// Kopiert public/* nach dist/ für Vercel – Statik wird an Root (/) ausgeliefert.
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(publicDir)) {
  console.error('Ordner public/ nicht gefunden.');
  process.exit(1);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });
copyRecursive(publicDir, distDir);
// Stub für Vercel: Erwartet einen Express-Entrypoint im Output – echte API lebt in api/
const stub = "const e=require('express');module.exports=e();\n";
fs.writeFileSync(path.join(distDir, 'server.js'), stub, 'utf8');
console.log('public/ → dist/ kopiert.');
