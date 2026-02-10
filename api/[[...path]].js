// Vercel Serverless: Alle /api/*-Anfragen an die Express-App weiterleiten
const { app } = require('../server');
module.exports = (req, res) => app(req, res);
