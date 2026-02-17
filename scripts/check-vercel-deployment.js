// Ruft die Vercel-API auf und zeigt die letzten Deployments + Status
const fs = require('fs');
const path = require('path');

function getToken() {
  if (process.env.VERCEL_ACCESS_TOKEN) return process.env.VERCEL_ACCESS_TOKEN;
  const p = path.join(process.env.APPDATA || '', 'com.vercel.cli', 'Data', 'auth.json');
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8')).token;
  } catch (_) {}
  return null;
}

const PROJECT_ID = 'prj_vokd1gBj2BelTEKf4Vw0emnasdgr';
const TEAM_ID = 'team_gxzJopNWO6SRputpsTdp8h6Y';

async function main() {
  const token = getToken();
  if (!token) {
    console.error('Vercel-Token nicht gefunden. Setze VERCEL_ACCESS_TOKEN oder melde dich mit vercel login an.');
    process.exit(1);
  }

  const url = `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=5`;
  const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
  if (!res.ok) {
    console.error('API-Fehler:', res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  const deployments = data.deployments || data || [];

  console.log('Letzte Vercel-Deployments:\n');
  if (deployments.length === 0) {
    console.log('Keine Deployments gefunden.');
    return;
  }
  for (const d of deployments) {
    const state = d.state || d.readyState || '?';
    const meta = d.meta || {};
    const commit = meta.githubCommitRef || meta.gitSource?.ref || meta.commitMessage || '-';
    const commitSha = meta.githubCommitSha || d.meta?.commitSha || '-';
    const createdAt = d.createdAt ? new Date(d.createdAt).toLocaleString('de-DE') : '-';
    console.log(`  State: ${state}`);
    console.log(`  URL:   ${d.url || '(noch nicht bereit)'}`);
    console.log(`  Commit: ${commitSha} ${commit}`);
    console.log(`  Erstellt: ${createdAt}`);
    console.log('  ---');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
