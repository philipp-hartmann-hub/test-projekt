# Architekturumbau - Status

## ✅ Abgeschlossen (für lokales Testen)

### Backend
- ✅ Express-Server (`server.js`) mit JSON-Datenbank (`database.json`)
- ✅ Alle API-Endpunkte implementiert:
  - `/api/login` (POST)
  - `/api/users` (GET, POST, PUT, DELETE)
  - `/api/antraege` (GET, POST, PUT, DELETE)
  - `/api/aufgaben` (GET, POST, PUT, DELETE)
  - `/api/notifications` (GET, POST, PUT)
  - `/api/aktivitaeten` (GET, POST)
  - `/api/termine` (GET, POST, PUT, DELETE)
- ✅ Demo-Benutzer werden automatisch erstellt
- ✅ Server läuft auf Port 3000 (oder PORT aus Umgebungsvariable)

### Frontend-Anbindung
- ✅ `data-sync.js` in allen drei Portalen eingebunden (admin.html, mitarbeiter.html, insassen.html)
- ✅ Automatisches Laden der Daten vom Server beim Seitenaufruf
- ✅ Automatische Synchronisation: Jede Änderung im localStorage wird an den Server gesendet
- ✅ Login über API: Alle drei Portale nutzen `DataSync.serverLogin()` wenn verfügbar
- ✅ `reloadDataFromStorage()`: Lädt Daten nach Server-Sync neu in die Systeme
- ✅ `setSessionFromServer()`: Setzt Session aus Server-Login-Antwort
- ✅ Event `dataSyncLoaded`: UI aktualisiert sich automatisch nach Datenladung

### Datenkompatibilität
- ✅ User-Mapping: Server (`name`/`rolle`) → Frontend (`vorname`/`nachname`/`type`)
- ✅ JSON-Serialisierung für komplexe Felder (jvas, kommentare, dokumente, etc.)

### Fallback-Verhalten
- ✅ Wenn Server nicht erreichbar: App läuft weiterhin mit lokalem localStorage
- ✅ Login funktioniert lokal, wenn kein Backend verfügbar

---

## ⏳ Noch ausstehend (nur für Deployment)

Diese Punkte sind **nicht nötig für lokales Testen**, sondern nur für das Deployment auf Vercel + Neon DB:

1. **PostgreSQL/Neon DB Integration**
   - `pg` Package zu `package.json` hinzufügen
   - Datenbank-Schema (SQL) erstellen
   - Server umbauen: Unterscheidung zwischen JSON (lokal) und Neon (Production) basierend auf `DATABASE_URL` Umgebungsvariable

2. **Vercel-Konfiguration**
   - `vercel.json` erstellen
   - Umgebungsvariablen für Neon DB konfigurieren

3. **Migration**
   - Initialdaten (Demo-User) in Neon DB einfügen

---

## 🧪 Testbereitschaft

**Der Architekturumbau ist für lokales Testen vollständig abgeschlossen.**

Sie können jetzt:

1. **Lokales Testen mit Backend:**
   ```bash
   npm install
   npm start
   # Browser: http://localhost:3000
   ```

2. **Alle Funktionen testen:**
   - Login in allen drei Portalen
   - Anträge erstellen, bearbeiten, verakten
   - Aufgaben erstellen und zuweisen
   - Benachrichtigungen
   - Termine/Kalender
   - Dokumenten-Upload
   - Bearbeitungsverlauf
   - Alle Rollen (VAL, AVD, Kammer, etc.)

3. **Persistenz prüfen:**
   - Daten werden in `database.json` gespeichert
   - Nach Neuladen der Seite bleiben alle Daten erhalten
   - Synchronisation zwischen Browser-Tabs funktioniert (über Server)

---

## 📋 Checkliste für lokales Testen

- [ ] Server starten (`npm start`)
- [ ] Insassen-Portal: Login mit `insasse1` / `insasse1`
- [ ] Antrag erstellen (Teilhabegeld oder Eigentum)
- [ ] Mitarbeiter-Portal: Login mit `avd1` / `avd1` oder `val1` / `val1`
- [ ] Antrag nehmen und bearbeiten
- [ ] Sachliche Prüfung durchführen
- [ ] Entscheidung treffen
- [ ] Aufgabe erstellen
- [ ] Dokument hochladen
- [ ] Notiz hinzufügen (verschiedene Typen)
- [ ] Antrag verakten
- [ ] Admin-Portal: Login mit `admin` / `admin`
- [ ] Benutzer verwalten
- [ ] Seite neu laden → Daten sollten erhalten bleiben
- [ ] `database.json` prüfen → sollte alle Daten enthalten

---

## 🚀 Nächste Schritte nach erfolgreichem Test

1. Neon DB Integration (für Deployment)
2. Vercel-Konfiguration
3. Deployment auf Vercel + Neon DB
