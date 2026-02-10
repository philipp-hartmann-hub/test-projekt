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
7. [Betrieb mit Backend (optional)](#betrieb-mit-backend-optional)
8. [Besondere Features](#besondere-features)

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
│  CSS3           │  Custom Properties, Flexbox, Grid             │
│  JavaScript     │  ES6+, Vanilla (keine Frameworks)             │
│  jsPDF          │  PDF-Generierung im Browser                   │
│  data-sync.js   │  Optional: Sync mit Backend, Server-Login       │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Nur Browser    │  │  Mit Backend    │  │  Mit Backend     │
│  (Standard)     │  │  (optional)     │  │  (optional)      │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│  localStorage   │  │  localStorage   │  │  Node.js/Express │
│  - Benutzer     │  │  als Cache      │  │  + JSON-DB oder  │
│  - Anträge      │  │  + Sync zu API  │  │  SQLite/Neon     │
│  - Aufgaben     │  │  Login über API │  │  Persistenz      │
│  - etc.         │  │                 │  │  internetfähig   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Dateistruktur

```
JVA-Antragssystem/
├── index.html          # Startseite / Portal-Auswahl
├── admin.html          # Admin-Portal (Benutzerverwaltung)
├── mitarbeiter.html    # Mitarbeiter-Portal (Antragsbearbeitung)
├── insassen.html       # Insassen-Portal (Antragsstellung)
├── app.js              # Kernlogik und alle Systeme
├── data-sync.js        # Optional: Sync mit Backend, Server-Login
├── server.js           # Optional: Express-Backend (Node.js)
├── database.json       # Optional: Persistenz bei JSON-Backend
├── styles.css          # Globale Styles (Hamburg.de Design)
├── README.md           # Diese Dokumentation
└── PROZESSMODELL.md    # Detailliertes Prozessmodell
```

### Single-Page Application (SPA)

Das System ist als clientseitige SPA konzipiert:
- **Ohne Backend**: Vollständig im Browser lauffähig, Daten im localStorage
- **Mit Backend** (optional): Daten persistent und geräteübergreifend, Login über API
- **Offline-fähig** (ohne Backend) nach initialem Laden

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
- Optional für Backend-Betrieb: Node.js (z. B. 18.x oder 20.x)

### Schnellstart (nur Browser)

1. Repository klonen oder Dateien herunterladen
2. `index.html` im Browser öffnen (oder über einen beliebigen Webserver ausliefern)
3. Portal auswählen (Admin / Mitarbeiter / Insassen)
4. Mit vorhandenen Testdaten anmelden (nach erstem Aufruf werden Standardbenutzer angelegt)

### Standard-Testbenutzer

Die Anwendung legt beim ersten Start (ohne Backend) Standardbenutzer an; Anmeldedaten erscheinen in der Browser-Konsole. Mit Backend werden die in `server.js` / `database.json` hinterlegten Demo-Benutzer verwendet.

---

## Betrieb mit Backend (optional)

Für **persistente, geräteübergreifende Daten** und **internetfähigen Zugriff** kann ein kleines Backend betrieben werden.

### Architektur

- **Express** (Node.js) liefert die statischen Dateien und eine REST-API.
- **Persistenz**: JSON-Datei (`database.json`) oder optional SQLite/Neon DB.
- **Frontend**: Lädt beim Start Daten vom Server in den localStorage und synchronisiert Änderungen zurück (data-sync.js). Login erfolgt über die API.

### Lokaler Start mit Backend

1. Im Projektverzeichnis: `npm install` (einmalig)
2. `npm start` oder `node server.js`
3. Im Browser aufrufen: **http://localhost:3000**
4. Portale wie gewohnt nutzen; Daten bleiben in `database.json` erhalten

### API-Übersicht

| Methode | Endpunkt | Beschreibung |
|--------|----------|--------------|
| POST | `/api/login` | Anmeldung (username, password, portalTyp) |
| GET/POST | `/api/users` | Benutzer lesen / anlegen |
| GET/PUT/DELETE | `/api/users/:id` | Benutzer bearbeiten / löschen |
| GET/POST | `/api/antraege` | Anträge |
| GET/POST | `/api/aufgaben` | Aufgaben |
| GET/POST | `/api/notifications` | Benachrichtigungen |
| GET/POST | `/api/aktivitaeten` | Bearbeitungsverlauf |
| GET/POST | `/api/termine` | Termine |

Die Portalseiten (admin, mitarbeiter, insassen) binden `data-sync.js` ein; sobald der Server erreichbar ist, werden Daten vom Server geladen und der Login über die API durchgeführt.

### Hinweise Backend

- Prototyp-/Demo-Betrieb: Keine TLS, keine erweiterte Absicherung.
- Für Produktion: HTTPS, sichere Authentifizierung und Absicherung der API empfohlen.

### Lokaler Test vor dem Deploy

So können Sie die Umstrukturierung (Backend + data-sync) lokal prüfen, bevor Sie deployen:

1. **Voraussetzung**: Node.js (z. B. 18 oder 20) installiert.
2. **Im Projektordner**:
   - `npm install` (falls noch nicht geschehen)
   - `npm start`
3. **Browser**: http://localhost:3000 öffnen (nicht `file://`).
4. **Login testen**:
   - **Insassen-Portal**: `insasse1` / `insasse1` oder `insasse2` / `insasse2`
   - **Mitarbeiter-Portal**: `avd1` / `avd1`, `avd2` / `avd2`, `val1` / `val1`, `kammer1` / `kammer1`
   - **Admin-Portal**: `admin` / `admin`
5. **Persistenz prüfen**: Einen Antrag anlegen oder eine Aktion ausführen, Seite neu laden – Daten sollten erhalten sein. In `database.json` im Projektordner erscheinen die Einträge.
6. **Ohne Backend**: `index.html` direkt im Browser öffnen (oder über einen anderen Webserver) – dann läuft die App wie bisher nur mit localStorage, kein Server nötig.

**Hinweis**: Beim ersten Aufruf unter http://localhost:3000 lädt das Frontend die Daten vom Server; in der Browser-Konsole erscheint „Alle Daten vom Server geladen …“, sobald der Sync fertig ist.

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
- **Schnellantwort-Buttons**: Vordefinierte Antworten ("Ja", "Nein", "Ist vollständig", "Kann entschieden werden") per Klick einfügen

### Fortschrittsanzeige

- **Phasenübersicht**: Eingang → Prüfung → Entscheiden → Bekanntgabe → Vollzug → Abschluss
- **Sticky-Verhalten**: Bleibt beim Scrollen am oberen Bildschirmrand sichtbar
- **Visueller Status**: Aktive Phase hervorgehoben, erledigte Phasen markiert

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

- **Ohne Backend**: Daten liegen im localStorage und sind browser- bzw. gerätespezifisch.
- **Mit Backend**: Daten sind in `database.json` (oder konfigurierter DB) persistent und geräteübergreifend nutzbar.
- **Demo-System**: Konzipiert als Prototyp/Demonstrator; für Produktion sind Absicherung und Datensicherung zu ergänzen.

---

## Lizenz

Proprietär - Alle Rechte vorbehalten

---

*Entwickelt im Hamburg.de Corporate Design*  
*Version: 2.0 - Februar 2026*
