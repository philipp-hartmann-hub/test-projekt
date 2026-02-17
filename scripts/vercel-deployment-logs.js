/**
 * Holt Build-Events/Logs eines Vercel-Deployments (für Fehleranalyse).
 * Token aus VERCEL_ACCESS_TOKEN oder aus Vercel-CLI auth.json.
 */

const fs = require('fs');
const path = require('path');

function getToken() {
  if (process.env.VERCEL_ACCESS_TOKEN) return process.env.VERCEL_ACCESS_TOKEN;
  const authPath = process.platform === 'win32'
    ? path.join(process.env.APPDATA || '', 'com.vercel.cli', 'Data', 'auth.json')
    : path.join(process.env.HOME || '', '.local', 'share', 'com.vercel.cli', 'auth.json');
  try {
    const data = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    return data.token;
  } catch (e) {
    return null;
  }
}

async function main() {
  const token = getToken();
  if (!token) {
    console.error('Kein VERCEL_ACCESS_TOKEN und keine Vercel-CLI-Auth gefunden.');
    process.exit(1);
  }

  const projectId = 'prj_vokd1gBj2BelTEKf4Vw0emnasdgr';
  const teamId = 'team_gxzJopNWO6SRputpsTdp8h6Y';

  // 1) Letztes Deployment holen
  const listRes = await fetch(
    `https://api.vercel.com/v6/deployments?projectId=${projectId}&teamId=${teamId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!listRes.ok) {
    console.error('Deployments abrufen:', listRes.status, await listRes.text());
    process.exit(1);
  }
  const { deployments } = await listRes.json();
  const latest = deployments && deployments[0];
  if (!latest) {
    console.error('Keine Deployments gefunden.');
    process.exit(1);
  }

  console.log('Letztes Deployment:', latest.uid, '| State:', latest.state, '| Created:', new Date(latest.created).toISOString());
  if (latest.readyState) console.log('readyState:', latest.readyState);
  if (latest.errorMessage) console.log('errorMessage:', latest.errorMessage);
  if (latest.buildError) console.log('buildError:', latest.buildError);
  if (latest.meta?.githubCommitMessage) console.log('Commit:', latest.meta.githubCommitMessage);
  // Alle Felder die nach Fehler aussehen
  const errKeys = ['errorMessage', 'buildError', 'error', 'failureReason', 'message'];
  errKeys.forEach((k) => { if (latest[k]) console.log(k + ':', latest[k]); });
  console.log('');

  // 2) Vollständige Deployment-Details (kann mehr Fehlerinfos enthalten)
  const detailRes = await fetch(
    `https://api.vercel.com/v13/deployments/${latest.uid}?teamId=${teamId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (detailRes.ok) {
    const detail = await detailRes.json();
    if (detail.errorMessage) console.log('Detail errorMessage:', detail.errorMessage);
    if (detail.build?.error?.message) console.log('Build error:', detail.build.error.message);
    if (detail.functions) console.log('Functions:', JSON.stringify(detail.functions, null, 2).slice(0, 500));
  }

  // 3) Build-Events
  const eventsRes = await fetch(
    `https://api.vercel.com/v3/deployments/${latest.uid}/events?teamId=${teamId}&limit=200`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!eventsRes.ok) {
    console.error('Events abrufen:', eventsRes.status, await eventsRes.text());
    return;
  }
  const events = await eventsRes.json();
  if (!Array.isArray(events) || events.length === 0) {
    console.log('Keine Event-Logs verfügbar. Deployment (alle Felder):');
    console.log(JSON.stringify(latest, null, 2));
    return;
  }

  const lines = [];
  events.forEach((e) => {
    const t = e.text || e.payload?.text || e.message || JSON.stringify(e.payload || e);
    if (e.type === 'stdout' || e.type === 'stderr' || e.type === 'error' || t) lines.push({ type: e.type, text: t });
  });
  console.log('--- Build-Log ---');
  lines.forEach(({ type, text }) => {
    const prefix = type === 'stderr' || type === 'error' ? '[ERR] ' : '';
    console.log(prefix + String(text).trim());
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
