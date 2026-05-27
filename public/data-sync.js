// ============================================
// DATA SYNC - Synchronisiert localStorage mit dem Server
// Diese Datei muss VOR app.js geladen werden!
// ============================================

const API_BASE = window.location.origin + '/api';

// Flag ob wir mit dem Server verbunden sind
let serverConnected = false;
let initialDataLoaded = false;

// ============================================
// RECONNECT / RETRY
// ============================================

let reconnectTimer = null;
let reconnectDelayMs = 5000; // startet kurz, wächst bis max
const RECONNECT_DELAY_MAX_MS = 60000;

function _setConnectedState(connected, loaded) {
  serverConnected = Boolean(connected);
  initialDataLoaded = Boolean(loaded);
  if (serverConnected && initialDataLoaded) {
    // Reset Backoff bei Erfolg
    reconnectDelayMs = 5000;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }
}

function scheduleReconnect(reason) {
  // Reconnect nur wenn nicht verbunden oder noch nicht geladen
  if (serverConnected && initialDataLoaded) return;
  if (reconnectTimer) return;
  const delay = Math.min(reconnectDelayMs, RECONNECT_DELAY_MAX_MS);
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    try {
      const ok = await loadInitialData();
      if (!ok) {
        reconnectDelayMs = Math.min(Math.round(reconnectDelayMs * 1.6), RECONNECT_DELAY_MAX_MS);
        scheduleReconnect('retry');
      }
    } catch (e) {
      reconnectDelayMs = Math.min(Math.round(reconnectDelayMs * 1.6), RECONNECT_DELAY_MAX_MS);
      scheduleReconnect('retry-error');
    }
  }, delay);
  try {
    console.warn('[Sync] Reconnect geplant in', delay, 'ms', reason ? '(' + reason + ')' : '');
  } catch (_) {}
}

async function ensureConnected() {
  if (serverConnected && initialDataLoaded) return true;
  try {
    const ok = await loadInitialData();
    return ok === true;
  } catch (e) {
    scheduleReconnect('ensureConnected');
    return false;
  }
}

// Storage Keys die synchronisiert werden sollen
const SYNC_KEYS = {
  'gefaengnis_users': '/users',
  'gefaengnis_antraege': '/antraege',
  'gefaengnis_aufgaben': '/aufgaben',
  'gefaengnis_notifications': '/notifications',
  'gefaengnis_aktivitaeten': '/aktivitaeten',
  'gefaengnis_termine': '/termine'
};

// ============================================
// API HELPER
// ============================================

/** Vereinigt Aktivitäten nach id (Verlauf append-only; verhindert Datenverlust bei Reload). */
function mergeAktivitaetenArrays(existing, incoming) {
  const map = new Map();
  const add = (item) => {
    if (!item || item.id == null || String(item.id) === '') return;
    const id = String(item.id);
    const prev = map.get(id);
    if (!prev) {
      map.set(id, item);
      return;
    }
    const tPrev = new Date(prev.erstelltAm || 0).getTime();
    const tNew = new Date(item.erstelltAm || 0).getTime();
    map.set(id, tNew >= tPrev ? { ...prev, ...item } : { ...item, ...prev });
  };
  (Array.isArray(existing) ? existing : []).forEach(add);
  (Array.isArray(incoming) ? incoming : []).forEach(add);
    return Array.from(map.values());
}

/**
 * Lädt alle Aktivitäten zu einem Antrag vom Server und merged sie in localStorage
 * (fürs Bearbeitungsverlauf: Einträge aller Bearbeiter, auch nach Gerätewechsel).
 */
async function fetchAktivitaetenForAntrag(antragId) {
  if (!serverConnected || !initialDataLoaded) return;
  if (antragId == null || String(antragId) === '') return;
  try {
    const data = await apiCall('/aktivitaeten?antragId=' + encodeURIComponent(String(antragId)));
    const prev = JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
    const merged = mergeAktivitaetenArrays(prev, Array.isArray(data) ? data : []);
    localStorage.setItem('gefaengnis_aktivitaeten', JSON.stringify(merged));
    if (typeof window.reloadDataFromStorage === 'function') {
      window.reloadDataFromStorage();
    }
  } catch (error) {
    console.warn('fetchAktivitaetenForAntrag:', error?.message || error);
  }
}

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API-Fehler bei ${endpoint}:`, error);
    // Wenn Netzwerk/Server hakt, nicht "für immer offline" bleiben
    scheduleReconnect('apiCall ' + endpoint);
    throw error;
  }
}

// ============================================
// INITIALE DATEN VOM SERVER LADEN
// ============================================

async function loadInitialData() {
  console.log('Lade Daten vom Server...');

  try {
    // Alle Daten parallel laden
    const [users, antraege, aufgaben, notifications, aktivitaeten, termine] = await Promise.all([
      apiCall('/users'),
      apiCall('/antraege'),
      apiCall('/aufgaben'),
      apiCall('/notifications'),
      apiCall('/aktivitaeten'),
      apiCall('/termine')
    ]);

    const userMergeResult = storeMergedUsersFromServer(users);
    const prevAntraegeInit = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
    localStorage.setItem(
      'gefaengnis_antraege',
      JSON.stringify(mergeAntraegeArraysAfterFetch(prevAntraegeInit, antraege))
    );
    const prevAufgabenInit = JSON.parse(localStorage.getItem('gefaengnis_aufgaben') || '[]');
    localStorage.setItem(
      'gefaengnis_aufgaben',
      JSON.stringify(mergeAntragArraysByIdOrContent(prevAufgabenInit, aufgaben))
    );
    const prevNotificationsInit = JSON.parse(localStorage.getItem('gefaengnis_notifications') || '[]');
    localStorage.setItem(
      'gefaengnis_notifications',
      JSON.stringify(mergeAntragArraysByIdOrContent(prevNotificationsInit, notifications))
    );
    const prevAktivitaeten = JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
    localStorage.setItem(
      'gefaengnis_aktivitaeten',
      JSON.stringify(mergeAktivitaetenArrays(prevAktivitaeten, aktivitaeten))
    );
    const prevTermineInit = JSON.parse(localStorage.getItem('gefaengnis_termine') || '[]');
    localStorage.setItem(
      'gefaengnis_termine',
      JSON.stringify(mergeTermineArraysAfterFetch(prevTermineInit, termine))
    );

    _setConnectedState(true, true);
    console.log('Alle Daten vom Server geladen und in localStorage gespeichert');
    if (userMergeResult.shouldPushToServer) {
      console.log('[Sync] Lokale Benutzer ergänzen Server — Upload wird eingeplant.');
      scheduleSyncToServer('gefaengnis_users');
    }
    if (typeof window.reloadDataFromStorage === 'function') {
      window.reloadDataFromStorage();
    }
    if (typeof window.seedDemoDatenIfEmpty === 'function') {
      const seeded = window.seedDemoDatenIfEmpty();
      if (seeded && serverConnected) {
        ['gefaengnis_antraege', 'gefaengnis_aufgaben', 'gefaengnis_notifications', 'gefaengnis_aktivitaeten'].forEach(
          (k) => scheduleSyncToServer(k)
        );
      }
    }
    window.dispatchEvent(new CustomEvent('dataSyncLoaded'));
    return true;
  } catch (error) {
    console.warn('Server nicht erreichbar, verwende lokale Daten:', error.message);
    _setConnectedState(false, false);
    scheduleReconnect('loadInitialData failed');
    return false;
  }
}

// ============================================
// DATEN AN SERVER SENDEN
// ============================================

// Pro Key eine Warteschlange: verhindert, dass ein älterer setItem-Sync nach einem neueren fertig wird
// und den Server mit veraltetem Snapshot überschreibt (lokal höhere Latenz = auf Vercel häufiger).
const syncKeyChains = {};

function enqueueSyncJob(key, job) {
  if (!SYNC_KEYS[key]) return Promise.resolve();
  const prev = syncKeyChains[key] || Promise.resolve();
  const next = prev.then(() => job());
  syncKeyChains[key] = next.catch((err) => {
    console.warn(`Sync queue ${key}:`, err?.message || err);
  });
  return next;
}

function _antragArrayItemKey(item) {
  if (item && typeof item === 'object' && item.id != null && String(item.id) !== '') {
    return 'id:' + String(item.id);
  }
  try {
    return 'raw:' + JSON.stringify(item);
  } catch (_) {
    return 'raw:' + String(item);
  }
}

function mergeAntragArraysByIdOrContent(existingArr, incomingArr) {
  const ex = Array.isArray(existingArr) ? existingArr : [];
  const inc = Array.isArray(incomingArr) ? incomingArr : [];
  const map = new Map();
  const order = [];
  function add(item) {
    const key = _antragArrayItemKey(item);
    if (map.has(key)) {
      const prev = map.get(key);
      map.set(key, typeof prev === 'object' && prev && typeof item === 'object' && item ? { ...prev, ...item } : item);
    } else {
      map.set(key, item);
      order.push(key);
    }
  }
  ex.forEach(add);
  inc.forEach(add);
  return order.map((k) => map.get(k));
}

/** PDF-Binary (data URL) bei zusammengeführten Dokumenten nicht durch „leeren“ Server-Eintrag überschreiben. */
function _isPdfDataUrl(s) {
  return typeof s === 'string' && s.startsWith('data:') && s.length > 200;
}

function mergeDokumenteArrays(existingArr, incomingArr) {
  const ex = Array.isArray(existingArr) ? existingArr : [];
  const inc = Array.isArray(incomingArr) ? incomingArr : [];
  const map = new Map();
  const order = [];
  function add(item) {
    const key = _antragArrayItemKey(item);
    if (map.has(key)) {
      const prev = map.get(key);
      if (typeof prev === 'object' && prev && typeof item === 'object' && item) {
        const o = { ...prev, ...item };
        if (_isPdfDataUrl(prev.data) && !_isPdfDataUrl(item.data)) o.data = prev.data;
        else if (!_isPdfDataUrl(prev.data) && _isPdfDataUrl(item.data)) o.data = item.data;
        else if (_isPdfDataUrl(prev.data) && _isPdfDataUrl(item.data)) {
          o.data = String(item.data).length >= String(prev.data).length ? item.data : prev.data;
        }
        map.set(key, o);
      } else {
        map.set(key, item);
      }
    } else {
      map.set(key, item);
      order.push(key);
    }
  }
  ex.forEach(add);
  inc.forEach(add);
  return order.map((k) => map.get(k));
}

function unionAbgegebenVonMerge(a, b) {
  const set = new Set();
  for (const arr of [a, b]) {
    if (!Array.isArray(arr)) continue;
    for (const id of arr) {
      if (id != null && String(id).length) set.add(String(id));
    }
  }
  return [...set];
}

function _antragPhaseRank(a) {
  if (!a || typeof a !== 'object') return 0;
  if (a.veraktet === true) return 6;
  if (a.vollzogen === true) return 5;
  if (a.erledigt === true || ['genehmigt', 'abgelehnt', 'teilweise-genehmigt'].includes(a.status)) return 4;
  if (a.entscheidungGetroffen === true) return 3;
  if (a.sachlichGeprueft === true) return 2;
  if (a.status === 'in-bearbeitung') return 1;
  return 0;
}

function mergeAntragSnapshotAfterPut(localAntrag, serverAntrag) {
  if (!serverAntrag || typeof serverAntrag !== 'object') return localAntrag;
  if (!localAntrag || typeof localAntrag !== 'object') return serverAntrag;
  const merged = { ...localAntrag, ...serverAntrag };
  merged.kommentare = mergeAntragArraysByIdOrContent(localAntrag.kommentare, serverAntrag.kommentare);
  merged.dokumente = mergeDokumenteArrays(localAntrag.dokumente, serverAntrag.dokumente);
  merged.weiterleitungen = mergeAntragArraysByIdOrContent(localAntrag.weiterleitungen, serverAntrag.weiterleitungen);
  merged.abgegebenVon = unionAbgegebenVonMerge(localAntrag.abgegebenVon, serverAntrag.abgegebenVon);

  const lwl = Array.isArray(localAntrag.weiterleitungen) ? localAntrag.weiterleitungen.length : 0;
  const swl = Array.isArray(serverAntrag.weiterleitungen) ? serverAntrag.weiterleitungen.length : 0;
  if (lwl < swl) {
    merged.bearbeiterId = serverAntrag.bearbeiterId;
    merged.bearbeiterName = serverAntrag.bearbeiterName;
  }

  const monotonicTrue = ['sachlichGeprueft', 'entscheidungGetroffen', 'veraktet', 'vollzogen', 'erledigt'];
  for (const k of monotonicTrue) {
    if (localAntrag[k] === true || serverAntrag[k] === true) {
      merged[k] = true;
    }
  }
  const rankLocal = _antragPhaseRank(localAntrag);
  const rankServer = _antragPhaseRank(serverAntrag);
  const progressed = rankLocal >= rankServer ? localAntrag : serverAntrag;
  const progressedStatus = progressed && progressed.status;
  if (progressedStatus && _antragPhaseRank(merged) < Math.max(rankLocal, rankServer)) {
    merged.status = progressedStatus;
  }

  // Nie in frühere Bekanntgabe-/Vollzugszustände zurückfallen.
  const bekanntgabeErledigt =
    localAntrag.persoenlichEroeffnet === true ||
    serverAntrag.persoenlichEroeffnet === true ||
    (localAntrag.erledigt === true && localAntrag.wartetAufEroeffnung === false) ||
    (serverAntrag.erledigt === true && serverAntrag.wartetAufEroeffnung === false);
  if (bekanntgabeErledigt && (localAntrag.wartetAufEroeffnung === false || serverAntrag.wartetAufEroeffnung === false)) {
    merged.wartetAufEroeffnung = false;
  }
  const vollzugErledigt =
    localAntrag.vollzogen === true ||
    serverAntrag.vollzogen === true ||
    (localAntrag.erledigt === true && localAntrag.wartetAufVollzug === false) ||
    (serverAntrag.erledigt === true && serverAntrag.wartetAufVollzug === false);
  if (vollzugErledigt && (localAntrag.wartetAufVollzug === false || serverAntrag.wartetAufVollzug === false)) {
    merged.wartetAufVollzug = false;
  }
  const len = (v) => (v == null ? 0 : String(v).length);
  const pkL = localAntrag.pruefungsKommentar;
  const pkS = serverAntrag.pruefungsKommentar;
  if (len(pkS) > len(pkL)) {
    merged.pruefungsKommentar = pkS;
  } else if (pkL != null && pkS == null) {
    merged.pruefungsKommentar = pkL;
  }
  return merged;
}

/**
 * Beim Neuladen vom Server: Anträge nicht blind ersetzen (Race mit Upload/Sync).
 * Pro ID: mergeAntragSnapshotAfterPut(lokal, Server) → dokumente/kommentare/weiterleitungen vereinigt.
 */
/** Insassen-Sichtbarkeit bei Termin-Merge erhalten (Server-Payload oft ohne sichtbarFuer). */
function mergeTerminSnapshotAfterFetch(localT, serverT) {
  if (!localT && !serverT) return null;
  if (!localT) return serverT;
  if (!serverT) return localT;
  const ts = (t) => new Date(t.erstelltAm || t.einladungVersendetAm || 0).getTime();
  const merged = ts(serverT) >= ts(localT) ? { ...localT, ...serverT } : { ...serverT, ...localT };

  const insasseId = merged.insasseId || localT.insasseId || serverT.insasseId;
  if (insasseId) merged.insasseId = String(insasseId);
  const insasseName = merged.insasseName || localT.insasseName || serverT.insasseName;
  if (insasseName) merged.insasseName = insasseName;

  const sf = new Set();
  [localT.sichtbarFuer, serverT.sichtbarFuer, merged.sichtbarFuer].forEach((arr) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((id) => {
      if (id != null && String(id) !== '') sf.add(String(id));
    });
  });
  if (insasseId) sf.add(String(insasseId));
  if (sf.size > 0) merged.sichtbarFuer = [...sf];

  return merged;
}

/** Termine beim Server-Reload mit lokalen Daten vereinigen (verhindert verlorene Buchungen vor Sync-Ende). */
function mergeTermineArraysAfterFetch(localArr, serverArr) {
  const local = Array.isArray(localArr) ? localArr : [];
  const server = Array.isArray(serverArr) ? serverArr : [];
  const map = new Map();
  local.forEach((t) => {
    if (t && t.id != null && String(t.id) !== '') map.set(String(t.id), t);
  });
  server.forEach((t) => {
    if (!t || t.id == null || String(t.id) === '') return;
    const id = String(t.id);
    if (!map.has(id)) {
      map.set(id, t);
      return;
    }
    map.set(id, mergeTerminSnapshotAfterFetch(map.get(id), t));
  });
  return Array.from(map.values());
}

function mergeAntraegeArraysAfterFetch(localArr, serverArr) {
  const local = Array.isArray(localArr) ? localArr : [];
  const server = Array.isArray(serverArr) ? serverArr : [];
  const map = new Map();
  local.forEach((a) => {
    if (a && a.id != null && String(a.id) !== '') map.set(String(a.id), a);
  });
  server.forEach((a) => {
    if (!a || a.id == null || String(a.id) === '') return;
    const id = String(a.id);
    if (!map.has(id)) map.set(id, a);
    else map.set(id, mergeAntragSnapshotAfterPut(map.get(id), a));
  });
  return Array.from(map.values());
}

function mapServerUserToFrontend(u) {
  if (!u || typeof u !== 'object') return u;
  if (u.type !== undefined && u.vorname !== undefined) return u;
  return {
    ...u,
    type: u.rolle === 'insasse' ? 'insasse' : 'mitarbeiter',
    vorname: (u.name && u.name.split(' ')[0]) || '',
    nachname: (u.name && u.name.split(' ').slice(1).join(' ')) || ''
  };
}

/** Benutzer nie blind durch Server-Seed ersetzen — lokale Konten bleiben erhalten. */
function mergeUsersArraysAfterFetch(localArr, serverArr) {
  const local = Array.isArray(localArr) ? localArr : [];
  const server = Array.isArray(serverArr) ? serverArr : [];
  if (server.length === 0 && local.length > 0) {
    console.warn('[Sync] Server ohne Benutzer — lokale Benutzerliste bleibt erhalten.');
    return local;
  }
  if (local.length === 0) return server;

  const map = new Map();
  const order = [];
  const preserveKeys = ['password', 'username', 'vorname', 'nachname', 'insassenNummer', 'geburtsdatum', 'jva', 'jvas', 'station', 'rolle'];

  function add(item, fromServer) {
    if (!item || typeof item !== 'object' || item.id == null || String(item.id) === '') return;
    const id = String(item.id);
    if (map.has(id)) {
      const prev = map.get(id);
      const merged = { ...prev, ...item };
      if (fromServer) {
        preserveKeys.forEach((k) => {
          if ((item[k] == null || item[k] === '') && prev[k] != null && prev[k] !== '') {
            merged[k] = prev[k];
          }
        });
      }
      map.set(id, merged);
    } else {
      map.set(id, item);
      order.push(id);
    }
  }

  local.forEach((u) => add(u, false));
  server.forEach((u) => add(u, true));
  return order.map((id) => map.get(id));
}

function readLocalUsersArray() {
  try {
    const parsed = JSON.parse(localStorage.getItem('gefaengnis_users') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function storeMergedUsersFromServer(serverUsersRaw) {
  const prevUsers = readLocalUsersArray();
  const serverMapped = (Array.isArray(serverUsersRaw) ? serverUsersRaw : []).map(mapServerUserToFrontend);
  const merged = mergeUsersArraysAfterFetch(prevUsers, serverMapped);
  localStorage.setItem('gefaengnis_users', JSON.stringify(merged));
  return {
    merged,
    shouldPushToServer: merged.length > serverMapped.length
  };
}

// Liest localStorage erst beim Ausführen des Jobs (nicht den Wert vom setItem-Zeitpunkt).
async function syncToServerImpl(key) {
  if (!serverConnected) return;

  const endpoint = SYNC_KEYS[key];
  if (!endpoint) return;

  const data = localStorage.getItem(key);
  if (!data) return;

  try {
    const currentServerData = await apiCall(endpoint);
    const localData = JSON.parse(data);
    const skipDeletes = !Array.isArray(localData) || localData.length === 0;

    if (skipDeletes && currentServerData.length > 0) {
      console.warn(
        `[Sync] ${key}: keine lokalen Einträge — Server-Löschungen übersprungen (${currentServerData.length} auf dem Server)`
      );
    }

    for (const localItem of localData) {
      const serverItem = currentServerData.find(s => s.id === localItem.id);

      if (!serverItem) {
        await apiCall(endpoint, {
          method: 'POST',
          body: JSON.stringify(localItem)
        });
      } else {
        const localStr = JSON.stringify(localItem);
        const serverStr = JSON.stringify(serverItem);

        if (localStr !== serverStr) {
          const response = await apiCall(`${endpoint}/${localItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(localItem)
          });
          if (response && response.id) {
            const index = localData.findIndex(l => l.id === response.id);
            if (index !== -1) {
              if (key === 'gefaengnis_antraege') {
                localData[index] = mergeAntragSnapshotAfterPut(localData[index], response);
              } else {
                localData[index] = response;
              }
            }
          }
        }
      }
    }

    if (key !== 'gefaengnis_aktivitaeten' && !skipDeletes) {
      for (const serverItem of currentServerData) {
        const stillExists = localData.find(l => l.id === serverItem.id);
        if (!stillExists) {
          await apiCall(`${endpoint}/${serverItem.id}`, {
            method: 'DELETE'
          });
        }
      }
    }
  } catch (error) {
    console.warn(`Sync-Fehler fuer ${key}:`, error.message);
  }
}

function scheduleSyncToServer(key) {
  if (!serverConnected || !initialDataLoaded) {
    // Verbindung später automatisch nachholen
    scheduleReconnect('scheduleSyncToServer ' + key);
    return Promise.resolve();
  }
  return enqueueSyncJob(key, () => syncToServerImpl(key));
}

// Flag um zu verhindern, dass reloadDataFromServer während der Synchronisation läuft
let isSyncing = false;

// Explizite Synchronisation eines einzelnen Antrags UND aller Aufgaben
// Läuft in derselben Warteschlange wie Hintergrund-Syncs für gefaengnis_antraege (kein Überschreiben durch veraltete Jobs).
async function syncAntragToServer(antragId) {
  if (!serverConnected || !initialDataLoaded) {
    const okConn = await ensureConnected();
    if (!okConn) return false;
  }
  return enqueueSyncJob('gefaengnis_antraege', async () => {
    isSyncing = true;
    try {
      const base = window.location.origin + '/api';

      const antragData = localStorage.getItem('gefaengnis_antraege');
      if (!antragData) return false;

      const localAntraege = JSON.parse(antragData);
      const antrag = localAntraege.find(a => a.id === antragId);
      if (!antrag) return false;

      console.log('[Sync] Synchronisiere Antrag:', antragId, 'Bearbeiter:', antrag.bearbeiterId);
      const antragResponse = await fetch(base + '/antraege/' + antragId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(antrag)
      });

      if (!antragResponse.ok) {
        throw new Error(`HTTP ${antragResponse.status}: ${antragResponse.statusText}`);
      }

      const serverAntrag = await antragResponse.json();
      console.log('[Sync] Antrag synchronisiert:', serverAntrag.id, 'Bearbeiter:', serverAntrag.bearbeiterId);

      if (localStorage.getItem('gefaengnis_aufgaben')) {
        console.log('[Sync] Synchronisiere Aufgaben...');
        await enqueueSyncJob('gefaengnis_aufgaben', () => syncToServerImpl('gefaengnis_aufgaben'));
        console.log('[Sync] Aufgaben synchronisiert');
      }

      // KRITISCH für Bearbeitungsverlauf bei Weiterleitung:
      // Aktivitäten explizit mitsynchronisieren, damit der nächste Bearbeiter sie sofort vom Server sieht.
      if (localStorage.getItem('gefaengnis_aktivitaeten')) {
        console.log('[Sync] Synchronisiere Aktivitäten...');
        await enqueueSyncJob('gefaengnis_aktivitaeten', () => syncToServerImpl('gefaengnis_aktivitaeten'));
        console.log('[Sync] Aktivitäten synchronisiert');
      }

      if (localStorage.getItem('gefaengnis_notifications')) {
        await enqueueSyncJob('gefaengnis_notifications', () => syncToServerImpl('gefaengnis_notifications'));
        console.log('[Sync] Benachrichtigungen synchronisiert');
      }

      if (serverAntrag.id) {
        const fresh = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
        const index = fresh.findIndex(a => a.id === serverAntrag.id);
        if (index !== -1) {
          fresh[index] = mergeAntragSnapshotAfterPut(fresh[index], serverAntrag);
          originalSetItem('gefaengnis_antraege', JSON.stringify(fresh));
          if (typeof window.reloadDataFromStorage === 'function') {
            window.reloadDataFromStorage();
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.warn('Explizite Antrag-Synchronisation fehlgeschlagen:', error);
      scheduleReconnect('syncAntragToServer failed');
      return false;
    } finally {
      isSyncing = false;
    }
  }).then(
    (ok) => ok === true,
    () => false
  );
}

// ============================================
// LOCALSTORAGE PATCHEN
// ============================================

const originalSetItem = localStorage.setItem.bind(localStorage);

localStorage.setItem = function(key, value) {
  // Immer zuerst lokal speichern
  originalSetItem(key, value);

  // Dann an Server senden (asynchron, nicht blockierend)
  if (SYNC_KEYS[key] && serverConnected && initialDataLoaded) {
    console.log(`Sync: ${key} → Server (${key === 'gefaengnis_antraege' ? JSON.parse(value).length + ' Anträge' : 'Daten'})`);
    scheduleSyncToServer(key).catch(err => {
      console.warn('Hintergrund-Sync fehlgeschlagen:', err.message);
    });
  } else {
    if (SYNC_KEYS[key]) {
      console.log(`Sync übersprungen für ${key}:`, {
        serverConnected,
        initialDataLoaded
      });
    }
  }
};

// ============================================
// LOGIN MIT SERVER
// ============================================

async function serverLogin(username, password, portalTyp) {
  try {
    const result = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, portalTyp })
    });

    return result;
  } catch (error) {
    console.error('Login-Fehler:', error);
    return { success: false, message: 'Server nicht erreichbar' };
  }
}

// ============================================
// SOFORT-SYNC BENUTZER (nach Admin Aenderungen)
// ============================================

async function syncUsersNow() {
  if (!serverConnected || !initialDataLoaded) {
    const okConn = await ensureConnected();
    if (!okConn) return;
  }
  try {
    await enqueueSyncJob('gefaengnis_users', () => syncToServerImpl('gefaengnis_users'));
  } catch (e) {
    console.warn('syncUsersNow:', e.message);
  }
}

// ============================================
// DATEN VOM SERVER NEU LADEN (für andere Geräte)
// ============================================

async function reloadDataFromServer() {
  if (!serverConnected) {
    console.warn('Server nicht verbunden, kann Daten nicht neu laden');
    return false;
  }
  
  // Warte bis Synchronisation abgeschlossen ist
  if (isSyncing) {
    console.log('[Reload] Synchronisation läuft, überspringe reloadDataFromServer');
    return false;
  }
  
  try {
    console.log('Lade aktuelle Daten vom Server...');
    
    // Alle Daten parallel laden
    const [users, antraege, aufgaben, notifications, aktivitaeten, termine] = await Promise.all([
      apiCall('/users'),
      apiCall('/antraege'),
      apiCall('/aufgaben'),
      apiCall('/notifications'),
      apiCall('/aktivitaeten'),
      apiCall('/termine')
    ]);

    const prevUsers = readLocalUsersArray();
    const serverMapped = users.map(mapServerUserToFrontend);
    const mergedUsers = mergeUsersArraysAfterFetch(prevUsers, serverMapped);
    originalSetItem('gefaengnis_users', JSON.stringify(mergedUsers));
    if (mergedUsers.length > serverMapped.length) {
      console.log('[Sync] Nach Reload: lokale Benutzer zum Server hochladen…');
      scheduleSyncToServer('gefaengnis_users');
    }
    const prevAntraegeReload = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
    originalSetItem(
      'gefaengnis_antraege',
      JSON.stringify(mergeAntraegeArraysAfterFetch(prevAntraegeReload, antraege))
    );
    const prevAufgabenReload = JSON.parse(localStorage.getItem('gefaengnis_aufgaben') || '[]');
    originalSetItem(
      'gefaengnis_aufgaben',
      JSON.stringify(mergeAntragArraysByIdOrContent(prevAufgabenReload, aufgaben))
    );
    const prevNotificationsReload = JSON.parse(localStorage.getItem('gefaengnis_notifications') || '[]');
    originalSetItem(
      'gefaengnis_notifications',
      JSON.stringify(mergeAntragArraysByIdOrContent(prevNotificationsReload, notifications))
    );
    const prevAktivReload = JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
    originalSetItem(
      'gefaengnis_aktivitaeten',
      JSON.stringify(mergeAktivitaetenArrays(prevAktivReload, aktivitaeten))
    );
    const prevTermineReload = JSON.parse(localStorage.getItem('gefaengnis_termine') || '[]');
    originalSetItem(
      'gefaengnis_termine',
      JSON.stringify(mergeTermineArraysAfterFetch(prevTermineReload, termine))
    );

    const vorherAntraege = antragSystem ? antragSystem.antraege.length : 0;
    const vorherAufgaben = aufgabenSystem ? aufgabenSystem.aufgaben.length : 0;
    
    console.log('Daten vom Server neu geladen:', {
      users: users.length,
      antraege: antraege.length,
      aufgaben: aufgaben.length,
      notifications: notifications.length
    });
    
    // reloadDataFromStorage aufrufen, damit die Systeme die neuen Daten verwenden
    if (typeof window.reloadDataFromStorage === 'function') {
      console.log('Rufe reloadDataFromStorage auf...');
      window.reloadDataFromStorage();
      
      // Prüfen ob sich die Anzahl geändert hat
      const nachherAntraege = antragSystem ? antragSystem.antraege.length : 0;
      const nachherAufgaben = aufgabenSystem ? aufgabenSystem.aufgaben.length : 0;
      
      if (nachherAntraege !== vorherAntraege) {
        console.log(`Anträge-Änderung: ${vorherAntraege} → ${nachherAntraege}`);
      }
      if (nachherAufgaben !== vorherAufgaben) {
        console.log(`Aufgaben-Änderung: ${vorherAufgaben} → ${nachherAufgaben}`);
        // Prüfe ob Aufgaben-Status sich geändert hat
        const erledigteAufgaben = aufgabenSystem ? aufgabenSystem.aufgaben.filter(a => a.status === 'erledigt').length : 0;
        console.log(`Erledigte Aufgaben: ${erledigteAufgaben}`);
      }
    } else {
      console.warn('reloadDataFromStorage Funktion nicht verfügbar');
    }

    if (typeof window.seedDemoDatenIfEmpty === 'function') {
      const seeded = window.seedDemoDatenIfEmpty();
      if (seeded && serverConnected) {
        ['gefaengnis_antraege', 'gefaengnis_aufgaben', 'gefaengnis_notifications', 'gefaengnis_aktivitaeten'].forEach(
          (k) => scheduleSyncToServer(k)
        );
      }
    }
    
    // Event feuern, damit UI aktualisiert wird
    console.log('Feuere dataReloaded Event...');
    window.dispatchEvent(new CustomEvent('dataReloaded', { 
      detail: { 
        antraege: antraege.length,
        aufgaben: aufgaben.length,
        aufgabenErledigt: aufgaben.filter(a => a.status === 'erledigt').length
      } 
    }));
    
    return true;
  } catch (error) {
    console.warn('Fehler beim Neuladen der Daten:', error.message);
    return false;
  }
}

// ============================================
// BACKUP / WIEDERHERSTELLUNG
// ============================================

const BACKUP_STORAGE_KEYS = [
  'gefaengnis_users',
  'gefaengnis_antraege',
  'gefaengnis_aufgaben',
  'gefaengnis_notifications',
  'gefaengnis_aktivitaeten',
  'gefaengnis_termine',
  'gefaengnis_externe_partner'
];

function _mergeBackupArray(key, existing, incoming) {
  const ex = Array.isArray(existing) ? existing : [];
  const inc = Array.isArray(incoming) ? incoming : [];
  if (key === 'gefaengnis_antraege') return mergeAntraegeArraysAfterFetch(ex, inc);
  if (key === 'gefaengnis_users') return mergeUsersArraysAfterFetch(ex, inc);
  if (key === 'gefaengnis_aktivitaeten') return mergeAktivitaetenArrays(ex, inc);
  if (key === 'gefaengnis_termine') return mergeTermineArraysAfterFetch(ex, inc);
  return mergeAntragArraysByIdOrContent(ex, inc);
}

function exportAppDataBundle() {
  const bundle = {
    format: 'jvp-backup-v1',
    exportedAt: new Date().toISOString(),
    data: {}
  };
  BACKUP_STORAGE_KEYS.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      bundle.data[key] = raw ? JSON.parse(raw) : [];
    } catch (_) {
      bundle.data[key] = [];
    }
  });
  return bundle;
}

function downloadAppDataBackup() {
  const bundle = exportAppDataBundle();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `jvp-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return bundle;
}

async function importAppDataBundle(bundle, options = {}) {
  const merge = options.merge !== false;
  const payload = bundle && bundle.data ? bundle.data : bundle;
  if (!payload || typeof payload !== 'object') {
    throw new Error('Ungültige Backup-Datei.');
  }

  BACKUP_STORAGE_KEYS.forEach((key) => {
    if (payload[key] == null) return;
    const incoming = payload[key];
    if (merge) {
      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem(key) || '[]');
      } catch (_) {
        existing = [];
      }
      originalSetItem(key, JSON.stringify(_mergeBackupArray(key, existing, incoming)));
    } else {
      originalSetItem(key, JSON.stringify(incoming));
    }
  });

  if (typeof window.reloadDataFromStorage === 'function') {
    window.reloadDataFromStorage();
  }

  if (serverConnected && initialDataLoaded) {
    for (const key of Object.keys(SYNC_KEYS)) {
      await scheduleSyncToServer(key);
    }
  }

  return {
    antraege: JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]').length,
    aufgaben: JSON.parse(localStorage.getItem('gefaengnis_aufgaben') || '[]').length
  };
}

async function fetchServerDataCounts() {
  if (!serverConnected) return null;
  const counts = {};
  for (const [key, endpoint] of Object.entries(SYNC_KEYS)) {
    try {
      const rows = await apiCall(endpoint);
      counts[key] = Array.isArray(rows) ? rows.length : 0;
    } catch (_) {
      counts[key] = null;
    }
  }
  return counts;
}

// ============================================
// GLOBALE API OBJEKTE
// ============================================

window.DataSync = {
  loadInitialData,
  serverLogin,
  syncUsersNow,
  reloadDataFromServer,
  syncAntragToServer,
  fetchAktivitaetenForAntrag,
  exportAppDataBundle,
  downloadAppDataBackup,
  importAppDataBundle,
  fetchServerDataCounts,
  isConnected: () => serverConnected,
  isLoaded: () => initialDataLoaded
};

// ============================================
// AUTOMATISCH BEIM LADEN AUSFUEHREN
// ============================================

// Initiale Daten laden wenn DOM bereit
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
  });
} else {
  loadInitialData();
}

console.log('Data-Sync Modul geladen');

