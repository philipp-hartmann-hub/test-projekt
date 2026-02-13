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

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...options.headers
      },
      cache: 'no-store', // Verhindere Browser-Caching
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
    localStorage.setItem('gefaengnis_antraege', JSON.stringify(antraege));
    localStorage.setItem('gefaengnis_aufgaben', JSON.stringify(aufgaben));
    localStorage.setItem('gefaengnis_notifications', JSON.stringify(notifications));
    localStorage.setItem('gefaengnis_aktivitaeten', JSON.stringify(aktivitaeten));
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

async function syncToServer(key, data) {
  if (!serverConnected) return;

  const endpoint = SYNC_KEYS[key];
  if (!endpoint) return;

  try {
    // Komplette Daten neu laden und dann einzelne Aenderungen synchen
    // Fuer Prototyp: Einfache Loesung - ganzes Array ersetzen

    const currentServerData = await apiCall(endpoint);
    const localData = JSON.parse(data);

    // Neue Items hinzufuegen
    for (const localItem of localData) {
      const serverItem = currentServerData.find(s => s.id === localItem.id);

      if (!serverItem) {
        // Neues Item - POST
        await apiCall(endpoint, {
          method: 'POST',
          body: JSON.stringify(localItem)
        });
      } else {
        // Bestehendes Item - Pruefen ob Update noetig
        const localStr = JSON.stringify(localItem);
        const serverStr = JSON.stringify(serverItem);

        if (localStr !== serverStr) {
          const response = await apiCall(`${endpoint}/${localItem.id}`, {
            method: 'PUT',
            body: JSON.stringify(localItem)
          });
          // Wenn Server den aktualisierten Eintrag zurückgibt, verwende diesen
          if (response && response.id) {
            const index = localData.findIndex(l => l.id === response.id);
            if (index !== -1) {
              localData[index] = response;
            }
          }
        }
      }
    }

    // Geloeschte Items entfernen
    for (const serverItem of currentServerData) {
      const stillExists = localData.find(l => l.id === serverItem.id);
      if (!stillExists) {
        await apiCall(`${endpoint}/${serverItem.id}`, {
          method: 'DELETE'
        });
      }
    }
  } catch (error) {
    console.warn(`Sync-Fehler fuer ${key}:`, error.message);
  }
}

// Flag um zu verhindern, dass reloadDataFromServer während der Synchronisation läuft
let isSyncing = false;

// Explizite Synchronisation eines einzelnen Antrags UND aller Aufgaben
async function syncAntragToServer(antragId) {
  if (!serverConnected) return false;
  if (isSyncing) {
    console.log('[Sync] Synchronisation bereits im Gange, warte...');
    // Warte bis die aktuelle Synchronisation abgeschlossen ist
    while (isSyncing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return true;
  }
  
  isSyncing = true;
  try {
    const base = window.location.origin + '/api';
    
    // 1. Antrag synchronisieren
    const antragData = localStorage.getItem('gefaengnis_antraege');
    if (!antragData) {
      isSyncing = false;
      return false;
    }
    
    const localAntraege = JSON.parse(antragData);
    const antrag = localAntraege.find(a => a.id === antragId);
    if (!antrag) {
      isSyncing = false;
      return false;
    }
    
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
    
    // 2. Aufgaben synchronisieren (wichtig: Aufgaben können sich geändert haben)
    const aufgabenData = localStorage.getItem('gefaengnis_aufgaben');
    if (aufgabenData) {
      console.log('[Sync] Synchronisiere Aufgaben...');
      await syncToServer('gefaengnis_aufgaben', aufgabenData);
      console.log('[Sync] Aufgaben synchronisiert');
    }
    
    // 3. Verifiziere dass die Änderung wirklich auf dem Server gespeichert wurde
    // Wichtig bei Netzwerk-Latenz: Mehrfach prüfen mit Retry
    let verifiziert = false;
    let retries = 0;
    const maxRetries = 5;
    
    while (!verifiziert && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500 + (retries * 200))); // Zunehmende Verzögerung
      
      try {
        const verifyResponse = await fetch(base + '/antraege/' + antragId, {
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (verifyResponse.ok) {
          const verifyAntrag = await verifyResponse.json();
          console.log('[Sync] Verifikation:', verifyAntrag.id, 'Bearbeiter:', verifyAntrag.bearbeiterId, 'Erwartet:', antrag.bearbeiterId);
          
          // Prüfe ob Bearbeiter übereinstimmt
          if (verifyAntrag.bearbeiterId === antrag.bearbeiterId) {
            verifiziert = true;
            console.log('[Sync] Änderung erfolgreich verifiziert nach', retries + 1, 'Versuchen');
            // Verwende die verifizierten Server-Daten
            serverAntrag.bearbeiterId = verifyAntrag.bearbeiterId;
            serverAntrag.bearbeiterName = verifyAntrag.bearbeiterName;
            serverAntrag.status = verifyAntrag.status;
            serverAntrag.zugewiesenAnGruppe = verifyAntrag.zugewiesenAnGruppe;
          } else {
            retries++;
            console.log('[Sync] Verifikation fehlgeschlagen, versuche erneut...', retries);
          }
        } else {
          retries++;
          console.log('[Sync] Verifikations-Request fehlgeschlagen, versuche erneut...', retries);
        }
      } catch (e) {
        retries++;
        console.log('[Sync] Verifikations-Fehler, versuche erneut...', retries, e.message);
      }
    }
    
    if (!verifiziert) {
      console.warn('[Sync] WARNUNG: Änderung konnte nicht verifiziert werden nach', maxRetries, 'Versuchen');
    }
    
    // 4. Aktualisiere lokale Daten mit Server-Daten
    if (serverAntrag.id) {
      const index = localAntraege.findIndex(a => a.id === serverAntrag.id);
      if (index !== -1) {
        localAntraege[index] = serverAntrag;
        originalSetItem('gefaengnis_antraege', JSON.stringify(localAntraege));
        if (typeof window.reloadDataFromStorage === 'function') {
          window.reloadDataFromStorage();
        }
      }
    }
    
    // 5. Zusätzliche Verzögerung für Netzwerk-Latenz
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    isSyncing = false;
    return true;
  } catch (error) {
    console.warn('Explizite Antrag-Synchronisation fehlgeschlagen:', error);
    isSyncing = false;
    return false;
  }
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
    syncToServer(key, value).catch(err => {
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
    await syncToServer('gefaengnis_users', localStorage.getItem('gefaengnis_users'));
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
    
    // Alle Daten parallel laden mit Cache-Control Headers für frische Daten
    const [users, antraege, aufgaben, notifications, aktivitaeten, termine] = await Promise.all([
      apiCall('/users', { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
      apiCall('/antraege', { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
      apiCall('/aufgaben', { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
      apiCall('/notifications', { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
      apiCall('/aktivitaeten', { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } }),
      apiCall('/termine', { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } })
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
    originalSetItem('gefaengnis_antraege', JSON.stringify(antraege));
    originalSetItem('gefaengnis_aufgaben', JSON.stringify(aufgaben));
    originalSetItem('gefaengnis_notifications', JSON.stringify(notifications));
    originalSetItem('gefaengnis_aktivitaeten', JSON.stringify(aktivitaeten));
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

