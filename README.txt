ABGABE: A - Single-Game Server + G - Interaktiver Client
============================================================

REST API Version : v1.0.0
Server-Stand     : A (ein Spiel, Tip-Auswertung)
Client-Stand     : G: interaktiv, Eingabevalidierung, Menü

Dieser Ordner ist eigenständig lauffähig - einfach kopieren und abgeben.

INHALT
  server/   Node/Express-Server auf dem Stand dieser Abgabe
  client/   passender Python-Client
  docs/REST-API.txt            aktuelle Endpunkt-Referenz (v1.0.0)
  docs/REST-API-CHANGELOG.txt  fortlaufender Changelog (v1.0.0 bis v1.0.0)

STARTEN - SERVER
  cd server
  npm install
  npm start                    Server auf http://localhost:3000

STARTEN - CLIENT
  cd client
  pip install -r requirements.txt
  python mastermind_client.py            interaktiv spielen

HINWEIS
  Die Abgaben sind kumulativ: A/G -> B -> C/H -> D/I/E -> F -> Z.
  Jede Abgabe entspricht einer REST-API-Version. Die API ist abwärtskompatibel,
  daher laufen ältere Clients auch gegen neuere Server.
  node_modules sind nicht enthalten - vor dem Start 'npm install' ausführen.
