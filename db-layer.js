// ============================================
// DB-Layer: Unterstützt JSON-Datei (lokal) und PostgreSQL/Neon (Produktion)
// ============================================

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const DB_FILE = path.join(__dirname, 'database.json');
const USE_POSTGRES = !!process.env.DATABASE_URL;

let pgClient = null;

// PostgreSQL-Client initialisieren (lazy - nur beim ersten Aufruf)
async function initPostgres() {
  if (!USE_POSTGRES) return;
  if (pgClient) return; // Bereits initialisiert
  
  try {
    pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await pgClient.connect();
    console.log('✅ PostgreSQL-Verbindung hergestellt (Neon)');
  } catch (error) {
    console.error('❌ Fehler bei PostgreSQL-Verbindung:', error.message);
    // Nicht werfen, damit JSON-Fallback verwendet werden kann
    pgClient = null;
  }
}

// JSON-Datenbank laden
function loadJSONDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('Erstelle neue JSON-Datenbank...');
  }
  
  // Standard-Datenbank erstellen
  return {
    users: [
      { id: 'admin-1', username: 'admin', password: 'admin', name: 'Administrator', rolle: 'admin', jva: null, jvas: [], station: null, geburtsdatum: null, insassenNummer: null },
      { id: 'val-1', username: 'val1', password: 'val1', name: 'Max Mustermann (VAL)', rolle: 'hausleitung', jva: null, jvas: [{id: 'haus1', name: 'Haus 1'}, {id: 'haus2', name: 'Haus 2'}], station: null, geburtsdatum: null, insassenNummer: null },
      { id: 'avd-1', username: 'avd1', password: 'avd1', name: 'Anna Schmidt (AVD)', rolle: 'mitarbeiter', jva: null, jvas: [{id: 'haus1', name: 'Haus 1'}], station: '1', geburtsdatum: null, insassenNummer: null },
      { id: 'avd-2', username: 'avd2', password: 'avd2', name: 'Peter Weber (AVD)', rolle: 'mitarbeiter', jva: null, jvas: [{id: 'haus2', name: 'Haus 2'}], station: '2', geburtsdatum: null, insassenNummer: null },
      { id: 'kammer-1', username: 'kammer1', password: 'kammer1', name: 'Kammer Mitarbeiter', rolle: 'kammer', jva: null, jvas: [], station: null, geburtsdatum: null, insassenNummer: null },
      { id: 'zahlstelle-1', username: 'zahlstelle1', password: 'zahlstelle1', name: 'Zahlstelle Mitarbeiter', rolle: 'zahlstelle', jva: null, jvas: [], station: null, geburtsdatum: null, insassenNummer: null },
      { id: 'arbeit-1', username: 'arbeit1', password: 'arbeit1', name: 'Arbeitskoordination', rolle: 'arbeitskoordination', jva: null, jvas: [], station: null, geburtsdatum: null, insassenNummer: null },
      { id: 'insasse-1', username: 'insasse1', password: 'insasse1', name: 'Hans Mueller', rolle: 'insasse', jva: 'haus1', jvas: [], station: '1', geburtsdatum: '1985-03-15', insassenNummer: 'INS-001' },
      { id: 'insasse-2', username: 'insasse2', password: 'insasse2', name: 'Klaus Fischer', rolle: 'insasse', jva: 'haus2', jvas: [], station: '2', geburtsdatum: '1990-07-22', insassenNummer: 'INS-002' }
    ],
    antraege: [],
    aufgaben: [],
    notifications: [],
    aktivitaeten: [],
    termine: []
  };
}

// JSON-Datenbank speichern
function saveJSONDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Fehler beim Speichern der JSON-Datenbank:', error);
  }
}

// ============================================
// EINHEITLICHE DB-API
// ============================================

// Alle Einträge einer Tabelle abrufen
async function getAll(tableName) {
  if (USE_POSTGRES) {
    await initPostgres();
    if (!pgClient) {
      // Fallback zu JSON wenn PostgreSQL-Verbindung fehlgeschlagen ist
      const db = loadJSONDatabase();
      return db[tableName] || [];
    }
    const result = await pgClient.query(`SELECT data FROM ${tableName} ORDER BY id`);
    return result.rows.map(row => row.data);
  } else {
    const db = loadJSONDatabase();
    return db[tableName] || [];
  }
}

// Einen Eintrag nach ID abrufen
async function getById(tableName, id) {
  if (USE_POSTGRES) {
    await initPostgres();
    const result = await pgClient.query('SELECT data FROM ' + tableName + ' WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0].data : null;
  } else {
    const db = loadJSONDatabase();
    const items = db[tableName] || [];
    return items.find(item => item.id === id) || null;
  }
}

// Einen Eintrag nach Bedingung finden (z.B. für Login: username + password)
async function findOne(tableName, predicate) {
  if (USE_POSTGRES) {
    await initPostgres();
    const all = await getAll(tableName);
    return all.find(predicate) || null;
  } else {
    const db = loadJSONDatabase();
    const items = db[tableName] || [];
    return items.find(predicate) || null;
  }
}

// Alle Einträge nach Bedingung filtern
async function findMany(tableName, predicate) {
  if (USE_POSTGRES) {
    await initPostgres();
    const all = await getAll(tableName);
    return all.filter(predicate);
  } else {
    const db = loadJSONDatabase();
    const items = db[tableName] || [];
    return items.filter(predicate);
  }
}

// Einen neuen Eintrag erstellen
async function create(tableName, item) {
  if (USE_POSTGRES) {
    await initPostgres();
    await pgClient.query(
      'INSERT INTO ' + tableName + ' (id, data) VALUES ($1, $2::jsonb)',
      [item.id, JSON.stringify(item)]
    );
    return item;
  } else {
    const db = loadJSONDatabase();
    if (!db[tableName]) db[tableName] = [];
    db[tableName].push(item);
    saveJSONDatabase(db);
    return item;
  }
}

// Einen Eintrag aktualisieren
async function update(tableName, id, updates) {
  if (USE_POSTGRES) {
    await initPostgres();
    const existing = await getById(tableName, id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updates };
    await pgClient.query(
      'UPDATE ' + tableName + ' SET data = $1::jsonb WHERE id = $2',
      [JSON.stringify(updated), id]
    );
    return updated;
  } else {
    const db = loadJSONDatabase();
    const items = db[tableName] || [];
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    saveJSONDatabase(db);
    return items[index];
  }
}

// Einen Eintrag löschen
async function remove(tableName, id) {
  if (USE_POSTGRES) {
    await initPostgres();
    const result = await pgClient.query('DELETE FROM ' + tableName + ' WHERE id = $1', [id]);
    return result.rowCount > 0;
  } else {
    const db = loadJSONDatabase();
    const items = db[tableName] || [];
    const beforeLength = items.length;
    db[tableName] = items.filter(item => item.id !== id);
    saveJSONDatabase(db);
    return items.length < beforeLength;
  }
}

// Prüfen ob ein Eintrag existiert
async function exists(tableName, predicate) {
  const found = await findOne(tableName, predicate);
  return found !== null;
}

module.exports = {
  getAll,
  getById,
  findOne,
  findMany,
  create,
  update,
  remove,
  exists,
  initPostgres
};
