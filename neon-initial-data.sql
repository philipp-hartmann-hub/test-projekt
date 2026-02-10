-- ============================================
-- Initialdaten für Neon (Demo-Benutzer)
-- In Neon SQL Editor ausführen (Dashboard → SQL Editor)
-- ============================================
--
-- WICHTIG: Führe zuerst neon-schema.sql aus, bevor du dieses Skript ausführst!
--
-- Dieses Skript fügt die Demo-Benutzer ein, die für lokale Tests verwendet werden.
-- Die anderen Tabellen (antraege, aufgaben, notifications, aktivitaeten, termine) bleiben leer.
--
-- ============================================

-- Demo-Benutzer einfügen (nur wenn noch nicht vorhanden)
INSERT INTO users (id, data) VALUES
('admin-1', '{"id":"admin-1","username":"admin","password":"admin","name":"Administrator","rolle":"admin","jva":null,"jvas":[],"station":null,"geburtsdatum":null,"insassenNummer":null}'::jsonb),
('val-1', '{"id":"val-1","username":"val1","password":"val1","name":"Max Mustermann (VAL)","rolle":"hausleitung","jva":null,"jvas":[{"id":"haus1","name":"Haus 1"},{"id":"haus2","name":"Haus 2"}],"station":null,"geburtsdatum":null,"insassenNummer":null}'::jsonb),
('avd-1', '{"id":"avd-1","username":"avd1","password":"avd1","name":"Anna Schmidt (AVD)","rolle":"mitarbeiter","jva":null,"jvas":[{"id":"haus1","name":"Haus 1"}],"station":"Station 1","geburtsdatum":null,"insassenNummer":null}'::jsonb),
('avd-2', '{"id":"avd-2","username":"avd2","password":"avd2","name":"Peter Weber (AVD)","rolle":"mitarbeiter","jva":null,"jvas":[{"id":"haus2","name":"Haus 2"}],"station":"Station 2","geburtsdatum":null,"insassenNummer":null}'::jsonb),
('kammer-1', '{"id":"kammer-1","username":"kammer1","password":"kammer1","name":"Kammer Mitarbeiter","rolle":"kammer","jva":null,"jvas":[],"station":null,"geburtsdatum":null,"insassenNummer":null}'::jsonb),
('zahlstelle-1', '{"id":"zahlstelle-1","username":"zahlstelle1","password":"zahlstelle1","name":"Zahlstelle Mitarbeiter","rolle":"zahlstelle","jva":null,"jvas":[],"station":null,"geburtsdatum":null,"insassenNummer":null}'::jsonb),
('arbeit-1', '{"id":"arbeit-1","username":"arbeit1","password":"arbeit1","name":"Arbeitskoordination","rolle":"arbeitskoordination","jva":null,"jvas":[],"station":null,"geburtsdatum":null,"insassenNummer":null}'::jsonb),
('insasse-1', '{"id":"insasse-1","username":"insasse1","password":"insasse1","name":"Hans Mueller","rolle":"insasse","jva":"haus1","jvas":[],"station":"Station 1","geburtsdatum":"1985-03-15","insassenNummer":"INS-001"}'::jsonb),
('insasse-2', '{"id":"insasse-2","username":"insasse2","password":"insasse2","name":"Klaus Fischer","rolle":"insasse","jva":"haus2","jvas":[],"station":"Station 2","geburtsdatum":"1990-07-22","insassenNummer":"INS-002"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Prüfen ob Daten eingefügt wurden
SELECT COUNT(*) as anzahl_benutzer FROM users;

-- Alle Benutzer anzeigen (zur Kontrolle)
SELECT id, data->>'username' as username, data->>'name' as name, data->>'rolle' as rolle FROM users ORDER BY id;
