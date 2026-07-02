'use strict';
/** app.js (Stand A/B/C) – Express-App mit Spiel-Endpunkten. */
const express = require('express');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`));
  next();
});
const API = '/api/v1';
app.get(`${API}/health`, (req, res) => res.json({ status: 'ok', version: 'v1', time: new Date().toISOString() }));
app.use(`${API}/games`, require('./routes/games'));
app.use(`${API}`, (req, res) => res.status(404).json({ error: 'Endpunkt nicht gefunden.' }));
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Ungültiges JSON im Request-Body.' });
  console.error('[error]', err); res.status(500).json({ error: 'Interner Serverfehler.' });
});
module.exports = app;
