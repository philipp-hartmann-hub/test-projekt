# Cursor Rules aktivieren

Die Regeln liegen nur unter:

**`JVP-Meldewesen-Cursor-Paket/.cursor/rules/*.mdc`**

Im **Projektroot** (`test-projekt/`) gibt es **keine** `.cursor/rules` mehr — damit Dokumentation und App klar getrennt sind.

**Option A — nur Meldewesen-Paket bearbeiten:**  
In Cursor den Ordner **`JVP-Meldewesen-Cursor-Paket`** als Workspace öffnen (oder Multi-Root Workspace ergänzen). Dann lädt Cursor die Regeln aus diesem Unterordner.

**Option B — Regeln auch im gesamten Repo:**  
Den Ordner **`JVP-Meldewesen-Cursor-Paket/.cursor/rules`** nach **`<Projektroot>/.cursor/rules`** kopieren (oder symbolisch verknüpfen). Keine Auswirkung auf die Anwendung, nur auf Cursor-Kontext.
