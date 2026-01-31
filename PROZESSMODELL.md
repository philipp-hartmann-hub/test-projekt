# Prozessmodell Antragswesen

## Übersicht

Das Antragswesen durchläuft einen strukturierten Prozess von der Antragstellung durch den Insassen bis zur Veraktung durch den Mitarbeiter.

---

## Prozessablauf (BPMN-ähnlich)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         ANTRAGSPROZESS                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   EINGANG   │ ───► │   PRÜFUNG   │ ───► │ ENTSCHEIDEN │ ───► │ BEKANNTGABE │ ───► │   VOLLZUG   │ ───► │  ABSCHLUSS  │
│             │      │             │      │             │      │             │      │             │      │             │
│  ○ Antrag   │      │  ○ Antrag   │      │  ○ Genehm.  │      │  ○ Autom.   │      │  ○ Vollzug  │      │  ○ Veraktung│
│    stellen  │      │    nehmen   │      │  ○ Teilw.   │      │    ODER     │      │    bestät.  │      │             │
│             │      │  ○ Sachlich/│      │  ○ Ablehnen │      │  ○ Persönl. │      │             │      │             │
│             │      │    fachlich │      │             │      │    Eröffn.  │      │             │      │             │
│             │      │    prüfen   │      │             │      │             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
     │                    │                    │                    │                    │                    │
     ▼                    ▼                    ▼                    ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  INSASSE    │      │ MITARBEITER │      │ MITARBEITER │      │ MITARBEITER │      │ MITARBEITER │      │ MITARBEITER │
│             │      │ STATIONS-   │      │ STATIONS-   │      │             │      │             │      │             │
│             │      │ LEITUNG     │      │ LEITUNG     │      │             │      │             │      │             │
│             │      │ HAUSLEITUNG │      │ HAUSLEITUNG │      │             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
```

---

## Detaillierte Prozessbeschreibung

### Phase 1: EINGANG
```
┌──────────────────────────────────────────────────────────────┐
│                         EINGANG                               │
├──────────────────────────────────────────────────────────────┤
│  Akteur: Insasse                                              │
│                                                               │
│  ┌─────────┐     ┌──────────────┐     ┌─────────────────┐   │
│  │  Start  │ ──► │ Antragstyp   │ ──► │ Formular        │   │
│  │    ○    │     │ auswählen    │     │ ausfüllen       │   │
│  └─────────┘     └──────────────┘     └────────┬────────┘   │
│                                                 │             │
│                        ┌────────────────────────┴──────┐     │
│                        ▼                               ▼     │
│               ┌────────────────┐             ┌─────────────┐ │
│               │ Als Entwurf    │             │ Absenden    │ │
│               │ speichern      │             │             │ │
│               └────────────────┘             └─────────────┘ │
│                                                               │
│  Antragstypen:                                               │
│  • Teilhabegeld (Monat/Jahr auswählen)                       │
│  • Eigentum aus der Kammer (Kleidung auswählen + Begründung) │
└──────────────────────────────────────────────────────────────┘
```

### Phase 2: PRÜFUNG
```
┌──────────────────────────────────────────────────────────────┐
│                         PRÜFUNG                               │
├──────────────────────────────────────────────────────────────┤
│  Akteure: Mitarbeiter, Stationsleitung, Hausleitung          │
│                                                               │
│  ┌─────────────────┐     ┌─────────────────┐                 │
│  │ Antrag in       │ ──► │ "Antrag nehmen" │                 │
│  │ "Offene Anträge"│     │ betätigen       │                 │
│  └─────────────────┘     └────────┬────────┘                 │
│                                   │                           │
│                                   ▼                           │
│                    ┌──────────────────────────┐               │
│                    │ Antrag sachlich/fachlich │               │
│                    │ prüfen (Pflicht)         │               │
│                    └──────────────────────────┘               │
│                                                               │
│  Optional während Prüfung:                                   │
│  • Aufgabe erstellen (an Insasse oder Mitarbeiter)           │
│  • Termin wird automatisch erstellt (bei Frist)              │
└──────────────────────────────────────────────────────────────┘
```

### Phase 3: ENTSCHEIDEN
```
┌──────────────────────────────────────────────────────────────┐
│                       ENTSCHEIDEN                             │
├──────────────────────────────────────────────────────────────┤
│  Akteure: Mitarbeiter, Stationsleitung, Hausleitung          │
│                                                               │
│  Voraussetzung: Antrag wurde sachlich/fachlich geprüft       │
│                                                               │
│              ┌──────────────────────────────┐                 │
│              │    Entscheidung treffen      │                 │
│              └──────────────┬───────────────┘                 │
│                             │                                 │
│         ┌───────────────────┼───────────────────┐             │
│         ▼                   ▼                   ▼             │
│  ┌────────────┐     ┌──────────────┐    ┌────────────┐       │
│  │ Genehmigen │     │  Teilweise   │    │  Ablehnen  │       │
│  │            │     │  genehmigen  │    │            │       │
│  └────────────┘     └──────────────┘    └────────────┘       │
│         │                   │                   │             │
│         └───────────────────┴───────────────────┘             │
│                             │                                 │
│                             ▼                                 │
│              ┌──────────────────────────────┐                 │
│              │  Begründung eingeben (Pflicht)│                │
│              └──────────────────────────────┘                 │
│                             │                                 │
│         ┌───────────────────┴───────────────────┐             │
│         ▼                                       ▼             │
│  ┌────────────────────┐              ┌────────────────────┐  │
│  │ □ Persönliche      │              │ □ Vollzug vor      │  │
│  │   Eröffnung        │              │   Bekanntgabe      │  │
│  │   (optional)       │              │   planen (optional)│  │
│  └────────────────────┘              └────────────────────┘  │
│                                                               │
│  → Bescheid-PDF wird automatisch erstellt                    │
└──────────────────────────────────────────────────────────────┘
```

### Phase 4: BEKANNTGABE
```
┌──────────────────────────────────────────────────────────────┐
│                       BEKANNTGABE                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│         ┌───────────────────────────────────────┐             │
│         │  Wurde "Persönliche Eröffnung" oder   │             │
│         │  "Vollzug vor Bekanntgabe" gewählt?   │             │
│         └───────────────────┬───────────────────┘             │
│                             │                                 │
│              ┌──────────────┴──────────────┐                  │
│              │ NEIN                   JA   │                  │
│              ▼                             ▼                  │
│  ┌─────────────────────┐      ┌─────────────────────┐        │
│  │ Automatische        │      │ Manuelle Bestätigung│        │
│  │ Benachrichtigung    │      │ erforderlich        │        │
│  │ an Insasse          │      │                     │        │
│  │ (Postfach)          │      │ □ Pers. Eröffnung   │        │
│  └─────────────────────┘      │   bestätigt         │        │
│                               │ □ Vollzug geplant   │        │
│                               │   bestätigt         │        │
│                               └─────────────────────┘        │
│                                                               │
│  Für Insasse: Status ändert sich erst nach Bestätigung       │
└──────────────────────────────────────────────────────────────┘
```

### Phase 5: VOLLZUG
```
┌──────────────────────────────────────────────────────────────┐
│                         VOLLZUG                               │
├──────────────────────────────────────────────────────────────┤
│  Nur bei: Genehmigt oder Teilweise genehmigt                 │
│                                                               │
│  ┌─────────────────────────────────────────────┐             │
│  │ ☑ Kontrollkästchen "Antrag vollzogen"       │             │
│  │   betätigen                                  │             │
│  └─────────────────────────────────────────────┘             │
│                                                               │
│  Optional: Weitere Aufgaben erstellen                        │
│                                                               │
│  Bei Ablehnung: Phase wird übersprungen                      │
└──────────────────────────────────────────────────────────────┘
```

### Phase 6: ABSCHLUSS
```
┌──────────────────────────────────────────────────────────────┐
│                        ABSCHLUSS                              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────┐             │
│  │ "Verakten" betätigen                        │             │
│  └─────────────────────────────────────────────┘             │
│                             │                                 │
│                             ▼                                 │
│  ┌─────────────────────────────────────────────┐             │
│  │ PDF mit komplettem Bearbeitungsverlauf      │             │
│  │ wird erstellt und heruntergeladen           │             │
│  └─────────────────────────────────────────────┘             │
│                             │                                 │
│                             ▼                                 │
│  ┌─────────────────────────────────────────────┐             │
│  │ Antrag wird in "Erledigt"-Liste verschoben  │             │
│  └─────────────────────────────────────────────┘             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Nebenläufige Prozesse

### Aufgabenerstellung
```
┌──────────────────────────────────────────────────────────────┐
│                    AUFGABE ERSTELLEN                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐    │
│  │ Empfänger   │ ──► │ Beschreibung│ ──► │ Frist       │    │
│  │ auswählen   │     │ eingeben    │     │ setzen      │    │
│  │ (Insasse/   │     │ (Kurz/Lang) │     │ (optional)  │    │
│  │ Mitarbeiter)│     │             │     │             │    │
│  └─────────────┘     └─────────────┘     └─────────────┘    │
│                                                 │             │
│                                                 ▼             │
│                                    ┌─────────────────────┐   │
│                                    │ PDF anhängen        │   │
│                                    │ (optional, mehrere) │   │
│                                    └─────────────────────┘   │
│                                                               │
│  Aufgabe erscheint:                                          │
│  • Im Postfach des Empfängers                                │
│  • In "Meine Anträge und Aufgaben"                           │
│  • Als Termin (wenn Frist gesetzt)                           │
└──────────────────────────────────────────────────────────────┘
```

### Aufgabe bearbeiten
```
┌──────────────────────────────────────────────────────────────┐
│                    AUFGABE BEARBEITEN                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────┐             │
│  │ Aufgabe öffnen                              │             │
│  └─────────────────────┬───────────────────────┘             │
│                        │                                      │
│         ┌──────────────┴──────────────┐                      │
│         ▼                             ▼                      │
│  ┌────────────────┐          ┌────────────────┐              │
│  │   "Antwort"    │          │"Zur Kenntnis"  │              │
│  │   (mit Text)   │          │ (ohne Text)    │              │
│  └───────┬────────┘          └───────┬────────┘              │
│          │                           │                        │
│          ▼                           ▼                        │
│  ┌────────────────┐          ┌────────────────────────┐      │
│  │ PDF anhängen   │          │ Bearbeitung übernehmen │      │
│  │ (optional)     │          │ ODER zurück an         │      │
│  └────────────────┘          │ Aufgabensteller        │      │
│                              └────────────────────────┘      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Rollen und Berechtigungen

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              ROLLEN                                         │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │    INSASSE      │  • Anträge stellen                                    │
│  │                 │  • Eigene Anträge einsehen                            │
│  │                 │  • Aufgaben beantworten                               │
│  │                 │  • Bescheide einsehen                                 │
│  └─────────────────┘                                                       │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │   MITARBEITER   │  • Anträge der eigenen Station bearbeiten            │
│  │                 │  • Prüfen, Entscheiden, Verakten                      │
│  │                 │  • Aufgaben erstellen                                 │
│  │                 │  • Termine verwalten (persönlich, Station)            │
│  └─────────────────┘                                                       │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │ STATIONSLEITUNG │  • Wie Mitarbeiter                                    │
│  │                 │  • Sieht alle Anträge der Station                     │
│  │                 │  • Kann Termine für Station erstellen                 │
│  └─────────────────┘                                                       │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │  HAUSLEITUNG    │  • Sieht alle Anträge des gesamten Hauses            │
│  │                 │  • Kann Entscheidungen revidieren                     │
│  │                 │  • Kann Termine für Haus erstellen                    │
│  │                 │  • Sieht alle Stations-Termine des Hauses             │
│  └─────────────────┘                                                       │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │     ADMIN       │  • Benutzer verwalten (anlegen, bearbeiten, löschen) │
│  │                 │  • Allgemeine Termine erstellen                       │
│  │                 │  • Passwörter zurücksetzen                            │
│  └─────────────────┘                                                       │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Statusübersicht Antrag

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         ANTRAGSSTATUS                                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Interner Status          │ Sichtbar für Insasse    │ Sichtbar für MA      │
│  ─────────────────────────┼─────────────────────────┼──────────────────────│
│  entwurf                  │ "Entwurf"               │ -                    │
│  offen                    │ "In Bearbeitung"        │ "Offen"              │
│  in-bearbeitung           │ "In Bearbeitung"        │ "In Bearbeitung"     │
│  genehmigt                │ "Genehmigt" *           │ "Genehmigt"          │
│  teilweise-genehmigt      │ "Teilweise genehmigt" * │ "Teilw. genehmigt"   │
│  abgelehnt                │ "Abgelehnt" *           │ "Abgelehnt"          │
│  veraktet                 │ (in Historie)           │ (in Erledigt)        │
│                                                                             │
│  * Bei "Pers. Eröffnung" oder "Vollzug vor Bekanntgabe":                   │
│    Insasse sieht weiterhin "In Bearbeitung" bis Bestätigung erfolgt        │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Legende

```
○     Start-/Endpunkt
□     Aktivität/Aufgabe
◇     Entscheidung
──►   Prozessfluss
☑     Checkbox/Bestätigung
```

---

*Erstellt: Januar 2026*
*Version: 1.0*
