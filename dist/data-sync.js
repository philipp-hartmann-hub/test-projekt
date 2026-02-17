// ============================================
// DATA SYNC - Synchronisiert localStorage mit dem Server
// Diese Datei muss VOR app.js geladen werden!
// ============================================

// Bei file:// (Datei direkt geöffnet) funktionieren API-Aufrufe nicht – Fallback auf Vercel-URL
const API_BASE = (window.location.protocol === 'file:' || window.location.protocol === 'null' || !window.location.origin || window.location.origin === 'null')
  ? 'https://test-projekt-rose.vercel.app/api'
  : (window.location.origin + '/api');

// Flag ob wir mit dem Server verbunden sind
let serverConnected = false;
let initialDataLoaded = false;

// Hilfsfunktion um die aktuelle Benutzer-ID zu erhalten
function getCurrentUserId() {
  try {
    // Versuche Session aus sessionStorage zu holen
    const sessionData = sessionStorage.getItem('currentSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session && session.userId) {
        return session.userId;
      }
    }
    
    // Fallback: Versuche aus localStorage (falls SessionManager dort speichert)
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      if (user && user.userId) {
        return user.userId;
      }
    }
    
    return null;
  } catch (e) {
    console.warn('[Reload] Fehler beim Abrufen der aktuellen Benutzer-ID:', e);
    return null;
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
    console.warn(`API-Fehler bei ${endpoint}:`, error.message || error);
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
    // Anträge: fehlende insasseJva/insasseStation aus Insassen füllen (für AVD-Anzeige)
    const antraegeMitOrt = antraege.map(a => {
      if (a.insasseJva != null && a.insasseJva !== '' && a.insasseStation != null && a.insasseStation !== '') return a;
      if (!a.insasseId) return a;
      const insasse = usersFrontend.find(u => u.type === 'insasse' && (u.id === a.insasseId || String(u.id) === String(a.insasseId) || u.insassenNummer === a.insassenNummer));
      if (!insasse) return a;
      let jva = a.insasseJva;
      let station = a.insasseStation;
      if (station == null || station === '') station = insasse.station != null ? insasse.station : station;
      if (jva == null || jva === '') {
        const raw = insasse.jva != null ? (typeof insasse.jva === 'string' ? insasse.jva : (insasse.jva && (insasse.jva.id || insasse.jva.name))) : null;
        if (raw) jva = typeof raw === 'string' && raw.indexOf('jva') !== -1 ? raw.replace(/jva/gi, 'haus') : raw;
      }
      return { ...a, insasseJva: jva, insasseStation: station };
    });
    localStorage.setItem('gefaengnis_users', JSON.stringify(usersFrontend));
    localStorage.setItem('gefaengnis_antraege', JSON.stringify(antraegeMitOrt));
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
    // Trotzdem lokale Daten laden, damit Login und App mit localStorage weiter funktionieren
    if (typeof window.reloadDataFromStorage === 'function') {
      window.reloadDataFromStorage();
    }
    window.dispatchEvent(new CustomEvent('dataSyncLoaded'));
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
    
    // WICHTIG: Prüfe ob der aktuelle Benutzer noch der Bearbeiter ist
    const currentUserId = getCurrentUserId();
    if (antrag.bearbeiterId && antrag.bearbeiterId !== currentUserId) {
      console.warn('[Sync] Benutzer ist nicht mehr Bearbeiter, Synchronisation abgebrochen:', {
        antragId,
        lokalerBearbeiter: antrag.bearbeiterId,
        aktuellerBenutzer: currentUserId
      });
      isSyncing = false;
      return false;
    }
    
    // Prüfe auch auf dem Server, ob der Antrag noch dem Benutzer zugewiesen ist
    try {
      const serverCheck = await fetch(base + '/antraege/' + antragId, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      }).then(r => r.json());
      
      if (serverCheck.bearbeiterId && serverCheck.bearbeiterId !== currentUserId) {
        console.warn('[Sync] Antrag wurde auf dem Server anderem Bearbeiter zugewiesen, Synchronisation abgebrochen:', {
          antragId,
          serverBearbeiter: serverCheck.bearbeiterId,
          aktuellerBenutzer: currentUserId
        });
        // Aktualisiere lokale Daten mit Server-Daten
        const index = localAntraege.findIndex(a => a.id === antragId);
        if (index !== -1) {
          localAntraege[index] = serverCheck;
          originalSetItem('gefaengnis_antraege', JSON.stringify(localAntraege));
          if (typeof window.reloadDataFromStorage === 'function') {
            window.reloadDataFromStorage();
          }
        }
        isSyncing = false;
        return false;
      }
    } catch (e) {
      console.warn('[Sync] Fehler beim Prüfen des Server-Status:', e);
      // Bei Fehler trotzdem synchronisieren
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
    // WICHTIG: Nur aktualisieren, wenn der lokale Benutzer noch der Bearbeiter ist
    // oder wenn der Antrag noch keinem Bearbeiter zugewiesen ist
    if (serverAntrag.id) {
      const index = localAntraege.findIndex(a => a.id === serverAntrag.id);
      if (index !== -1) {
        const localAntrag = localAntraege[index];
        
        // Prüfe ob der lokale Benutzer noch der Bearbeiter ist
        const currentUserId = getCurrentUserId();
        const istNochBearbeiter = !localAntrag.bearbeiterId || localAntrag.bearbeiterId === currentUserId;
        const serverBearbeiterId = serverAntrag.bearbeiterId;
        
        // Nur aktualisieren wenn:
        // 1. Der lokale Benutzer noch der Bearbeiter ist ODER
        // 2. Der Antrag noch keinem Bearbeiter zugewiesen ist ODER
        // 3. Der Server-Bearbeiter ist derselbe wie der lokale Bearbeiter
        if (istNochBearbeiter && (!serverBearbeiterId || serverBearbeiterId === currentUserId || serverBearbeiterId === localAntrag.bearbeiterId)) {
          // Merge: Behalte lokale Änderungen für Felder, die der Bearbeiter ändern kann
          // WICHTIG: Phasenfelder IMMER vom Server nehmen (für korrekte Schaltflächen-Anzeige)
          const mergedAntrag = {
            ...serverAntrag,
            // Behalte lokale Änderungen für Bearbeitungsfelder (nur wenn noch nicht auf Server gespeichert)
            kommentare: localAntrag.kommentare && localAntrag.kommentare.length > (serverAntrag.kommentare?.length || 0) 
              ? localAntrag.kommentare 
              : serverAntrag.kommentare,
            dokumente: localAntrag.dokumente && localAntrag.dokumente.length > (serverAntrag.dokumente?.length || 0)
              ? localAntrag.dokumente
              : serverAntrag.dokumente,
            // WICHTIG: Phasenfelder IMMER vom Server nehmen
            sachlichGeprueft: serverAntrag.sachlichGeprueft !== undefined ? serverAntrag.sachlichGeprueft : localAntrag.sachlichGeprueft,
            sachlichGeprueftAm: serverAntrag.sachlichGeprueftAm || localAntrag.sachlichGeprueftAm,
            sachlichGeprueftVon: serverAntrag.sachlichGeprueftVon || localAntrag.sachlichGeprueftVon,
            sachlichGeprueftVonId: serverAntrag.sachlichGeprueftVonId || localAntrag.sachlichGeprueftVonId,
            pruefungsKommentar: serverAntrag.pruefungsKommentar || localAntrag.pruefungsKommentar,
            entscheidungGetroffen: serverAntrag.entscheidungGetroffen !== undefined ? serverAntrag.entscheidungGetroffen : localAntrag.entscheidungGetroffen,
            erledigt: serverAntrag.erledigt !== undefined ? serverAntrag.erledigt : localAntrag.erledigt,
            vollzogen: serverAntrag.vollzogen !== undefined ? serverAntrag.vollzogen : localAntrag.vollzogen,
            veraktet: serverAntrag.veraktet !== undefined ? serverAntrag.veraktet : localAntrag.veraktet,
            wartetAufEroeffnung: serverAntrag.wartetAufEroeffnung !== undefined ? serverAntrag.wartetAufEroeffnung : localAntrag.wartetAufEroeffnung,
            wartetAufVollzug: serverAntrag.wartetAufVollzug !== undefined ? serverAntrag.wartetAufVollzug : localAntrag.wartetAufVollzug
          };
          
          localAntraege[index] = mergedAntrag;
          console.log('[Sync] Lokale Daten aktualisiert (Bearbeiter behält Änderungen)');
        } else {
          // Benutzer ist nicht mehr Bearbeiter - vollständig mit Server-Daten aktualisieren
          localAntraege[index] = serverAntrag;
          console.log('[Sync] Lokale Daten mit Server-Daten überschrieben (Benutzer nicht mehr Bearbeiter)');
        }
        
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
    
    // WICHTIG: Anträge schützen - Anträge die dem aktuellen Benutzer gehören nicht überschreiben
    const currentUserId = getCurrentUserId();
    let localAntraege = [];
    try {
      const localAntraegeData = localStorage.getItem('gefaengnis_antraege');
      if (localAntraegeData) {
        localAntraege = JSON.parse(localAntraegeData);
      }
    } catch (e) {
      console.warn('[Reload] Fehler beim Lesen lokaler Anträge:', e);
    }
    
    // Merge-Strategie: Anträge die dem aktuellen Benutzer gehören behalten lokale Änderungen
    const mergedAntraege = antraege.map(serverAntrag => {
      const localAntrag = localAntraege.find(a => a.id === serverAntrag.id);
      
      // Wenn kein lokaler Antrag existiert, verwende Server-Daten
      if (!localAntrag) {
        return serverAntrag;
      }
      
      // WICHTIG: Prüfe zuerst ob der lokale Benutzer noch der Bearbeiter ist
      // Wenn nicht, verwende IMMER Server-Daten (verhindert parallele Bearbeitung)
      if (serverAntrag.bearbeiterId && serverAntrag.bearbeiterId !== currentUserId) {
        console.log('[Reload] Antrag wurde anderem Bearbeiter zugewiesen, lokale Änderungen werden verworfen:', {
          antragId: serverAntrag.id,
          lokalerBearbeiter: localAntrag.bearbeiterId,
          serverBearbeiter: serverAntrag.bearbeiterId,
          aktuellerBenutzer: currentUserId
        });
        // Verwende Server-Daten komplett - lokale Änderungen werden verworfen
        return serverAntrag;
      }
      
      // Wenn der lokale Benutzer der Bearbeiter ist, behalte lokale Änderungen
      if (localAntrag.bearbeiterId === currentUserId && serverAntrag.bearbeiterId === currentUserId) {
        // Merge: Behalte lokale Änderungen für Bearbeitungsfelder, aber aktualisiere Phasenfelder vom Server
        return {
          ...serverAntrag,
          // Behalte lokale Änderungen für Bearbeitungsfelder (nur wenn noch nicht auf Server gespeichert)
          kommentare: localAntrag.kommentare && localAntrag.kommentare.length > (serverAntrag.kommentare?.length || 0) 
            ? localAntrag.kommentare 
            : serverAntrag.kommentare,
          dokumente: localAntrag.dokumente && localAntrag.dokumente.length > (serverAntrag.dokumente?.length || 0)
            ? localAntrag.dokumente
            : serverAntrag.dokumente,
          // WICHTIG: Phasenfelder IMMER vom Server nehmen (für korrekte Schaltflächen-Anzeige)
          sachlichGeprueft: serverAntrag.sachlichGeprueft !== undefined ? serverAntrag.sachlichGeprueft : localAntrag.sachlichGeprueft,
          sachlichGeprueftAm: serverAntrag.sachlichGeprueftAm || localAntrag.sachlichGeprueftAm,
          sachlichGeprueftVon: serverAntrag.sachlichGeprueftVon || localAntrag.sachlichGeprueftVon,
          sachlichGeprueftVonId: serverAntrag.sachlichGeprueftVonId || localAntrag.sachlichGeprueftVonId,
          pruefungsKommentar: serverAntrag.pruefungsKommentar || localAntrag.pruefungsKommentar,
          entscheidungGetroffen: serverAntrag.entscheidungGetroffen !== undefined ? serverAntrag.entscheidungGetroffen : localAntrag.entscheidungGetroffen,
          erledigt: serverAntrag.erledigt !== undefined ? serverAntrag.erledigt : localAntrag.erledigt,
          vollzogen: serverAntrag.vollzogen !== undefined ? serverAntrag.vollzogen : localAntrag.vollzogen,
          veraktet: serverAntrag.veraktet !== undefined ? serverAntrag.veraktet : localAntrag.veraktet,
          wartetAufEroeffnung: serverAntrag.wartetAufEroeffnung !== undefined ? serverAntrag.wartetAufEroeffnung : localAntrag.wartetAufEroeffnung,
          wartetAufVollzug: serverAntrag.wartetAufVollzug !== undefined ? serverAntrag.wartetAufVollzug : localAntrag.wartetAufVollzug,
          // Aktualisiere Metadaten vom Server
          bearbeiterId: serverAntrag.bearbeiterId,
          bearbeiterName: serverAntrag.bearbeiterName,
          status: serverAntrag.status,
          zugewiesenAnGruppe: serverAntrag.zugewiesenAnGruppe,
          zugewiesenAnGruppeName: serverAntrag.zugewiesenAnGruppeName
        };
      }
      
      // WICHTIG: Wenn der lokale Benutzer der Insasse ist, der den Antrag erstellt hat,
      // und der Antrag noch keinem Bearbeiter zugewiesen ist, behalte lokale Änderungen
      // (z.B. Entwürfe die noch nicht eingereicht wurden)
      if (localAntrag.insasseId === currentUserId && 
          (!localAntrag.bearbeiterId || localAntrag.bearbeiterId === null) &&
          (!serverAntrag.bearbeiterId || serverAntrag.bearbeiterId === null)) {
        // Merge: Behalte lokale Änderungen für Insassen-Anträge ohne Bearbeiter
        return {
          ...serverAntrag,
          // Behalte lokale Änderungen für Insassen-Felder
          begruendung: localAntrag.begruendung || serverAntrag.begruendung,
          // Aktualisiere Metadaten vom Server
          status: serverAntrag.status,
          erstelltAm: serverAntrag.erstelltAm || localAntrag.erstelltAm
        };
      }
      
      // Wenn der Antrag einem anderen Bearbeiter zugewiesen wurde, verwende Server-Daten
      if (serverAntrag.bearbeiterId && serverAntrag.bearbeiterId !== currentUserId) {
        console.log('[Reload] Antrag wurde anderem Bearbeiter zugewiesen:', serverAntrag.id, serverAntrag.bearbeiterId);
        return serverAntrag;
      }
      
      // WICHTIG: Phasenfelder IMMER vom Server nehmen, um sicherzustellen dass Phasenübergänge nicht verloren gehen
      // Auch wenn der Benutzer nicht der Bearbeiter ist, müssen Phasenfelder aktualisiert werden
      const mergedAntrag = {
        ...serverAntrag,
        // Behalte lokale Kommentare/Dokumente nur wenn sie neuer sind
        kommentare: localAntrag.kommentare && localAntrag.kommentare.length > (serverAntrag.kommentare?.length || 0) 
          ? localAntrag.kommentare 
          : serverAntrag.kommentare,
        dokumente: localAntrag.dokumente && localAntrag.dokumente.length > (serverAntrag.dokumente?.length || 0)
          ? localAntrag.dokumente
          : serverAntrag.dokumente,
        // Phasenfelder IMMER vom Server (verhindert Rücksprung zu früheren Phasen)
        sachlichGeprueft: serverAntrag.sachlichGeprueft !== undefined ? serverAntrag.sachlichGeprueft : localAntrag.sachlichGeprueft,
        sachlichGeprueftAm: serverAntrag.sachlichGeprueftAm || localAntrag.sachlichGeprueftAm,
        entscheidungGetroffen: serverAntrag.entscheidungGetroffen !== undefined ? serverAntrag.entscheidungGetroffen : localAntrag.entscheidungGetroffen,
        erledigt: serverAntrag.erledigt !== undefined ? serverAntrag.erledigt : localAntrag.erledigt,
        vollzogen: serverAntrag.vollzogen !== undefined ? serverAntrag.vollzogen : localAntrag.vollzogen,
        veraktet: serverAntrag.veraktet !== undefined ? serverAntrag.veraktet : localAntrag.veraktet,
        status: serverAntrag.status || localAntrag.status, // Status IMMER vom Server
        bearbeiterId: serverAntrag.bearbeiterId || localAntrag.bearbeiterId,
        bearbeiterName: serverAntrag.bearbeiterName || localAntrag.bearbeiterName
      };
      
      return mergedAntrag;
    });

    // Anträge: fehlende insasseJva/insasseStation aus Insassen nachziehen (für AVD-Filter)
    const antraegeMitOrt = mergedAntraege.map(a => {
      if (a.insasseJva != null && a.insasseJva !== '' && a.insasseStation != null && a.insasseStation !== '') return a;
      if (!a.insasseId) return a;
      const insasse = usersFrontend.find(u => u.type === 'insasse' && (u.id === a.insasseId || String(u.id) === String(a.insasseId) || u.insassenNummer === a.insassenNummer));
      if (!insasse) return a;
      let jva = a.insasseJva;
      let station = a.insasseStation;
      if (station == null || station === '') station = insasse.station != null ? insasse.station : station;
      if (jva == null || jva === '') {
        const raw = insasse.jva != null ? (typeof insasse.jva === 'string' ? insasse.jva : (insasse.jva && (insasse.jva.id || insasse.jva.name))) : null;
        if (raw) jva = typeof raw === 'string' && raw.indexOf('jva') !== -1 ? raw.replace(/jva/gi, 'haus') : raw;
      }
      return { ...a, insasseJva: jva, insasseStation: station };
    });

    // Daten in localStorage speichern (ohne Sync-Loop zu triggern)
    originalSetItem('gefaengnis_users', JSON.stringify(usersFrontend));
    originalSetItem('gefaengnis_antraege', JSON.stringify(antraegeMitOrt));
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

// Initiale Daten laden wenn DOM bereit; Fehler abfangen damit Login auch bei API-Ausfall funktioniert
function runLoadInitialData() {
  loadInitialData().catch((err) => {
    console.warn('Initialdaten konnten nicht geladen werden:', err);
    serverConnected = false;
    if (typeof window.reloadDataFromStorage === 'function') {
      window.reloadDataFromStorage();
    }
    window.dispatchEvent(new CustomEvent('dataSyncLoaded'));
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runLoadInitialData);
} else {
  runLoadInitialData();
}

console.log('Data-Sync Modul geladen');

