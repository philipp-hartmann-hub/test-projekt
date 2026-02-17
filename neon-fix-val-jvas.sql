-- ============================================
-- Neon: VAL/Hausleitung-Benutzer mit leerem jvas reparieren
-- ============================================
--
-- Wenn VAL die Anträge ihres Hauses nicht sieht, fehlen oft die Häuser (jvas)
-- im User-Datensatz – z.B. wenn der User im Admin angelegt wurde, ohne
-- Häuser zuzuordnen.
--
-- Dieses Skript setzt für alle User mit Rolle 'hausleitung' oder 'val'
-- und leerem jvas ein Standard-jvas (Haus 1 + Haus 2). Passe die Werte
-- bei Bedarf an.
--
-- Im Neon SQL Editor ausführen: https://console.neon.tech → Projekt → SQL Editor
--
-- ============================================

-- Zeige betroffene User (nur zur Kontrolle)
SELECT id, data->>'username' AS username, data->>'rolle' AS rolle,
       data->'jvas' AS jvas_vorher
FROM users
WHERE data->>'rolle' IN ('hausleitung', 'haus-leitung', 'jva-leitung', 'val')
  AND (data->'jvas' IS NULL OR jsonb_array_length(COALESCE(data->'jvas', '[]'::jsonb)) = 0);

-- VAL/Hausleitung: jvas setzen wenn leer (Standard: Haus 1 + Haus 2)
UPDATE users
SET data = jsonb_set(
  data,
  '{jvas}',
  '[{"id":"haus1","name":"Haus 1"},{"id":"haus2","name":"Haus 2"}]'::jsonb
)
WHERE data->>'rolle' IN ('hausleitung', 'haus-leitung', 'jva-leitung', 'val')
  AND (data->'jvas' IS NULL OR jsonb_array_length(COALESCE(data->'jvas', '[]'::jsonb)) = 0);

-- Optional: Nur ein Haus zuweisen (z.B. nur haus1)
-- UPDATE users SET data = jsonb_set(data, '{jvas}', '[{"id":"haus1","name":"Haus 1"}]'::jsonb)
-- WHERE data->>'rolle' IN ('hausleitung', 'val') AND ...;

-- Kontrolle: User mit rolle und jvas anzeigen
SELECT id, data->>'username' AS username, data->>'rolle' AS rolle, data->'jvas' AS jvas
FROM users
WHERE data->>'rolle' IN ('hausleitung', 'haus-leitung', 'jva-leitung', 'val')
ORDER BY id;
