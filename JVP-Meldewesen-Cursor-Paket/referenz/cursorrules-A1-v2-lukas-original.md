# .cursorrules – Prototyp A1: eGefangenenanträge
# HEUREKA 2.0 | FHH Hamburg Justiz | Stand: Mai 2026
# Version 2.1 – inkl. PDF-Generierung, eGPA-Mock-Veraktung

---

## 1. PROJEKTKONTEXT

Du hilfst beim Entwickeln eines **funktionalen Prototypen** für die digitale Bearbeitung
von Gefangenenanträgen in Hamburger Justizvollzugsanstalten (JVAs).

Dieser Prototyp dient als **Anforderungserhebungs- und Validierungsinstrument**.
Er wird mit JVA-Bediensteten iterativ validiert und mündet in ein Lastenheft
für eine Low-Code-Plattform (Appian oder ServiceNow – noch nicht entschieden).

### 1.1 Zwei-Portal-Architektur (Zielarchitektur)

A1 besteht in der Zielarchitektur aus **zwei logisch getrennten Instanzen**,
die niemals direkt miteinander kommunizieren:

```
┌─────────────────────────────┐     Integrationsschicht      ┌─────────────────────────────┐
│   BEDIENSTETEN-PORTAL       │   (kontrollierter, proto-    │   GEFANGENEN-PORTAL         │
│                             │    kollierter Übergabepunkt) │                             │
│  Netz:    FHH-Behördennetz  │◄────────────────────────────►│  Netz:    Non-Behördennetz  │
│  Auth:    Active Directory  │   nur fachlich notwendige    │  Auth:    eigenes IAM       │
│  Zugang:  Bedienstete       │   Daten (Antragsinhalte,     │  Zugang:  Gefangene         │
│  Rollen:  BEAMTER, ABTL,    │   Statusänderungen,          │  Geräte:  UEM (präferiert), │
│           ANSTL, SOZIAL,    │   Bescheide)                 │           SiteKiosk,        │
│           MEDIZIN, PFORTE   │                              │           dSmartDesk        │
└─────────────────────────────┘                              └─────────────────────────────┘
```

**Warum diese Trennung?**
Gefangene erhalten aus IT-Sicherheitsgründen keinen Zugriff auf das FHH-Behördennetz.
Die beiden Zonen sind daher netzwerktechnisch vollständig getrennt. Der Datenaustausch
erfolgt ausschließlich über eine dedizierte Integrationsschicht als kontrollierten
Übergabepunkt – nur fachlich notwendige Daten (Antragsinhalte, Statusänderungen, Bescheide)
wechseln die Zone.

**Zugangsgeräte Gefangenenportal:**
Dataport sieht drei Varianten vor. Aktuell präferiert ist **UEM (Unified Endpoint Management)**,
da der Zugriff über das Internet (nicht das Landesnetz) erfolgt und Anforderungsänderungen
flexibel per Whitelisting konfiguriert werden können.

**KI-Unterstützung im Gefangenenportal:**
Für Gefangene ist KI-Unterstützung bei der Antragsstellung vorgesehen (z.B. Chatbot-Assistent).
Geplant: On-premise KI via data[port]ai-Plattform, angebunden über OpenAI-API-kompatible
Schnittstelle, Schutzbedarf „hoch", verfügbar voraussichtlich ab Juni 2026.
Sicherheitsrisiko Chatbot ist ein offener Klärungspunkt vor MVP-Entwicklung.

### 1.2 Prototyp-Ansatz: Simulation beider Portale in einer App

Da die echte Netzwerktrennung im Prototypen nicht umsetzbar ist, werden beide Portale
**in einer Anwendung simuliert** – umschaltbar über den Prototyp-Banner-Toggle.

```
Prototyp-Toggle „GEFANGENER" → simuliert Gefangenenportal-Ansicht
Prototyp-Toggle „BEAMTER" etc. → simuliert Bediensteten-Portal-Ansicht
```

Im **Lastenheft** und in den **Validierungsworkshops** wird klar kommuniziert:
In der Produktivumgebung sind dies zwei separate Deployments mit eigenem
Authentifizierungsmechanismus und eigener Netzwerkzone.

### 1.3 Wichtig für alle Architekturentscheidungen

Das Backend ist bewusst als dünne REST-API-Schicht gebaut – keine komplexe
Business-Logik, kein Framework-Lock-in. Zu einem späteren Zeitpunkt wird ein
separates `.cursorrules-appian` oder `.cursorrules-servicenow` erstellt, das
den Kontext auf die spezifische LC-Plattform ummünzt. Baue daher niemals
plattformspezifische Konzepte ein.

---

## 2. ARCHITEKTUR-ÜBERSICHT

```
jvp-a1/
├── frontend/                  ← React 18 + Tailwind CSS + Vite
│   ├── public/
│   │   └── assets/
│   │       └── Justizvollzug-Hamburg-logo.png  ← Offizielles BJV-Logo (nie umbenennen!)
│   ├── src/
│   │   ├── components/        ← Wiederverwendbare UI-Komponenten
│   │   │   ├── layout/        ← Header, Breadcrumb, Footer
│   │   │   ├── antrag/        ← Antrags-spezifische Komponenten
│   │   │   └── shared/        ← Buttons, Badges, Tabellen, Formulare
│   │   ├── pages/             ← Seiten (Dashboard, Liste, Detail, Neu)
│   │   ├── context/           ← React Context (Auth, Anträge)
│   │   ├── hooks/             ← Custom Hooks (useAntraege, useRolle)
│   │   ├── api/               ← API-Client-Funktionen (fetch-Wrapper)
│   │   └── styles/            ← Tailwind-Konfiguration + FHH-Tokens
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/                   ← Node.js 20 + Express + Prisma
│   ├── src/
│   │   ├── routes/            ← REST-Endpunkte je Ressource
│   │   ├── controllers/       ← Request/Response-Logik
│   │   ├── middleware/        ← Fehlerbehandlung, Logging, CORS
│   │   ├── services/          ← Fachliche Services (PDF, eGPA-Mock)
│   │   │   ├── pdfService.js  ← PDF-Generierung mit pdfkit
│   │   │   └── egpaService.js ← eGPA-Mock (REST oder Dateieinwurf)
│   │   └── prisma/
│   │       └── schema.prisma  ← Datenbankschema (= Anforderungsdoku)
│   ├── seed.js                ← Mock-Daten beim Start laden
│   ├── .env.example
│   └── Dockerfile
│
├── docker-compose.yml         ← Lokale Entwicklung: alle Services
├── railway.toml               ← Railway-Deployment-Konfiguration
└── .env.example               ← Umgebungsvariablen-Vorlage
```

---

## 3. FRONTEND: React + Tailwind CSS

### 3.1 Tech Stack

- **React 18** mit funktionalen Komponenten und Hooks
- **Vite** als Build-Tool (schneller als CRA, einfacher für Deployment)
- **Tailwind CSS** mit FHH-Design-Tokens als Custom-Farben (siehe 3.3)
- **React Router v6** für clientseitiges Routing
- **React Context + useState** für State Management
- **fetch API** für Backend-Kommunikation (kein Axios, kein React Query)

### 3.2 Seitenstruktur (React Router)

```javascript
// BEDIENSTETEN-PORTAL – Pflicht-Routen:
/                              → Redirect zu /dashboard
/dashboard                     → DashboardPage (Antragsliste + Kennzahlen)
/antraege                      → AntraegeListe
/antraege/neu                  → AntragNeu
/antraege/:id                  → AntragDetail
/antraege/:id/bearbeiten       → AntragBearbeiten

// GEFANGENEN-PORTAL – Pflicht-Routen (eingeschränkte Ansicht):
/gefangene/meine-antraege      → MeineAntraege (nur eigene Anträge)
/gefangene/antrag-stellen      → AntragStellen (vereinfachtes Formular + KI-Assistent)
/gefangene/antrag/:id          → MeinAntragDetail (Lesemodus, Status + Bescheid)
```

Im Prototyp sind beide Routebereiche in einer App – der Toggle im Prototyp-Banner
schaltet zwischen den Ansichten um. In der Produktivumgebung: zwei separate Deployments.

**Absprungpunkt Justizvollzugsplattform (JVP):**
```javascript
// .env / Railway-Umgebungsvariable:
VITE_JVP_URL=https://jvp-dashboard.railway.app

const JVP_URL = import.meta.env.VITE_JVP_URL || 'http://localhost:5174';
```

### 3.3 Tailwind-Konfiguration (FHH Design-Tokens)

```javascript
// tailwind.config.js – IMMER diese Farben verwenden, niemals hardcoded:
module.exports = {
  theme: {
    extend: {
      colors: {
        'jhh-primary':    '#003063',  // Dunkelblau – Header, Buttons, H1/H2
        'jhh-accent':     '#E10019',  // Rot – Warnungen, Ablehnungen
        'jhh-secondary':  '#005CA9',  // Mittelblau – Links, Fokus
        'jhh-bg':         '#EEF0F3',  // Seitenhintergrund
        'jhh-text':       '#1A1A1A',  // Fließtext
        'jhh-text-light': '#5A6472',  // Labels, Sekundärtext
        'jhh-border':     '#C8CDD5',  // Rahmen, Trennlinien
        'jhh-success':    '#2E7D32',  // Grün – Genehmigt
        'jhh-warning':    '#E65100',  // Orange – In Bearbeitung
        'jhh-danger':     '#E10019',  // Rot – Abgelehnt
        'jhh-info':       '#005CA9',  // Blau – Eingereicht
      },
      fontFamily: {
        sans: ['HamburgSans', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
}
```

### 3.4 Responsives Design (Pflicht)

Der Prototyp muss auf **Desktop (1280px+) und Tablet (768px–1024px)** funktionieren.
Grund: Validierungsworkshops nutzen teils Tablets auf den Haftraummedien-Systemen.

```
Mobile (<768px):   Nicht erforderlich
Tablet (768–1024px): Einspaltiges Layout, Sidebar unter Hauptinhalt
Desktop (>1024px): Zweispaltiges Layout (Hauptinhalt + Sidebar)
```

Tailwind-Breakpoints verwenden:
- `md:` für Tablet (768px+)
- `lg:` für Desktop (1024px+)
- `xl:` für große Bildschirme (1280px+)

### 3.5 Pflicht-Elemente auf jeder Seite

Jede Seite bindet die gemeinsame Layout-Komponente ein:

```jsx
// components/layout/PageLayout.jsx – Pflichtstruktur:
<div className="min-h-screen bg-jhh-bg">
  <PrototypBanner />       {/* Nur Prototyp-Modus, gelber Banner */}
  <Header />               {/* FHH-Header mit Schiffsbug, Logo, Nutzer */}
  <Breadcrumb />           {/* Justizplattform > eGefangenenanträge > [Seite] */}
  <main>
    {children}
  </main>
  <Footer />
</div>
```

**Header enthält zwingend:**
1. Dunkelblaues Band (`bg-jhh-primary`)
2. Offizielles BJV-Logo (PNG, siehe unten)
3. Plattformtitel „Justizvollzugsplattform – eGefangenenanträge"
4. Aktive Benutzerrolle und JVA (aus Context)
5. „Zurück zur Justizplattform"-Link (immer sichtbar)

**Logo-Vorgabe (Pflicht):**

Das offizielle Logo der Behörde für Justiz und Verbraucherschutz Hamburg
wird als PNG-Datei ins Projekt gelegt und von dort eingebunden.

```
Dateiname:  Justizvollzug-Hamburg-logo.png
Pfad:       /frontend/public/assets/Justizvollzug-Hamburg-logo.png
```

Einbindung in React:
```jsx
// In der Header-Komponente – Logo in weißes Hintergrundfeld einbetten:
<div className="bg-white rounded px-2 py-1 mr-5 flex-shrink-0">
  <img
    src="/assets/Justizvollzug-Hamburg-logo.png"
    alt="Hamburg – Behörde für Justiz und Verbraucherschutz"
    className="h-9 w-auto"
  />
</div>
```

Hinweise zur Einbindung:
- Das Logo hat einen weißen Hintergrund und wird **niemals** per CSS-Filter verändert
- Im dunklen Header (`bg-jhh-primary`): Logo in ein weißes Hintergrundfeld einbetten (`bg-white rounded px-2 py-1`)
- Auf weißem Hintergrund (z.B. PDFs): Logo direkt ohne Wrapper einbinden
- **Datei niemals umbenennen** – Referenz in der Codebasis ist `Justizvollzug-Hamburg-logo.png`

**Breadcrumb – vollständige Navigationsvorgabe (Pflicht):**

Die Breadcrumb ist das zentrale Navigationselement zwischen JVP und A1.
Sie muss auf **jeder Seite** sichtbar und vollständig klickbar sein.

```jsx
// components/layout/Breadcrumb.jsx – Pflichtimplementierung:

// Beispiel auf der Antrag-Detailseite:
// [Justizplattform] › [eGefangenenanträge] › Antrag ANT-047

<nav aria-label="Breadcrumb" className="bg-white border-b border-jhh-border px-8 py-2">
  <ol className="flex items-center gap-2 text-sm">

    {/* Stufe 1: JVP – immer als externer Link zur JVP-URL */}
    <li>
      <a
        href={JVP_URL}                          // VITE_JVP_URL aus .env
        className="text-jhh-secondary hover:underline font-medium"
        aria-label="Zurück zur Justizvollzugsplattform"
      >
        Justizplattform
      </a>
    </li>

    <li aria-hidden="true" className="text-jhh-border">›</li>

    {/* Stufe 2: A1-Dashboard – immer als interner Link zu /dashboard */}
    <li>
      <a
        href="/dashboard"
        className="text-jhh-secondary hover:underline font-medium"
        aria-label="Zurück zu eGefangenenanträge"
      >
        eGefangenenanträge
      </a>
    </li>

    {/* Stufe 3+: Aktuelle Seite – nur wenn tiefer als /dashboard */}
    {currentPage && (
      <>
        <li aria-hidden="true" className="text-jhh-border">›</li>
        <li aria-current="page" className="text-jhh-primary font-semibold">
          {currentPage}     {/* z.B. "Antrag ANT-047" oder "Neuen Antrag erfassen" */}
        </li>
      </>
    )}

  </ol>
</nav>
```

**Breadcrumb-Inhalte je Route:**

| Route | Breadcrumb |
|---|---|
| `/dashboard` | Justizplattform › **eGefangenenanträge** |
| `/antraege` | Justizplattform › eGefangenenanträge › **Alle Anträge** |
| `/antraege/neu` | Justizplattform › eGefangenenanträge › **Neuen Antrag erfassen** |
| `/antraege/:id` | Justizplattform › eGefangenenanträge › **Antrag [Nr.]** |
| `/antraege/:id/bearbeiten` | Justizplattform › eGefangenenanträge › Antrag [Nr.] › **Bearbeiten** |

**Regel:** Die erste Stufe (Justizplattform) ist **immer** ein anklickbarer
externer Link zur JVP – auch wenn der Nutzer gerade auf `/dashboard` ist.
Die zweite Stufe (eGefangenenanträge) ist **immer** ein anklickbarer
interner Link zu `/dashboard` – auch wenn der Nutzer bereits dort ist.

**Zusätzlich im Header:** Persistenter Rücksprung-Link zur JVP,
sichtbar auf jeder Seite, unabhängig von der Breadcrumb:

```jsx
// In Header.jsx – rechts oben, immer sichtbar:
<a
  href={JVP_URL}
  className="text-white/80 hover:text-white text-sm flex items-center gap-1"
  aria-label="Zurück zur Justizvollzugsplattform"
>
  ← Zur Justizplattform
</a>
```

### 3.6 Rollenlogik (React Context + Mock-Header)

```javascript
// context/RollenContext.jsx

// BEDIENSTETEN-PORTAL (Zielarchitektur: FHH-Behördennetz + Active Directory)
const ROLLEN_BEDIENSTETE = {
  BEAMTER: { label: 'Vollzugsbeamtin/-beamter', jva: 'JVA Billwerder', portal: 'bedienstete' },
  ABTL:    { label: 'Abteilungsleitung',         jva: 'JVA Billwerder', portal: 'bedienstete' },
  ANSTL:   { label: 'Anstaltsleitung',           jva: 'JVA Billwerder', portal: 'bedienstete' },
  SOZIAL:  { label: 'Sozialdienst',              jva: 'JVA Fuhlsbüttel',portal: 'bedienstete' },
  MEDIZIN: { label: 'Medizinischer Dienst',      jva: 'JVA Billwerder', portal: 'bedienstete' },
  PFORTE:  { label: 'Pforte / Empfang',          jva: 'JVA Billwerder', portal: 'bedienstete' },
};

// GEFANGENEN-PORTAL (Zielarchitektur: Non-Behördennetz + eigenes IAM)
// Eingeschränkte Ansicht: nur eigene Anträge, kein Bearbeitungs-UI
// KI-Assistent bei Antragsstellung vorgesehen (Validierungspunkt)
const ROLLEN_GEFANGENE = {
  GEFANGENER: { label: 'Gefangene/r', jva: 'JVA Billwerder', portal: 'gefangene' },
};
```

**Im Prototyp:** Beide Portal-Typen werden über denselben Toggle umgeschaltet.
Bei Wechsel auf `GEFANGENER` wechselt die App vollständig in die Gefangenen-Ansicht
(eingeschränkte Routen, reduzierte UI, kein Zugriff auf Bediensteten-Funktionen).

**Rollenbasierte Sichtbarkeit als Hooks:**
```javascript
// useRolle().istGefangener()     → true nur für GEFANGENER → Gefangenenportal-UI
// useRolle().kannBearbeiten()    → false für GEFANGENER
// useRolle().kannGenehmigen()    → nur ABTL, ANSTL
// useRolle().siehtAlleJVAs()     → nur ANSTL
// useRolle().darfVerakten()      → nur ABTL, ANSTL
```

Kein Keycloak, keine echte AD-Authentifizierung. Im Prototyp: Rolle über
Prototyp-Banner-Toggle. In der Produktivumgebung: AD für Bedienstete,
eigenes IAM für Gefangene – zwei vollständig getrennte Auth-Systeme.

**Die aktive Rolle wird bei jedem API-Call als HTTP-Header mitgeschickt:**
```javascript
'X-Mock-Rolle':    aktiveRolle,       // z.B. "GEFANGENER"
'X-Mock-Portal':   aktiverNutzer.portal, // "bedienstete" oder "gefangene"
'X-Mock-Nutzer-ID': aktiverNutzer.id,
'X-Mock-JVA':      aktiverNutzer.jva,
```

### 3.7 API-Client

```javascript
// api/client.js – zentraler Fetch-Wrapper, immer verwenden:
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API Fehler: ${res.status}`);
  return res.json();
}

// Verwendung:
// api/antraege.js
export const getAntraege    = () => apiFetch('/api/antraege');
export const getAntrag      = (id) => apiFetch(`/api/antraege/${id}`);
export const createAntrag   = (data) => apiFetch('/api/antraege', { method: 'POST', body: JSON.stringify(data) });
export const updateAntrag   = (id, data) => apiFetch(`/api/antraege/${id}`, { method: 'PUT', body: JSON.stringify(data) });
```

---

## 4. BACKEND: Node.js + Express + Prisma

### 4.1 Tech Stack

- **Node.js 20 LTS**
- **Express 4**
- **Prisma** als ORM (Schema = Datenbankdokumentation für Lastenheft)
- **PostgreSQL 15** (lokal via Docker, produktiv via Railway)
- **dotenv** für Umgebungsvariablen
- **cors** Middleware
- **morgan** für Request-Logging
- **pdfkit** für serverseitige PDF-Generierung (Antrags-PDFs für eGPA-Veraktung)

### 4.2 REST-API-Endpunkte (A1)

```
GET    /api/health               → Healthcheck für Railway
GET    /api/antraege             → Liste aller Anträge (mit Filterparametern)
GET    /api/antraege/:id         → Einzelner Antrag mit StatusVerlauf
POST   /api/antraege             → Neuen Antrag erstellen
PUT    /api/antraege/:id         → Antrag aktualisieren
PATCH  /api/antraege/:id/status  → Status ändern (+ StatusVerlauf-Eintrag)

GET    /api/gefangene            → Liste (für Autocomplete-Suche)
GET    /api/gefangene/:id        → Einzelne Person

GET    /api/bedienstete          → Liste (für Zuständigkeits-Dropdown)
GET    /api/bedienstete/me       → Mock: aktuell eingeloggte Person per Rolle

GET    /api/cluster              → Antragscluster-Typen und ihr Status

# PDF & eGPA-Veraktung
GET    /api/antraege/:id/pdf          → PDF des Antrags generieren + zurückgeben
POST   /api/antraege/:id/verakten     → Antrag in eGPA verakten (Mock)
GET    /api/antraege/:id/veraktungen  → Veraktungs-Verlauf eines Antrags
```

**Query-Parameter für GET /api/antraege:**
```
?status=SUBMITTED
?clusterTyp=Ausgang+%26+Urlaub
?jva=JVA+Billwerder
?gefangenenNr=GEF-021
?search=Yilmaz
?page=1&limit=20
```

### 4.3 Rollen-Middleware (Mock-Header auswerten)

Jeder eingehende Request wird durch eine Middleware geprüft,
die den `X-Mock-Rolle`-Header ausliest und an `req.mockNutzer` anhängt.
Alle Controller filtern danach – nie direkt aus dem Header lesen.

```javascript
// middleware/mockAuth.js
export function mockAuth(req, res, next) {
  const rolle     = req.headers['x-mock-rolle']     || 'BEAMTER';
  const nutzerId  = req.headers['x-mock-nutzer-id'] || 'BD-001';
  const jva       = req.headers['x-mock-jva']       || 'JVA Billwerder';

  // Ungültige Rollen abweisen
  const gueltigeRollen = ['BEAMTER','ABTL','ANSTL','SOZIAL','MEDIZIN','PFORTE','ITADMIN','GEFANGENER'];
  if (!gueltigeRollen.includes(rolle)) {
    return res.status(400).json({ error: `Ungültige Rolle: ${rolle}` });
  }

  req.mockNutzer = { rolle, nutzerId, jva };
  next();
}

// server.js – Middleware global einbinden:
app.use(mockAuth);
```

**Filterregeln je Rolle (in allen Controllern umsetzen):**

```javascript
// controllers/antraegeController.js
export async function getAntraege(req, res, next) {
  try {
    const { rolle, nutzerId, jva } = req.mockNutzer;

    // Filterlogik je Rolle – gleichzeitig Anforderungsdokumentation:
    let where = {};

    if (rolle === 'GEFANGENER') {
      // Gefangene sehen nur eigene Anträge
      where.gefangene = { gefangenenNr: nutzerId };

    } else if (rolle === 'ANSTL') {
      // Anstaltsleitung sieht alle JVAs – kein Filter
      where = {};

    } else {
      // Alle anderen Bediensteten: nur eigene JVA
      where.gefangene = { jva };
    }

    const antraege = await prisma.antrag.findMany({
      where,
      include: { gefangene: true, zustaendig: true },
      orderBy: { erstelltAm: 'desc' },
    });

    res.json({ data: antraege, total: antraege.length });
  } catch (err) {
    next(err);
  }
}
```

**Berechtigungsmatrix (im Lastenheft als Anforderung):**

| Aktion | GEFANGENER | BEAMTER | SOZIAL | MEDIZIN | ABTL | ANSTL |
|---|---|---|---|---|---|---|
| Eigene Anträge sehen | ✅ | — | — | — | — | — |
| Anträge der eigenen JVA sehen | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Anträge aller JVAs sehen | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Antrag erstellen (für Gefangene) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Antrag bearbeiten | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Antrag genehmigen / ablehnen | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| In eGPA verakten | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

> Diese Tabelle ist als **Validierungshypothese** zu verstehen –
> sie wird in den JVA-Workshops aktiv hinterfragt und angepasst.
> Die finale Version fließt als Anforderung ins Lastenheft.

### 4.4 Controller-Struktur

```javascript
// Immer diese Struktur in Controllern:
export async function getAntraege(req, res, next) {
  try {
    const { status, clusterTyp, jva, search, page = 1, limit = 20 } = req.query;
    // Prisma-Query hier
    const antraege = await prisma.antrag.findMany({ where: { ... } });
    res.json({ data: antraege, total: antraege.length, page, limit });
  } catch (err) {
    next(err); // immer an Error-Middleware weitergeben
  }
}
```

**Antwortformat immer einheitlich:**
```json
{
  "data": [...],
  "total": 47,
  "page": 1,
  "limit": 20
}
```

---

## 5. DATENBANK: PostgreSQL + Prisma Schema

### 5.1 Basis-Schema (`schema.prisma`)

```prisma
// prisma/schema.prisma
// HEUREKA 2.0 – A1 eGefangenenanträge
// Dieses Schema ist gleichzeitig die Datenbankdokumentation für das Lastenheft.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -------------------------------------------------------
// GEFANGENE
// Mock-Tabelle: Im Produktivsystem kommt dies aus BASIS-Web.
// Feldnamen entsprechen den Vorgaben aus dem JVP-Vorgabendokument.
// -------------------------------------------------------
model Gefangene {
  id                  String    @id @default(uuid())
  gefangenenNr        String    @unique  // z.B. "GEF-021"
  nachname            String
  vorname             String
  geburtsdatum        DateTime?
  staatsangehoerigkeit String?
  muttersprache       String?
  jva                 String    // z.B. "JVA Billwerder"
  haftraum            String?   // z.B. "B2-14"
  haftart             String?   // z.B. "Strafhaft"
  strafende           DateTime?
  vollzugsabteilung   String?
  betreuenderBeamter  String?
  createdAt           DateTime  @default(now())

  // Relationen
  antraege            Antrag[]

  @@map("gefangene")
}

// -------------------------------------------------------
// BEDIENSTETE
// Mock-Tabelle: Im Produktivsystem kommt dies aus Active Directory.
// -------------------------------------------------------
model Bedienstete {
  id                  String    @id @default(uuid())
  bediensteterID      String    @unique  // z.B. "BD-001"
  bediensteterName    String
  bediensteterRolle   Rolle
  bediensteterJVA     String
  bediensteterAbteilung String?
  createdAt           DateTime  @default(now())

  // Relationen
  zugewieseneAntraege Antrag[]  @relation("Zustaendig")
  statusAenderungen   StatusVerlauf[]

  @@map("bedienstete")
}

// -------------------------------------------------------
// ANTRAG – Kerntabelle A1
// clusterTyp = generischer Antragscluster (nicht 1:1 Antragsart)
// metadaten  = flexibles JSON für clustersspezifische Felder
//              → wird nach Validierungsworkshops konkretisiert
// -------------------------------------------------------
model Antrag {
  id              String        @id @default(uuid())
  antragNr        String        @unique  // z.B. "ANT-047", auto-generiert
  clusterTyp      ClusterTyp
  status          AntragStatus  @default(DRAFT)
  begruendung     String?       // Freitext
  metadaten       Json?         // Cluster-spezifische Felder (flexibel)
  erstelltAm      DateTime      @default(now())
  aktualisiertAm  DateTime      @updatedAt
  prioritaet      Int           @default(0)  // 0=normal, 1=dringend

  // Relationen
  gefangeneId     String
  gefangene       Gefangene     @relation(fields: [gefangeneId], references: [id])

  zustaendigId    String?
  zustaendig      Bedienstete?  @relation("Zustaendig", fields: [zustaendigId], references: [id])

  statusVerlauf   StatusVerlauf[]
  anhaenge        Anhang[]
  veraktungen     Veraktung[]

  @@map("antraege")
}

// -------------------------------------------------------
// STATUS-VERLAUF
// Jede Statusänderung wird protokolliert – wichtig für
// Nachvollziehbarkeit im Vollzug (Anforderung aus HEUREKA 1.0)
// -------------------------------------------------------
model StatusVerlauf {
  id            String        @id @default(uuid())
  status        AntragStatus
  kommentar     String?
  erstelltAm    DateTime      @default(now())

  antragId      String
  antrag        Antrag        @relation(fields: [antragId], references: [id])

  bediensteteId String?
  bedienstete   Bedienstete?  @relation(fields: [bediensteteId], references: [id])

  @@map("status_verlauf")
}

// -------------------------------------------------------
// ANHANG (Dateireferenzen)
// Nur Metadaten – Dateien selbst werden auf Railway Volume
// oder später im DMS der Behörde gespeichert
// -------------------------------------------------------
model Anhang {
  id          String   @id @default(uuid())
  dateiname   String
  dateityp    String   // z.B. "application/pdf"
  pfad        String   // relativer Pfad oder URL
  erstelltAm  DateTime @default(now())

  antragId    String
  antrag      Antrag   @relation(fields: [antragId], references: [id])

  @@map("anhaenge")
}

// -------------------------------------------------------
// ENUMS
// Statusbezeichnungen einheitlich für A1 und A2
// -------------------------------------------------------
// VERAKTUNG
// Protokolliert jeden Veraktungsvorgang in die eGPA.
// Im Produktivsystem: REST-API oder Dateieinwurf an eGPA/VIS.
// Im Prototyp: Mock – Mechanismus (REST vs. Dateieinwurf) noch offen.
// Dieses Modell ist Anforderungsgrundlage für die Schnittstellenspezifikation.
// -------------------------------------------------------
model Veraktung {
  id              String          @id @default(uuid())
  erstelltAm      DateTime        @default(now())
  pdfPfad         String          // Pfad zur generierten PDF-Datei
  egpaAktenzeichen String?        // Rückantwort eGPA (im Mock: fiktiv)
  status          VeraktungStatus @default(AUSSTEHEND)
  fehlerMeldung   String?         // Falls Veraktung fehlschlägt

  antragId        String
  antrag          Antrag          @relation(fields: [antragId], references: [id])

  ausgefuehrtVon  String?         // bediensteterID
  @@map("veraktungen")
}

// -------------------------------------------------------
enum AntragStatus {
  DRAFT        // Entwurf
  SUBMITTED    // Eingereicht
  IN_PROGRESS  // In Bearbeitung
  APPROVED     // Genehmigt
  REJECTED     // Abgelehnt
  FORWARDED    // Weitergeleitet
  ARCHIVED     // Archiviert
}

enum ClusterTyp {
  AUSGANG_URLAUB          // Ausgang & Urlaub
  BESUCH_KOMMUNIKATION    // Besuch & Kommunikation
  EINKAUF_FINANZEN        // Einkauf & Finanzen
  GESUNDHEIT_SOZIALES     // In Planung
  ARBEIT_BILDUNG          // In Planung
  RECHTLICHES             // In Planung
  UNTERBRINGUNG_VERLEGUNG // In Planung
}

enum Rolle {
  BEAMTER
  ABTL
  ANSTL
  SOZIAL
  MEDIZIN
  PFORTE
  ITADMIN
  GEFANGENER
}

enum VeraktungStatus {
  AUSSTEHEND   // PDF generiert, noch nicht an eGPA übermittelt
  UEBERMITTELT // An eGPA übermittelt (Mock: immer erfolgreich)
  FEHLGESCHLAGEN // Übermittlung fehlgeschlagen (für Fehlerfall-Validierung)
}
```

### 5.2 Hinweise zum Schema

- **Nie Spalten löschen** während der Prototyp-Phase – stattdessen als deprecated markieren
- **Migrationen immer committen** (`prisma migrate dev --name beschreibung`)
- **metadaten Json?** ist bewusst offen gehalten – nach Validierungsworkshops werden
  hier konkrete Felder pro ClusterTyp definiert und ins Lastenheft übernommen
- Das Schema ist die **zentrale Anforderungsdokumentation für das Datenwörterbuch im Lastenheft**

---

## 6. DOCKER-KONFIGURATION

### 6.1 `docker-compose.yml` (lokale Entwicklung)

```yaml
version: '3.9'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: jvp_a1
      POSTGRES_USER: jvp_user
      POSTGRES_PASSWORD: jvp_dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jvp_user -d jvp_a1"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://jvp_user:jvp_dev_password@db:5432/jvp_a1
      PORT: 3001
      NODE_ENV: development
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3001
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
```

### 6.2 Backend `Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && node seed.js && npm start"]
```

### 6.3 Frontend `Dockerfile`

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 7. RAILWAY-DEPLOYMENT

### 7.1 `railway.toml`

```toml
[build]
builder = "DOCKERFILE"

[[services]]
name = "backend"
source = "backend"

[[services]]
name = "frontend"
source = "frontend"

[[services]]
name = "db"
plugin = "postgresql"
```

### 7.2 Umgebungsvariablen auf Railway

Backend benötigt:
```
DATABASE_URL    → Railway PostgreSQL Connection String (auto-gesetzt)
PORT            → 3001
NODE_ENV        → production
```

Frontend benötigt:
```
VITE_API_URL    → URL des Railway-Backend-Services
```

### 7.3 Deployment-Ablauf für das Team (Schritt für Schritt)

```
1. Git Repository anlegen (GitHub empfohlen)
2. railway.app → New Project → Deploy from GitHub
3. Repository verbinden
4. Railway erkennt docker-compose.yml automatisch
5. PostgreSQL-Plugin hinzufügen → DATABASE_URL wird auto-gesetzt
6. VITE_API_URL im Frontend-Service auf Backend-URL setzen
7. Deploy → URL wird automatisch generiert
```

---

## 8. NAMING-KONVENTIONEN

| Element | Konvention | Beispiel |
|---|---|---|
| React-Komponenten | PascalCase | `AntragDetail.jsx` |
| React-Hooks | camelCase mit `use` | `useAntraege.js` |
| API-Dateien | camelCase | `antraege.js` |
| CSS-Klassen | Tailwind-Utilities | `bg-jhh-primary text-white` |
| Backend-Routen | kebab-case | `/api/antraege/:id/status` |
| Prisma-Modelle | PascalCase Singular | `Antrag`, `Gefangene` |
| DB-Tabellen (`@@map`) | snake_case Plural | `antraege`, `gefangene` |
| Umgebungsvariablen | SCREAMING_SNAKE_CASE | `DATABASE_URL`, `VITE_API_URL` |
| Git-Branches | kebab-case | `feature/antrag-detail`, `fix/filter-status` |
| Mock-IDs | Präfix-Nummer | `ANT-001`, `GEF-001`, `BD-001` |
| Status-Codes | SCREAMING_SNAKE_CASE | `IN_PROGRESS`, `APPROVED` |

---

## 9. SPRACHE & TONALITÄT

- Alle UI-Texte, Fehlermeldungen, Labels: **Deutsch**
- Alle Code-Kommentare: **Deutsch**
- Variablennamen, Funktionen, Routen: **Englisch** (Entwicklungsstandard)
- Fehlermeldungen für Nutzer: konkret und handlungsweisend
  - ✅ „Bitte geben Sie das Geburtsdatum im Format TT.MM.JJJJ ein."
  - ❌ „Ungültige Eingabe."
- Formelles Sie in der Nutzeransprache
- Statusbezeichnungen: Entwurf | Eingereicht | In Bearbeitung | Genehmigt | Abgelehnt | Weitergeleitet | Archiviert

---

## 10. BARRIEREFREIHEIT & FHH-STYLEGUIDE-COMPLIANCE

### 10.1 Barrierefreiheit (WCAG 2.1 AA – Pflicht)

- Alle Formularfelder: sichtbares Label + `htmlFor`-Verknüpfung
- Pflichtfelder: `*`-Markierung + `aria-required="true"`
- Fokus-Indikator: `focus:ring-2 focus:ring-jhh-secondary focus:outline-none`
- Status immer: Text + Farbe + Icon (nie nur Farbe)
- Tabellen: Min. Zeilenhöhe 44px (`min-h-[44px]`)
- Interaktive Elemente: Min. Klickfläche 44×44px
- Bilder und Icons: `alt`-Attribut oder `aria-hidden="true"`
- Kontrastverhältnis: min. 4,5:1 für Fließtext (FHH-Primärblau auf Weiß: 12,6:1 ✅)
- Keine Information ausschließlich durch Farbe kommunizieren
- Alle Seiten haben einen aussagekräftigen `<title>`: `„[Seitenname] – eGefangenenanträge – JVP Hamburg"`

### 10.2 FHH Online-Styleguide Compliance (Pflicht)

Diese Regeln sind aus dem FHH Hamburg Online-Styleguide abgeleitet
und für alle Seiten des Prototypen verbindlich:

**Schrift:**
- Schriftart: `HamburgSans` (Fallback: `'Segoe UI', Arial, sans-serif`)
- Fließtext: 16px, Regular (400) – nie kleiner als 14px
- Überschriften H1: 28px Bold, H2: 22px Bold, H3: 18px Semibold
- Zeilenabstand: mindestens 1,5× Schriftgröße

**Farben (keine Abweichungen erlaubt):**
- Primär-Blau `#003063`: Header, primäre Buttons, H1/H2, aktive Navigationselemente
- Akzent-Rot `#E10019`: Hamburger Wappen/Schiffsbug, Fehlerzustände, Ablehnen-Aktionen
- Link-Blau `#005CA9`: alle klickbaren Links, Fokus-Indikator, sekundäre Aktionen
- Hintergrund `#EEF0F3`: Seitenhintergrund (nie reines Weiß für den Body)
- Karteninhalt `#FFFFFF`: Formulare, Karten, Tabellen

**Abstände (4px-Raster):**
- Innenabstand Buttons: 10px vertikal, 24px horizontal
- Innenabstand Formularfelder: 8px vertikal, 12px horizontal
- Abstand zwischen Sektionen: mindestens 24px (`gap-6`)
- Seitenränder: mindestens 32px auf Desktop (`px-8`)

**Navigation:**
- Aktiver Navigationspunkt: `font-semibold`, Primär-Blau, ggf. linker Rahmen
- Hover-Zustand: Hintergrund `#E8EEF5` (niemals Unterstreichung allein)
- Breadcrumb immer sichtbar (siehe Abschnitt 3.5)

**Buttons:**
- Primärer Button: `bg-jhh-primary text-white` – nur für die Hauptaktion je Seite
- Sekundärer Button: `border-2 border-jhh-primary text-jhh-primary bg-transparent`
- Destruktiver Button: `bg-jhh-danger text-white` – nur für Ablehnen/Löschen
- Maximal **ein primärer Button** pro Seite/Bereich
- Buttons haben immer ein beschreibendes `aria-label` wenn der Text nicht eindeutig ist

**Formulare:**
- Labels immer oberhalb des Feldes (nicht inline/placeholder als Ersatz)
- Pflichtfeld-Markierung: roter Stern `*` nach dem Label, `aria-required="true"`
- Fehlermeldung: direkt unterhalb des Feldes, rot `#E10019`, mit Icon ⚠
- Erfolgsmeldung: grün `#2E7D32`, mit Icon ✓
- Maximale Formularbreite: 640px (Lesbarkeit)

**Tabellen:**
- Tabellenkopf: `bg-jhh-primary text-white font-semibold`
- Zeilen alternierend: `#FFFFFF` / `#F7F9FB`
- Hover: `bg-[#E8EEF5]`
- Sortierbare Spalten: visueller Pfeil-Indikator

**Icons:**
- Einheitlich: Heroicons (MIT-lizenziert, passt zu Tailwind)
- Import: `import { CheckCircleIcon } from '@heroicons/react/24/outline'`
- Größe: 20px (`w-5 h-5`) inline, 24px (`w-6 h-6`) in Buttons
- Immer mit `aria-hidden="true"` wenn dekorativ

---

## 11. VORGANGSLOGIK & PROZESSSCHRITTE (A1 + A2 übergreifend)

Sowohl A1 (eGefangenenanträge) als auch A2 (eMeldewesen) folgen einer
**mehrstufigen Vorgangslogik**, in der ein Vorgang verschiedene Prüf-
und Bearbeitungsschritte durchläuft. Die genauen Schritte unterscheiden
sich je Fachverfahren – das UI-Muster und das Look & Feel sind jedoch
**bewusst ähnlich gehalten**, damit Bedienstete, die beide Fachverfahren
nutzen, sich sofort zurechtfinden.

**Wichtig:** Die konkrete Anzahl und Benennung der Schritte wird in
den Validierungsworkshops mit den JVAs erhoben. Baue das Muster daher
**flexibel und datengetrieben** – nie mit hardcoded Schrittnamen.

### 11.1 Gemeinsames UI-Muster: Schrittanzeige

Jeder Vorgang mit mehr als einem Schritt zeigt eine **Fortschrittsanzeige**
(Stepper) am oberen Rand des Inhaltsbereichs. Diese visualisiert:
- Welche Schritte es gibt (Anzahl und Bezeichnung)
- Welcher Schritt aktuell aktiv ist
- Welche Schritte bereits abgeschlossen sind

```jsx
// components/shared/VorgangsSchritte.jsx
// Plattformneutral – beschreibt das Muster, nicht die Implementierung

// Props:
// schritte: Array von { id, label, status: 'abgeschlossen' | 'aktiv' | 'offen' | 'gesperrt' }
// aktuellerSchritt: String (id)

<VorgangsSchritte
  schritte={[
    { id: 'erfassung',  label: 'Erfassung',      status: 'abgeschlossen' },
    { id: 'pruefung',   label: 'Prüfung',         status: 'aktiv' },
    { id: 'entscheid',  label: 'Entscheidung',    status: 'offen' },
    { id: 'abschluss',  label: 'Abschluss',       status: 'gesperrt' },
  ]}
  aktuellerSchritt="pruefung"
/>
```

**Visuelle Regeln für den Stepper (FHH-konform, plattformneutral):**

| Schritt-Status | Hintergrund | Textfarbe | Icon |
|---|---|---|---|
| `abgeschlossen` | `#2E7D32` (Grün) | Weiß | ✓ |
| `aktiv` | `#003063` (Primär) | Weiß | Schrittnummer |
| `offen` | `#EEF0F3` (Hellgrau) | `#5A6472` | Schrittnummer |
| `gesperrt` | `#EEF0F3` (Hellgrau) | `#C8CDD5` | 🔒 |

Verbindungslinie zwischen Schritten: 2px, Farbe je Status (`#2E7D32` wenn vorheriger Schritt abgeschlossen, sonst `#C8CDD5`).

### 11.2 Vorgangs-Datenbankmodell

Das Prisma-Schema unterstützt flexible Schrittfolgen:

```prisma
// Erweiterung von Antrag – optional, nach Validierungsworkshop konkretisieren:
model VorgangsSchritt {
  id            String   @id @default(uuid())
  schrittnummer Int
  bezeichnung   String   // z.B. "Prüfung Berechtigung"
  status        SchrittStatus @default(OFFEN)
  erledgtAm     DateTime?
  kommentar     String?

  antragId      String
  antrag        Antrag   @relation(fields: [antragId], references: [id])

  ausgefuehrtVon String?  // bediensteterID

  @@map("vorgangs_schritte")
}

enum SchrittStatus {
  OFFEN
  AKTIV
  ABGESCHLOSSEN
  GESPERRT      // Wartet auf vorherigen Schritt
  UEBERSPRUNGEN // Nicht anwendbar für diesen Vorgang
}
```

### 11.3 Plattformneutrale Prinzipien (für Lastenheft übernehmen)

Diese Prinzipien gelten für A1 und A2 gleichermassen und werden
**plattformneutral** formuliert – sie sind unabhängig davon, ob
Appian, ServiceNow oder eine andere LC-Plattform gewählt wird:

1. **Jeder Vorgang hat einen eindeutigen Status** – sichtbar auf
   jeder Ansicht (Liste, Detail, Stepper), immer als Text + Farbe + Icon.

2. **Übergänge zwischen Schritten sind explizit** – der Nutzer führt
   eine bewusste Aktion aus (Button klicken), kein automatisches Weiterschalten.

3. **Jeder Schritt kann Pflichtfelder haben** – das System verhindert
   das Weiterschalten, solange Pflichtfelder nicht ausgefüllt sind.

4. **Gesperrte Schritte sind sichtbar, aber nicht bedienbar** –
   der Nutzer sieht den Gesamtprozess, auch wenn er ihn nicht vollständig
   steuern kann (Transparenz über den Prozess).

5. **Jede Statusänderung wird protokolliert** (→ StatusVerlauf-Modell) –
   mit Zeitstempel, ausführender Person und optionalem Kommentar.

6. **Automatisierungspotenziale werden als eigene Schritte markiert** –
   Schritte, die das System selbst ausführen könnte (z.B. Berechtigungsprüfung),
   werden im Prototyp mit dem Hinweis „⚡ Automatisierbar" gekennzeichnet.
   Dies ist ein expliziter Diskussionspunkt in den Validierungsworkshops.

### 11.4 Unterschiede A1 vs. A2 (bewusst offen gehalten)

| Aspekt | A1 eGefangenenanträge | A2 eMeldewesen |
|---|---|---|
| Initiant | Bedienstete (für Gefangene) | Bedienstete |
| Außenwirkung | Intern (JVA) | Intern + Extern (Gericht, StA) |
| Ausgang | eGPA-Veraktung | eGPA + xJustiz/beBPo |
| Schrittanzahl | Noch offen (Workshop) | Noch offen (Workshop) |
| UI-Muster | Identisch (VorgangsSchritte) | Identisch (VorgangsSchritte) |

---

## 12. SCHNITTSTELLEN-MOCKS (Ende-zu-Ende-Gedanke)

Der Prototyp bildet den vollständigen Prozessfluss ab:
**BASIS-Web (Eingang) → JVP/A1 → eGPA (Ausgang)**

### 11.1 Mock-Eingang: BASIS-Web

Gefangenenstammdaten kommen im Produktivsystem aus BASIS-Web.
Im Prototyp: Daten liegen in der PostgreSQL-Tabelle `gefangene` (per `seed.js` befüllt).
Die Feldnamen sind identisch mit den BASIS-Web-Feldern aus dem JVP-Vorgabendokument,
damit das Lastenheft die Schnittstellenspezifikation direkt übernehmen kann.

### 11.2 PDF-Generierung (pdfkit)

Für jeden Antrag kann ein standardisiertes PDF generiert werden.
Dieses dient als Veraktungsdokument für die eGPA.

**PDF-Inhalt (Pflichtstruktur):**
```
Kopfzeile:   Logo „Hamburg | Behörde für Justiz und Verbraucherschutz"
             Schriftzug „Justizvollzugsplattform – eGefangenenanträge"
             Antragsnummer + Datum der Erstellung

Abschnitt 1: Gefangenen-Stammdaten (Name, gefangenenNr, JVA, Haftraum, Haftart)
Abschnitt 2: Antragsinhalt (ClusterTyp, Begründung, alle metadaten-Felder)
Abschnitt 3: Entscheidung (Status, Entscheidungsdatum, zuständige Person, Kommentar)
Abschnitt 4: Verlauf (StatusVerlauf-Einträge chronologisch)
Fußzeile:    „Erstellt durch Justizvollzugsplattform Hamburg – HEUREKA 2.0 Prototyp"
             Seitenzahl, Erstellungsdatum, Antragsnummer
```

**Implementierung `pdfService.js`:**
```javascript
// services/pdfService.js
import PDFDocument from 'pdfkit';

export async function generiereAntragsPDF(antrag, gefangene, verlauf) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  // FHH-Primärfarbe für Überschriften: #003063
  // Strukturierter Aufbau: Kopfzeile → Stammdaten → Inhalt → Entscheidung → Verlauf
  // Gibt Buffer zurück – Controller streamt diesen als PDF an Frontend
  return doc;
}
```

**API-Endpunkt:**
```javascript
// GET /api/antraege/:id/pdf
// Antwort: Content-Type: application/pdf
// Content-Disposition: attachment; filename="ANT-047_Antrag.pdf"
```

### 11.3 Mock-Ausgang: eGPA-Veraktung

Nach Abschluss eines Antrags (APPROVED oder REJECTED) kann das PDF
in die eGPA (digitale Gefangenen-Personalakte / VIS) übergeben werden.

**Da der eGPA-Schnittstellenmechanismus noch nicht geklärt ist**
(REST-API oder Dateieinwurf), wird der Mock so gebaut, dass er
**beide Varianten simulieren** kann:

```javascript
// services/egpaService.js

// Konfiguration per Umgebungsvariable – leicht umschaltbar:
// EGPA_MODUS=REST       → simuliert REST-API-Call
// EGPA_MODUS=DATEIEINWURF → simuliert Ablage in Ordner

export async function verakteInEGPA(antrag, pdfBuffer) {
  const modus = process.env.EGPA_MODUS || 'REST';

  if (modus === 'REST') {
    // Mock: simuliert erfolgreichen REST-API-Call an eGPA
    // Im Produktivsystem: echter HTTP-POST an eGPA/VIS-Endpunkt
    return {
      egpaAktenzeichen: `EGPA-${antrag.antragNr}-${Date.now()}`,
      status: 'UEBERMITTELT',
      timestamp: new Date().toISOString(),
    };
  }

  if (modus === 'DATEIEINWURF') {
    // Mock: schreibt PDF in /tmp/egpa-einwurf/
    // Im Produktivsystem: Ablage in definierten Netzwerkpfad
    const pfad = `/tmp/egpa-einwurf/${antrag.antragNr}.pdf`;
    // fs.writeFileSync(pfad, pdfBuffer);
    return {
      egpaAktenzeichen: `EINWURF-${antrag.antragNr}`,
      status: 'UEBERMITTELT',
      pfad,
    };
  }
}
```

**Veraktungs-Flow im Frontend:**
```
Antrag Detail-Seite
  → Button „In eGPA verakten" (nur sichtbar bei Status APPROVED oder REJECTED)
  → Bestätigungsdialog: „Antrag ANT-047 wird als PDF generiert und in die
    digitale Gefangenen-Personalakte übertragen. Vorgang kann nicht rückgängig
    gemacht werden."
  → POST /api/antraege/:id/verakten
  → Backend: PDF generieren → eGPA-Mock → Veraktung in DB speichern
  → Erfolg: Badge „Veranktet in eGPA" + Aktenzeichen sichtbar auf Detailseite
  → Fehlerfall: Fehlermeldung + Status FEHLGESCHLAGEN in Veraktungs-Verlauf
```

### 12.4 Integrationsschicht zwischen Bediensteten- und Gefangenenportal

Im Prototyp wird der Datenaustausch zwischen den beiden Portalen
über denselben API-Endpunkt simuliert (da beide Portale in einer App laufen).
In der Produktivumgebung übernimmt eine dedizierte Integrationsschicht diese Aufgabe.

**Welche Daten wechseln die Zone (Validierungshypothese):**

| Richtung | Datenkategorie | Beispiel |
|---|---|---|
| Gefangene → Bedienstete | Antragsinhalte | Formularfelder, Begründung |
| Bedienstete → Gefangene | Statusänderungen | „Ihr Antrag ist in Bearbeitung" |
| Bedienstete → Gefangene | Bescheide | Genehmigung oder Ablehnung mit Begründung |

**Was niemals die Zone wechselt:**
- Benutzerdaten der Bediensteten (Name, Rolle, AD-Kennung)
- Interne Bearbeitungsnotizen zwischen Bediensteten
- BASIS-Web-Rohdaten (nur gefilterte, freigegebene Felder)

**Prototyp-Simulation der Integrationsschicht:**
```javascript
// Neuer API-Endpunkt – simuliert den Übergabepunkt:
GET  /api/integration/bescheide/:gefangenenNr
     → Gibt freigegebene Statusänderungen + Bescheide für einen Gefangenen zurück
     → Nur Felder, die die Zone wechseln dürfen (kein Bediensteten-Kontext)

POST /api/integration/antraege
     → Neuen Antrag aus Gefangenenportal einreichen
     → Validierung, dass nur erlaubte Felder übergeben werden
```

**Offene Klärungspunkte für Lastenheft (aus HEUREKA 2.0 Architektur-Chats):**
- Technische Realisierung Integrationsschicht: dConnector (Dataport) oder REST-Schnittstelle?
- IAM für Gefangene: Welches System, wer verwaltet Konten?
- Kontostatus nach Entlassung: Zugang erhalten, deaktivieren oder löschen?
- Reaktivierung bei Rückkehr (Kurzzeitinsassen): automatisch via J-Nummer oder manuell?
- Chatbot-Sicherheit: Angriffsvektor-Analyse vor MVP-Entwicklung erforderlich

Diese offenen Punkte sind als **Lastenheft-Anforderungen noch zu klären** und
werden in den Validierungsworkshops und im Dataport-Abschlussbericht (Mai 2026) adressiert.

---

## 13. WAS DIESER PROTOTYP NICHT IST

Der Prototyp ist ein Validierungsinstrument, kein Produktionscode.

❌ Nicht umsetzen:
- Keycloak oder echte AD-Authentifizierung
- E-Mail-Versand (Benachrichtigungen als UI-Mock)
- Echte eGPA/VIS-Anbindung (nur Mock – Mechanismus noch offen)
- Echte Anbindung an BASIS-Web oder Active Directory
- xJustiz/beBPo-Versand (gehört zu A2 eMeldewesen, nicht A1)
- Performance-Optimierungen (kein Caching, kein CDN)
- Sicherheitsmechanismen (kein CSRF, kein Rate Limiting)
- Mobile-first (Tablet 768px+ und Desktop reichen)

✅ Fokus:
- Prozesslogik und Entscheidungspfade sichtbar machen
- Felder und Informationsstrukturen klären
- Automatisierungspotenziale identifizierbar machen
- Rollenbasierte Sichten validierbar machen
- Ende-zu-Ende-Flow: BASIS-Web Mock → Antragsbearbeitung → PDF → eGPA Mock
- Schnittstellenanforderungen (BASIS-Web, eGPA) als Lastenheft-Grundlage ableiten
- Datenmodell (Prisma-Schema) als Datenwörterbuch für das Lastenheft entwickeln
- Veraktungs- und PDF-Flow mit JVA-Bediensteten validieren

---

## 14. LC-PLATTFORM-UNABHÄNGIGKEIT

Da die Entscheidung zwischen Appian und ServiceNow noch aussteht:

- **Keine plattformspezifischen Begriffe** im Code oder in Kommentaren
  (kein „Process Model", kein „Record Type", kein „Flow")
- **Funktional beschreiben**, nicht implementierungsspezifisch:
  „Das System prüft Berechtigungen" – nicht „Der Button wird disabled"
- **REST-API bleibt plattformneutral** – sie wird später durch
  Appian- oder ServiceNow-APIs ersetzt, nicht erweitert
- **metadaten Json?** im Antrag-Modell bleibt flexibel bis zur
  Plattformentscheidung und den Validierungsworkshops

Zu einem späteren Zeitpunkt wird `.cursorrules-appian` oder
`.cursorrules-servicenow` erstellt, das spezifische Umsetzungshinweise
für die gewählte Plattform enthält.
