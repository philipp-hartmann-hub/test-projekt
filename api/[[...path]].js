// Vercel Serverless: Alle /api/*-Anfragen an die Express-App weiterleiten
let app;
try {
  const server = require('../server');
  app = server.app;
} catch (error) {
  console.error('Fehler beim Laden der Express-App:', error);
  app = null;
}

module.exports = (req, res) => {
  if (!app) {
    return res.status(500).json({ error: 'Server initialization failed' });
  }
  return app(req, res);
};
