// Vercel Serverless: Eigenständige Route /api/setup-db (Neon-Schema ausführen)
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

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Nur GET erlaubt' });
    return;
  }
  const query = getQuery(req);
  const key = (query.key || (req.headers || {})['x-setup-key'] || '').trim();
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
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: 'Schema ausgeführt.', tables: result.tables });
  } catch (error) {
    console.error('Setup-DB Fehler:', error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ success: false, error: error.message || String(error) });
  }
};
