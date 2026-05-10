# Hierarchie der Vorgaben (dieses Paket)

| Rang | Quelle | Gültigkeit |
|------|--------|------------|
| **1 — Maßgeblich** | **`JVP-Meldewesen-Cursor-Paket/.cursor/rules/*.mdc`** | Design, Hub/Dashboard, Naming, Rollen-Labels (§1–3), A2-Grenzen, Prototyp-Bezug. **Hat Vorrang** bei Konflikten. |
| **2 — Ergänzend** | **`cursorrules-A1-v2.md`** (kurz) + **`referenz/cursorrules-A1-v2-lukas-original.md`** | Nur technische/HEUREKA-Details; **keine** Überschreibung der `.mdc`. |
| **3 — Starter-Code** | **`jvp-starter/`** | **Optional** für eMeldewesen Phase 1; erste Ausbaustufe kann rein **HTML + Docker** sein (s. `meldewesen-a2-grenze.mdc`). Wenn genutzt: `README_TEAM.md` (geschützte Dateien), inhaltlich **Rang 1**. |

**Konfliktfall:** Wenn Lukas-Original **andere** Rollenstrings, Schrift oder Farbkontext vorschlägt als die `.mdc` → **`.mdc` gewinnt**; Starter bei Bedarf later anpassen (z. B. `tailwind` an Tokens des Prototyps).
