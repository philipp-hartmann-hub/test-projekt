# Cursor-Kontext — ergänzend (nicht maßgeblich allein)

**Maßgeblich sind ausschließlich die Dateien unter `JVP-Meldewesen-Cursor-Paket/.cursor/rules/*.mdc`** (vom HTML-Prototyp / Philipp Hartmann): Design, Hub-Aufbau, Rollenlabels §1–3, Meldewesen-Grenzen, Naming.

---

## Diese Datei ersetzt keine `.mdc`-Regel

- Die ausführliche HEUREKA-A1-Vorgabe liegt nur noch als **Referenz** vor:  
  **`referenz/cursorrules-A1-v2-lukas-original.md`** (historischer Stand Lukas, A1-Fokus, Rollen `BEAMTER`/`ABTL`/…, Prisma-Anträge).
- **Bei Widerspruch** gilt immer die **`.mdc`**-Sammlung — insbesondere:
  - **Farben/Typografie/Shell**: wie in `rollen-berechtigungen-und-design.mdc` und `prototyp-jvp-cursor-regeln.mdc` (Open Sans / Tokens aus dem Prototyp; keine Ersetzung durch HamburgSans allein).
  - **Rollenbezeichner für Behördenparallelität**: Anzeige-Labels und Dimensionen Haus/Station wie in den `.mdc`; das React-Starter-Enum ist **technisches Mock-Detail**, bis es an den Prototyp angeglichen ist.
  - **eMeldewesen (A2)**: nur `meldewesen-a2-grenze.mdc` + Hub-Spezifikation; **keine** Übernahme der Antrags-Businesslogik aus der Referenzdatei.

---

## Wofür die Referenzdatei noch nutzbar ist

- Docker-/Railway-Struktur, Prisma-Patterns, API-Antwortformat `{ data, total }`, wenn du **explizit** A1-nah bleiben willst.
- Textliche Lastenheft-Formulierungen aus HEUREKA — **nach Abgleich** mit dem maßgeblichen Projektkontext.

**Cursor:** Lade primär **`JVP-Meldewesen-Cursor-Paket/.cursor/rules/*.mdc`** (oder Kopie nach `<Projektroot>/.cursor/rules/`); behandle **`referenz/cursorrules-A1-v2-lukas-original.md`** als **nachrangiges Archivmaterial**.
