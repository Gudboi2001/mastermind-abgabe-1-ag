'use strict';
/**
 * server.js
 * Einstiegspunkt: startet den HTTP-Server.
 * Port über Umgebungsvariable PORT konfigurierbar (Default 3000).
 */
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('==============================================');
  console.log('  Mastermind Server läuft');
  console.log(`  Web-Oberfläche: http://localhost:${PORT}/`);
  console.log(`  REST API:        http://localhost:${PORT}/api/v1`);
  console.log('==============================================');
});
