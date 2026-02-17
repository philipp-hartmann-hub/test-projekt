/**
 * Prüft per Vercel API, ob das Projekt mit einem Git-Repo verbunden ist.
 * Benötigt: VERCEL_ACCESS_TOKEN (von https://vercel.com/account/tokens)
 *
 * Aufruf: node scripts/check-vercel-git.js
 * Oder:   VERCEL_ACCESS_TOKEN=dein_token node scripts/check-vercel-git.js
 */

const PROJECT_NAME = process.env.VERCEL_PROJECT_NAME || 'test-projekt';

async function main() {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  if (!token) {
    console.error('FEHLER: VERCEL_ACCESS_TOKEN ist nicht gesetzt.');
    console.error('');
    console.error('So geht\'s:');
    console.error('  1. https://vercel.com/account/tokens öffnen');
    console.error('  2. Token erstellen (z.B. "Cursor Check")');
    console.error('  3. In der Konsole: set VERCEL_ACCESS_TOKEN=dein_token  (Windows)');
    console.error('     oder: export VERCEL_ACCESS_TOKEN=dein_token  (Mac/Linux)');
    console.error('  4. Dieses Script erneut ausführen.');
    process.exit(1);
  }

  const url = `https://api.vercel.com/v9/projects/${encodeURIComponent(PROJECT_NAME)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    console.error('API-Fehler:', res.status, res.statusText);
    const text = await res.text();
    if (text) console.error(text);
    process.exit(1);
  }

  const project = await res.json();

  // Vercel liefert oft "link" mit type + repo
  const link = project.link;
  const repo = link?.repo;
  const type = link?.type;

  console.log('Projekt:', project.name || project.id);
  console.log('');

  if (link && (repo || type)) {
    console.log('Git-Verbindung: JA');
    if (type) console.log('  Typ:    ', type);
    if (repo) console.log('  Repo:   ', repo);
    if (link.org) console.log('  Org:    ', link.org);
    if (link.createdAt) console.log('  Verknüpft:', link.createdAt);
  } else {
    console.log('Git-Verbindung: Keine Angabe in API-Antwort.');
    console.log('');
    console.log('Rohdaten (link):', JSON.stringify(project.link, null, 2));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
