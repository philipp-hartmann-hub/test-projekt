// ============================================
// DATA SYNC - Synchronisiert localStorage mit dem Server
// Diese Datei muss VOR app.js geladen werden!
// ============================================

const API_BASE = window.location.origin + '/api';

function safeLsSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    const isQuota =
      (e && e.name === 'QuotaExceededError') ||
      (e && e.code === 22) ||
      String(e && e.message ? e.message : e).toLowerCase().includes('quota');
    if (!isQuota) {
      console.warn('[Sync] localStorage.setItem:', key, e);
      return false;
    }
    try {
      ['gefaengnis_aktivitaeten', 'gefaengnis_termine', 'gefaengnis_notifications'].forEach((k) => {
        if (k === key) return;
        const raw = localStorage.getItem(k);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 200) {
          localStorage.setItem(k, JSON.stringify(arr.slice(-150)));
        }
      });
      localStorage.setItem(key, value);
      return true;
    } catch (e2) {
      console.warn('[Sync] Quota nach Bereinigung:', key, e2);
      return false;
    }
  }
}

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
    const [users, antraege, aufgaben, notifications, aktivitaeten, termine, antragTypenKatalog] = await Promise.all([
      apiCall('/users'),
      apiCall('/antraege'),
      apiCall('/aufgaben'),
      apiCall('/notifications'),
      apiCall('/aktivitaeten'),
      apiCall('/termine'),
      apiCall('/antrag-typen-katalog').catch(() => null)
    ]);

    if (antragTypenKatalog && Array.isArray(antragTypenKatalog.typen) && antragTypenKatalog.typen.length) {
      safeLsSetItem('gefaengnis_antrag_typen_katalog', JSON.stringify(antragTypenKatalog));
    }

    const userMergeResult = storeMergedUsersFromServer(users);
    const prevAntraegeInit = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
    safeLsSetItem(
      'gefaengnis_antraege',
      JSON.stringify(mergeAntraegeArraysAfterFetch(prevAntraegeInit, antraege))
    );
    const prevAufgabenInit = JSON.parse(localStorage.getItem('gefaengnis_aufgaben') || '[]');
    safeLsSetItem(
      'gefaengnis_aufgaben',
      JSON.stringify(mergeAufgabenArraysAfterFetch(prevAufgabenInit, aufgaben))
    );
    const prevNotificationsInit = JSON.parse(localStorage.getItem('gefaengnis_notifications') || '[]');
    safeLsSetItem(
      'gefaengnis_notifications',
      JSON.stringify(mergeAntragArraysByIdOrContent(prevNotificationsInit, notifications))
    );
    const prevAktivitaeten = JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
    safeLsSetItem(
      'gefaengnis_aktivitaeten',
      JSON.stringify(mergeAktivitaetenArrays(prevAktivitaeten, aktivitaeten))
    );
    const prevTermineInit = JSON.parse(localStorage.getItem('gefaengnis_termine') || '[]');
    safeLsSetItem(
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

const AUFGABE_STATUS_RANK = { offen: 1, erledigt: 2, geloescht: 3 };

/** Aufgaben-Merge: Erledigt-Status und „Hauptbearbeitung übertragen“ nicht durch älteren Serverstand verlieren. */
function mergeAufgabeSnapshot(prev, item) {
  if (!prev) return item;
  if (!item) return prev;
  const merged = { ...prev, ...item };
  // Gruppen-→Persönlich-Übernahme lokal darf nicht durch veralteten Server (noch „gruppe“) zurückgedreht werden
  const prevPersonal =
    prev.zugewiesenAnTyp === 'mitarbeiter' &&
    prev.zugewiesenAnId != null &&
    String(prev.zugewiesenAnId) !== '';
  const itemStillGruppe = item.zugewiesenAnTyp === 'gruppe';
  if (prevPersonal && itemStillGruppe && prev.status === 'offen') {
    merged.zugewiesenAnTyp = prev.zugewiesenAnTyp;
    merged.zugewiesenAnId = prev.zugewiesenAnId;
    merged.zugewiesenAnName = prev.zugewiesenAnName;
    merged.zugewiesenAnGruppe = prev.zugewiesenAnGruppe ?? null;
    if (prev.terminKalenderNachUebernahme === false) {
      merged.terminKalenderNachUebernahme = false;
    }
  }
  if (prev.bearbeitungNachErledigung === 'uebertragen') {
    merged.bearbeitungNachErledigung = 'uebertragen';
  }
  const rPrev = AUFGABE_STATUS_RANK[prev.status] || 0;
  const rItem = AUFGABE_STATUS_RANK[item.status] || 0;
  if (rPrev > rItem) {
    merged.status = prev.status;
    merged.erledigtAm = prev.erledigtAm || merged.erledigtAm;
    merged.erledigungsTyp = prev.erledigungsTyp ?? merged.erledigungsTyp;
    merged.antwort = prev.antwort ?? merged.antwort;
    merged.antwortPdfs = prev.antwortPdfs ?? merged.antwortPdfs;
  }
  return merged;
}

function mergeAufgabenArraysAfterFetch(existingArr, incomingArr) {
  const ex = Array.isArray(existingArr) ? existingArr : [];
  const inc = Array.isArray(incomingArr) ? incomingArr : [];
  if (inc.length === 0 && ex.length > 0) {
    console.warn('[Sync] Server ohne Aufgaben — lokale Aufgabenliste bleibt erhalten.');
    return ex;
  }
  const map = new Map();
  const order = [];
  function add(item) {
    if (!item || typeof item !== 'object') return;
    const key = item.id ? String(item.id) : _antragArrayItemKey(item);
    if (map.has(key)) {
      map.set(key, mergeAufgabeSnapshot(map.get(key), item));
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

function _dokumentItemKey(item) {
  if (item && item.id != null && String(item.id) !== '') return 'id:' + String(item.id);
  if (item && item.name) {
    return 'name:' + String(item.name) + '|' + String(item.hochgeladenAm || '');
  }
  return _antragArrayItemKey(item);
}

function _countPdfDokumente(arr) {
  if (!Array.isArray(arr)) return 0;
  return arr.filter((d) => _isPdfDataUrl(d && d.data)).length;
}

function mergeDokumenteArrays(existingArr, incomingArr) {
  const ex = Array.isArray(existingArr) ? existingArr : [];
  const inc = Array.isArray(incomingArr) ? incomingArr : [];
  const map = new Map();
  const order = [];
  function add(item) {
    const key = _dokumentItemKey(item);
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

const PRUEFUNG_PHASE_KEYS = [
  'sachlichGeprueft',
  'sachlichGeprueftAm',
  'sachlichGeprueftVon',
  'sachlichGeprueftVonId',
  'pruefungsKommentar'
];

const ENTSCHEIDUNG_PHASE_KEYS = [
  'entscheidungGetroffen',
  'entscheidungVon',
  'entscheidungVonId',
  'entscheidungAm',
  'geplantesErgebnis',
  'geplanteBegruendung',
  'wartetAufEroeffnung',
  'wartetAufVollzug',
  'bescheidPdf',
  'begruendung',
  'erledigt',
  'bearbeitetAm'
];

const VOLLZUG_PHASE_KEYS = [
  'vollzogen',
  'vollzogenAm',
  'vollzogenVon',
  'vollzogenVonId'
];

function _pickRicherField(localVal, serverVal) {
  if (localVal == null || localVal === '') {
    return serverVal != null && serverVal !== '' ? serverVal : localVal;
  }
  if (serverVal == null || serverVal === '') return localVal;
  if (typeof localVal === 'string' && typeof serverVal === 'string') {
    return localVal.length >= serverVal.length ? localVal : serverVal;
  }
  return localVal;
}

/** Prüfung/Entscheidung: Metadaten nicht durch veralteten Server-Snapshot überschreiben. */
function mergePhaseProgressFields(merged, localAntrag, serverAntrag) {
  const rankLocal = _antragPhaseRank(localAntrag);
  const rankServer = _antragPhaseRank(serverAntrag);
  const progressed = rankLocal >= rankServer ? localAntrag : serverAntrag;

  if (merged.sachlichGeprueft === true) {
    const src =
      localAntrag.sachlichGeprueft === true && serverAntrag.sachlichGeprueft !== true
        ? localAntrag
        : serverAntrag.sachlichGeprueft === true && localAntrag.sachlichGeprueft !== true
          ? serverAntrag
          : progressed;
    for (const k of PRUEFUNG_PHASE_KEYS) {
      merged[k] = _pickRicherField(localAntrag[k], serverAntrag[k]);
      if ((merged[k] == null || merged[k] === '') && src[k] != null) merged[k] = src[k];
    }
  }

  if (merged.entscheidungGetroffen === true) {
    const src =
      localAntrag.entscheidungGetroffen === true && serverAntrag.entscheidungGetroffen !== true
        ? localAntrag
        : serverAntrag.entscheidungGetroffen === true && localAntrag.entscheidungGetroffen !== true
          ? serverAntrag
          : progressed;
    for (const k of ENTSCHEIDUNG_PHASE_KEYS) {
      merged[k] = _pickRicherField(localAntrag[k], serverAntrag[k]);
      if ((merged[k] == null || merged[k] === '') && src[k] != null) merged[k] = src[k];
    }
    if (
      rankLocal >= rankServer &&
      localAntrag.status &&
      ['genehmigt', 'abgelehnt', 'teilweise-genehmigt'].includes(localAntrag.status)
    ) {
      merged.status = localAntrag.status;
    } else if (
      ['genehmigt', 'abgelehnt', 'teilweise-genehmigt'].includes(serverAntrag.status)
    ) {
      merged.status = serverAntrag.status;
    }
  }

  if (merged.vollzogen === true) {
    const src =
      localAntrag.vollzogen === true && serverAntrag.vollzogen !== true
        ? localAntrag
        : serverAntrag.vollzogen === true && localAntrag.vollzogen !== true
          ? serverAntrag
          : progressed;
    for (const k of VOLLZUG_PHASE_KEYS) {
      merged[k] = _pickRicherField(localAntrag[k], serverAntrag[k]);
      if ((merged[k] == null || merged[k] === '') && src[k] != null) merged[k] = src[k];
    }
  }
}

function mergeAntragSnapshotAfterPut(localAntrag, serverAntrag) {
  if (!serverAntrag || typeof serverAntrag !== 'object') return localAntrag;
  if (!localAntrag || typeof localAntrag !== 'object') return serverAntrag;
  const merged = { ...localAntrag, ...serverAntrag };
  merged.kommentare = mergeAntragArraysByIdOrContent(localAntrag.kommentare, serverAntrag.kommentare);
  merged.dokumente = mergeDokumenteArrays(localAntrag.dokumente, serverAntrag.dokumente);
  merged.weiterleitungen = mergeAntragArraysByIdOrContent(localAntrag.weiterleitungen, serverAntrag.weiterleitungen);
  merged.abgegebenVon = unionAbgegebenVonMerge(localAntrag.abgegebenVon, serverAntrag.abgegebenVon);

  const abgIds = merged.abgegebenVon || [];
  const localBearbeiter = localAntrag.bearbeiterId;
  const serverBearbeiter = serverAntrag.bearbeiterId;
  if (
    localBearbeiter != null &&
    localBearbeiter !== '' &&
    (serverBearbeiter == null || serverBearbeiter === '')
  ) {
    merged.bearbeiterId = localBearbeiter;
    merged.bearbeiterName = localAntrag.bearbeiterName;
  }
  if (
    localBearbeiter != null &&
    serverBearbeiter != null &&
    String(localBearbeiter) !== String(serverBearbeiter)
  ) {
    const localAbgegeben = abgIds.some((id) => String(id) === String(localBearbeiter));
    const serverAbgegeben = abgIds.some((id) => String(id) === String(serverBearbeiter));
    const lUt = localAntrag.updatedAt ? Date.parse(localAntrag.updatedAt) : 0;
    const sUt = serverAntrag.updatedAt ? Date.parse(serverAntrag.updatedAt) : 0;
    if (!localAbgegeben && serverAbgegeben) {
      merged.bearbeiterId = localAntrag.bearbeiterId;
      merged.bearbeiterName = localAntrag.bearbeiterName;
    } else if (!localAbgegeben && !serverAbgegeben && lUt >= sUt) {
      merged.bearbeiterId = localAntrag.bearbeiterId;
      merged.bearbeiterName = localAntrag.bearbeiterName;
    }
  }

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
  if (merged.veraktet === true) {
    for (const k of ['veraktetAm', 'veraktetVon', 'veraktetVonId']) {
      merged[k] = localAntrag[k] || serverAntrag[k] || merged[k];
    }
  }
  if (_countPdfDokumente(localAntrag.dokumente) > _countPdfDokumente(serverAntrag.dokumente)) {
    merged.dokumente = mergeDokumenteArrays(serverAntrag.dokumente, localAntrag.dokumente);
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
  mergePhaseProgressFields(merged, localAntrag, serverAntrag);
  mergeWeiterleitungUndGruppenZuweisung(merged, localAntrag, serverAntrag);
  return merged;
}

/** Gruppen-Weiterleitung beim Merge nicht verlieren (wichtig bei Sync-Konflikt / veraltetem Server). */
function mergeWeiterleitungUndGruppenZuweisung(merged, localAntrag, serverAntrag) {
  const localWl = Array.isArray(localAntrag.weiterleitungen) ? localAntrag.weiterleitungen.length : 0;
  const serverWl = Array.isArray(serverAntrag.weiterleitungen) ? serverAntrag.weiterleitungen.length : 0;
  const localHatGruppe = !!(localAntrag.zugewiesenAnGruppe && localAntrag.zugewiesenAnGruppe.typ);
  const serverHatGruppe = !!(serverAntrag.zugewiesenAnGruppe && serverAntrag.zugewiesenAnGruppe.typ);
  if (!localHatGruppe && !serverHatGruppe) return;

  const lUt = localAntrag.updatedAt ? Date.parse(localAntrag.updatedAt) : 0;
  const sUt = serverAntrag.updatedAt ? Date.parse(serverAntrag.updatedAt) : 0;

  const pickLocal =
    localHatGruppe &&
    (!serverHatGruppe || localWl > serverWl || (localWl >= serverWl && lUt >= sUt));

  const quelle = pickLocal ? localAntrag : serverAntrag;
  merged.zugewiesenAnGruppe = quelle.zugewiesenAnGruppe;
  merged.zugewiesenAnGruppeName = quelle.zugewiesenAnGruppeName;
  merged.hauptbearbeitungWartetAufUebernahme = quelle.hauptbearbeitungWartetAufUebernahme;
  merged.urspruenglicherBearbeiterId = quelle.urspruenglicherBearbeiterId;
  merged.urspruenglicherBearbeiterName = quelle.urspruenglicherBearbeiterName;

  // Gruppen-Weiterleitung: Hauptbearbeitungs-Flag nicht durch veralteten Server auf false zurücksetzen
  const wl = Array.isArray(merged.weiterleitungen) ? merged.weiterleitungen : [];
  const letzteWl = wl.length > 0 ? wl[wl.length - 1] : null;
  const letzteGruppenWlUebertragen =
    letzteWl && (letzteWl.anGruppe || letzteWl.anGruppeName)
      ? letzteWl.hauptbearbeitungUebertragen !== false
      : null;
  if (localAntrag.hauptbearbeitungWartetAufUebernahme === true) {
    merged.hauptbearbeitungWartetAufUebernahme = true;
  } else if (serverAntrag.hauptbearbeitungWartetAufUebernahme === true) {
    merged.hauptbearbeitungWartetAufUebernahme = true;
  } else if (letzteGruppenWlUebertragen === true) {
    merged.hauptbearbeitungWartetAufUebernahme = true;
  } else if (
    merged.zugewiesenAnGruppe &&
    merged.zugewiesenAnGruppe.typ &&
    merged.hauptbearbeitungWartetAufUebernahme !== false &&
    letzteGruppenWlUebertragen !== false
  ) {
    merged.hauptbearbeitungWartetAufUebernahme = true;
  }
}

function storeMergedAntragInLocalStorage(serverAntrag) {
  if (!serverAntrag || !serverAntrag.id) return;
  const fresh = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
  const index = fresh.findIndex((a) => a.id === serverAntrag.id);
  if (index !== -1) {
    fresh[index] = mergeAntragSnapshotAfterPut(fresh[index], serverAntrag);
  } else {
    fresh.push(serverAntrag);
  }
  originalSetItem('gefaengnis_antraege', JSON.stringify(fresh));
  if (typeof window.reloadDataFromStorage === 'function') {
    window.reloadDataFromStorage();
  }
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
  if (server.length === 0 && local.length > 0) {
    console.warn('[Sync] Server ohne Anträge — lokale Antragsliste bleibt erhalten.');
    return local;
  }
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
          let response;
          try {
            const putPayload =
              key === 'gefaengnis_antraege'
                ? { ...localItem, _baseUpdatedAt: localItem.updatedAt || null }
                : localItem;
            response = await apiCall(`${endpoint}/${localItem.id}`, {
              method: 'PUT',
              body: JSON.stringify(putPayload)
            });
          } catch (err) {
            // Bei Konflikt (409) nie erneut blind drueberschreiben: Serverstand uebernehmen.
            if (key === 'gefaengnis_antraege' && err && /409/.test(String(err.message || err))) {
              try {
                const latest = await apiCall(`${endpoint}`);
                const latestItem = Array.isArray(latest) ? latest.find((s) => s.id === localItem.id) : null;
                if (latestItem) {
                  const idx = localData.findIndex((l) => l.id === localItem.id);
                  if (idx !== -1) {
                    localData[idx] = mergeAntragSnapshotAfterPut(localData[idx], latestItem);
                    originalSetItem('gefaengnis_antraege', JSON.stringify(localData));
                  }
                }
              } catch (_) {}
              continue;
            }
            throw err;
          }
          if (response && response.id) {
            const index = localData.findIndex(l => l.id === response.id);
            if (index !== -1) {
              if (key === 'gefaengnis_antraege') {
                localData[index] = mergeAntragSnapshotAfterPut(localData[index], response);
              } else if (key === 'gefaengnis_aufgaben') {
                localData[index] = mergeAufgabeSnapshot(localData[index], response);
              } else {
                localData[index] = response;
              }
            }
          }
        }
      }
    }

    // Anträge/Aufgaben: keine Server-Löschungen (verhindert „alle Anträge weg“ bei veraltetem lokalen Snapshot)
    const allowServerDeletes =
      key !== 'gefaengnis_antraege' && key !== 'gefaengnis_aufgaben';
    if (key !== 'gefaengnis_aktivitaeten' && allowServerDeletes && !skipDeletes) {
      for (const serverItem of currentServerData) {
        const stillExists = localData.find(l => l.id === serverItem.id);
        if (!stillExists) {
          await apiCall(`${endpoint}/${serverItem.id}`, {
            method: 'DELETE'
          });
        }
      }
    }

    if (key === 'gefaengnis_antraege' || key === 'gefaengnis_aufgaben') {
      originalSetItem(key, JSON.stringify(localData));
      if (typeof window.reloadDataFromStorage === 'function') {
        window.reloadDataFromStorage();
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

// Flag: expliziter Antrag-Sync läuft (reload wartet statt blind zu überspringen)
let isSyncing = false;

/** Wartet auf laufende Upload-Warteschlangen, damit Reload nicht veralteten Serverstand zieht. */
async function waitForPendingSync(timeoutMs = 12000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!isSyncing) {
      const chains = Object.values(syncKeyChains).filter(Boolean);
      if (chains.length > 0) {
        await Promise.allSettled(chains);
      }
      if (!isSyncing) return true;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  console.warn('[Sync] waitForPendingSync: Timeout');
  return false;
}

/** Aufgaben eines Antrags zuerst hochladen (wichtig nach „Aufgabe übernehmen“). */
async function syncAufgabenForAntrag(antragId) {
  if (!serverConnected || !initialDataLoaded) {
    const okConn = await ensureConnected();
    if (!okConn) return false;
  }
  const endpoint = SYNC_KEYS.gefaengnis_aufgaben;
  if (!endpoint) return false;
  let localData;
  try {
    localData = JSON.parse(localStorage.getItem('gefaengnis_aufgaben') || '[]');
  } catch (_) {
    return false;
  }
  if (!Array.isArray(localData)) return false;

  const sid = String(antragId);
  const targets = localData.filter((a) => a && a.antragId != null && String(a.antragId) === sid);
  if (targets.length === 0) return true;

  let allOk = true;
  try {
    const currentServerData = await apiCall(endpoint);
    for (const localItem of targets) {
      try {
        const serverItem = Array.isArray(currentServerData)
          ? currentServerData.find((s) => s.id === localItem.id)
          : null;
        if (!serverItem) {
          await apiCall(endpoint, { method: 'POST', body: JSON.stringify(localItem) });
          continue;
        }
        if (JSON.stringify(localItem) === JSON.stringify(serverItem)) continue;
        const response = await apiCall(`${endpoint}/${localItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(localItem)
        });
        if (response && response.id) {
          const index = localData.findIndex((l) => l.id === response.id);
          if (index !== -1) {
            localData[index] = mergeAufgabeSnapshot(localData[index], response);
          }
        }
      } catch (e) {
        console.warn('[Sync] Aufgabe-Upload fehlgeschlagen:', localItem.id, e);
        allOk = false;
      }
    }
    originalSetItem('gefaengnis_aufgaben', JSON.stringify(localData));
    if (typeof window.reloadDataFromStorage === 'function') {
      window.reloadDataFromStorage();
    }
  } catch (e) {
    console.warn('[Sync] syncAufgabenForAntrag:', e);
    return false;
  }
  return allOk;
}

/** Aktivitäten eines Antrags hochladen (Bearbeitungsverlauf nach Phasenwechsel). */
async function syncAktivitaetenForAntrag(antragId) {
  if (!serverConnected || !initialDataLoaded) {
    const okConn = await ensureConnected();
    if (!okConn) return false;
  }
  const endpoint = SYNC_KEYS.gefaengnis_aktivitaeten;
  if (!endpoint) return true;
  let localData;
  try {
    localData = JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
  } catch (_) {
    return false;
  }
  if (!Array.isArray(localData)) return false;

  const sid = String(antragId);
  const targets = localData.filter((a) => a && a.antragId != null && String(a.antragId) === sid);
  if (targets.length === 0) return true;

  let allOk = true;
  try {
    const currentServerData = await apiCall(endpoint);
    for (const localItem of targets) {
      try {
        const serverItem = Array.isArray(currentServerData)
          ? currentServerData.find((s) => s.id === localItem.id)
          : null;
        if (!serverItem) {
          await apiCall(endpoint, { method: 'POST', body: JSON.stringify(localItem) });
          continue;
        }
        if (JSON.stringify(localItem) === JSON.stringify(serverItem)) continue;
        const response = await apiCall(`${endpoint}/${localItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(localItem)
        });
        if (response && response.id) {
          const index = localData.findIndex((l) => l.id === response.id);
          if (index !== -1) {
            localData[index] = { ...localData[index], ...response };
          }
        }
      } catch (e) {
        console.warn('[Sync] Aktivität-Upload fehlgeschlagen:', localItem.id, e);
        allOk = false;
      }
    }
    originalSetItem('gefaengnis_aktivitaeten', JSON.stringify(localData));
    if (typeof window.reloadDataFromStorage === 'function') {
      window.reloadDataFromStorage();
    }
  } catch (e) {
    console.warn('[Sync] syncAktivitaetenForAntrag:', e);
    return false;
  }
  return allOk;
}

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

      await syncAktivitaetenForAntrag(antragId);
      await syncAufgabenForAntrag(antragId);

      const readLocalAntrag = () => {
        const raw = localStorage.getItem('gefaengnis_antraege');
        if (!raw) return null;
        const list = JSON.parse(raw);
        return list.find((a) => a.id === antragId) || null;
      };

      let antrag = readLocalAntrag();
      if (!antrag) return false;

      async function putAntragSnapshot(snapshot, baseUpdatedAt) {
        const putPayload = { ...snapshot, _baseUpdatedAt: baseUpdatedAt || null };
        return fetch(base + '/antraege/' + antragId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(putPayload)
        });
      }

      console.log('[Sync] Synchronisiere Antrag:', antragId, 'Bearbeiter:', antrag.bearbeiterId);
      let antragResponse = await putAntragSnapshot(antrag, antrag.updatedAt || null);

      if (!antragResponse.ok) {
        if (antragResponse.status === 409) {
          const conflict = await antragResponse.json().catch(() => null);
          const latest = conflict && conflict.latestAntrag ? conflict.latestAntrag : null;
          if (!latest) return false;

          antrag = readLocalAntrag() || antrag;
          const mergedLocal = mergeAntragSnapshotAfterPut(antrag, latest);
          const freshConflict = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
          const idx = freshConflict.findIndex((a) => a.id === latest.id);
          if (idx !== -1) {
            freshConflict[idx] = mergedLocal;
          } else {
            freshConflict.push(mergedLocal);
          }
          originalSetItem('gefaengnis_antraege', JSON.stringify(freshConflict));
          if (typeof window.reloadDataFromStorage === 'function') {
            window.reloadDataFromStorage();
          }

          const phaseFortschrittLokal =
            _antragPhaseRank(mergedLocal) > _antragPhaseRank(latest) ||
            (mergedLocal.sachlichGeprueft === true && latest.sachlichGeprueft !== true) ||
            (mergedLocal.entscheidungGetroffen === true && latest.entscheidungGetroffen !== true) ||
            (mergedLocal.status === 'in-bearbeitung' && latest.status === 'offen') ||
            (!!mergedLocal.zugewiesenAnGruppe?.typ && !latest.zugewiesenAnGruppe?.typ) ||
            (Array.isArray(mergedLocal.weiterleitungen) &&
              Array.isArray(latest.weiterleitungen) &&
              mergedLocal.weiterleitungen.length > latest.weiterleitungen.length);

          if (!phaseFortschrittLokal) {
            storeMergedAntragInLocalStorage(mergedLocal);
            return true;
          }

          if (latest.updatedAt) {
            antragResponse = await putAntragSnapshot(mergedLocal, latest.updatedAt);
            if (antragResponse.ok) {
              const serverAfterRetry = await antragResponse.json();
              storeMergedAntragInLocalStorage(serverAfterRetry);
              console.log('[Sync] Phasen-Fortschritt nach 409-Konflikt nachgezogen:', antragId);
              await waitForPendingSync(8000);
              return true;
            }
            console.warn('[Sync] Retry nach 409 fehlgeschlagen:', antragResponse.status);
            return false;
          }
          return false;
        }
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
        storeMergedAntragInLocalStorage(serverAntrag);
      }

      await waitForPendingSync(8000);
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
  if (!safeLsSetItem(key, value)) {
    return;
  }

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

  await waitForPendingSync(12000);

  try {
    console.log('Lade aktuelle Daten vom Server...');
    const endpoints = {
      users: '/users',
      antraege: '/antraege',
      aufgaben: '/aufgaben',
      notifications: '/notifications',
      aktivitaeten: '/aktivitaeten',
      termine: '/termine'
    };
    const settled = await Promise.allSettled(
      Object.entries(endpoints).map(async ([k, endpoint]) => {
        const val = await apiCall(endpoint);
        return { key: k, value: val };
      })
    );
    const fetched = {};
    settled.forEach((s) => {
      if (s.status === 'fulfilled' && s.value) {
        fetched[s.value.key] = s.value.value;
      }
    });
    const users = Array.isArray(fetched.users) ? fetched.users : JSON.parse(localStorage.getItem('gefaengnis_users') || '[]');
    const antraege = Array.isArray(fetched.antraege) ? fetched.antraege : JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
    const aufgaben = Array.isArray(fetched.aufgaben) ? fetched.aufgaben : JSON.parse(localStorage.getItem('gefaengnis_aufgaben') || '[]');
    const notifications = Array.isArray(fetched.notifications) ? fetched.notifications : JSON.parse(localStorage.getItem('gefaengnis_notifications') || '[]');
    const aktivitaeten = Array.isArray(fetched.aktivitaeten) ? fetched.aktivitaeten : JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
    const termine = Array.isArray(fetched.termine) ? fetched.termine : JSON.parse(localStorage.getItem('gefaengnis_termine') || '[]');

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
      JSON.stringify(mergeAufgabenArraysAfterFetch(prevAufgabenReload, aufgaben))
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
        aufgabenErledigt: aufgaben.filter(a => a.status === 'erledigt').length,
        partialReload:
          settled.some((s) => s.status === 'rejected')
      } 
    }));
    
    return settled.some((s) => s.status === 'fulfilled');
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
  'gefaengnis_externe_partner',
  'gefaengnis_antrag_typen_katalog'
];

async function syncAntragTypenKatalogToServer() {
  if (!serverConnected) return false;
  try {
    const raw = localStorage.getItem('gefaengnis_antrag_typen_katalog');
    if (!raw) return false;
    const katalog = JSON.parse(raw);
    await apiCall('/antrag-typen-katalog', {
      method: 'PUT',
      body: JSON.stringify(katalog)
    });
    return true;
  } catch (error) {
    console.warn('syncAntragTypenKatalogToServer:', error?.message || error);
    return false;
  }
}

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
  waitForPendingSync,
  reloadDataFromServer,
  scheduleSyncToServer,
  syncAntragToServer,
  fetchAktivitaetenForAntrag,
  exportAppDataBundle,
  downloadAppDataBackup,
  importAppDataBundle,
  fetchServerDataCounts,
  syncAntragTypenKatalogToServer,
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

