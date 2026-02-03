# JVA Antragsbearbeitungssystem

Ein webbasiertes Verwaltungssystem für die Bearbeitung von Anträgen in Justizvollzugsanstalten (JVA). Das System ermöglicht Insassen die Stellung von Anträgen und Mitarbeitern deren strukturierte Bearbeitung.

---

## Inhaltsverzeichnis

1. [Funktionsübersicht](#funktionsübersicht)
2. [Architektur](#architektur)
3. [Benutzerrollen](#benutzerrollen)
4. [Prozessmodell](#prozessmodell)
5. [Systemkomponenten](#systemkomponenten)
6. [Installation & Start](#installation--start)
7. [Besondere Features](#besondere-features)

---

## Funktionsübersicht

### Für Insassen
- **Antragsstellung**: Teilhabegeld und Eigentum aus der Kammer
- **Antragsverfolgung**: Status-Anzeige (Offen, In Bearbeitung, Erledigt)
- **Postfach**: Benachrichtigungen über Entscheidungen und neue Dokumente
- **Aufgaben**: Bearbeitung zugewiesener Aufgaben
- **Dokumente**: Einsicht und Download freigegebener PDF-Dokumente
- **Mehrsprachigkeit**: Deutsch, Englisch, Französisch

### Für Mitarbeiter
- **Antragsbearbeitung**: Prüfen, Entscheiden, Aufgaben erstellen, Verakten
- **Workflow-Steuerung**: 
  - Sachliche/fachliche Prüfung (mit Pflichtkommentar)
  - Entscheidungen (Genehmigen, Teilweise genehmigen, Ablehnen)
  - Persönliche Eröffnung
  - Vollzug vor Bekanntgabe planen
- **Aufgabenverwaltung**: Aufgaben an Mitarbeiter, Gruppen oder Insassen zuweisen
- **Dokumentenverwaltung**: PDF-Upload, Freigabe für Insassen
- **PDF-Erstellung**: Automatische Bescheide, Veraktungs-Dokumentation
- **Terminkalender**: Tag/Woche/Monat-Ansichten (ausklappbar)
- **Postfach**: Aufgaben- und Fristbenachrichtigungen (ausklappbar)
- **Bearbeitungsverlauf**: Vollständige Protokollierung inkl. Kommentare und Begründungen

### Für Administratoren
- **Benutzerverwaltung**: Insassen und Mitarbeiter anlegen/bearbeiten
- **Rollenverwaltung**: Zuweisung zu Häusern, Stationen und Gruppen
- **Terminverwaltung**: Allgemeine Termine für alle Mitarbeiter

---

## Architektur

### Technologie-Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  HTML5          │  Semantische Struktur, Barrierefreiheit       │
│  CSS3           │  Custom Properties, Flexbox, Grid              │
│  JavaScript     │  ES6+, Vanilla (keine Frameworks)              │
│  jsPDF          │  PDF-Generierung im Browser                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATENSPEICHERUNG                             │
├─────────────────────────────────────────────────────────────────┤
│  localStorage   │  Persistente Speicherung im Browser            │
│                 │  - Benutzer (users)                            │
│                 │  - Anträge (antraege)                          │
│                 │  - Aufgaben (aufgaben)                         │
│                 │  - Benachrichtigungen (notifications)          │
│                 │  - Aktivitäten (aktivitaeten)                  │
│                 │  - Termine (termine)                           │
└─────────────────────────────────────────────────────────────────┘
```

### Dateistruktur

```
JVA-Antragssystem/
├── index.html          # Startseite / Portal-Auswahl
├── admin.html          # Admin-Portal (Benutzerverwaltung)
├── mitarbeiter.html    # Mitarbeiter-Portal (Antragsbearbeitung)
├── insassen.html       # Insassen-Portal (Antragsstellung)
├── app.js              # Kernlogik und alle Systeme
├── styles.css          # Globale Styles (Hamburg.de Design)
├── README.md           # Diese Dokumentation
└── PROZESSMODELL.md    # Detailliertes Prozessmodell
```

### Single-Page Application (SPA)

Das System ist als clientseitige SPA konzipiert:
- **Keine Server-Komponente** erforderlich
- **Vollständig im Browser** lauffähig
- **Offline-fähig** nach initialem Laden
- **Datenisolation** pro Browser/Gerät

---

## Benutzerrollen

### Rollenübersicht

| Rolle | Kürzel | Beschreibung |
|-------|--------|--------------|
| **Administrator** | Admin | Vollzugriff, Benutzerverwaltung |
| **Vollzugsabteilungsleitung** | VAL | Alle Anträge des Hauses, Entscheidungen revidieren |
| **Allgemeiner Vollzugsdienst** | AVD | Anträge der eigenen Station bearbeiten |
| **Kammer** | - | Eigentums- und Kleidungsverwaltung |
| **Zahlstelle** | - | Finanzielle Angelegenheiten |
| **Arbeitskoordination** | - | Arbeitseinsatz-Koordination |
| **Insasse** | - | Eigene Anträge, zugewiesene Aufgaben |

### Berechtigungsmatrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BERECHTIGUNGEN                                     │
├──────────────────┬──────┬─────┬─────┬────────┬───────────┬─────────────────┤
│ Funktion         │Admin │ VAL │ AVD │ Kammer │ Zahlstelle│ Arbeitskoord.   │
├──────────────────┼──────┼─────┼─────┼────────┼───────────┼─────────────────┤
│ Benutzer anlegen │  ✓   │  -  │  -  │   -    │     -     │       -         │
│ Anträge sehen    │  -   │Haus │Stat.│ Aufg.  │   Aufg.   │     Aufg.       │
│ Antrag nehmen    │  -   │  ✓  │  ✓  │   -    │     -     │       -         │
│ Prüfen/Entsch.   │  -   │  ✓  │  ✓  │   ✓    │     ✓     │       ✓         │
│ Aufgaben erstell.│  -   │  ✓  │  ✓  │   ✓    │     ✓     │       ✓         │
│ Entsch. revidier.│  -   │  ✓  │  -  │   -    │     -     │       -         │
│ Termine (allg.)  │  ✓   │  -  │  -  │   -    │     -     │       -         │
│ Termine (Haus)   │  -   │  ✓  │  -  │   -    │     -     │       -         │
│ Termine (Station)│  -   │  -  │  ✓  │   -    │     -     │       -         │
└──────────────────┴──────┴─────┴─────┴────────┴───────────┴─────────────────┘
```

### Gruppenkonzept

Mitarbeiter können Gruppen zugeordnet werden:
- **AVD-Gruppen**: Pro Haus und Station (z.B. "AVD Haus 2 Station 1")
- **VAL-Gruppe**: Pro Haus
- **Spezialgruppen**: Kammer, Zahlstelle, Arbeitskoordination (hausübergreifend)

Aufgaben können an **Gruppen** oder **Einzelpersonen** zugewiesen werden.

---

## Prozessmodell

### Phasenübersicht

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   EINGANG   │───►│   PRÜFUNG   │───►│ ENTSCHEIDEN │───►│ BEKANNTGABE │───►│   VOLLZUG   │───►│  ABSCHLUSS  │
│             │    │             │    │             │    │             │    │             │    │             │
│  Antrag     │    │  Antrag     │    │  Genehmigen │    │  Automatisch│    │  Vollzug    │    │  Veraktung  │
│  stellen    │    │  nehmen &   │    │  Teilweise  │    │    ODER     │    │  bestätigen │    │             │
│             │    │  prüfen     │    │  Ablehnen   │    │  Persönlich │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                  │                  │                  │                  │                  │
   Insasse          AVD/VAL            AVD/VAL            AVD/VAL            AVD/VAL            AVD/VAL
```

### Phase 1: EINGANG

**Akteur:** Insasse

1. Antragstyp auswählen:
   - **Teilhabegeld**: Monat/Jahr angeben
   - **Eigentum aus der Kammer**: Kleidungsstücke auswählen + Begründung
2. Formular ausfüllen
3. Als Entwurf speichern ODER direkt absenden

### Phase 2: PRÜFUNG

**Akteure:** AVD, VAL

1. Antrag erscheint in "Anträge und Aufgaben meiner Gruppe"
2. "Antrag nehmen" betätigen → Antrag in "Meine Anträge und Aufgaben"
3. **Sachliche/fachliche Prüfung** durchführen (Pflichtkommentar)
4. Optional: Aufgaben erstellen, Weiterleiten

### Phase 3: ENTSCHEIDEN

**Akteure:** AVD, VAL

Voraussetzung: Antrag wurde geprüft

1. Entscheidung treffen: Genehmigen / Teilweise genehmigen / Ablehnen
2. **Begründung eingeben** (Pflicht)
3. Optional:
   - ☐ Persönliche Eröffnung
   - ☐ Vollzug vor Bekanntgabe planen
4. Optional: Dokumente für Insassen freigeben
5. Bescheid-PDF wird automatisch erstellt

### Phase 4: BEKANNTGABE

**Variante A - Automatisch:**
- Insasse erhält sofort Benachrichtigung im Postfach
- Bescheid und freigegebene Dokumente sind einsehbar

**Variante B - Manuell (bei pers. Eröffnung/Vollzugsplanung):**
1. Persönliche Eröffnung bestätigen
2. ODER Vollzug bestätigen (mit Kommentar für Insassen)
3. Erst dann: Benachrichtigung an Insassen

### Phase 5: VOLLZUG

**Akteure:** AVD, VAL, Spezialgruppen

- Bei **Genehmigung/Teilgenehmigung**: Vollzug durchführen und bestätigen
- Bei **Ablehnung**: Phase wird übersprungen
- Aufgaben können jederzeit an alle Gruppen zugewiesen werden
- Dokumente können nachträglich hochgeladen und freigegeben werden

### Phase 6: ABSCHLUSS

1. "Verakten" betätigen
2. PDF mit komplettem Bearbeitungsverlauf wird erstellt
3. Antrag wird in "Erledigt"-Liste verschoben
4. Alle offenen Gruppenaufgaben werden automatisch geschlossen

---

## Systemkomponenten

### Kernkomponenten (app.js)

| Komponente | Beschreibung |
|------------|--------------|
| `SessionManager` | Login/Logout, Session-Verwaltung |
| `UserSystem` | Benutzer erstellen, bearbeiten, Rollenzuweisung |
| `AntragSystem` | Anträge erstellen, bearbeiten, Status ändern, Dokumente |
| `AufgabenSystem` | Aufgaben erstellen, zuweisen, erledigen, Fristen |
| `NotificationSystem` | Benachrichtigungen erstellen und verwalten |
| `AktivitaetenSystem` | Aktivitätsprotokoll / Bearbeitungsverlauf |
| `TerminSystem` | Kalendertermine und Fristen |

### Hilfssysteme

| Komponente | Beschreibung |
|------------|--------------|
| `TRANSLATIONS` | Mehrsprachige UI-Texte (DE/EN/FR) |
| `TEXT_DICTIONARY` | Wort-für-Wort-Übersetzung für Freitexte |
| `createTranslatableText()` | Speichert Texte mit Quellsprache |
| `getTranslatedUserText()` | Übersetzt Freitexte in aktuelle Sprache |

---

## Installation & Start

### Voraussetzungen

- Moderner Webbrowser (Chrome, Firefox, Edge, Safari)
- Webserver (optional, kann auch lokal geöffnet werden)

### Schnellstart

1. Repository klonen oder Dateien herunterladen
2. `index.html` im Browser öffnen
3. Portal auswählen (Admin / Mitarbeiter / Insassen)
4. Mit vorhandenen Testdaten anmelden

### Standard-Testbenutzer

Die Anwendung enthält vordefinierte Testbenutzer, die über das Admin-Portal verwaltet werden können.

---

## Besondere Features

### Dokumentenverwaltung

- **PDF-Upload** in der Antragsdetailansicht
- **Freigabe für Insassen** vor oder nach der Bekanntgabe
- **Automatische Benachrichtigung** bei nachträglicher Freigabe
- **Download** für alle Bearbeiter und freigegebene Dokumente für Insassen

### Aufgabensystem

- Zuweisung an **Gruppen** oder **Einzelpersonen**
- **Hierarchische Auswahl**: Bei Gruppenauswahl werden nur Gruppenmitglieder angezeigt
- **Fristen** mit automatischer Kalendereintragung
- **PDF-Anhänge** (mehrere möglich)
- **Antwortoptionen**: "Zur Kenntnis" oder "Mit Antwort"
- **Hauptbearbeitung übertragen** möglich

### Bearbeitungsverlauf

- Vollständige Protokollierung aller Aktionen
- **Prüfungskommentare** und **Entscheidungsbegründungen** sichtbar
- **Notizen/Kommentare** mit Inhalt im Verlauf
- **Sortierung**: Neueste/Älteste zuerst

### Notizensystem

Drei Arten von Notizen mit unterschiedlicher Sichtbarkeit:

| Typ | Sichtbarkeit | Bearbeitungsverlauf | In Veraktungs-PDF |
|-----|--------------|---------------------|-------------------|
| **Notiz für mich** | Nur Ersteller | Nein | Nein |
| **Notiz für alle** | Alle Mitarbeiter | Ja | Nein |
| **Notiz für Akte** | Alle Mitarbeiter | Ja | Ja |

- Bei jeder Notiz wird vor dem Speichern der Typ abgefragt
- Private Notizen sind mit grauem Badge "Privat" markiert
- Akte-Notizen sind mit blauem Badge "Für Akte" markiert

### Mehrsprachigkeit

- UI in Deutsch, Englisch, Französisch
- Freitexte werden automatisch übersetzt
- Quellsprache wird beim Speichern erfasst

### Kalender

- **Ansichten**: Tag, Woche, Monat
- **Terminarten**: Privat, Station, Haus, Allgemein
- **Automatische Termine** aus Aufgabenfristen
- **Ausklappbar** für mehr Übersicht

### Benachrichtigungssystem

- Fristüberschreitungen (tägliche Erinnerungen)
- Entscheidungs-Benachrichtigungen
- Aufgaben-Zuweisungen
- Neue Dokumente

---

## Statusübersicht Antrag

| Interner Status | Für Insasse | Für Mitarbeiter |
|-----------------|-------------|-----------------|
| `entwurf` | "Entwurf" | - |
| `offen` | "In Bearbeitung" | "Offen" |
| `in-bearbeitung` | "In Bearbeitung" | "In Bearbeitung" |
| `genehmigt` | "Genehmigt" * | "Genehmigt" |
| `teilweise-genehmigt` | "Teilweise genehmigt" * | "Teilw. genehmigt" |
| `abgelehnt` | "Abgelehnt" * | "Abgelehnt" |
| `veraktet` | (in Historie) | (in Erledigt) |

\* Bei "Persönliche Eröffnung" oder "Vollzug vor Bekanntgabe": Insasse sieht weiterhin "In Bearbeitung" bis Bestätigung erfolgt.

---

## Browser-Kompatibilität

| Browser | Status |
|---------|--------|
| Chrome | ✓ Empfohlen |
| Firefox | ✓ Unterstützt |
| Edge | ✓ Unterstützt |
| Safari | ✓ Unterstützt |

---

## Hinweise

- **Datenspeicherung**: Alle Daten werden im localStorage gespeichert und sind browser- und gerätespezifisch
- **Keine Server-Komponente**: Die Anwendung läuft vollständig clientseitig
- **Demo-System**: Konzipiert als Prototyp/Demonstrator
- **Datensicherung**: Regelmäßiger Export empfohlen (localStorage kann gelöscht werden)

---

## Lizenz

Proprietär - Alle Rechte vorbehalten

---

*Entwickelt im Hamburg.de Corporate Design*  
*Version: 2.0 - Februar 2026*
