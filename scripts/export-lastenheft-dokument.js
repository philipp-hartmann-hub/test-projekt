#!/usr/bin/env node
/**
 * Erzeugt ein lesbares HTML-Dokument aus LASTENHEFT.md:
 * - keine Code-/ASCII-Blöcke
 * - Mermaid-Diagramme als PNG
 * - Inline-Backticks entfernt (Fließtext)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'LASTENHEFT.md');
const OUT_DIR = path.join(ROOT, 'docs', 'export', 'lastenheft');
const IMG_DIR = path.join(OUT_DIR, 'images');

const ASCII_REPLACEMENTS = [
  {
    match: /Header \(immer\)[\s\S]*?③ antragDetailView/,
    html: `<div class="infobox"><p><strong>Navigation im Mitarbeiter-Portal:</strong> Unter dem gemeinsamen Header ist immer genau eine Hauptfläche sichtbar — entweder das Plattform-Dashboard (Hub), die Antrags-Übersicht (Listen) oder die Detailansicht eines einzelnen Antrags.</p></div>`,
  },
  {
    match: /┌─────────────────────────────────────────────────────────┐[\s\S]*?└─────────────────────────────────────────────────────────┘/,
    html: `<div class="infobox"><p><strong>Aufbau der Antragsübersicht:</strong> Oben ein Info-Banner zur Zuständigkeit, darunter drei Tabs (Gruppe / Meine / Erledigt), Listenkopf mit Sortierung, Themenfilter und darunter die Antragskarten.</p></div>`,
  },
  {
    match: /\[ ← Zurück zur Übersicht \][\s\S]*?└─────────────────────────────┴─────────────────────────┘/,
    html: `<div class="infobox"><p><strong>Aufbau der Antragsdetailansicht:</strong> Zurück-Link und Titelzeile, darunter die sechsstufige Prozessleiste (Eingang bis Abschluss). Links: Stammdaten, Anliegen, Aufgaben, Bescheid und phasenabhängige Aktionen. Rechts: Dokumente, Notizen und Bearbeitungsverlauf.</p></div>`,
  },
  {
    match: /Prozessleiste \(lesen\)[\s\S]*?└─ erledigt \/ nur Lesen/,
    html: `<table class="ux-table"><thead><tr><th>Situation</th><th>Aktion im Portal</th></tr></thead><tbody>
<tr><td>Noch kein Bearbeiter zuständig</td><td>Antrag übernehmen</td></tr>
<tr><td>Nur Aufgabe für mich, keine Hauptverantwortung</td><td>Aufgabe bearbeiten</td></tr>
<tr><td>Ich bin Hauptbearbeiter</td><td>Prüfung → Entscheidung → Eröffnung/Vollzug → Verakten; quer: Termin, Aufgabe erstellen</td></tr>
<tr><td>Erledigt / nur Lesen</td><td>Keine oder kaum Primäraktionen</td></tr>
</tbody></table>`,
  },
];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function stripInlineCode(text) {
  return text.replace(/`([^`]+)`/g, '$1');
}

function preprocessMarkdown(raw) {
  let md = raw;

  // Mermaid → Platzhalter (werden nach Rendering ersetzt)
  const mermaidBlocks = [];
  md = md.replace(/```mermaid\n([\s\S]*?)```/g, (_, body) => {
    const id = mermaidBlocks.length;
    mermaidBlocks.push(body.trim());
    return `\n\n{{MERMAID_${id}}}\n\n`;
  });

  // Übrige Codeblöcke entfernen / ersetzen
  md = md.replace(/```[\s\S]*?```/g, (block) => {
    for (const { match, html } of ASCII_REPLACEMENTS) {
      const inner = block.replace(/^```\w*\n?/, '').replace(/```$/, '');
      if (match.test(inner)) return `\n\n${html}\n\n`;
    }
    return '';
  });

  for (const { match, html } of ASCII_REPLACEMENTS) {
    md = md.replace(match, html);
  }

  md = stripInlineCode(md);

  // HTML-Blöcke für marked als raw html erhalten (marked gfm)
  return { md, mermaidBlocks };
}

function renderMermaidImages(blocks) {
  ensureDir(IMG_DIR);
  const titles = [
    'Sechs Phasen des Antragsprozesses',
    'Aufgabe bearbeiten (Mitarbeiter)',
    'Gesamtübersicht: Pools Insasse, Mitarbeiter, System',
  ];
  const files = [];
  blocks.forEach((content, i) => {
    const mmd = path.join(IMG_DIR, `diagram-${i + 1}.mmd`);
    const png = path.join(IMG_DIR, `diagram-${i + 1}.png`);
    fs.writeFileSync(mmd, content, 'utf8');
    try {
      execSync(
        `npx -y @mermaid-js/mermaid-cli@11.4.0 -i "${mmd}" -o "${png}" -b white -w 1200`,
        { cwd: ROOT, stdio: 'pipe', timeout: 120000 }
      );
      files.push({ png: `images/diagram-${i + 1}.png`, title: titles[i] || `Diagramm ${i + 1}` });
    } catch (e) {
      console.warn(`Mermaid-Rendering fehlgeschlagen für Diagramm ${i + 1}:`, e.message);
      files.push(null);
    }
  });
  return files;
}

function markdownToHtml(md) {
  const tmp = path.join(OUT_DIR, '_temp.md');
  fs.writeFileSync(tmp, md, 'utf8');
  try {
    const html = execSync(`npx -y marked@15.0.7 -i "${tmp}"`, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 60000,
    });
    return html;
  } finally {
    try {
      fs.unlinkSync(tmp);
    } catch (_) {}
  }
}

function injectMermaid(html, mermaidFiles) {
  let out = html;
  mermaidFiles.forEach((file, i) => {
    const placeholder = `{{MERMAID_${i}}}`;
    if (!file) {
      out = out.replace(`<p>${placeholder}</p>`, '');
      out = out.replace(placeholder, '');
      return;
    }
    const fig = `<figure class="diagram"><img src="${file.png}" alt="${file.title}" /><figcaption>${file.title}</figcaption></figure>`;
    out = out.replace(`<p>${placeholder}</p>`, fig);
    out = out.replace(placeholder, fig);
  });
  return out;
}

function wrapHtml(body) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lastenheft — Prototyp Justizvollzugsplattform</title>
  <style>
    body { font-family: "Segoe UI", Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.45; color: #1a1a1a; max-width: 210mm; margin: 0 auto; padding: 20mm 18mm; }
    h1 { font-size: 22pt; border-bottom: 2px solid #003366; padding-bottom: 8px; color: #003366; page-break-after: avoid; }
    h2 { font-size: 16pt; color: #003366; margin-top: 1.4em; page-break-after: avoid; }
    h3 { font-size: 13pt; color: #004080; margin-top: 1.2em; page-break-after: avoid; }
    h4 { font-size: 11.5pt; color: #333; page-break-after: avoid; }
    p { margin: 0.6em 0; text-align: justify; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; page-break-inside: avoid; }
    th, td { border: 1px solid #bbb; padding: 6px 8px; vertical-align: top; }
    th { background: #e8eef4; font-weight: 600; }
    tr:nth-child(even) td { background: #f9fafb; }
    ul, ol { margin: 0.5em 0 0.5em 1.2em; }
    li { margin: 0.25em 0; }
    hr { border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }
    blockquote { border-left: 4px solid #003366; margin: 1em 0; padding: 0.5em 1em; background: #f5f8fc; }
    .infobox { background: #f0f4f8; border: 1px solid #c5d3e0; border-radius: 4px; padding: 12px 14px; margin: 1em 0; page-break-inside: avoid; }
    .ux-table { font-size: 10pt; }
    figure.diagram { margin: 1.2em 0; text-align: center; page-break-inside: avoid; }
    figure.diagram img { max-width: 100%; height: auto; border: 1px solid #ddd; }
    figcaption { font-size: 9.5pt; color: #555; margin-top: 6px; font-style: italic; }
    strong { font-weight: 600; }
    @media print { body { padding: 12mm; } h2 { page-break-before: auto; } }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error('LASTENHEFT.md nicht gefunden:', SRC);
    process.exit(1);
  }

  ensureDir(OUT_DIR);
  const raw = fs.readFileSync(SRC, 'utf8');
  const { md, mermaidBlocks } = preprocessMarkdown(raw);

  console.log('Rendere', mermaidBlocks.length, 'Diagramme …');
  const mermaidFiles = renderMermaidImages(mermaidBlocks);

  console.log('Konvertiere Markdown → HTML …');
  let body = markdownToHtml(md);
  body = injectMermaid(body, mermaidFiles);

  const outHtml = path.join(OUT_DIR, 'LASTENHEFT.html');
  fs.writeFileSync(outHtml, wrapHtml(body), 'utf8');

  // Zusätzlich: bereinigtes Markdown (ohne Code) für Word/Pandoc
  let cleanMd = md;
  mermaidFiles.forEach((file, i) => {
    const repl = file
      ? `![${file.title}](${file.png.replace(/\\/g, '/')})`
      : '';
    cleanMd = cleanMd.replace(`{{MERMAID_${i}}}`, repl);
  });
  const outMd = path.join(OUT_DIR, 'LASTENHEFT-DOKUMENT.md');
  fs.writeFileSync(outMd, cleanMd, 'utf8');

  console.log('\nFertig:');
  console.log('  HTML:     ', outHtml);
  console.log('  Markdown: ', outMd);
  console.log('  Bilder:   ', IMG_DIR);
  console.log('\nWord öffnen: LASTENHEFT.html in Word öffnen → Speichern unter → .docx');
}

main();
