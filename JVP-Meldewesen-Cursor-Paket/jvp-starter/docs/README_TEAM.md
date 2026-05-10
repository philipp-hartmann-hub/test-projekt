# JVP Starter-Paket – HEUREKA 2.0
## Anleitung für das Projektteam (A1 / A2)

**Projektleitung:** Lukas | **Stand:** Mai 2026  
**Dieses Paket gilt für:** Laura (A1 eGefangenenanträge) und Philipp (A2 eMeldewesen)

---

## Maßgebliche Vorgaben (Paket-Root)

Im Ordner **`JVP-Meldewesen-Cursor-Paket/`** (über `jvp-starter/`) liegen die **Cursor Rules** **`JVP-Meldewesen-Cursor-Paket/.cursor/rules/*.mdc`**. Diese sind **inhaltlich maßgeblich** für Design (Farben, Shell, Logo-Kontext), Hub/Dashboard-IA, Rollen-Anzeigenamen aus dem HTML-Prototyp und die Grenzen von **eMeldewesen (A2)**. Siehe **`CURSOR-REGELN-AKTIVIEREN.md`** — dieser Ordner beeinflusst **nicht** die Antrags-Anwendung im übrigen Repo.

- Ältere ausführliche Team-Cursorrules: **`referenz/cursorrules-A1-v2-lukas-original.md`** — **nachrangig**. Kurzfassung: **`HIERARCHIE-MASSGEBLICHKEIT.md`**.
- Die unten genannten „nicht verändern“-Dateien betreffen **Stabilität der gemeinsamen Komponenten**; **visuelle Tokens und fachliche Ausrichtung** zu JVP/Prototyp folgen aber den **`.mdc`**-Regeln (bei Konflikt `.mdc` vor dieser README).

---

## Was ist in diesem Paket?

Dieses Starter-Paket enthält alle gemeinsamen Grundkomponenten der
Justizvollzugsplattform (JVP). Du bekommst damit:

- ✅ FHH-konformen Header mit BJV-Logo
- ✅ Breadcrumb-Navigation (JVP → Fachverfahren → Seite)
- ✅ Rollen-Toggle für Validierungsworkshops
- ✅ PostgreSQL-Datenbankschema mit gemeinsamen Felddefinitionen
- ✅ Mock-Daten (Gefangene, Bedienstete, Anträge)
- ✅ Docker-Konfiguration für lokale Entwicklung
- ✅ React + Tailwind mit FHH-Design-Tokens

---

## 🚫 Diese Dateien NICHT verändern

Die folgenden Dateien sind gemeinsame Standards – Änderungen nur nach
Rücksprache mit der Projektleitung (Lukas):

```
frontend/src/components/layout/Header.jsx
frontend/src/components/layout/Breadcrumb.jsx
frontend/src/components/layout/PrototypBanner.jsx
frontend/src/components/layout/Footer.jsx
frontend/src/components/layout/PageLayout.jsx
frontend/src/context/RollenContext.jsx
frontend/src/api/client.js
frontend/src/styles/index.css
frontend/tailwind.config.js
backend/src/middleware/mockAuth.js
backend/prisma/schema.prisma   ← nur nach Absprache ergänzen
backend/seed.js                ← eigene Testdaten ergänzen, nichts löschen
```

---

## Schritt-für-Schritt: Starten

### Voraussetzungen
- Node.js 20+ installiert
- Docker Desktop installiert und gestartet
- Git installiert

### 1. Abhängigkeiten installieren
```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Umgebungsvariablen einrichten
```bash
cp .env.example .env
# .env öffnen und ggf. anpassen (für lokale Entwicklung reichen die Defaults)
```

### 3. Mit Docker starten
```bash
docker compose up
```

Das startet automatisch:
- PostgreSQL-Datenbank auf Port 5432
- Backend (Express + Prisma) auf Port 3001
- Frontend (React + Vite) auf Port 5173

Beim ersten Start werden automatisch:
- Datenbankmigrationen ausgeführt
- Mock-Daten (Seed) geladen

### 4. Im Browser öffnen
```
http://localhost:5173
```

Du siehst das JVP-Dashboard mit dem Rollen-Toggle oben.

---

## Dein Arbeitsbereich

### Neue Seiten erstellen (Beispiel A1)
```
frontend/src/pages/AntraegeListe.jsx     ← neue Seite erstellen
frontend/src/pages/AntragDetail.jsx      ← neue Seite erstellen
```

### Seiten in App.jsx einbinden
```jsx
// frontend/src/App.jsx – dort wo die TODO-Kommentare stehen:
import AntraegeListe from './pages/AntraegeListe'
<Route path="/antraege" element={<AntraegeListe />} />
```

### PageLayout verwenden (Pflicht für jede neue Seite)
```jsx
import PageLayout from '../components/layout/PageLayout'

export default function AntraegeListe() {
  return (
    <PageLayout
      plattformTitel="eGefangenenanträge"
      fachverfahren={{ label: 'eGefangenenanträge', href: '/dashboard' }}
      seiten={[{ label: 'Alle Anträge' }]}
    >
      {/* Dein Seiteninhalt hier */}
    </PageLayout>
  )
}
```

### API aufrufen
```jsx
import { useApiClient } from '../api/client'

export default function MeineSeite() {
  const api = useApiClient()

  async function ladeAntraege() {
    const result = await api.get('/api/antraege?status=SUBMITTED')
    console.log(result.data)
  }
}
```

### Rollen-Kontext nutzen
```jsx
import { useRolle } from '../context/RollenContext'

export default function MeineSeite() {
  const { aktiveRolle, aktiverNutzer, kannGenehmigen, istGefangener } = useRolle()

  return (
    <div>
      {kannGenehmigen && (
        <button>Antrag genehmigen</button>
      )}
    </div>
  )
}
```

---

## Neue Backend-Routen hinzufügen (A1)

```javascript
// backend/src/routes/index.js – unter dem TODO-Kommentar:
router.get('/meine-neue-route', async (req, res, next) => {
  try {
    const { jva, siehtAlleJVAs } = req.mockNutzer  // Rolle immer berücksichtigen
    // ... Prisma-Query
    res.json({ data: ergebnis, total: ergebnis.length })
  } catch (err) { next(err) }
})
```

---

## Starter-Prompts für Cursor

Kopiere diese Prompts direkt in Cursor:

### Neue Listen-Seite erstellen
```
Erstelle eine neue Seite /pages/AntraegeListe.jsx.
Nutze PageLayout mit plattformTitel="eGefangenenanträge".
Zeige eine Tabelle aller Anträge aus GET /api/antraege.
Nutze useApiClient() für den API-Call und useRolle() für Berechtigungen.
Halte dich an die Tailwind-Klassen aus tailwind.config.js (jhh-* Farben).
Kommentare auf Deutsch.
```

### Neues Formular erstellen
```
Erstelle eine neue Seite /pages/AntragNeu.jsx für ClusterTyp AUSGANG_URLAUB.
Nutze PageLayout. Formular mit Gefangenen-Suche (GET /api/gefangene?search=),
Freitext-Begründung und Submit-Button (POST /api/antraege).
Pflichtfelder mit * markieren und aria-required="true".
Nur sichtbar wenn useRolle().kannBearbeiten === true.
```

---

## Deployment auf Railway

1. GitHub-Repo anlegen und Code pushen
2. railway.app → New Project → Deploy from GitHub
3. Repository verbinden
4. PostgreSQL-Plugin hinzufügen
5. Umgebungsvariablen eintragen (aus .env.example)
6. Deploy → Railway generiert automatisch eine URL

---

## Fragen?

Bei Fragen zur Architektur oder zu den gemeinsamen Komponenten:
**Lukas (Projektleitung)** – nicht eigenständig an den NICHT-VERÄNDERN-Dateien arbeiten.

Für fachliche Fragen zu den Antragsarten / Meldungstypen:
**Abstimmungstermin A1/A2** – monatlich laut Projektplan.
