# JVA Antragsbearbeitungssystem

Ein webbasiertes Verwaltungssystem für die Bearbeitung von Anträgen in Justizvollzugsanstalten (JVA). Das System ermöglicht Insassen die Stellung von Anträgen und Mitarbeitern deren strukturierte Bearbeitung.

## Funktionsübersicht

### Für Insassen
- **Antragsstellung**: Teilhabegeld und Eigentum aus der Kammer
- **Antragsverfolgung**: Status-Anzeige (Offen, In Bearbeitung, Erledigt)
- **Postfach**: Benachrichtigungen über Entscheidungen
- **Aufgaben**: Bearbeitung zugewiesener Aufgaben
- **Mehrsprachigkeit**: Deutsch, Englisch, Französisch

### Für Mitarbeiter
- **Antragsbearbeitung**: Prüfen, Entscheiden, Aufgaben erstellen, Verakten
- **Workflow-Steuerung**: 
  - Sachliche/fachliche Prüfung
  - Entscheidungen (Genehmigen, Teilweise genehmigen, Ablehnen)
  - Persönliche Eröffnung
  - Vollzug vor Bekanntgabe
- **Aufgabenverwaltung**: Aufgaben an Mitarbeiter oder Insassen zuweisen
- **PDF-Erstellung**: Automatische Bescheide, Veraktung
- **Terminkalender**: Tag/Woche/Monat-Ansichten
- **Postfach**: Aufgaben- und Fristbenachrichtigungen

### Für Administratoren
- **Benutzerverwaltung**: Insassen und Mitarbeiter anlegen/bearbeiten
- **Rollen**: Admin, Hausleitung, Stationsleitung, Mitarbeiter
- **Terminverwaltung**: Allgemeine Termine für alle Mitarbeiter

## Technische Details

### Architektur
Das System ist als **Single-Page Application (SPA)** konzipiert und läuft vollständig im Browser. Alle Daten werden im **localStorage** des Browsers gespeichert.

### Technologie-Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties (Variablen), Flexbox, Grid
- **PDF-Generierung**: jsPDF-Bibliothek
- **Datenspeicherung**: Browser localStorage
- **Design**: Hamburg.de Corporate Design

### Dateistruktur
```
├── index.html          # Startseite / Portal-Auswahl
├── admin.html          # Admin-Portal (Benutzerverwaltung)
├── mitarbeiter.html    # Mitarbeiter-Portal (Antragsbearbeitung)
├── insassen.html       # Insassen-Portal (Antragsstellung)
├── app.js              # Kernlogik und alle Systeme
├── styles.css          # Globale Styles
└── README.md           # Diese Dokumentation
```

## Systemkomponenten (app.js)

| Komponente | Beschreibung |
|------------|--------------|
| `SessionManager` | Login/Logout, Session-Verwaltung |
| `UserSystem` | Benutzer erstellen, bearbeiten, laden |
| `AntragSystem` | Anträge erstellen, bearbeiten, Status ändern |
| `AufgabenSystem` | Aufgaben erstellen, zuweisen, erledigen |
| `NotificationSystem` | Benachrichtigungen erstellen und verwalten |
| `AktivitaetenSystem` | Aktivitätsprotokoll / Bearbeitungsverlauf |
| `TerminSystem` | Kalendertermine und Fristen |
| `TRANSLATIONS` | Mehrsprachige UI-Texte (DE/EN/FR) |
| `TEXT_DICTIONARY` | Wort-für-Wort-Übersetzung für Freitexte |

## Benutzerrollen

| Rolle | Berechtigungen |
|-------|----------------|
| **Admin** | Vollzugriff, Benutzerverwaltung, allgemeine Termine |
| **Hausleitung** | Alle Anträge des Hauses, Entscheidungen revidieren |
| **Stationsleitung** | Anträge der Station, Termine für Station |
| **Mitarbeiter** | Zugewiesene Anträge und Aufgaben |
| **Insasse** | Eigene Anträge, zugewiesene Aufgaben |

## Antrags-Workflow

```
1. EINGANG        → Antrag gestellt, noch nicht genommen
2. PRÜFUNG        → Antrag genommen, sachliche Prüfung steht aus
3. ENTSCHEIDUNG   → Geprüft, Entscheidung steht aus
4. BEKANNTGABE    → Entschieden, ggf. persönliche Eröffnung
5. VOLLZUG        → Bekannt gegeben, Vollzug steht aus
6. ABSCHLUSS      → Vollzogen, Veraktung steht aus
7. VERAKTET       → Abgeschlossen und archiviert
```

## Installation & Start

1. Dateien in einen Webserver-Ordner kopieren (oder lokal öffnen)
2. `index.html` im Browser öffnen
3. Portal auswählen und mit vorhandenen Zugangsdaten anmelden

### Standard-Benutzer (Beispiel)
Die Anwendung enthält vordefinierte Testbenutzer. Diese können über das Admin-Portal verwaltet werden.

## Besondere Features

### Mehrsprachigkeit
- Alle UI-Elemente in DE/EN/FR
- Freitexte werden automatisch übersetzt
- Individuelle Spracheinstellung pro Benutzer

### PDF-Dokumente
- Automatische Bescheid-Erstellung bei Entscheidungen
- PDF-Upload bei Aufgaben (mehrere Dateien möglich)
- Veraktungs-PDFs mit vollständigem Verlauf

### Benachrichtigungssystem
- Fristüberschreitungen (tägliche Erinnerungen)
- Entscheidungs-Benachrichtigungen
- Aufgaben-Zuweisungen

### Kalender
- Verschiedene Terminarten (Privat, Station, Haus, Allgemein)
- Automatische Termine aus Aufgabenfristen
- Tag/Woche/Monat-Ansichten

## Browser-Kompatibilität

- Chrome (empfohlen)
- Firefox
- Edge
- Safari

## Hinweise

- **Datenspeicherung**: Alle Daten werden im localStorage gespeichert und sind browser- und gerätespezifisch
- **Keine Server-Komponente**: Die Anwendung läuft vollständig clientseitig
- **Demo-System**: Konzipiert als Prototyp/Demonstrator

## Lizenz

Proprietär - Alle Rechte vorbehalten

---

*Entwickelt im Hamburg.de Corporate Design*
