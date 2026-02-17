# Projekt-Memory: JVA Antragsbearbeitungssystem

**Stand:** Februar 2026 | Für Cursor/Chat-Referenz

---

## Was ist das Projekt?

- **Name:** JVA Antragsbearbeitungssystem (`jva-antragssystem`, Version 2.0)
- **Zweck:** Webbasiertes Verwaltungssystem für die Bearbeitung von Anträgen in Justizvollzugsanstalten (JVA).
- **Repo/Workspace:** `test projekt`

---

## Drei Portale

| Portal      | Zielgruppe   | Kernfunktionen |
|------------|--------------|----------------|
| **Insassen**   | Insassen     | Anträge stellen (Teilhabegeld, Eigentum), Postfach, Aufgaben, Dokumente, Mehrsprachigkeit (DE/EN/FR) |
| **Mitarbeiter**| AVD, VAL, Kammer, Zahlstelle, Arbeitskoordination | Anträge prüfen/entscheiden, Aufgaben, Termine, Dokumente, Veraktung, Bearbeitungsverlauf |
| **Admin**      | Administratoren | Benutzer- und Rollenverwaltung, Terminverwaltung (allgemein) |

---

## Technologie

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3, jsPDF; keine Frameworks.
- **Backend (optional):** Node.js, Express, CORS.
- **Persistenz:** Ohne Backend: `localStorage`; mit Backend: `database.json` oder **Neon (PostgreSQL)**.
- **Sync:** `data-sync.js` für API-Anbindung und Server-Login.
- **Relevante Dateien:** `app.js` (Kernlogik), `server.js`, `db-layer.js`, `data-sync.js`, `neon-schema.sql`, `migrate-to-neon.js`, `check-neon-schema.js`, `neon-initial-data.sql`.

---

## Fachlichkeit (kurz)

- **Antragstypen:** Teilhabegeld (ein Antrag pro Monat/Jahr), Eigentum aus der Kammer (Kleidung aufstocken/tauschen).
- **Prozess:** Eingang → Prüfung → Entscheiden → Bekanntgabe → Vollzug → Abschluss (Veraktung).
- **Rollen:** Admin, VAL (Vollzugsabteilungsleitung), AVD (Allgemeiner Vollzugsdienst), Kammer, Zahlstelle, Arbeitskoordination, Insasse.
- **Strukturen:** Häuser, Stationen, Gruppen (AVD-Gruppen, VAL-Gruppe, Spezialgruppen).

---

## Dokumentation im Projekt

- **USER_STORIES_UND_AKZEPTANZKRITERIEN.md** – Alle User Stories und Akzeptanzkriterien (Insassen-, Mitarbeiter-, Admin-Portal, NFR, Glossar).
- **README.md** – Architektur, Prozessmodell, Installation, API, Test-Logins.

---

## Test-Logins (Beispiele)

- **Insassen:** `insasse1` / `insasse1`, `insasse2` / `insasse2`
- **Mitarbeiter:** `avd1` / `avd1`, `avd2` / `avd2`, `val1` / `val1`, `kammer1` / `kammer1`
- **Admin:** `admin` / `admin`

---

## Aktueller Kontext (Git-Status zum Zeitpunkt der Erstellung)

- Migration zu Neon DB im Fokus; geänderte Dateien u. a.: `.gitignore`, `check-neon-schema.js`, `db-layer.js`, `migrate-to-neon.js`, `neon-initial-data.sql`, `neon-schema.sql`, `test-api.js`.

---

*Diese Datei dient als Projekt-Memory für Chats und Entwicklung. Bei großen Änderungen am Projekt bitte anpassen.*
