// Einfaches Testskript für die API
const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Teste API-Endpunkte...\n');

  // Test 1: GET /api/users
  console.log('1. Test: GET /api/users');
  try {
    const result = await makeRequest('/api/users');
    if (result.status === 200 && Array.isArray(result.data) && result.data.length > 0) {
      console.log(`   ✅ Erfolg: ${result.data.length} Benutzer gefunden`);
      console.log(`   Erster Benutzer: ${result.data[0].username} (${result.data[0].rolle})`);
    } else {
      console.log(`   ❌ Fehler: Status ${result.status}, Daten:`, result.data);
    }
  } catch (error) {
    console.log(`   ❌ Fehler: ${error.message}`);
  }
  console.log('');

  // Test 2: POST /api/login
  console.log('2. Test: POST /api/login (admin/admin)');
  try {
    const result = await makeRequest('/api/login', 'POST', {
      username: 'admin',
      password: 'admin',
      portalTyp: 'mitarbeiter'
    });
    if (result.status === 200 && result.data.success && result.data.user) {
      console.log(`   ✅ Login erfolgreich: ${result.data.user.name} (${result.data.user.rolle})`);
    } else {
      console.log(`   ❌ Login fehlgeschlagen:`, result.data);
    }
  } catch (error) {
    console.log(`   ❌ Fehler: ${error.message}`);
  }
  console.log('');

  // Test 3: GET /api/antraege
  console.log('3. Test: GET /api/antraege');
  try {
    const result = await makeRequest('/api/antraege');
    if (result.status === 200 && Array.isArray(result.data)) {
      console.log(`   ✅ Erfolg: ${result.data.length} Anträge gefunden`);
    } else {
      console.log(`   ❌ Fehler: Status ${result.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Fehler: ${error.message}`);
  }
  console.log('');

  // Test 4: GET /api/aufgaben
  console.log('4. Test: GET /api/aufgaben');
  try {
    const result = await makeRequest('/api/aufgaben');
    if (result.status === 200 && Array.isArray(result.data)) {
      console.log(`   ✅ Erfolg: ${result.data.length} Aufgaben gefunden`);
    } else {
      console.log(`   ❌ Fehler: Status ${result.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Fehler: ${error.message}`);
  }
  console.log('');

  console.log('✅ Alle Tests abgeschlossen!');
  process.exit(0);
}

// Warte kurz, dann starte Tests
setTimeout(() => {
  runTests().catch(err => {
    console.error('❌ Test-Fehler:', err);
    process.exit(1);
  });
}, 500);
