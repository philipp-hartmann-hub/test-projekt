// Vercel Serverless: /api/setup-db direkt behandeln, Rest an Express
const dbLayer = require('../db-layer');

function getQuery(req) {
  if (req.query && typeof req.query === 'object') return req.query;
  const u = (req.url || '').split('?')[1] || '';
  const q = {};
  u.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k) q[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
  });
  return q;
}

async function handleSetupDb(req, res) {
  const query = getQuery(req);
  const key = (query.key || req.headers?.['x-setup-key'] || '').trim();
  const secret = process.env.SETUP_SECRET || '';
  const ok = secret ? (key === secret) : (key === 'setup');
  if (!ok) {
    res.status(401).json({
      success: false,
      error: secret ? 'Ungültiger Key.' : 'Rufe mit ?key=setup auf.'
    });
    return;
  }
  try {
    const result = await dbLayer.runSchema();
    res.json({ success: true, message: 'Schema ausgeführt.', tables: result.tables });
  } catch (error) {
    console.error('Setup-DB Fehler:', error);
    res.status(500).json({ success: false, error: error.message || String(error) });
  }
}

let app;
try {
  const server = require('../server');
  app = server.app;
} catch (error) {
  console.error('Fehler beim Laden der Express-App:', error);
  app = null;
}

module.exports = async (req, res) => {
  // Pfad: bei Vercel oft req.url = "/api/setup-db?key=..." oder path in req
  const pathname = (req.url || req.path || '').split('?')[0];
  if (req.method === 'GET' && (pathname === '/api/setup-db' || pathname === '/setup-db')) {
    return await handleSetupDb(req, res);
  }
  if (!app) {
    return res.status(500).json({ error: 'Server initialization failed' });
  }
  return app(req, res);
};
