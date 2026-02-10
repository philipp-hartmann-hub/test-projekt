// Prüfskript für Neon-Schema
// Führt automatisch alle Checks durch und zeigt Ergebnisse

const { Client } = require('pg');
// Optional: dotenv für .env-Datei (falls installiert)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv nicht installiert, verwende nur Umgebungsvariablen
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ FEHLER: DATABASE_URL nicht gesetzt!');
  console.log('\nBitte setze die Umgebungsvariable:');
  console.log('  Windows PowerShell: $env:DATABASE_URL="dein-connection-string"');
  console.log('  Oder erstelle eine .env Datei mit: DATABASE_URL=dein-connection-string');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  const results = {
    connection: false,
    tables: [],
    columns: {},
    indexes: [],
    errors: []
  };

  try {
    console.log('🔌 Verbinde mit Neon...\n');
    await client.connect();
    results.connection = true;
    console.log('✅ Verbindung erfolgreich!\n');

    // 1. Tabellen prüfen
    console.log('📋 Prüfe Tabellen...');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);
    results.tables = tablesResult.rows.map(r => r.table_name);
    
    const expectedTables = ['users', 'antraege', 'aufgaben', 'notifications', 'aktivitaeten', 'termine'];
    const missingTables = expectedTables.filter(t => !results.tables.includes(t));
    
    if (missingTables.length === 0) {
      console.log(`✅ Alle ${expectedTables.length} Tabellen gefunden:`);
      results.tables.forEach(t => console.log(`   - ${t}`));
    } else {
      console.log(`⚠️  Nur ${results.tables.length}/${expectedTables.length} Tabellen gefunden:`);
      results.tables.forEach(t => console.log(`   - ${t}`));
      console.log(`❌ Fehlende Tabellen: ${missingTables.join(', ')}`);
      results.errors.push(`Fehlende Tabellen: ${missingTables.join(', ')}`);
    }
    console.log('');

    // 2. Spalten prüfen (für jede Tabelle)
    console.log('📊 Prüfe Spalten...');
    for (const table of expectedTables) {
      if (results.tables.includes(table)) {
        const columnsQuery = `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `;
        const columnsResult = await client.query(columnsQuery, [table]);
        results.columns[table] = columnsResult.rows;
        
        const hasId = columnsResult.rows.some(r => r.column_name === 'id' && r.data_type === 'text');
        const hasData = columnsResult.rows.some(r => r.column_name === 'data' && r.data_type === 'jsonb');
        
        if (hasId && hasData) {
          console.log(`   ✅ ${table}: id (text), data (jsonb)`);
        } else {
          console.log(`   ⚠️  ${table}: Erwartet id (text) + data (jsonb), gefunden:`);
          columnsResult.rows.forEach(c => console.log(`      - ${c.column_name} (${c.data_type})`));
          results.errors.push(`${table}: Falsche Spalten`);
        }
      }
    }
    console.log('');

    // 3. Indizes prüfen
    console.log('🔍 Prüfe Indizes...');
    const indexesQuery = `
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
        AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `;
    const indexesResult = await client.query(indexesQuery);
    results.indexes = indexesResult.rows;
    
    const expectedIndexes = [
      { table: 'users', index: 'idx_users_username' },
      { table: 'aktivitaeten', index: 'idx_aktivitaeten_antragid' },
      { table: 'termine', index: 'idx_termine_datum' }
    ];
    
    const foundIndexes = results.indexes.map(i => i.indexname);
    const missingIndexes = expectedIndexes.filter(e => !foundIndexes.includes(e.index));
    
    if (missingIndexes.length === 0) {
      console.log(`✅ Alle ${expectedIndexes.length} erwarteten Indizes gefunden:`);
      results.indexes.forEach(i => console.log(`   - ${i.indexname} auf ${i.tablename}`));
    } else {
      console.log(`⚠️  Nur ${foundIndexes.length}/${expectedIndexes.length} Indizes gefunden:`);
      results.indexes.forEach(i => console.log(`   - ${i.indexname} auf ${i.tablename}`));
      console.log(`❌ Fehlende Indizes: ${missingIndexes.map(e => e.index).join(', ')}`);
      results.errors.push(`Fehlende Indizes: ${missingIndexes.map(e => e.index).join(', ')}`);
    }
    console.log('');

    // 4. Test-Insert/Select (optional, nur wenn users-Tabelle existiert)
    if (results.tables.includes('users')) {
      console.log('🧪 Teste INSERT/SELECT...');
      try {
        const testId = 'schema-check-' + Date.now();
        const testData = {
          username: 'schema_test',
          password: 'test',
          name: 'Schema Test',
          rolle: 'admin'
        };
        
        await client.query(
          'INSERT INTO users (id, data) VALUES ($1, $2::jsonb)',
          [testId, JSON.stringify(testData)]
        );
        
        const selectResult = await client.query('SELECT * FROM users WHERE id = $1', [testId]);
        if (selectResult.rows.length > 0) {
          console.log('   ✅ INSERT/SELECT funktioniert');
          
          // Cleanup
          await client.query('DELETE FROM users WHERE id = $1', [testId]);
          console.log('   ✅ Test-Daten entfernt');
        } else {
          console.log('   ⚠️  INSERT erfolgreich, aber SELECT findet keine Daten');
          results.errors.push('INSERT/SELECT Test fehlgeschlagen');
        }
      } catch (testError) {
        console.log(`   ❌ Test fehlgeschlagen: ${testError.message}`);
        results.errors.push(`INSERT/SELECT Test: ${testError.message}`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ FEHLER:', error.message);
    results.errors.push(error.message);
  } finally {
    await client.end();
  }

  // Zusammenfassung
  console.log('═══════════════════════════════════════');
  console.log('📊 ZUSAMMENFASSUNG');
  console.log('═══════════════════════════════════════');
  console.log(`Verbindung: ${results.connection ? '✅ OK' : '❌ FEHLER'}`);
  console.log(`Tabellen: ${results.tables.length}/6 ${results.tables.length === 6 ? '✅' : '❌'}`);
  console.log(`Indizes: ${results.indexes.length}/3 ${results.indexes.length >= 3 ? '✅' : '⚠️'}`);
  
  if (results.errors.length === 0) {
    console.log('\n🎉 ALLE CHECKS BESTANDEN! Schema ist korrekt angelegt.');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${results.errors.length} Problem(e) gefunden:`);
    results.errors.forEach(e => console.log(`   - ${e}`));
    process.exit(1);
  }
}

checkSchema().catch(err => {
  console.error('❌ Unerwarteter Fehler:', err);
  process.exit(1);
});
