# Architekturskizze - JVA Antragsbearbeitungssystem

## Systemübersicht

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROWSER (Client)                                │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         PRÄSENTATIONSSCHICHT                           │ │
│  │                                                                        │ │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │ │
│  │   │  index.html  │  │  admin.html  │  │mitarbeiter.  │  │ insassen. │ │ │
│  │   │              │  │              │  │    html      │  │   html    │ │ │
│  │   │ Portal-      │  │ Benutzer-    │  │ Antrags-     │  │ Antrags-  │ │ │
│  │   │ Auswahl      │  │ verwaltung   │  │ bearbeitung  │  │ stellung  │ │ │
│  │   └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘ │ │
│  │                                                                        │ │
│  │                        ┌──────────────┐                                │ │
│  │                        │  styles.css  │                                │ │
│  │                        │  (Hamburg.de │                                │ │
│  │                        │   Design)    │                                │ │
│  │                        └──────────────┘                                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                     │                                        │
│                                     ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                          GESCHÄFTSLOGIK (app.js)                       │ │
│  │                                                                        │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │ │
│  │  │ SessionManager  │  │   UserSystem    │  │  AntragSystem   │        │ │
│  │  │                 │  │                 │  │                 │        │ │
│  │  │ • login()       │  │ • createUser()  │  │ • createAntrag()│        │ │
│  │  │ • logout()      │  │ • getUser()     │  │ • getAntrag()   │        │ │
│  │  │ • getSession()  │  │ • updateUser()  │  │ • abschliessen()│        │ │
│  │  │ • checkSession()│  │ • deleteUser()  │  │ • verakten()    │        │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │ │
│  │                                                                        │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │ │
│  │  │ AufgabenSystem  │  │Notification     │  │ Aktivitaeten    │        │ │
│  │  │                 │  │    System       │  │    System       │        │ │
│  │  │ • create()      │  │                 │  │                 │        │ │
│  │  │ • erledige()    │  │ • create()      │  │ • logAktivität()│        │ │
│  │  │ • loesche()     │  │ • markAsRead()  │  │ • getVerlauf()  │        │ │
│  │  │ • getAufgaben() │  │ • getAll()      │  │ • istBeteiligt()│        │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │ │
│  │                                                                        │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │ │
│  │  │  TerminSystem   │  │  TRANSLATIONS   │  │ TEXT_DICTIONARY │        │ │
│  │  │                 │  │                 │  │                 │        │ │
│  │  │ • createTermin()│  │ • DE / EN / FR  │  │ • Wort-für-Wort │        │ │
│  │  │ • getTermine()  │  │ • t(key)        │  │ • translateText │        │ │
│  │  │ • deleteTermin()│  │ • setLanguage() │  │ • Freitexte     │        │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │ │
│  │                                                                        │ │
│  │                        ┌─────────────────┐                             │ │
│  │                        │  HAUS_CONFIG    │                             │ │
│  │                        │                 │                             │ │
│  │                        │ • Häuser        │                             │ │
│  │                        │ • Stationen     │                             │ │
│  │                        │ • Hierarchie    │                             │ │
│  │                        └─────────────────┘                             │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                     │                                        │
│                                     ▼                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         DATENSCHICHT (localStorage)                    │ │
│  │                                                                        │ │
│  │   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐         │ │
│  │   │gefaengnis_ │ │gefaengnis_ │ │gefaengnis_ │ │gefaengnis_ │         │ │
│  │   │  users     │ │  antraege  │ │  aufgaben  │ │notifications│        │ │
│  │   └────────────┘ └────────────┘ └────────────┘ └────────────┘         │ │
│  │                                                                        │ │
│  │   ┌────────────┐ ┌────────────┐ ┌────────────┐                        │ │
│  │   │gefaengnis_ │ │gefaengnis_ │ │ current_   │                        │ │
│  │   │aktivitaeten│ │  termine   │ │  session   │                        │ │
│  │   └────────────┘ └────────────┘ └────────────┘                        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Datenfluss: Antragsstellung bis Veraktung

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   INSASSE   │     │ MITARBEITER │     │ MITARBEITER │     │ MITARBEITER │
│             │     │  (Station)  │     │  (Aufgabe)  │     │  (Entsch.)  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │ Antrag stellen    │                   │                   │
       │ ─────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ Antrag nehmen     │                   │
       │                   │ ─────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ Prüfen            │
       │                   │                   │ ─────────────────>│
       │                   │                   │                   │
       │                   │                   │     Entscheiden   │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │ Benachrichtigung  │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
```

## Antrags-Zustandsdiagramm

```
                              ┌─────────────┐
                              │   OFFEN     │
                              │  (Eingang)  │
                              └──────┬──────┘
                                     │ Antrag nehmen
                                     ▼
                              ┌─────────────┐
                              │    IN       │
                              │ BEARBEITUNG │
                              │  (Prüfung)  │
                              └──────┬──────┘
                                     │ Sachlich geprüft
                                     ▼
                              ┌─────────────┐
                              │  GEPRÜFT    │
                              │(Entscheiden)│
                              └──────┬──────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
    ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
    │  GENEHMIGT  │           │  TEILWEISE  │           │  ABGELEHNT  │
    │             │           │  GENEHMIGT  │           │             │
    └──────┬──────┘           └──────┬──────┘           └──────┬──────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
             ┌───────────┐    ┌───────────┐    ┌───────────┐
             │ Persönl.  │    │  Vollzug  │    │  Direkt   │
             │ Eröffnung │    │   vor     │    │ bekannt   │
             │           │    │Bekanntgabe│    │  geben    │
             └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
                   │                │                │
                   └────────────────┼────────────────┘
                                    │
                                    ▼
                             ┌─────────────┐
                             │  VOLLZOGEN  │
                             │             │
                             └──────┬──────┘
                                    │ Verakten
                                    ▼
                             ┌─────────────┐
                             │  VERAKTET   │
                             │ (Erledigt)  │
                             └─────────────┘
```

## Benutzerrollen-Hierarchie

```
                              ┌─────────────┐
                              │    ADMIN    │
                              │             │
                              │ • Alle      │
                              │   Rechte    │
                              │ • Benutzer- │
                              │   verwaltung│
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ HAUSLEITUNG │
                              │             │
                              │ • Haus-     │
                              │   übersicht │
                              │ • Revidieren│
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ STATIONS-   │
                              │  LEITUNG    │
                              │             │
                              │ • Stations- │
                              │   übersicht │
                              │ • Termine   │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ MITARBEITER │
                              │             │
                              │ • Eigene    │
                              │   Anträge   │
                              │ • Aufgaben  │
                              └─────────────┘
```

## Datenbankschema (localStorage)

### Benutzer (gefaengnis_users)
```javascript
{
  id: "USR-...",
  benutzername: "string",
  passwort: "string",
  vorname: "string",
  nachname: "string",
  rolle: "admin|hausleitung|stationsleitung|mitarbeiter|insasse",
  haus: "string",
  station: "string",
  insassenId: "string",        // nur für Insassen
  geburtsdatum: "ISO-Date",    // nur für Insassen
  sprache: "de|en|fr",
  erstelltAm: "ISO-Date"
}
```

### Antrag (gefaengnis_antraege)
```javascript
{
  id: "ANT-...",
  antragsNummer: "string",
  type: "teilhabegeld|eigentum",
  status: "offen|in-bearbeitung|genehmigt|abgelehnt|teilweise-genehmigt",
  insasseId: "string",
  insasseName: "string",
  haus: "string",
  station: "string",
  bearbeiterId: "string",
  bearbeiterName: "string",
  sachlichGeprueft: boolean,
  entscheidungGetroffen: boolean,
  wartetAufEroeffnung: boolean,
  wartetAufVollzug: boolean,
  vollzogen: boolean,
  veraktet: boolean,
  bescheidPdf: "base64",
  erstelltAm: "ISO-Date",
  bearbeitetAm: "ISO-Date"
}
```

### Aufgabe (gefaengnis_aufgaben)
```javascript
{
  id: "AUF-...",
  antragId: "string",
  erstelltVonId: "string",
  erstelltVonName: "string",
  zugewiesenAnId: "string",
  zugewiesenAnName: "string",
  zugewiesenAnTyp: "insasse|mitarbeiter",
  kurzbeschreibung: "string",   // max 40 Zeichen
  beschreibung: "string",
  anhangPdfs: [{name, data}],   // Array von PDFs
  fristDatum: "ISO-Date",
  status: "offen|erledigt|geloescht",
  antwort: "string",
  antwortPdfs: [{name, data}],
  erledigungsTyp: "antwort|kenntnisnahme",
  erstelltAm: "ISO-Date",
  erledigtAm: "ISO-Date"
}
```

### Benachrichtigung (gefaengnis_notifications)
```javascript
{
  id: "NOT-...",
  userId: "string",
  type: "string",
  title: "string",
  message: "string",
  antragId: "string",
  read: boolean,
  createdAt: "ISO-Date"
}
```

### Termin (gefaengnis_termine)
```javascript
{
  id: "TER-...",
  titel: "string",
  beschreibung: "string",
  datum: "ISO-Date",
  uhrzeit: "string",
  erstelltVonId: "string",
  erstelltVonName: "string",
  sichtbarkeit: "privat|station|haus|allgemein",
  haus: "string",
  station: "string",
  aufgabeId: "string",        // falls aus Aufgabe erstellt
  erstelltAm: "ISO-Date"
}
```

## Externe Abhängigkeiten

```
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNE BIBLIOTHEKEN                        │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  jsPDF (CDN)                                            │  │
│   │  https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/   │  │
│   │                                                         │  │
│   │  → PDF-Generierung für Bescheide und Veraktung         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Hamburg Logo (extern)                                  │  │
│   │  https://pem-center.de/.../Logo-Stadt-Hamburg.jpg      │  │
│   │                                                         │  │
│   │  → Corporate Design Element                            │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Sicherheitshinweise

⚠️ **Prototyp-System** - Nicht für Produktivbetrieb geeignet:

- Passwörter werden im Klartext gespeichert
- Keine serverseitige Validierung
- localStorage ist nicht verschlüsselt
- Keine Audit-Logs außerhalb des Browsers
- Keine Backup-Mechanismen

---

*Architekturskizze erstellt für das JVA Antragsbearbeitungssystem*
