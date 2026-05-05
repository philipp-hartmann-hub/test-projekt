// ============================================
// DATA SYNC - Synchronisiert localStorage mit dem Server
// Diese Datei muss VOR app.js geladen werden!
// ============================================

const API_BASE = window.location.origin + '/api';

// Flag ob wir mit dem Server verbunden sind
let serverConnected = false;
let initialDataLoaded = false;

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

    // Server-User auf Frontend-Format mappen (name/rolle -> vorname/nachname/type), falls noch nicht vorhanden
    const usersFrontend = users.map(u => {
      if (u.type !== undefined && u.vorname !== undefined) return u;
      return {
        ...u,
        type: u.rolle === 'insasse' ? 'insasse' : 'mitarbeiter',
        vorname: (u.name && u.name.split(' ')[0]) || '',
        nachname: (u.name && u.name.split(' ').slice(1).join(' ')) || ''
      };
    });
    localStorage.setItem('gefaengnis_users', JSON.stringify(usersFrontend));
    const prevAntraegeInit = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
    localStorage.setItem(
      'gefaengnis_antraege',
      JSON.stringify(mergeAntraegeArraysAfterFetch(prevAntraegeInit, antraege))
    );
    localStorage.setItem('gefaengnis_aufgaben', JSON.stringify(aufgaben));
    localStorage.setItem('gefaengnis_notifications', JSON.stringify(notifications));
    const prevAktivitaeten = JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
    localStorage.setItem(
      'gefaengnis_aktivitaeten',
      JSON.stringify(mergeAktivitaetenArrays(prevAktivitaeten, aktivitaeten))
    );
    localStorage.setItem('gefaengnis_termine', JSON.stringify(termine));

    serverConnected = true;
    initialDataLoaded = true;
    console.log('Alle Daten vom Server geladen und in localStorage gespeichert');
    if (typeof window.reloadDataFromStorage === 'function') {
      window.reloadDataFromStorage();
    }
    window.dispatchEvent(new CustomEvent('dataSyncLoaded'));
    return true;
  } catch (error) {
    console.warn('Server nicht erreichbar, verwende lokale Daten:', error.message);
    serverConnected = false;
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

    if (key !== 'gefaengnis_aktivitaeten') {
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
  if (!serverConnected || !initialDataLoaded) return Promise.resolve();
  return enqueueSyncJob(key, () => syncToServerImpl(key));
}

// Flag um zu verhindern, dass reloadDataFromServer während der Synchronisation läuft
let isSyncing = false;

// Explizite Synchronisation eines einzelnen Antrags UND aller Aufgaben
// Läuft in derselben Warteschlange wie Hintergrund-Syncs für gefaengnis_antraege (kein Überschreiben durch veraltete Jobs).
async function syncAntragToServer(antragId) {
  if (!serverConnected) return false;
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
  if (!serverConnected) return;
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

    // Server-User auf Frontend-Format mappen
    const usersFrontend = users.map(u => {
      if (u.type !== undefined && u.vorname !== undefined) return u;
      return {
        ...u,
        type: u.rolle === 'insasse' ? 'insasse' : 'mitarbeiter',
        vorname: (u.name && u.name.split(' ')[0]) || '',
        nachname: (u.name && u.name.split(' ').slice(1).join(' ')) || ''
      };
    });
    
    // Daten in localStorage speichern (ohne Sync-Loop zu triggern)
    originalSetItem('gefaengnis_users', JSON.stringify(usersFrontend));
    const prevAntraegeReload = JSON.parse(localStorage.getItem('gefaengnis_antraege') || '[]');
    originalSetItem(
      'gefaengnis_antraege',
      JSON.stringify(mergeAntraegeArraysAfterFetch(prevAntraegeReload, antraege))
    );
    originalSetItem('gefaengnis_aufgaben', JSON.stringify(aufgaben));
    originalSetItem('gefaengnis_notifications', JSON.stringify(notifications));
    const prevAktivReload = JSON.parse(localStorage.getItem('gefaengnis_aktivitaeten') || '[]');
    originalSetItem(
      'gefaengnis_aktivitaeten',
      JSON.stringify(mergeAktivitaetenArrays(prevAktivReload, aktivitaeten))
    );
    originalSetItem('gefaengnis_termine', JSON.stringify(termine));

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
// GLOBALE API OBJEKTE
// ============================================

window.DataSync = {
  loadInitialData,
  serverLogin,
  syncUsersNow,
  reloadDataFromServer,
  syncAntragToServer,
  fetchAktivitaetenForAntrag,
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

