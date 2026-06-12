# UX-Konzept: Drei Körper und Antragsübersicht

Stand: Prototyp Mitarbeiter-Portal (`public/mitarbeiter.html`)  
Zweck: Abstrakte Nutzerführung — wo welche Inhalte liegen und wie Übersicht vs. Detail zusammenhängen.

---

## Die drei „Körper“ (Views)

Im Mitarbeiter-Portal gibt es **genau eine sichtbare Hauptfläche** unter dem gemeinsamen Header. Es schaltet zwischen drei Containern um — nicht drei parallele Seiten, sondern **ein Stack**:

```
Header (immer)
  └─ genau EINER von:
       ① jvpHubView          → Plattform-Dashboard
       ② dashboardView       → Antrags-Übersicht (Listen)
       ③ antragDetailView    → ein Antrag im Vollbild
```

| Körper | DOM-ID | Zweck | Navigation hinein | Navigation raus |
|--------|--------|--------|-------------------|-----------------|
| **① Hub** | `jvpHubView` | Orientierung, Kennzahlen, Einstieg in Fachverfahren | Nach Login (Standard) | Kachel „Gefangenenanträge“ → Übersicht |
| **② Übersicht** | `dashboardView` | **Suchen, filtern, zuordnen, leichte Aktionen** auf vielen Vorgängen | Hub-Kachel / KPI-Karte | Header „Zurück zum Dashboard“ → Hub |
| **③ Detail** | `antragDetailView` | **Lesen + vollständig bearbeiten** eines Antrags | Karte „Öffnen“ oder nach Übernahme | „← Zurück zur Übersicht“ → ② |

**Logik:** Hub = *Wo stehe ich, was liegt an?* — Übersicht = *Welcher Vorgang ist dran?* — Detail = *Was steht im Antrag, was ist der nächste Schritt?*

---

## Körper ① — Hub (`jvpHubView`)

**Rolle:** Plattform, **kein** Antragsbearbeiten.

### Aufbau (von oben nach unten)

1. **Drei Kennzahl-Karten** — aggregierte Zahlen (meine Anträge, Meldungen, überfällig); eine Karte kann direkt in die Antrags-Übersicht springen.
2. **Fachverfahren-Raster** — Kacheln (Anträge aktiv, Meldewesen geplant, Rest deaktiviert).
3. **Postfach** (rollenabhängig, einklappbar) — Benachrichtigungen, kein Antragsinhalt.
4. **Kalender** (einklappbar) — Termine plattformweit; „Neuer Termin“ gehört hierher, nicht in die Antragsliste.

### Was hier nicht liegt

Tabs, Antragskarten, Prozessleiste, Notizen, Dokumente pro Antrag.

---

## Körper ② — Antragsübersicht (`dashboardView`)

**Rolle:** Arbeitsliste für **alle Anträge**, die für die Rolle sichtbar sind. Hier wird **sortiert, gefiltert und grob gesteuert**; die eigentliche Phasenarbeit passiert überwiegend im Detail.

### Aufbau (festes Gerüst)

```
┌─────────────────────────────────────────────────────────┐
│ Info-Banner (Zuständigkeit: Rolle / Haus / Station)      │
├─────────────────────────────────────────────────────────┤
│ [ Tab Gruppe ] [ Tab Meine ] [ Tab Erledigt ]            │  ← schaltet EINE Liste
├─────────────────────────────────────────────────────────┤
│ Listenkopf: Titel + Anzahl + Sortierung (Dropdown)       │
│ Themenfilter (Chips nach Antragstyp)                     │
├─────────────────────────────────────────────────────────┤
│ ┌ Karte ┐ ┌ Karte ┐ ┌ Karte ┐ …                          │
│ └───────┘ └───────┘ └───────┘                            │
└─────────────────────────────────────────────────────────┘
```

### Die drei Tabs (Logik)

| Tab | Inhalt (Konzept) | Typische Karten-Aktionen |
|-----|------------------|---------------------------|
| **Gruppe** | Offen für **meine Gruppe** / nicht mir zugewiesen: Gruppenaufgaben, wartende Hauptverantwortungs-Übergabe, noch unbesetzte Anträge | **Öffnen** + ggf. **Übernehmen** (Antrag / Aufgabe / Weiterleitung) |
| **Meine** | Anträge/Aufgaben, bei denen **ich** Hauptbearbeiter bin oder eigene offene Aufgabe habe | **Öffnen** (Bearbeitung im Detail) |
| **Erledigt** | Abgeschlossene / veraktete Vorgänge | **Öffnen** (Lesen, Verlauf) |

Technisch: drei Sektionen (`offenSection`, `bearbeitungSection`, `historieSection`) — nur eine ist sichtbar.

### Was auf einer Karte steckt (Übersichtsebene)

- Kopf: Insasse, Antragstyp, Status-Badge, Datum
- Kurzinhalt: typspezifische 1–2 Zeilen (Teilhabegeld-Monat, Kammer-Aktion, …)
- optional: Hinweisbox (Gruppenaufgabe, Weiterleitung)
- Fuß: **1–2 Buttons** — nicht der volle Phasen-Werkzeugkasten

**Prinzip Übersicht:** Karte = **Vorfilter + Einstieg**. Übernehmen/Öffnen ja; Prüfung, Entscheidung, Verakten, Notizen, PDF-Upload → **nur im Detail**.

---

## Körper ③ — Antragsdetail (`antragDetailView`)

**Rolle:** Ein Antrag, vollständiger Kontext + **phasenabhängige Aktionen**.

### Aufbau (von oben nach unten)

```
[ ← Zurück zur Übersicht ]

Titel (Antragsnummer)                    Status-Badge

═══════════════════════════════════════════════════════
  Prozessleiste: 6 Schritte (Orientierung)
  Eingang → Prüfung → Entscheiden → Bekanntgabe → Vollzug → Abschluss
═══════════════════════════════════════════════════════

┌─────────────────────────────┬─────────────────────────┐
│  HAUPTSPALTE (links)        │  SEITENLEISTE (rechts)   │
│                             │                          │
│  Stammdaten + Anliegen      │  Dokumente (+ Upload)    │
│  Aufgabenliste              │  Notizen (+ hinzufügen)  │
│  Bescheid (falls vorhanden) │  Bearbeitungsverlauf     │
│                             │                          │
│  ── Bereich „Aktionen“ ──   │                          │
│  Hinweise (gelb/blau/grau)  │                          │
│  Buttons (dynamisch)        │                          │
└─────────────────────────────┴─────────────────────────┘
```

CSS-Klassen im Prototyp: `detail-two-column`, `detail-main`, `detail-sidebar`, `detail-section`, `action-buttons`.

### Wo liegt was — feste Zonen

| Zone | Inhalt | Bearbeitbar? |
|------|--------|--------------|
| **Prozessleiste** | Wo der Antrag im Gesamtprozess steht | Nein (nur Statusvisualisierung) |
| **Links: Daten** | Grunddaten, Insasse, Anliegen, Aufgaben, Bescheid | Lesen; Aufgaben ggf. abschließen über Modal |
| **Links: Aktionen** | Nächster fachlicher Schritt | **Ja** — hier sitzen die Phasen-Buttons |
| **Rechts: Dokumente** | PDF-Liste, Upload | Ja (wenn Berechtigung + nicht veraktet) |
| **Rechts: Notizen** | Text + Verlauf | Ja |
| **Rechts: Verlauf** | Chronik aller Schritte | Nein (nur Anzeige) |

**Schwere Modals** (Prüfung, Entscheidung, Termin, Aufgabe erstellen, VAL-Übernahme) öffnen sich **über** dem Detail — der Körper bleibt strukturell gleich.

---

## Phasen und Buttons (abstrakt)

Die **Prozessleiste** zeigt den Stand. Der Block **„Aktionen“** darunter liefert **nur das, was jetzt sinnvoll ist** — gesteuert aus Status, Rolle, Hauptbearbeiter ja/nein, offene Aufgabe, Prüfung erledigt ja/nein.

```
Prozessleiste (lesen)          Aktionen (tun)
     │                              │
     ├─ noch niemand zuständig  →  Übernehmen
     ├─ nur Aufgabe für mich    →  Aufgabe bearbeiten (ggf. ohne Antrags-Phasen)
     ├─ ich bin Hauptbearbeiter →  je nach aktivem Schritt:
     │                              Prüfung → Entscheidung → Eröffnung/Vollzug → Verakten
     │                              quer: Termin, Aufgabe erstellen
     └─ erledigt / nur Lesen     →  kaum oder keine Primärbuttons
```

**UX-Regel:** Nicht jede Phase mit jedem Button dokumentieren, sondern:

- **Orientierung** = Leiste oben
- **Fachliche Schritte** = Button-Gruppe links unten
- **Belege & interne Dokumentation** = rechte Spalte
- **Übersicht** = Einstieg und Übernahme, nicht der ganze Workflow

---

## Abgrenzung Meldewesen (A2)

Gleiche **drei Körper** (Hub → Listenkörper → Detailkörper), aber:

- Listenkörper: **Meldungen**, nicht Anträge (eigene Tabs/Filter)
- Prozessleiste: **eigene Schritte**, gleiches visuelles Muster
- Rechte Spalte: Dokumente, Notizen, Verlauf — **analog**
- Keine Insassen-Journey, kein Antrags-Bescheid-Flow aus A1

Siehe auch: `JVP-Meldewesen-Cursor-Paket/.cursor/rules/meldewesen-a2-grenze.mdc`

---

## Referenz im Code

| Thema | Datei |
|--------|--------|
| Drei Views (HTML) | `public/mitarbeiter.html` — `jvpHubView`, `dashboardView`, `antragDetailView` |
| View-Wechsel | `openJvpHub()`, `openAntraegeDashboard()`, `openAntragDetail()`, `closeAntragDetail()` |
| Karten in Übersicht | `renderAntragCard()` |
| Detail-Aufbau | `openAntragDetail()` (dynamisches HTML in `antragDetailContent`) |
| Prozessmodell fachlich | `PROZESSMODELL.md` |
