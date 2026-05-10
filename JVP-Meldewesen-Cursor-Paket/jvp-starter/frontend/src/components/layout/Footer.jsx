// ============================================================
// Footer.jsx – HEUREKA 2.0 | NICHT VERÄNDERN
// ============================================================

export default function Footer({ fachverfahren = 'Justizvollzugsplattform' }) {
  return (
    <footer className="bg-jhh-primary mt-16">
      <div className="max-w-content mx-auto px-8 py-4 flex flex-wrap
                      items-center justify-between gap-4 text-white/55 text-xs">
        <div className="flex flex-wrap gap-4">
          <span>© 2026 Behörde für Justiz und Verbraucherschutz Hamburg</span>
          <a href="#" className="hover:text-white transition-colors">Impressum</a>
          <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
          <a href="#" className="hover:text-white transition-colors">Barrierefreiheit</a>
        </div>
        <div>{fachverfahren} · HEUREKA 2.0 · Prototyp v1.0</div>
      </div>
    </footer>
  )
}
