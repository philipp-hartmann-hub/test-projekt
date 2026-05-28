const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dbLayer = require('./db-layer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Fuer PDF-Uploads
// Statische Dateien nur lokal servieren; auf Vercel macht das Vercel selbst
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, 'public')));
}

// ============================================
// DATENBANK-INITIALISIERUNG
// ============================================

const DB_FILE = path.join(__dirname, 'database.json');

// PostgreSQL initialisieren (falls DATABASE_URL gesetzt) - lazy init beim ersten API-Call
// Nicht beim Modul-Laden, um Vercel-Deployment-Probleme zu vermeiden

// ============================================
// HILFSFUNKTIONEN
// ============================================

function generateId(prefix = 'ID') {
  return prefix + '-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Verhindert Datenverlust bei verzögerten oder veralteten PUTs (z. B. parallele Sync-Jobs):
// dokumente/kommentare/weiterleitungen werden nach id vereinigt; Einträge ohne id per Inhalt dedupliziert.
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

/** Vereinigt Bearbeiter-IDs aus Weiterleitungen (kein Datenverlust bei parallelen Clients). */
function unionAbgegebenVonIds(a, b) {
  const set = new Set();
  for (const arr of [a, b]) {
    if (!Array.isArray(arr)) continue;
    for (const id of arr) {
      if (id != null && String(id).length) set.add(String(id));
    }
  }
  return [...set];
}

function antragPhaseRank(a) {
  if (!a || typeof a !== 'object') return 0;
  if (a.veraktet === true) return 6;
  if (a.vollzogen === true) return 5;
  if (a.erledigt === true || ['genehmigt', 'abgelehnt', 'teilweise-genehmigt'].includes(a.status)) return 4;
  if (a.entscheidungGetroffen === true) return 3;
  if (a.sachlichGeprueft === true) return 2;
  if (a.status === 'in-bearbeitung') return 1;
  return 0;
}

function mergeAntragPutPayload(existing, incoming) {
  if (!incoming || typeof incoming !== 'object') return incoming;
  if (!existing || typeof existing !== 'object') return incoming;

  const incWlLen = Array.isArray(incoming.weiterleitungen) ? incoming.weiterleitungen.length : 0;
  const exWlLen = Array.isArray(existing.weiterleitungen) ? existing.weiterleitungen.length : 0;

  const base = { ...existing, ...incoming };
  base.dokumente = mergeDokumenteArrays(existing.dokumente, incoming.dokumente);
  base.kommentare = mergeAntragArraysByIdOrContent(existing.kommentare, incoming.kommentare);
  base.weiterleitungen = mergeAntragArraysByIdOrContent(existing.weiterleitungen, incoming.weiterleitungen);

  base.abgegebenVon = unionAbgegebenVonIds(existing.abgegebenVon, incoming.abgegebenVon);

  // Veralteter Client mit weniger Weiterleitungseinträgen darf Bearbeiter nicht zurückdrehen
  if (incWlLen < exWlLen) {
    base.bearbeiterId = existing.bearbeiterId;
    base.bearbeiterName = existing.bearbeiterName;
  }

  const monotonicTrue = ['sachlichGeprueft', 'entscheidungGetroffen', 'veraktet', 'vollzogen', 'erledigt'];
  for (const k of monotonicTrue) {
    if (existing[k] === true || incoming[k] === true) {
      base[k] = true;
    }
  }
  const rankExisting = antragPhaseRank(existing);
  const rankIncoming = antragPhaseRank(incoming);
  const progressed = rankExisting >= rankIncoming ? existing : incoming;
  const progressedStatus = progressed && progressed.status;
  if (progressedStatus && antragPhaseRank(base) < Math.max(rankExisting, rankIncoming)) {
    base.status = progressedStatus;
  }

  // Nie in frühere Bekanntgabe-/Vollzugszustände zurückfallen.
  const bekanntgabeErledigt =
    existing.persoenlichEroeffnet === true ||
    incoming.persoenlichEroeffnet === true ||
    (existing.erledigt === true && existing.wartetAufEroeffnung === false) ||
    (incoming.erledigt === true && incoming.wartetAufEroeffnung === false);
  if (bekanntgabeErledigt && (existing.wartetAufEroeffnung === false || incoming.wartetAufEroeffnung === false)) {
    base.wartetAufEroeffnung = false;
  }
  const vollzugErledigt =
    existing.vollzogen === true ||
    incoming.vollzogen === true ||
    (existing.erledigt === true && existing.wartetAufVollzug === false) ||
    (incoming.erledigt === true && incoming.wartetAufVollzug === false);
  if (vollzugErledigt && (existing.wartetAufVollzug === false || incoming.wartetAufVollzug === false)) {
    base.wartetAufVollzug = false;
  }
  const pkEx = existing.pruefungsKommentar;
  const pkIn = incoming.pruefungsKommentar;
  const len = (v) => (v == null ? 0 : String(v).length);
  if (len(pkIn) > len(pkEx)) {
    base.pruefungsKommentar = pkIn;
  } else if (pkEx != null && pkIn == null) {
    base.pruefungsKommentar = pkEx;
  }
  return base;
}

// ============================================
// API ROUTEN - DB-SETUP (Neon-Schema ausführen)
// ============================================
// Aufruf: GET /api/setup-db?key=setup  (Vercel leitet an /api/[[...path]] weiter)
const handleSetupDb = async (req, res) => {
  try {
    const key = (req.query.key || req.headers['x-setup-key'] || '').trim();
    const secret = process.env.SETUP_SECRET || '';
    const ok = secret ? (key === secret) : (key === 'setup');
    if (!ok) {
      return res.status(401).json({
        success: false,
        error: secret ? 'Ungültiger Key.' : 'Rufe mit ?key=setup auf, um das Schema auszuführen (ohne Vercel-Konfiguration).'
      });
    }
    const result = await dbLayer.runSchema();
    res.json({ success: true, message: 'Schema ausgeführt.', tables: result.tables });
  } catch (error) {
    console.error('Setup-DB Fehler:', error);
    res.status(500).json({ success: false, error: error.message || String(error) });
  }
};
app.get('/api/setup-db', handleSetupDb);
app.get('/setup-db', handleSetupDb); // Falls Vercel Pfad ohne /api übergibt

// ============================================
// DEPLOYMENT AUSLÖSEN (Vercel Deploy Hook)
// Löst ein neues Deployment vom verbundenen Git-Branch aus – ersetzt kein git push.
// Vercel: Projekt → Settings → Git → Deploy Hooks → Hook anlegen, URL als VERCEL_DEPLOY_HOOK_URL speichern.
// ============================================

async function handleTriggerDeployment(req, res) {
  const hookUrl = (process.env.VERCEL_DEPLOY_HOOK_URL || '').trim();
  if (!hookUrl) {
    return res.status(503).json({
      success: false,
      error:
        'VERCEL_DEPLOY_HOOK_URL fehlt. In Vercel unter Settings → Git einen Deploy Hook anlegen und die URL als Umgebungsvariable setzen.'
    });
  }
  const secret = (process.env.DEPLOY_TRIGGER_SECRET || '').trim();
  const provided =
    String(req.query.key || '').trim() ||
    String(req.headers['x-deploy-key'] || '').trim() ||
    (() => {
      const a = String(req.headers.authorization || '');
      const m = /^Bearer\s+(.+)$/i.exec(a);
      return m ? m[1].trim() : '';
    })();
  if (!secret) {
    return res.status(503).json({
      success: false,
      error:
        'DEPLOY_TRIGGER_SECRET muss gesetzt sein (Vercel → Environment Variables), damit die Deploy-API nicht öffentlich missbraucht werden kann.'
    });
  }
  if (provided !== secret) {
    return res.status(401).json({ success: false, error: 'Ungültiger Key.' });
  }
  try {
    const r = await fetch(hookUrl, { method: 'POST' });
    const text = await r.text();
    let vercelBody;
    try {
      vercelBody = text ? JSON.parse(text) : null;
    } catch {
      vercelBody = { raw: text.slice(0, 300) };
    }
    if (!r.ok) {
      return res.status(502).json({
        success: false,
        error: 'Vercel Deploy Hook hat einen Fehler zurückgegeben.',
        status: r.status,
        detail: vercelBody
      });
    }
    res.json({
      success: true,
      message: 'Deployment wurde bei Vercel angestoßen (Stand entspricht dem letzten Push auf GitHub).',
      vercel: vercelBody
    });
  } catch (error) {
    console.error('trigger-deployment:', error);
    res.status(500).json({ success: false, error: error.message || String(error) });
  }
}

app.post('/api/trigger-deployment', handleTriggerDeployment);
app.get('/api/trigger-deployment', handleTriggerDeployment);

// ============================================
// API ROUTEN - AUTHENTIFIZIERUNG
// ============================================

/** Login: Benutzername oder Anzeigename (name / Vorname Nachname), Passwort exakt wie gespeichert */
async function findUserByCredentials(rawUsername, rawPassword) {
  const username = String(rawUsername || '').trim();
  const password = String(rawPassword ?? '');
  if (!username || password === '') return null;

  const users = await dbLayer.getAll('users');
  const pwOk = (u) => u.password === password;

  let u = users.find((x) => x.username === username && pwOk(x));
  if (u) return u;

  u = users.find(
    (x) =>
      x.username &&
      String(x.username).trim().toLowerCase() === username.toLowerCase() &&
      pwOk(x)
  );
  if (u) return u;

  const want = username.toLowerCase().replace(/\s+/g, ' ').trim();
  u = users.find((x) => {
    if (!pwOk(x)) return false;
    const nameFull = String(x.name || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
    if (nameFull === want) return true;
    const vn = String(x.vorname || '').trim();
    const nn = String(x.nachname || '').trim();
    const combined = `${vn} ${nn}`
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
    return combined === want;
  });
  return u || null;
}

app.post('/api/login', async (req, res) => {
  try {
    const { username, password, portalTyp } = req.body;

    const user = await findUserByCredentials(username, password);

    if (!user) {
      return res.json({ success: false, message: 'Ungueltige Anmeldedaten' });
    }

    // Admin-Portal: nur nicht-Insassen (Mitarbeitende / Admin / VAL etc.)
    if (portalTyp === 'admin' && user.rolle === 'insasse') {
      return res.json({ success: false, message: 'Kein Zugang zum Admin-Portal' });
    }

    // Portal-Typ pruefen
    if (portalTyp === 'insasse' && user.rolle !== 'insasse') {
      return res.json({ success: false, message: 'Kein Zugang zum Insassen-Portal' });
    }
    if (portalTyp === 'mitarbeiter' && user.rolle === 'insasse') {
      return res.json({ success: false, message: 'Kein Zugang zum Mitarbeiter-Portal' });
    }
    
    // User-Objekt fuer Frontend aufbereiten
    const userData = {
      ...user,
      userId: user.id
    };
    
    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ success: false, message: 'Server-Fehler bei der Anmeldung' });
  }
});

// ============================================
// API ROUTEN - BENUTZER
// ============================================

app.get('/api/users', async (req, res) => {
  try {
    const users = await dbLayer.getAll('users');
    res.json(users);
  } catch (error) {
    console.error('Fehler beim Laden der Benutzer:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Benutzer' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = req.body;
    user.id = user.id || generateId('USR');
    user.jvas = user.jvas || [];
    
    // Pruefen ob Username bereits existiert
    const existing = await dbLayer.findOne('users', u => u.username === user.username);
    if (existing) {
      return res.status(400).json({ success: false, error: 'Benutzername existiert bereits' });
    }
    
    await dbLayer.create('users', user);
    res.json({ success: true, id: user.id });
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen des Benutzers' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const updated = await dbLayer.update('users', id, userData);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren des Benutzers' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbLayer.remove('users', id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen des Benutzers' });
  }
});

// ============================================
// API ROUTEN - ANTRAEGE
// ============================================

app.get('/api/antraege', async (req, res) => {
  try {
    const antraege = await dbLayer.getAll('antraege');
    res.json(antraege);
  } catch (error) {
    console.error('Fehler beim Laden der Anträge:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Anträge' });
  }
});

app.post('/api/antraege', async (req, res) => {
  try {
    const antrag = req.body;
    if (!antrag || typeof antrag !== 'object') {
      return res.status(400).json({ success: false, error: 'Ungültiger Antrag (kein Objekt)' });
    }
    antrag.id = antrag.id || generateId('ANT');
    antrag.antragsNummer = antrag.antragsNummer || 'A-' + Date.now().toString().slice(-6);
    antrag.erstelltAm = antrag.erstelltAm || new Date().toISOString();
    antrag.updatedAt = antrag.updatedAt || new Date().toISOString();
    antrag.syncVersion = Number.isFinite(Number(antrag.syncVersion)) ? Number(antrag.syncVersion) : 1;
    antrag.kommentare = antrag.kommentare || [];
    antrag.dokumente = antrag.dokumente || [];
    // Sicherstellen, dass id ein String ist (PostgreSQL TEXT)
    antrag.id = String(antrag.id);

    await dbLayer.create('antraege', antrag);
    res.json({ success: true, id: antrag.id, antragsNummer: antrag.antragsNummer });
  } catch (error) {
    console.error('Fehler beim Erstellen des Antrags:', error.message || error);
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen des Antrags',
      detail: error.message || String(error)
    });
  }
});

app.put('/api/antraege/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const antragData = req.body;
    const existing = await dbLayer.getById('antraege', id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Antrag nicht gefunden' });
    }

    // Optimistic locking: veraltete Clients duerfen keinen neueren Stand ueberschreiben.
    const baseUpdatedAt = antragData && typeof antragData === 'object' ? antragData._baseUpdatedAt : null;
    if (baseUpdatedAt && existing.updatedAt && String(baseUpdatedAt) !== String(existing.updatedAt)) {
      return res.status(409).json({
        success: false,
        error: 'Konflikt: Antrag wurde zwischenzeitlich auf einem anderen Geraet aktualisiert.',
        latestAntrag: existing
      });
    }

    const payload = mergeAntragPutPayload(existing, antragData);
    if (payload && typeof payload === 'object') {
      delete payload._baseUpdatedAt;
      payload.updatedAt = new Date().toISOString();
      payload.syncVersion = Math.max(
        Number(existing.syncVersion) || 0,
        Number(antragData && antragData.syncVersion) || 0,
        0
      ) + 1;
    }

    const updated = await dbLayer.update('antraege', id, payload);
    
    // Aktualisierten Antrag zurückgeben, damit Frontend die Änderungen bestätigen kann
    res.json(updated);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Antrags:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren des Antrags' });
  }
});

app.delete('/api/antraege/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbLayer.remove('antraege', id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Antrag nicht gefunden' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen des Antrags:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen des Antrags' });
  }
});

// ============================================
// API ROUTEN - AUFGABEN
// ============================================

app.get('/api/aufgaben', async (req, res) => {
  try {
    const aufgaben = await dbLayer.getAll('aufgaben');
    res.json(aufgaben);
  } catch (error) {
    console.error('Fehler beim Laden der Aufgaben:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Aufgaben' });
  }
});

app.post('/api/aufgaben', async (req, res) => {
  try {
    const aufgabe = req.body;
    aufgabe.id = aufgabe.id || generateId('AUF');
    aufgabe.erstelltAm = aufgabe.erstelltAm || new Date().toISOString();
    aufgabe.status = aufgabe.status || 'offen';
    aufgabe.anhangPdfs = aufgabe.anhangPdfs || [];
    aufgabe.antwortPdfs = aufgabe.antwortPdfs || [];
    
    await dbLayer.create('aufgaben', aufgabe);
    res.json({ success: true, id: aufgabe.id });
  } catch (error) {
    console.error('Fehler beim Erstellen der Aufgabe:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen der Aufgabe' });
  }
});

app.put('/api/aufgaben/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const aufgabeData = req.body;
    
    const updated = await dbLayer.update('aufgaben', id, aufgabeData);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Aufgabe nicht gefunden' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Aufgabe:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren der Aufgabe' });
  }
});

app.delete('/api/aufgaben/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbLayer.remove('aufgaben', id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Aufgabe nicht gefunden' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen der Aufgabe:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen der Aufgabe' });
  }
});

// ============================================
// API ROUTEN - BENACHRICHTIGUNGEN
// ============================================

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await dbLayer.getAll('notifications');
    res.json(notifications);
  } catch (error) {
    console.error('Fehler beim Laden der Benachrichtigungen:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Benachrichtigungen' });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const notification = req.body;
    notification.id = notification.id || generateId('NOT');
    notification.erstelltAm = notification.erstelltAm || new Date().toISOString();
    notification.gelesen = notification.gelesen || false;
    
    await dbLayer.create('notifications', notification);
    res.json({ success: true, id: notification.id });
  } catch (error) {
    console.error('Fehler beim Erstellen der Benachrichtigung:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen der Benachrichtigung' });
  }
});

app.put('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notificationData = req.body;
    
    const updated = await dbLayer.update('notifications', id, notificationData);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Benachrichtigung nicht gefunden' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Benachrichtigung:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren der Benachrichtigung' });
  }
});

// ============================================
// API ROUTEN - AKTIVITAETEN
// ============================================

app.get('/api/aktivitaeten', async (req, res) => {
  try {
    const { antragId } = req.query;
    
    let result;
    if (antragId) {
      const aid = String(antragId);
      result = await dbLayer.findMany('aktivitaeten', a => String(a.antragId) === aid);
    } else {
      result = await dbLayer.getAll('aktivitaeten');
    }
    
    // Nach Erstellungsdatum sortieren (neueste zuerst)
    result.sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
    
    res.json(result);
  } catch (error) {
    console.error('Fehler beim Laden der Aktivitäten:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Aktivitäten' });
  }
});

app.post('/api/aktivitaeten', async (req, res) => {
  try {
    const aktivitaet = req.body;
    aktivitaet.id = aktivitaet.id || generateId('AKT');
    aktivitaet.erstelltAm = aktivitaet.erstelltAm || new Date().toISOString();
    
    await dbLayer.create('aktivitaeten', aktivitaet);
    res.json({ success: true, id: aktivitaet.id });
  } catch (error) {
    console.error('Fehler beim Erstellen der Aktivität:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen der Aktivität' });
  }
});

// ============================================
// API ROUTEN - TERMINE
// ============================================

app.get('/api/termine', async (req, res) => {
  try {
    const termine = await dbLayer.getAll('termine');
    // Nach Datum sortieren
    const sorted = [...termine].sort((a, b) => {
      const dateA = new Date(a.datum + 'T' + (a.uhrzeit || '00:00'));
      const dateB = new Date(b.datum + 'T' + (b.uhrzeit || '00:00'));
      return dateA - dateB;
    });
    res.json(sorted);
  } catch (error) {
    console.error('Fehler beim Laden der Termine:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Laden der Termine' });
  }
});

app.post('/api/termine', async (req, res) => {
  try {
    const termin = req.body;
    termin.id = termin.id || generateId('TRM');
    termin.erstelltAm = termin.erstelltAm || new Date().toISOString();
    
    await dbLayer.create('termine', termin);
    res.json({ success: true, id: termin.id });
  } catch (error) {
    console.error('Fehler beim Erstellen des Termins:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Erstellen des Termins' });
  }
});

app.put('/api/termine/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const terminData = req.body;
    
    const updated = await dbLayer.update('termine', id, terminData);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Termin nicht gefunden' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Termins:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren des Termins' });
  }
});

app.delete('/api/termine/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbLayer.remove('termine', id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Termin nicht gefunden' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Löschen des Termins:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Löschen des Termins' });
  }
});

// ============================================
// FALLBACK ROUTE - SPA SUPPORT (nur lokal; auf Vercel serviert Vercel die statischen Dateien)
// ============================================

if (!process.env.VERCEL) {
  const publicDir = path.join(__dirname, 'public');
  app.get('*', (req, res) => {
    // Wenn keine API-Route, dann statische Datei oder index.html (aus public/)
    const filePath = path.join(publicDir, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.sendFile(filePath);
    } else {
      res.sendFile(path.join(publicDir, 'index.html'));
    }
  });
}

// ============================================
// SERVER STARTEN (nur lokal; auf Vercel wird die App als Serverless Function genutzt)
// ============================================

module.exports = { app };

const LOCAL_URL = `http://localhost:${PORT}`;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
======================================================
    JVA Antragsbearbeitungssystem - Server
======================================================
  Im Browser oeffnen: ${LOCAL_URL}
  
  Direktlinks:
  - Startseite:    ${LOCAL_URL}/
  - Insassen:      ${LOCAL_URL}/insassen.html
  - Mitarbeiter:   ${LOCAL_URL}/mitarbeiter.html
  - Admin:         ${LOCAL_URL}/admin.html
  
  Demo-Zugaenge:
  - Admin:              admin / admin
  - VAL:                val1 / val1
  - AVD:                avd1 / avd1  oder  avd2 / avd2
  - Kammer:             kammer1 / kammer1
  - Insasse:            insasse1 / insasse1  oder  insasse2 / insasse2
  
  Datenbank: ${process.env.DATABASE_URL ? 'PostgreSQL (Neon)' : DB_FILE}
======================================================
  `);
    // Browser automatisch oeffnen (nur wenn nicht in CI/Produktion)
    if (process.platform && !process.env.CI && process.env.NODE_ENV !== 'production') {
      try {
        const { exec } = require('child_process');
        const url = LOCAL_URL;
        if (process.platform === 'win32') exec('start "" "' + url + '"');
        else if (process.platform === 'darwin') exec('open "' + url + '"');
        else exec('xdg-open "' + url + '"');
      } catch (e) { /* ignorieren */ }
    }
  });
}
