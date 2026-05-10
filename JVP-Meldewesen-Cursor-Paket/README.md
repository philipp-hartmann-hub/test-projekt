# JVP-Meldewesen-Cursor-Paket

**Ein Ordner** für alles: Cursor Rules (`.mdc`), Hierarchie-Doku, Lukas-Archiv, optional **`jvp-starter/`**.  
Siehe **`KEINE-AUSWIRKUNG-AUF-DIE-ANWENDUNG.md`** — nichts hier wirkt auf die Antrags-Anwendung im übrigen Repo ein.

**Cursor:** **`CURSOR-REGELN-AKTIVIEREN.md`**

---

## Maßgeblichkeit

**Rang 1:** **`JVP-Meldewesen-Cursor-Paket/.cursor/rules/*.mdc`**

**Rang 2:** Kurze **`cursorrules-A1-v2.md`**; Volltext Lukas unter **`referenz/cursorrules-A1-v2-lukas-original.md`**.

Details: **`HIERARCHIE-MASSGEBLICHKEIT.md`**.

---

## Inhalt dieses Ordners

| Bestandteil | Pfad | Zweck |
|-------------|------|--------|
| **Cursor Rules** | `.cursor/rules/*.mdc` | Maßgeblich (Design, Hub, Rollen §1–3, A2, Phasen HTML/Docker). |
| **Hierarchie** | `HIERARCHIE-MASSGEBLICHKEIT.md` | Rangfolge bei Konflikten. |
| **Lukas-Archiv** | `referenz/cursorrules-A1-v2-lukas-original.md` | Nachrangige Referenz. |
| **Kurz Cursor** | `cursorrules-A1-v2.md` | Verhältnis zu `.mdc`. |
| **React-Starter (optional)** | `jvp-starter/` | Spätere Option; nicht Pflicht für HTML-Phase. |

---

## eMeldewesen: zuerst HTML + Docker

Siehe **`meldewesen-a2-grenze.mdc`**: statische Oberfläche, Docker für Tests, Deployment später; **`jvp-starter/`** nur Referenz.

---

## Tabellen: welche `.mdc`

| Datei | Rolle |
|-------|--------|
| `prototyp-jvp-cursor-regeln.mdc` | Tokens, Naming, Prototyp-Bezug. |
| `jvp-hub-dashboard-spezifikation.mdc` | Hub & Dashboard. |
| `rollen-berechtigungen-und-design.mdc` | Design/Shell/Rollen §1–3; Anhang nur A1. |
| `meldewesen-a2-grenze.mdc` | A2-Grenzen, Technik-Phasen. |

---

## Arbeit mit `jvp-starter/` (optional)

1. **`jvp-starter/docs/README_TEAM.md`** — geschützte Layout-Dateien; Aussehen nach `.mdc`.
2. **`VITE_A2_URL`** nur bei React-Hub relevant.

---

## Pflege

- Änderungen an Regeln: **`JVP-Meldewesen-Cursor-Paket/.cursor/rules/*.mdc`** bearbeiten (oder vom Ursprungs-Workflow hierher kopieren).
- **`jvp-starter/`** bei neuer Lukas-Zulieferung ersetzen.
