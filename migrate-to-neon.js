// Migrationsskript: Spielt Initialdaten in Neon ein
// Verwendung: DATABASE_URL="dein-neon-connection-string" node migrate-to-neon.js

const { Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ FEHLER: DATABASE_URL nicht gesetzt!');
  console.log('\nBitte setze die Umgebungsvariable:');
  console.log('  Windows PowerShell: $env:DATABASE_URL="dein-connection-string"');
  console.log('  Oder erstelle eine .env Datei mit: DATABASE_URL=dein-connection-string');
  process.exit(1);
}

const initialUsers = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin',
    name: 'Administrator',
    rolle: 'admin',
    jva: null,
    jvas: [],
    station: null,
    geburtsdatum: null,
    insassenNummer: null
  },
  {
    id: 'val-1',
    username: 'val1',
    password: 'val1',
    name: 'Max Mustermann (VAL)',
    rolle: 'hausleitung',
    jva: null,
    jvas: [{id: 'haus1', name: 'Haus 1'}, {id: 'haus2', name: 'Haus 2'}],
    station: null,
    geburtsdatum: null,
    insassenNummer: null
  },
  {
    id: 'avd-1',
    username: 'avd1',
    password: 'avd1',
    name: 'Anna Schmidt (AVD)',
    rolle: 'mitarbeiter',
    jva: null,
    jvas: [{id: 'haus1', name: 'Haus 1'}],
    station: 'Station 1',
    geburtsdatum: null,
    insassenNummer: null
  },
  {
    id: 'avd-2',
    username: 'avd2',
    password: 'avd2',
    name: 'Peter Weber (AVD)',
    rolle: 'mitarbeiter',
    jva: null,
    jvas: [{id: 'haus2', name: 'Haus 2'}],
    station: 'Station 2',
    geburtsdatum: null,
    insassenNummer: null
  },
  {
    id: 'kammer-1',
    username: 'kammer1',
    password: 'kammer1',
    name: 'Kammer Mitarbeiter',
    rolle: 'kammer',
    jva: null,
    jvas: [],
    station: null,
    geburtsdatum: null,
    insassenNummer: null
  },
  {
    id: 'zahlstelle-1',
    username: 'zahlstelle1',
    password: 'zahlstelle1',
    name: 'Zahlstelle Mitarbeiter',
    rolle: 'zahlstelle',
    jva: null,
    jvas: [],
    station: null,
    geburtsdatum: null,
    insassenNummer: null
  },
  {
    id: 'arbeit-1',
    username: 'arbeit1',
    password: 'arbeit1',
    name: 'Arbeitskoordination',
    rolle: 'arbeitskoordination',
    jva: null,
    jvas: [],
    station: null,
    geburtsdatum: null,
    insassenNummer: null
  },
  {
    id: 'insasse-1',
    username: 'insasse1',
    password: 'insasse1',
    name: 'Hans Mueller',
    rolle: 'insasse',
    jva: 'haus1',
    jvas: [],
    station: 'Station 1',
    geburtsdatum: '1985-03-15',
    insassenNummer: 'INS-001'
  },
  {
    id: 'insasse-2',
    username: 'insasse2',
    password: 'insasse2',
    name: 'Klaus Fischer',
    rolle: 'insasse',
    jva: 'haus2',
    jvas: [],
    station: 'Station 2',
    geburtsdatum: '1990-07-22',
    insassenNummer: 'INS-002'
  }
];

async function migrate() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Verbinde mit Neon...');
    await client.connect();
    console.log('✅ Verbindung erfolgreich!\n');

    // Prüfe ob Tabellen existieren
    console.log('📋 Prüfe Tabellen...');
    const tablesCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'antraege', 'aufgaben', 'notifications', 'aktivitaeten', 'termine')
      ORDER BY table_name;
    `);
    
    if (tablesCheck.rows.length !== 6) {
      console.error('❌ FEHLER: Nicht alle Tabellen gefunden!');
      console.log('   Gefunden:', tablesCheck.rows.map(r => r.table_name).join(', '));
      console.log('\n   Bitte führe zuerst neon-schema.sql aus!');
      process.exit(1);
    }
    console.log('✅ Alle Tabellen vorhanden\n');

    // Prüfe ob bereits Benutzer vorhanden sind
    const existingUsers = await client.query('SELECT COUNT(*) as count FROM users');
    const count = parseInt(existingUsers.rows[0].count);
    
    if (count > 0) {
      console.log(`⚠️  Bereits ${count} Benutzer in der Datenbank vorhanden.`);
      console.log('   Überspringe Einfügen (verwende ON CONFLICT DO NOTHING)...\n');
    }

    // Benutzer einfügen
    console.log('👥 Füge Demo-Benutzer ein...');
    let inserted = 0;
    let skipped = 0;

    for (const user of initialUsers) {
      try {
        const result = await client.query(
          'INSERT INTO users (id, data) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO NOTHING RETURNING id',
          [user.id, JSON.stringify(user)]
        );
        if (result.rows.length > 0) {
          inserted++;
          console.log(`   ✅ ${user.username} (${user.rolle}) eingefügt`);
        } else {
          skipped++;
          console.log(`   ⏭️  ${user.username} bereits vorhanden`);
        }
      } catch (error) {
        console.error(`   ❌ Fehler bei ${user.username}:`, error.message);
      }
    }

    console.log(`\n📊 Zusammenfassung:`);
    console.log(`   Eingefügt: ${inserted}`);
    console.log(`   Übersprungen: ${skipped}`);
    console.log(`   Gesamt: ${inserted + skipped}/${initialUsers.length}\n`);

    // Prüfe Ergebnis
    const finalCheck = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Datenbank enthält jetzt ${finalCheck.rows[0].count} Benutzer\n`);

    // Zeige alle Benutzer
    const allUsers = await client.query(`
      SELECT id, data->>'username' as username, data->>'name' as name, data->>'rolle' as rolle 
      FROM users 
      ORDER BY id
    `);
    
    console.log('📋 Alle Benutzer in der Datenbank:');
    allUsers.rows.forEach(u => {
      console.log(`   - ${u.username} (${u.name}) - ${u.rolle}`);
    });

    console.log('\n🎉 Migration erfolgreich abgeschlossen!');
    
  } catch (error) {
    console.error('❌ FEHLER:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
