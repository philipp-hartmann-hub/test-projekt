# Keine Auswirkung auf die laufende Anwendung

Alles in diesem Ordner **`JVP-Meldewesen-Cursor-Paket/`** ist **reine Dokumentation und Referenzmaterial** für Cursor, Meldewesen-Planung und Team:

- Es gibt **keinen** automatischen Build-Schritt, der aus diesem Ordner **`public/`**, **`dist/`**, **`server.js`** oder andere Teile der **Antrags-Anwendung** im Repo ändert.
- **`jvp-starter/`** hier ist eine **Kopie/Vorlage**, nicht der gebundene Runtime-Code deiner Haupt-App.
- Cursor Rules (`.cursor/rules/*.mdc` **innerhalb dieses Pakets**) steuern nur das **Verhalten der KI im Editor**, wenn dieses Paket als Workspace-Nutzung eingebunden wird — **nicht** den Node-/Browser-Lauf deiner Anwendung.

**Kurz:** Arbeit an Dokumenten hier = **keine** Änderung am Verhalten der HTML-/JS-Prototyp-App im übrigen Repository, solange niemand manuell Produktivcode anfasst.
