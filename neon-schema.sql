-- ============================================
-- PostgreSQL-Schema für Neon (JVA-Antragssystem)
-- ============================================
--
-- So führst du das Schema aus:
-- 1. Bei https://console.neon.tech anmelden und dein Projekt öffnen
-- 2. Links "SQL Editor" wählen
-- 3. Diesen gesamten Inhalt einfügen und "Run" klicken
-- 4. Prüfen: Unter "Tables" sollten users, antraege, aufgaben, notifications, aktivitaeten, termine erscheinen
--
-- ============================================

-- Users: id + vollständiges Objekt als JSONB (username, password, name, rolle, jva, jvas, station, geburtsdatum, insassenNummer)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users ((data->>'username'));

-- Anträge: id + vollständiges Objekt (antragsNummer, erstelltAm, kommentare, dokumente, …)
CREATE TABLE IF NOT EXISTS antraege (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);

-- Aufgaben: id + vollständiges Objekt (erstelltAm, status, anhangPdfs, antwortPdfs, …)
CREATE TABLE IF NOT EXISTS aufgaben (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);

-- Benachrichtigungen: id + vollständiges Objekt (erstelltAm, gelesen, antragId, …)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);

-- Aktivitäten: id + vollständiges Objekt (erstelltAm, antragId, …)
CREATE TABLE IF NOT EXISTS aktivitaeten (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_aktivitaeten_antragid ON aktivitaeten ((data->>'antragId'));

-- Termine: id + vollständiges Objekt (erstelltAm, datum, uhrzeit, antragId, aufgabeId, …)
CREATE TABLE IF NOT EXISTS termine (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_termine_datum ON termine ((data->>'datum'));
