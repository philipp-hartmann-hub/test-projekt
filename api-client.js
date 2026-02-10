// ============================================
// API CLIENT - Ersetzt localStorage durch Server-Aufrufe
// ============================================

const API_BASE = window.location.origin + '/api';

// ============================================
// FETCH HELPER MIT ERROR HANDLING
// ============================================

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API-Fehler');
    }
    
    return data;
  } catch (error) {
    console.error(`API-Fehler bei ${endpoint}:`, error);
    throw error;
  }
}

// ============================================
// AUTHENTIFIZIERUNG
// ============================================

const AuthAPI = {
  async login(username, password, portalTyp) {
    return await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, portalTyp })
    });
  }
};

// ============================================
// BENUTZER API
// ============================================

const UserAPI = {
  async getAll() {
    return await apiCall('/users');
  },
  
  async create(user) {
    return await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },
  
  async update(id, user) {
    return await apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
  },
  
  async delete(id) {
    return await apiCall(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================
// ANTRÄGE API
// ============================================

const AntraegeAPI = {
  async getAll() {
    return await apiCall('/antraege');
  },
  
  async create(antrag) {
    return await apiCall('/antraege', {
      method: 'POST',
      body: JSON.stringify(antrag)
    });
  },
  
  async update(id, antrag) {
    return await apiCall(`/antraege/${id}`, {
      method: 'PUT',
      body: JSON.stringify(antrag)
    });
  },
  
  async delete(id) {
    return await apiCall(`/antraege/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================
// AUFGABEN API
// ============================================

const AufgabenAPI = {
  async getAll() {
    return await apiCall('/aufgaben');
  },
  
  async create(aufgabe) {
    return await apiCall('/aufgaben', {
      method: 'POST',
      body: JSON.stringify(aufgabe)
    });
  },
  
  async update(id, aufgabe) {
    return await apiCall(`/aufgaben/${id}`, {
      method: 'PUT',
      body: JSON.stringify(aufgabe)
    });
  },
  
  async delete(id) {
    return await apiCall(`/aufgaben/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================
// BENACHRICHTIGUNGEN API
// ============================================

const NotificationsAPI = {
  async getAll() {
    return await apiCall('/notifications');
  },
  
  async create(notification) {
    return await apiCall('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification)
    });
  },
  
  async markAsRead(id) {
    return await apiCall(`/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ gelesen: true })
    });
  }
};

// ============================================
// AKTIVITÄTEN API
// ============================================

const AktivitaetenAPI = {
  async getAll(antragId = null) {
    const query = antragId ? `?antragId=${antragId}` : '';
    return await apiCall(`/aktivitaeten${query}`);
  },
  
  async create(aktivitaet) {
    return await apiCall('/aktivitaeten', {
      method: 'POST',
      body: JSON.stringify(aktivitaet)
    });
  }
};

// ============================================
// TERMINE API
// ============================================

const TermineAPI = {
  async getAll() {
    return await apiCall('/termine');
  },
  
  async create(termin) {
    return await apiCall('/termine', {
      method: 'POST',
      body: JSON.stringify(termin)
    });
  },
  
  async update(id, termin) {
    return await apiCall(`/termine/${id}`, {
      method: 'PUT',
      body: JSON.stringify(termin)
    });
  },
  
  async delete(id) {
    return await apiCall(`/termine/${id}`, {
      method: 'DELETE'
    });
  }
};

// ============================================
// SYNCHRONISIERTER SPEICHER (Hybrid-Lösung)
// Lädt Daten vom Server, cacht lokal für Performance
// ============================================

class SyncedStorage {
  constructor() {
    this.cache = {
      users: null,
      antraege: null,
      aufgaben: null,
      notifications: null,
      aktivitaeten: null,
      termine: null
    };
    this.loaded = false;
  }
  
  async loadAll() {
    if (this.loaded) return;
    
    try {
      const [users, antraege, aufgaben, notifications, aktivitaeten, termine] = await Promise.all([
        UserAPI.getAll(),
        AntraegeAPI.getAll(),
        AufgabenAPI.getAll(),
        NotificationsAPI.getAll(),
        AktivitaetenAPI.getAll(),
        TermineAPI.getAll()
      ]);
      
      this.cache.users = users;
      this.cache.antraege = antraege;
      this.cache.aufgaben = aufgaben;
      this.cache.notifications = notifications;
      this.cache.aktivitaeten = aktivitaeten;
      this.cache.termine = termine;
      this.loaded = true;
      
      console.log('Alle Daten vom Server geladen');
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      throw error;
    }
  }
  
  async refresh(type = null) {
    if (type) {
      switch(type) {
        case 'users': this.cache.users = await UserAPI.getAll(); break;
        case 'antraege': this.cache.antraege = await AntraegeAPI.getAll(); break;
        case 'aufgaben': this.cache.aufgaben = await AufgabenAPI.getAll(); break;
        case 'notifications': this.cache.notifications = await NotificationsAPI.getAll(); break;
        case 'aktivitaeten': this.cache.aktivitaeten = await AktivitaetenAPI.getAll(); break;
        case 'termine': this.cache.termine = await TermineAPI.getAll(); break;
      }
    } else {
      this.loaded = false;
      await this.loadAll();
    }
  }
}

const syncedStorage = new SyncedStorage();

// Export für globale Nutzung
window.API = {
  Auth: AuthAPI,
  Users: UserAPI,
  Antraege: AntraegeAPI,
  Aufgaben: AufgabenAPI,
  Notifications: NotificationsAPI,
  Aktivitaeten: AktivitaetenAPI,
  Termine: TermineAPI,
  storage: syncedStorage
};

console.log('API-Client geladen');
