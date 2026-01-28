/* ============================================
   GEFÄNGNIS ANTRAGSWESEN - APP LOGIC
   ============================================ */

// ============================================
// KONFIGURATION - Haus und Stationen
// ============================================

const HAUS_CONFIG = {
  'haus1': {
    name: 'Haus 1',
    stationen: ['1', '2']
  },
  'haus2': {
    name: 'Haus 2',
    stationen: ['1', '2', '3', '4']
  },
  'haus3': {
    name: 'Haus 3',
    stationen: ['1']
  }
};

// Alias für Kompatibilität
const JVA_CONFIG = HAUS_CONFIG;

// Admin-Zugangsdaten (in echter Anwendung sicher speichern!)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// ============================================
// BENUTZERVERWALTUNG
// ============================================

class UserSystem {
  constructor() {
    this.storageKey = 'gefaengnis_users';
    this.users = this.loadUsers();
    this.migrateUsers(); // Bestehende Benutzer mit Credentials versehen
  }

  loadUsers() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveUsers() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.users));
  }

  // Migration: Bestehende Benutzer ohne Credentials oder Insassen-Nummer ergänzen
  // und JVA -> Haus umbenennen
  migrateUsers() {
    let changed = false;
    this.users.forEach(user => {
      // Credentials ergänzen
      if (!user.username || !user.password) {
        user.username = this.generateUsername(user.vorname, user.nachname, user.id);
        user.password = this.generatePassword();
        changed = true;
      }
      // Insassen-Nummer ergänzen
      if (user.type === 'insasse' && !user.insassenNummer) {
        user.insassenNummer = this.generateInsassenNummer();
        changed = true;
      }
      // JVA -> Haus Migration für Insassen
      if (user.type === 'insasse' && user.jva && user.jva.startsWith('jva')) {
        user.jva = user.jva.replace('jva', 'haus');
        changed = true;
      }
      // JVA -> Haus Migration für Mitarbeiter
      if (user.type === 'mitarbeiter' && user.jvas) {
        const neuJvas = user.jvas.map(j => j.startsWith('jva') ? j.replace('jva', 'haus') : j);
        if (JSON.stringify(neuJvas) !== JSON.stringify(user.jvas)) {
          user.jvas = neuJvas;
          changed = true;
        }
      }
    });
    if (changed) {
      this.saveUsers();
    }
  }

  generateId(type) {
    const prefix = type === 'insasse' ? 'INS' : 'MIT';
    return prefix + '-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Fortlaufende Insassen-Nummer generieren (z.B. "I-0001")
  generateInsassenNummer() {
    const insassen = this.users.filter(u => u.type === 'insasse' && u.insassenNummer);
    let maxNummer = 0;
    
    insassen.forEach(u => {
      const match = u.insassenNummer.match(/^I-(\d+)$/);
      if (match) {
        maxNummer = Math.max(maxNummer, parseInt(match[1]));
      }
    });
    
    return 'I-' + String(maxNummer + 1).padStart(4, '0');
  }

  // Benutzername generieren: nachname + erster Buchstabe vorname
  generateUsername(vorname, nachname, excludeUserId = null) {
    // Basis-Username: nachname + erster Buchstabe vorname (alles kleingeschrieben)
    let baseUsername = (nachname + vorname.charAt(0))
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]/g, '');
    
    // Prüfen ob Benutzername bereits existiert
    const existingUsers = this.users.filter(u => 
      u.id !== excludeUserId && 
      (u.username === baseUsername || (u.username && u.username.match(new RegExp(`^${baseUsername}\\d+$`))))
    );
    
    if (existingUsers.length === 0) {
      return baseUsername;
    }
    
    // Nächste freie Nummer finden (01, 02, 03, ...)
    let maxNumber = 0;
    existingUsers.forEach(u => {
      if (u.username === baseUsername) {
        maxNumber = Math.max(maxNumber, 1);
      } else {
        const match = u.username.match(new RegExp(`^${baseUsername}(\\d+)$`));
        if (match) {
          maxNumber = Math.max(maxNumber, parseInt(match[1]) + 1);
        }
      }
    });
    
    // Nummer mit führender Null formatieren (01, 02, etc.)
    return baseUsername + String(maxNumber).padStart(2, '0');
  }

  // Zufälliges Passwort generieren (8 Zeichen)
  generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Passwort zurücksetzen
  resetPassword(id) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.password = this.generatePassword();
      this.saveUsers();
      return user.password;
    }
    return null;
  }

  // Insasse erstellen
  createInsasse(data) {
    const id = this.generateId('insasse');
    const username = this.generateUsername(data.vorname, data.nachname);
    const password = this.generatePassword();
    const insassenNummer = this.generateInsassenNummer();
    
    const insasse = {
      id: id,
      type: 'insasse',
      insassenNummer: insassenNummer,
      vorname: data.vorname,
      nachname: data.nachname,
      geburtsdatum: data.geburtsdatum,
      jva: data.jva,
      station: data.station,
      username: username,
      password: password,
      erstelltAm: new Date().toISOString()
    };
    this.users.push(insasse);
    this.saveUsers();
    return insasse;
  }

  // Mitarbeiter erstellen
  createMitarbeiter(data) {
    const id = this.generateId('mitarbeiter');
    const username = this.generateUsername(data.vorname, data.nachname);
    const password = this.generatePassword();
    
    const mitarbeiter = {
      id: id,
      type: 'mitarbeiter',
      vorname: data.vorname,
      nachname: data.nachname,
      geburtsdatum: data.geburtsdatum,
      rolle: data.rolle,
      jvas: data.jvas,
      station: data.station,
      username: username,
      password: password,
      erstelltAm: new Date().toISOString()
    };
    this.users.push(mitarbeiter);
    this.saveUsers();
    return mitarbeiter;
  }

  // Benutzer aktualisieren
  updateUser(id, data) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      const oldUser = this.users[index];
      
      // Wenn Name geändert wurde, neuen Benutzernamen generieren
      if (data.vorname && data.nachname && 
          (data.vorname !== oldUser.vorname || data.nachname !== oldUser.nachname)) {
        data.username = this.generateUsername(data.vorname, data.nachname, id);
      }
      
      this.users[index] = { ...this.users[index], ...data };
      this.saveUsers();
      return this.users[index];
    }
    return null;
  }

  // Benutzer löschen
  deleteUser(id) {
    this.users = this.users.filter(u => u.id !== id);
    this.saveUsers();
  }

  // Benutzer nach ID abrufen
  getUser(id) {
    return this.users.find(u => u.id === id);
  }

  // Alle Insassen abrufen
  getInsassen() {
    return this.users.filter(u => u.type === 'insasse')
      .sort((a, b) => a.nachname.localeCompare(b.nachname));
  }

  // Alle Mitarbeiter abrufen
  getMitarbeiter() {
    return this.users.filter(u => u.type === 'mitarbeiter')
      .sort((a, b) => a.nachname.localeCompare(b.nachname));
  }

  // Hilfsfunktion: Normalisiert Haus-ID (jva1 -> haus1)
  _normalisiereHausId(hausId) {
    if (!hausId) return hausId;
    return hausId.replace('jva', 'haus');
  }

  // Hilfsfunktion: Prüft ob Haus-ID in Array enthalten ist (kompatibel mit jva/haus)
  _hausIdInArray(hausId, hausArray) {
    if (!hausId || !hausArray) return false;
    const normalisiert = this._normalisiereHausId(hausId);
    return hausArray.some(h => this._normalisiereHausId(h) === normalisiert);
  }

  // Prüfen ob Hausleitung existiert
  hasJvaLeitung(hausId) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.some(u => 
      u.type === 'mitarbeiter' && 
      (u.rolle === 'jva-leitung' || u.rolle === 'haus-leitung') && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert)
    );
  }

  // Prüfen ob Stationsleitung existiert
  hasStationsleitung(hausId, stationId) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.some(u => 
      u.type === 'mitarbeiter' && 
      u.rolle === 'stationsleitung' && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert) &&
      u.station === stationId
    );
  }

  // Hausleitung für ein Haus abrufen (für Validierung beim Bearbeiten)
  getJvaLeitung(hausId, excludeUserId = null) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.find(u => 
      u.type === 'mitarbeiter' && 
      (u.rolle === 'jva-leitung' || u.rolle === 'haus-leitung') && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert) &&
      u.id !== excludeUserId
    );
  }

  // Stationsleitung für eine Station abrufen (für Validierung beim Bearbeiten)
  getStationsleitung(hausId, stationId, excludeUserId = null) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.find(u => 
      u.type === 'mitarbeiter' && 
      u.rolle === 'stationsleitung' && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert) &&
      u.station === stationId &&
      u.id !== excludeUserId
    );
  }
}

// Globale User-Instanz
const userSystem = new UserSystem();

// ============================================
// BENACHRICHTIGUNGSSYSTEM
// ============================================

class NotificationSystem {
  constructor() {
    this.storageKey = 'gefaengnis_notifications';
    this.notifications = this.loadNotifications();
  }

  loadNotifications() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveNotifications() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
  }

  generateId() {
    return 'NOT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Benachrichtigung erstellen
  createNotification(userId, type, title, message, antragId = null) {
    const notification = {
      id: this.generateId(),
      userId: userId,
      type: type, // 'genehmigt', 'abgelehnt', 'zurueckgegeben', 'info'
      title: title,
      message: message,
      antragId: antragId,
      gelesen: false,
      erstelltAm: new Date().toISOString()
    };
    this.notifications.push(notification);
    this.saveNotifications();
    return notification;
  }

  // Ungelesene Benachrichtigungen für einen Benutzer
  getUngeleseneNotifications(userId) {
    return this.notifications.filter(n => 
      n.userId === userId && !n.gelesen
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Alle Benachrichtigungen für einen Benutzer
  getAllNotifications(userId) {
    return this.notifications.filter(n => 
      n.userId === userId
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Benachrichtigung als gelesen markieren
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.gelesen = true;
      this.saveNotifications();
    }
  }

  // Alle Benachrichtigungen eines Benutzers als gelesen markieren
  markAllAsRead(userId) {
    let changed = false;
    this.notifications.forEach(n => {
      if (n.userId === userId && !n.gelesen) {
        n.gelesen = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveNotifications();
    }
  }

  // Anzahl ungelesener Benachrichtigungen
  getUnreadCount(userId) {
    return this.notifications.filter(n => n.userId === userId && !n.gelesen).length;
  }
}

const notificationSystem = new NotificationSystem();

// ============================================
// SESSION-MANAGEMENT
// ============================================

class SessionManager {
  constructor() {
    this.sessionKey = 'gefaengnis_session';
  }

  // Login für Insassen oder Mitarbeiter
  login(username, password, expectedType = null) {
    const user = userSystem.users.find(u => 
      u.username === username && 
      u.password === password &&
      (expectedType === null || u.type === expectedType)
    );
    
    if (user) {
      const session = {
        userId: user.id,
        type: user.type,
        username: user.username,
        name: `${user.vorname} ${user.nachname}`,
        jva: user.jva,
        station: user.station,
        rolle: user.rolle || null,
        jvas: user.jvas || null,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, message: 'Ungültige Zugangsdaten' };
  }

  logout() {
    sessionStorage.removeItem(this.sessionKey);
  }

  getSession() {
    const data = sessionStorage.getItem(this.sessionKey);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn() {
    return this.getSession() !== null;
  }

  isInsasse() {
    const session = this.getSession();
    return session && session.type === 'insasse';
  }

  isMitarbeiter() {
    const session = this.getSession();
    return session && session.type === 'mitarbeiter';
  }
}

const sessionManager = new SessionManager();

// ============================================
// AKTIVITÄTEN-/VERLAUFSSYSTEM
// ============================================

class AktivitaetenSystem {
  constructor() {
    this.storageKey = 'gefaengnis_aktivitaeten';
    this.aktivitaeten = this.loadAktivitaeten();
  }

  loadAktivitaeten() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveAktivitaeten() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.aktivitaeten));
  }

  generateId() {
    return 'AKT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Aktivität protokollieren
  logAktivitaet(data) {
    const aktivitaet = {
      id: this.generateId(),
      antragId: data.antragId,
      typ: data.typ, // 'erstellt', 'genommen', 'entscheidung', 'aufgabe-erstellt', 'aufgabe-erledigt', 'persoenlich-eroeffnet'
      beschreibung: data.beschreibung,
      details: data.details || null,
      benutzerTyp: data.benutzerTyp, // 'insasse' oder 'mitarbeiter'
      benutzerId: data.benutzerId,
      benutzerName: data.benutzerName,
      erstelltAm: new Date().toISOString()
    };
    this.aktivitaeten.push(aktivitaet);
    this.saveAktivitaeten();
    return aktivitaet;
  }

  // Alle Aktivitäten zu einem Antrag (chronologisch sortiert)
  getAktivitaetenZuAntrag(antragId) {
    return this.aktivitaeten
      .filter(a => a.antragId === antragId)
      .sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }
  
  // Alle Mitarbeiter-IDs, die an einem Antrag gearbeitet haben
  getBeteiligteMitarbeiter(antragId) {
    const mitarbeiterIds = new Set();
    this.aktivitaeten
      .filter(a => a.antragId === antragId && a.benutzerTyp === 'mitarbeiter')
      .forEach(a => mitarbeiterIds.add(a.benutzerId));
    return Array.from(mitarbeiterIds);
  }
  
  // Prüft ob ein Mitarbeiter an einem Antrag beteiligt war
  istMitarbeiterBeteiligt(antragId, mitarbeiterId) {
    return this.aktivitaeten.some(a => 
      a.antragId === antragId && 
      a.benutzerTyp === 'mitarbeiter' && 
      a.benutzerId === mitarbeiterId
    );
  }
}

const aktivitaetenSystem = new AktivitaetenSystem();

// ============================================
// TERMINSYSTEM
// ============================================

class TerminSystem {
  constructor() {
    this.storageKey = 'gefaengnis_termine';
    this.termine = this.loadTermine();
  }

  loadTermine() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveTermine() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.termine));
  }

  generateId() {
    return 'TRM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Termin erstellen
  createTermin(data) {
    const termin = {
      id: this.generateId(),
      titel: data.titel,
      beschreibung: data.beschreibung || '',
      datum: data.datum,
      uhrzeit: data.uhrzeit || null,
      typ: data.typ, // 'admin', 'persoenlich', 'aufgabe', 'haus', 'station'
      erstelltVonId: data.erstelltVonId,
      erstelltVonName: data.erstelltVonName,
      // Für Sichtbarkeit
      hausId: data.hausId || null,
      stationId: data.stationId || null,
      // Für Aufgaben-Termine
      aufgabeId: data.aufgabeId || null,
      antragId: data.antragId || null,
      sichtbarFuer: data.sichtbarFuer || [], // Array von User-IDs für spezielle Sichtbarkeit
      erstelltAm: new Date().toISOString()
    };
    this.termine.push(termin);
    this.saveTermine();
    return termin;
  }

  // Termin aktualisieren
  updateTermin(id, data) {
    const index = this.termine.findIndex(t => t.id === id);
    if (index !== -1) {
      this.termine[index] = { ...this.termine[index], ...data };
      this.saveTermine();
      return this.termine[index];
    }
    return null;
  }

  // Termin löschen
  deleteTermin(id) {
    const index = this.termine.findIndex(t => t.id === id);
    if (index !== -1) {
      this.termine.splice(index, 1);
      this.saveTermine();
      return true;
    }
    return false;
  }

  // Termine für einen Mitarbeiter abrufen (basierend auf Sichtbarkeit)
  getTermineFuerMitarbeiter(mitarbeiter) {
    return this.termine.filter(t => {
      // Admin-Termine: Für alle sichtbar
      if (t.typ === 'admin') return true;
      
      // Persönliche Termine: Nur für den Ersteller
      if (t.typ === 'persoenlich') {
        return t.erstelltVonId === mitarbeiter.userId;
      }
      
      // Aufgaben-Termine: Für die in sichtbarFuer eingetragenen User
      if (t.typ === 'aufgabe') {
        return t.sichtbarFuer && t.sichtbarFuer.includes(mitarbeiter.userId);
      }
      
      // Haus-Termine: Für alle Mitarbeiter des Hauses (inkl. Ersteller)
      if (t.typ === 'haus') {
        // Ersteller sieht immer seinen eigenen Termin
        if (t.erstelltVonId === mitarbeiter.userId) return true;
        if (!mitarbeiter.jvas) return false;
        // Normalisierung für Kompatibilität
        const normalisiereHaus = (h) => h ? h.replace('jva', 'haus') : h;
        return mitarbeiter.jvas.some(j => normalisiereHaus(j) === normalisiereHaus(t.hausId));
      }
      
      // Stations-Termine: Für alle Mitarbeiter der Station (inkl. Ersteller)
      if (t.typ === 'station') {
        // Ersteller sieht immer seinen eigenen Termin
        if (t.erstelltVonId === mitarbeiter.userId) return true;
        if (!mitarbeiter.jvas) return false;
        const normalisiereHaus = (h) => h ? h.replace('jva', 'haus') : h;
        const imSelbenHaus = mitarbeiter.jvas.some(j => normalisiereHaus(j) === normalisiereHaus(t.hausId));
        const aufSelberStation = mitarbeiter.station === t.stationId;
        return imSelbenHaus && aufSelberStation;
      }
      
      return false;
    }).sort((a, b) => new Date(a.datum) - new Date(b.datum));
  }

  // Termine für einen bestimmten Monat
  getTermineFuerMonat(mitarbeiter, jahr, monat) {
    const termine = this.getTermineFuerMitarbeiter(mitarbeiter);
    return termine.filter(t => {
      const d = new Date(t.datum);
      return d.getFullYear() === jahr && d.getMonth() === monat;
    });
  }

  // Termine für einen bestimmten Tag
  getTermineFuerTag(mitarbeiter, datum) {
    const termine = this.getTermineFuerMitarbeiter(mitarbeiter);
    const tag = new Date(datum).toDateString();
    return termine.filter(t => new Date(t.datum).toDateString() === tag);
  }

  // Aufgaben-Termin erstellen (automatisch bei Aufgabe mit Frist)
  createAufgabenTermin(aufgabe) {
    if (!aufgabe.fristDatum) return null;
    
    // Prüfen ob bereits ein Termin für diese Aufgabe existiert
    const existierend = this.termine.find(t => t.aufgabeId === aufgabe.id);
    if (existierend) return existierend;
    
    return this.createTermin({
      titel: `📋 Aufgabe: ${aufgabe.beschreibung.substring(0, 50)}${aufgabe.beschreibung.length > 50 ? '...' : ''}`,
      beschreibung: aufgabe.beschreibung,
      datum: aufgabe.fristDatum,
      typ: 'aufgabe',
      erstelltVonId: aufgabe.erstelltVonId,
      erstelltVonName: aufgabe.erstelltVonName,
      aufgabeId: aufgabe.id,
      antragId: aufgabe.antragId,
      sichtbarFuer: [aufgabe.erstelltVonId, aufgabe.zugewiesenAnId]
    });
  }

  // Aufgaben-Termin löschen (wenn Aufgabe erledigt/gelöscht)
  deleteAufgabenTermin(aufgabeId) {
    const termin = this.termine.find(t => t.aufgabeId === aufgabeId);
    if (termin) {
      return this.deleteTermin(termin.id);
    }
    return false;
  }

  // Alle Admin-Termine abrufen (für Admin-Portal)
  getAlleAdminTermine() {
    return this.termine.filter(t => t.typ === 'admin')
      .sort((a, b) => new Date(a.datum) - new Date(b.datum));
  }
}

const terminSystem = new TerminSystem();

// ============================================
// AUFGABENSYSTEM
// ============================================

class AufgabenSystem {
  constructor() {
    this.storageKey = 'gefaengnis_aufgaben';
    this.aufgaben = this.loadAufgaben();
  }

  loadAufgaben() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveAufgaben() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.aufgaben));
  }

  generateId() {
    return 'AUF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Aufgabe erstellen
  createAufgabe(data) {
    const aufgabe = {
      id: this.generateId(),
      antragId: data.antragId,
      antragsNummer: data.antragsNummer,
      erstelltVonId: data.erstelltVonId,
      erstelltVonName: data.erstelltVonName,
      zugewiesenAnId: data.zugewiesenAnId,
      zugewiesenAnName: data.zugewiesenAnName,
      zugewiesenAnTyp: data.zugewiesenAnTyp, // 'insasse' oder 'mitarbeiter'
      beschreibung: data.beschreibung,
      anhangPdf: data.anhangPdf || null,
      fristDatum: data.fristDatum || null,
      letzteErinnerung: null,
      status: 'offen', // 'offen', 'erledigt', 'geloescht'
      loesung: null,
      erstelltAm: new Date().toISOString(),
      erledigtAm: null
    };
    this.aufgaben.push(aufgabe);
    this.saveAufgaben();
    
    // Aktivität protokollieren
    const zielTypText = data.zugewiesenAnTyp === 'insasse' ? 'Insasse' : 'Mitarbeiter';
    const fristText = data.fristDatum ? ` (Frist: ${new Date(data.fristDatum).toLocaleDateString('de-DE')})` : '';
    aktivitaetenSystem.logAktivitaet({
      antragId: data.antragId,
      typ: 'aufgabe-erstellt',
      beschreibung: `Aufgabe erstellt für ${zielTypText}: ${data.zugewiesenAnName}${fristText}`,
      details: { beschreibung: data.beschreibung, zugewiesenAn: data.zugewiesenAnName, frist: data.fristDatum },
      benutzerTyp: 'mitarbeiter',
      benutzerId: data.erstelltVonId,
      benutzerName: data.erstelltVonName
    });
    
    // Automatisch Termin erstellen, wenn Frist gesetzt (nur für Mitarbeiter-Aufgaben)
    if (data.fristDatum && data.zugewiesenAnTyp === 'mitarbeiter') {
      terminSystem.createAufgabenTermin(aufgabe);
    }
    
    return aufgabe;
  }

  // Aufgabe erledigen
  erledigeAufgabe(aufgabeId, loesung) {
    const aufgabe = this.aufgaben.find(a => a.id === aufgabeId);
    if (aufgabe) {
      aufgabe.status = 'erledigt';
      aufgabe.loesung = loesung;
      aufgabe.erledigtAm = new Date().toISOString();
      this.saveAufgaben();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: aufgabe.antragId,
        typ: 'aufgabe-erledigt',
        beschreibung: `Aufgabe erledigt`,
        details: { loesung: loesung },
        benutzerTyp: aufgabe.zugewiesenAnTyp,
        benutzerId: aufgabe.zugewiesenAnId,
        benutzerName: aufgabe.zugewiesenAnName
      });
    }
    return aufgabe;
  }

  // Aufgabe löschen (durch Ersteller)
  loescheAufgabe(aufgabeId, loeschenderId, loeschenderName) {
    const aufgabe = this.aufgaben.find(a => a.id === aufgabeId);
    if (aufgabe && aufgabe.erstelltVonId === loeschenderId) {
      aufgabe.status = 'geloescht';
      aufgabe.geloeschtAm = new Date().toISOString();
      this.saveAufgaben();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: aufgabe.antragId,
        typ: 'aufgabe-geloescht',
        beschreibung: `Aufgabe gelöscht`,
        details: { urspruenglicheAufgabe: aufgabe.beschreibung },
        benutzerTyp: 'mitarbeiter',
        benutzerId: loeschenderId,
        benutzerName: loeschenderName
      });
      
      return aufgabe;
    }
    return null;
  }

  // Überfällige Aufgaben prüfen und Erinnerungen senden
  pruefeUeberfaelligeAufgaben() {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    
    this.aufgaben.forEach(aufgabe => {
      if (aufgabe.status !== 'offen' || !aufgabe.fristDatum) return;
      
      const frist = new Date(aufgabe.fristDatum);
      frist.setHours(0, 0, 0, 0);
      
      // Prüfen ob Frist überschritten
      if (heute > frist) {
        // Prüfen ob heute schon eine Erinnerung gesendet wurde
        const letzteErinnerung = aufgabe.letzteErinnerung ? new Date(aufgabe.letzteErinnerung) : null;
        if (letzteErinnerung) {
          letzteErinnerung.setHours(0, 0, 0, 0);
        }
        
        if (!letzteErinnerung || letzteErinnerung < heute) {
          // Erinnerung an Bearbeiter senden
          notificationSystem.createNotification(
            aufgabe.zugewiesenAnId,
            'aufgabe-ueberfaellig',
            '⚠️ Aufgabe überfällig',
            `Die Aufgabe zum Antrag ${aufgabe.antragsNummer} ist überfällig (Frist: ${new Date(aufgabe.fristDatum).toLocaleDateString('de-DE')}).`,
            aufgabe.antragId
          );
          
          // Erinnerung an Ersteller senden
          notificationSystem.createNotification(
            aufgabe.erstelltVonId,
            'aufgabe-ueberfaellig',
            '⚠️ Aufgabe überfällig',
            `Ihre erstellte Aufgabe zum Antrag ${aufgabe.antragsNummer} ist noch nicht erledigt (Frist: ${new Date(aufgabe.fristDatum).toLocaleDateString('de-DE')}).`,
            aufgabe.antragId
          );
          
          aufgabe.letzteErinnerung = new Date().toISOString();
          this.saveAufgaben();
        }
      }
    });
  }

  // Offene Aufgaben für einen Benutzer
  getOffeneAufgaben(userId) {
    return this.aufgaben.filter(a => 
      a.zugewiesenAnId === userId && a.status === 'offen'
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Aufgaben die ein Benutzer erstellt hat (für Verwaltung)
  getErstellteAufgaben(userId) {
    return this.aufgaben.filter(a => 
      a.erstelltVonId === userId && a.status === 'offen'
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Alle Aufgaben für einen Benutzer
  getAlleAufgaben(userId) {
    return this.aufgaben.filter(a => 
      a.zugewiesenAnId === userId
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Aufgaben zu einem Antrag (ohne gelöschte)
  getAufgabenZuAntrag(antragId) {
    return this.aufgaben.filter(a => a.antragId === antragId && a.status !== 'geloescht');
  }

  getAufgabe(id) {
    return this.aufgaben.find(a => a.id === id);
  }
}

const aufgabenSystem = new AufgabenSystem();

// ============================================
// ANTRAGSSYSTEM
// ============================================

class AntragSystem {
  constructor() {
    this.storageKey = 'gefaengnis_antraege';
    this.counterKey = 'gefaengnis_antrag_counter';
    this.antraege = this.loadAntraege();
    this.migrateAntraege();
  }

  loadAntraege() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveAntraege() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.antraege));
  }

  // Migration: Bestehende Anträge mit neuen Feldern versehen
  migrateAntraege() {
    let changed = false;
    this.antraege.forEach(antrag => {
      // Status-Migration: 'in-bearbeitung' ohne Bearbeiter wird zu 'offen'
      if (antrag.status === 'in-bearbeitung' && !antrag.bearbeiterId) {
        antrag.status = 'offen';
        changed = true;
      }
      // Erledigte Anträge markieren
      if (['genehmigt', 'abgelehnt', 'zurueckgegeben', 'teilweise-genehmigt'].includes(antrag.status) && antrag.erledigt === undefined) {
        antrag.erledigt = (antrag.status !== 'zurueckgegeben');
        changed = true;
      }
      // Insassen-Nummer ergänzen (aus User-System holen)
      if (!antrag.insassenNummer && antrag.insasseId) {
        const insasse = userSystem.getUser(antrag.insasseId);
        if (insasse && insasse.insassenNummer) {
          antrag.insassenNummer = insasse.insassenNummer;
          changed = true;
        }
      }
      // Antrags-Nummer ergänzen
      if (!antrag.antragsNummer) {
        antrag.antragsNummer = this.generateAntragsNummer();
        changed = true;
      }
      // Insassen-Geburtsdatum ergänzen
      if (!antrag.insasseGeburtsdatum && antrag.insasseId) {
        const insasse = userSystem.getUser(antrag.insasseId);
        if (insasse && insasse.geburtsdatum) {
          antrag.insasseGeburtsdatum = insasse.geburtsdatum;
          changed = true;
        }
      }
      // JVA -> Haus Migration
      if (antrag.insasseJva && antrag.insasseJva.startsWith('jva')) {
        antrag.insasseJva = antrag.insasseJva.replace('jva', 'haus');
        changed = true;
      }
    });
    if (changed) {
      this.saveAntraege();
    }
  }

  generateId() {
    return 'ANT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Lesbare Antrags-Nummer generieren (z.B. "A-2024-0001")
  generateAntragsNummer() {
    const year = new Date().getFullYear();
    let counter = parseInt(localStorage.getItem(this.counterKey) || '0');
    counter++;
    localStorage.setItem(this.counterKey, counter.toString());
    return `A-${year}-${String(counter).padStart(4, '0')}`;
  }

  // Prüft ob bereits ein Teilhabegeld-Antrag für den gegebenen Monat existiert (nicht Entwurf)
  hatTeilhabegeldAntragFuerMonat(insasseId, monat) {
    if (!monat) return false;
    return this.antraege.some(a => 
      a.type === 'teilhabegeld' && 
      a.insasseId === insasseId && 
      a.monat === monat &&
      a.status !== 'entwurf' // Entwürfe zählen nicht
    );
  }

  // Antrag erstellen (mit Insassen-Daten)
  createAntrag(type, data, insasse, alsEntwurf = false) {
    // Insassen-Daten aus dem User-System holen
    const insasseUser = userSystem.getUser(insasse.userId);
    const insassenNummer = insasseUser ? insasseUser.insassenNummer : null;
    const insasseGeburtsdatum = insasseUser ? insasseUser.geburtsdatum : null;
    
    const antrag = {
      id: this.generateId(),
      antragsNummer: this.generateAntragsNummer(),
      type: type,
      status: alsEntwurf ? 'entwurf' : 'offen',
      insasseId: insasse.userId,
      insassenNummer: insassenNummer,
      insasseName: insasse.name,
      insasseGeburtsdatum: insasseGeburtsdatum,
      insasseJva: insasse.jva,
      insasseStation: insasse.station,
      bearbeiterId: null,
      bearbeiterName: null,
      erstelltAm: new Date().toISOString(),
      bearbeitetAm: null,
      begruendung: null,
      erledigt: false,
      ...data
    };
    this.antraege.push(antrag);
    this.saveAntraege();
    
    // Aktivität protokollieren
    if (!alsEntwurf) {
      const typeText = type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
      aktivitaetenSystem.logAktivitaet({
        antragId: antrag.id,
        typ: 'erstellt',
        beschreibung: `Antrag "${typeText}" eingereicht`,
        benutzerTyp: 'insasse',
        benutzerId: insasse.userId,
        benutzerName: insasse.name
      });
    }
    
    return antrag;
  }

  // Entwurf aktualisieren
  updateEntwurf(id, data) {
    const antrag = this.antraege.find(a => a.id === id && a.status === 'entwurf');
    if (antrag) {
      Object.assign(antrag, data);
      this.saveAntraege();
      return antrag;
    }
    return null;
  }

  // Entwurf einreichen
  submitEntwurf(id) {
    const antrag = this.antraege.find(a => a.id === id && a.status === 'entwurf');
    if (antrag) {
      antrag.status = 'offen';
      antrag.erstelltAm = new Date().toISOString();
      this.saveAntraege();
      
      // Aktivität protokollieren
      const typeText = antrag.type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'erstellt',
        beschreibung: `Antrag "${typeText}" eingereicht (aus Entwurf)`,
        benutzerTyp: 'insasse',
        benutzerId: antrag.insasseId,
        benutzerName: antrag.insasseName
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag "nehmen" - einem Mitarbeiter zuweisen
  nehmeAntrag(antragId, mitarbeiter) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.status === 'offen') {
      antrag.status = 'in-bearbeitung';
      antrag.bearbeiterId = mitarbeiter.userId;
      antrag.bearbeiterName = mitarbeiter.name;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'genommen',
        beschreibung: 'Antrag zur Bearbeitung übernommen',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiter.userId,
        benutzerName: mitarbeiter.name
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag übernehmen (von anderem Bearbeiter zurückholen)
  uebernehmeAntrag(antragId, mitarbeiter, grund = null) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.status === 'in-bearbeitung') {
      const alterBearbeiter = antrag.bearbeiterName;
      antrag.bearbeiterId = mitarbeiter.userId;
      antrag.bearbeiterName = mitarbeiter.name;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'uebernommen',
        beschreibung: `Antrag übernommen von ${alterBearbeiter}`,
        details: grund ? { grund: grund } : null,
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiter.userId,
        benutzerName: mitarbeiter.name
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag als sachlich/fachlich geprüft markieren
  markiereAlsGeprueft(antragId, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.status === 'in-bearbeitung') {
      antrag.sachlichGeprueft = true;
      antrag.sachlichGeprueftAm = new Date().toISOString();
      antrag.sachlichGeprueftVon = mitarbeiterName;
      antrag.sachlichGeprueftVonId = mitarbeiterId;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'sachlich-geprueft',
        beschreibung: 'Antrag sachlich/fachlich geprüft',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag abschließen (genehmigen, ablehnen, teilweise genehmigen)
  abschliessenAntrag(id, status, begruendung = null, persoenlichEroeffnen = false, bescheidPdf = null) {
    const antrag = this.antraege.find(a => a.id === id);
    if (antrag) {
      const bearbeiterId = antrag.bearbeiterId;
      const bearbeiterName = antrag.bearbeiterName;
      
      // Bescheid speichern wenn vorhanden
      if (bescheidPdf) {
        antrag.bescheidPdf = bescheidPdf;
      }
      
      // Wenn "persönlich eröffnen" gewählt wurde
      if (persoenlichEroeffnen) {
        antrag.wartetAufEroeffnung = true;
        antrag.geplantesErgebnis = status;
        antrag.geplanteBegruendung = begruendung;
        // Status bleibt "in-bearbeitung" für den Insassen
        this.saveAntraege();
        
        // Aktivität protokollieren
        const statusText = status === 'genehmigt' ? 'Genehmigung' : 
                          status === 'abgelehnt' ? 'Ablehnung' : 'Teilweise Genehmigung';
        aktivitaetenSystem.logAktivitaet({
          antragId: id,
          typ: 'entscheidung-geplant',
          beschreibung: `${statusText} vorbereitet (persönliche Eröffnung)`,
          details: begruendung ? { begruendung: begruendung } : null,
          benutzerTyp: 'mitarbeiter',
          benutzerId: bearbeiterId,
          benutzerName: bearbeiterName
        });
        
        return antrag;
      }
      
      antrag.status = status;
      antrag.bearbeitetAm = new Date().toISOString();
      antrag.erledigt = true;
      antrag.wartetAufEroeffnung = false;
      if (begruendung) {
        antrag.begruendung = begruendung;
      }
      this.saveAntraege();

      // Aktivität protokollieren
      const statusText = status === 'genehmigt' ? 'Genehmigt' : 
                        status === 'abgelehnt' ? 'Abgelehnt' : 'Teilweise genehmigt';
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'entscheidung',
        beschreibung: `Entscheidung: ${statusText}`,
        details: begruendung ? { begruendung: begruendung } : null,
        benutzerTyp: 'mitarbeiter',
        benutzerId: bearbeiterId,
        benutzerName: bearbeiterName
      });

      // Benachrichtigung für den Insassen erstellen
      const antragsTyp = antrag.type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
      let title, message;
      
      if (status === 'genehmigt') {
        title = '✓ Antrag genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde genehmigt.`;
      } else if (status === 'abgelehnt') {
        title = '✕ Antrag abgelehnt';
        message = `Ihr Antrag "${antragsTyp}" wurde leider abgelehnt.${begruendung ? ' Begründung: ' + begruendung : ''}`;
      } else if (status === 'teilweise-genehmigt') {
        title = '⚡ Antrag teilweise genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde teilweise genehmigt.${begruendung ? ' Hinweis: ' + begruendung : ''}`;
      }
      
      if (title && antrag.insasseId) {
        notificationSystem.createNotification(antrag.insasseId, status, title, message, antrag.id);
      }
    }
    return antrag;
  }

  // Persönliche Eröffnung bestätigen
  bestaetigePersoenlicheEroeffnung(id) {
    const antrag = this.antraege.find(a => a.id === id && a.wartetAufEroeffnung);
    if (antrag) {
      const status = antrag.geplantesErgebnis;
      const begruendung = antrag.geplanteBegruendung;
      const bearbeiterId = antrag.bearbeiterId;
      const bearbeiterName = antrag.bearbeiterName;
      
      antrag.status = status;
      antrag.bearbeitetAm = new Date().toISOString();
      antrag.erledigt = (status !== 'teilweise-genehmigt');
      antrag.wartetAufEroeffnung = false;
      antrag.persoenlichEroeffnet = true;
      if (begruendung) {
        antrag.begruendung = begruendung;
      }
      // Bei Teilweise genehmigt: Antrag wieder offen für Bearbeitung durch Insassen
      if (status === 'teilweise-genehmigt') {
        antrag.bearbeiterId = null;
        antrag.bearbeiterName = null;
      }
      
      // Geplante Felder löschen
      delete antrag.geplantesErgebnis;
      delete antrag.geplanteBegruendung;
      
      this.saveAntraege();
      
      // Aktivität protokollieren
      const statusText = status === 'genehmigt' ? 'Genehmigt' : 
                        status === 'abgelehnt' ? 'Abgelehnt' : 'Teilweise genehmigt';
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'persoenlich-eroeffnet',
        beschreibung: `Persönliche Eröffnung: ${statusText}`,
        details: begruendung ? { begruendung: begruendung } : null,
        benutzerTyp: 'mitarbeiter',
        benutzerId: bearbeiterId,
        benutzerName: bearbeiterName
      });
    }
    return antrag;
  }

  // Anträge die auf persönliche Eröffnung warten
  getWartendeEroeffnungen(mitarbeiterId) {
    return this.antraege.filter(a => 
      a.wartetAufEroeffnung && a.bearbeiterId === mitarbeiterId
    ).sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }

  // Antrag neu einreichen (nach Zurückgabe)
  updateAntragMonat(id, monat) {
    const antrag = this.antraege.find(a => a.id === id);
    if (antrag) {
      antrag.monat = monat;
      antrag.status = 'offen';
      antrag.begruendung = null;
      antrag.bearbeitetAm = null;
      antrag.bearbeiterId = null;
      antrag.bearbeiterName = null;
      antrag.erledigt = false;
      this.saveAntraege();
    }
    return antrag;
  }

  updateAntragEigentum(id, aktion, kleidung) {
    const antrag = this.antraege.find(a => a.id === id);
    if (antrag) {
      antrag.aktion = aktion;
      antrag.kleidung = kleidung;
      antrag.status = 'offen';
      antrag.begruendung = null;
      antrag.bearbeitetAm = null;
      antrag.bearbeiterId = null;
      antrag.bearbeiterName = null;
      antrag.erledigt = false;
      this.saveAntraege();
    }
    return antrag;
  }

  deleteAntrag(id) {
    this.antraege = this.antraege.filter(a => a.id !== id);
    this.saveAntraege();
  }

  getAntrag(id) {
    return this.antraege.find(a => a.id === id);
  }

  // ====== INSASSEN-FUNKTIONEN ======

  // Entwürfe eines bestimmten Insassen
  getEntwuerfeInsasse(insasseId) {
    return this.antraege.filter(a => 
      a.insasseId === insasseId &&
      a.status === 'entwurf'
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Aktive Anträge eines bestimmten Insassen (ohne Entwürfe)
  getAktiveAntraegeInsasse(insasseId) {
    return this.antraege.filter(a => 
      a.insasseId === insasseId &&
      (a.status === 'offen' || a.status === 'in-bearbeitung')
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Historie eines bestimmten Insassen
  getHistorieInsasse(insasseId) {
    return this.antraege.filter(a => 
      a.insasseId === insasseId &&
      a.erledigt === true
    ).sort((a, b) => new Date(b.bearbeitetAm) - new Date(a.bearbeitetAm));
  }

  // ====== MITARBEITER-FUNKTIONEN ======

  // Hilfsfunktion: Prüft ob Haus/JVA übereinstimmt (kompatibel mit beiden Formaten)
  _matchesHaus(mitarbeiterJvas, antragJva) {
    if (!mitarbeiterJvas || !antragJva) return false;
    
    // Normalisiere beide Werte (jva1 <-> haus1)
    const normalisiereHaus = (val) => {
      if (!val) return val;
      return val.replace('jva', 'haus');
    };
    
    const antragHausNormalisiert = normalisiereHaus(antragJva);
    return mitarbeiterJvas.some(j => normalisiereHaus(j) === antragHausNormalisiert);
  }

  // Offene Anträge für Mitarbeiter (basierend auf Haus/Station)
  getOffeneAntraegeMitarbeiter(mitarbeiter) {
    return this.antraege.filter(a => {
      if (a.status !== 'offen') return false;
      
      // Hausleitung sieht alle Anträge ihres Hauses
      if (mitarbeiter.rolle === 'jva-leitung' || mitarbeiter.rolle === 'haus-leitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva);
      }
      
      // Mitarbeiter und Stationsleitung sehen nur ihre Station
      return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
             a.insasseStation === mitarbeiter.station;
    }).sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }

  // In Bearbeitung befindliche Anträge (inkl. entschiedene aber nicht veraktete)
  getInBearbeitungAntraege(mitarbeiter) {
    return this.antraege.filter(a => {
      // Anträge in Bearbeitung ODER entschieden aber noch nicht veraktet
      const istInBearbeitung = a.status === 'in-bearbeitung';
      const istEntschiedenNichtVeraktet = a.erledigt && !a.veraktet;
      
      if (!istInBearbeitung && !istEntschiedenNichtVeraktet) return false;
      
      // Prüfen ob Mitarbeiter berechtigt ist (Bearbeiter, Aufgaben-Beteiligter oder hat bereits am Antrag gearbeitet)
      const istBearbeiter = a.bearbeiterId === mitarbeiter.userId;
      const aufgabenZuAntrag = aufgabenSystem.getAufgabenZuAntrag(a.id);
      // Aufgabenkette: Jeder der eine Aufgabe erstellt oder erhalten hat, hat Zugriff
      const hatAufgabeErhalten = aufgabenZuAntrag.some(auf => auf.zugewiesenAnId === mitarbeiter.userId);
      const hatAufgabeErstellt = aufgabenZuAntrag.some(auf => auf.erstelltVonId === mitarbeiter.userId);
      // Aktivitätsbezug: Jeder der bereits eine Aktion am Antrag durchgeführt hat
      const hatAmAntragGearbeitet = aktivitaetenSystem.istMitarbeiterBeteiligt(a.id, mitarbeiter.userId);
      const hatAufgabenbezug = hatAufgabeErhalten || hatAufgabeErstellt || hatAmAntragGearbeitet;
      
      // Hausleitung sieht alle "in Bearbeitung" Anträge ihres Hauses
      if (mitarbeiter.rolle === 'jva-leitung' || mitarbeiter.rolle === 'haus-leitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva);
      }
      
      // Stationsleitung sieht alle "in Bearbeitung" Anträge ihrer Station
      if (mitarbeiter.rolle === 'stationsleitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
               a.insasseStation === mitarbeiter.station;
      }
      
      // Normale Mitarbeiter sehen ihre persönlich bearbeiteten Anträge ODER Anträge mit Aufgabenbezug
      return istBearbeiter || hatAufgabenbezug;
    }).sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }

  // Historie für Mitarbeiter (nur veraktete Anträge)
  getHistorieMitarbeiter(mitarbeiter) {
    return this.antraege.filter(a => {
      // Nur veraktete Anträge in der Historie
      if (!a.veraktet) return false;
      
      // Hausleitung sieht alle verakteten Anträge ihres Hauses
      if (mitarbeiter.rolle === 'jva-leitung' || mitarbeiter.rolle === 'haus-leitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva);
      }
      
      // Stationsleitung sieht alle verakteten Anträge ihrer Station
      if (mitarbeiter.rolle === 'stationsleitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
               a.insasseStation === mitarbeiter.station;
      }
      
      // Normale Mitarbeiter sehen ihre persönlich bearbeiteten Anträge
      // ODER Anträge, zu denen sie eine Aufgabe hatten oder an denen sie gearbeitet haben
      const istBearbeiter = a.bearbeiterId === mitarbeiter.userId;
      const aufgabenZuAntrag = aufgabenSystem.getAufgabenZuAntrag(a.id);
      const hatteAufgabe = aufgabenZuAntrag.some(auf => 
        auf.zugewiesenAnId === mitarbeiter.userId || auf.erstelltVonId === mitarbeiter.userId
      );
      const hatAmAntragGearbeitet = aktivitaetenSystem.istMitarbeiterBeteiligt(a.id, mitarbeiter.userId);
      
      return istBearbeiter || hatteAufgabe || hatAmAntragGearbeitet;
    }).sort((a, b) => new Date(b.veraktetAm || b.bearbeitetAm) - new Date(a.veraktetAm || a.bearbeitetAm));
  }

  // Antrag verakten
  verakteAntrag(antragId, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      antrag.veraktet = true;
      antrag.veraktetAm = new Date().toISOString();
      antrag.veraktetVon = mitarbeiterName;
      antrag.veraktetVonId = mitarbeiterId;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'veraktet',
        beschreibung: 'Antrag veraktet',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag als vollzogen markieren
  markiereAlsVollzogen(antragId, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.erledigt) {
      antrag.vollzogen = true;
      antrag.vollzogenAm = new Date().toISOString();
      antrag.vollzogenVon = mitarbeiterName;
      antrag.vollzogenVonId = mitarbeiterId;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'vollzogen',
        beschreibung: 'Antrag vollzogen',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });
      
      return antrag;
    }
    return null;
  }
}

// Globale Instanz
const antragSystem = new AntragSystem();

// ============================================
// HILFSFUNKTIONEN
// ============================================

function formatDate(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateOnly(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
}

function formatMonat(monat) {
  const [year, month] = monat.split('-');
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function getStatusText(status) {
  const statusTexts = {
    'entwurf': 'Entwurf',
    'offen': 'Offen',
    'in-bearbeitung': 'In Bearbeitung',
    'genehmigt': 'Genehmigt',
    'abgelehnt': 'Abgelehnt',
    'teilweise-genehmigt': 'Teilweise genehmigt'
  };
  return statusTexts[status] || status;
}

function getStatusIcon(status) {
  const icons = {
    'entwurf': '📝',
    'offen': '📄',
    'in-bearbeitung': '⏳',
    'genehmigt': '✓',
    'abgelehnt': '✕',
    'teilweise-genehmigt': '⚡'
  };
  return icons[status] || '•';
}

function getHausName(hausKey) {
  // Kompatibilität: jva1 -> haus1
  const mappedKey = hausKey?.replace('jva', 'haus') || hausKey;
  return HAUS_CONFIG[mappedKey]?.name || hausKey?.replace('jva', 'Haus ').replace('haus', 'Haus ') || hausKey;
}

// Alias für Kompatibilität
function getJvaName(jvaKey) {
  return getHausName(jvaKey);
}

function getRolleText(rolle) {
  const rollen = {
    'mitarbeiter': 'Mitarbeiter',
    'jva-leitung': 'Hausleitung',
    'haus-leitung': 'Hausleitung',
    'stationsleitung': 'Stationsleitung'
  };
  return rollen[rolle] || rolle;
}

// Modal-Funktionen
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Klick außerhalb Modal schließt es
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Escape-Taste schließt Modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// HTML escapen
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
