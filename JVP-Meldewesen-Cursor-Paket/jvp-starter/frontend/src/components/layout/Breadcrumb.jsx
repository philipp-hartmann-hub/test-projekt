// ============================================================
// Breadcrumb.jsx – HEUREKA 2.0 | NICHT VERÄNDERN
// Navigationspfad: Justizplattform › Fachverfahren › Seite
// Absprungpunkt ist immer die JVP
// ============================================================

const JVP_URL = import.meta.env.VITE_JVP_URL || '/'

// Props:
// - fachverfahren: { label: string, href: string }
//   z.B. { label: 'eGefangenenanträge', href: '/dashboard' }
// - seiten: Array von { label: string, href?: string }
//   letzte Seite ohne href = aktuelle Seite (nicht klickbar)

export default function Breadcrumb({ fachverfahren, seiten = [] }) {
  return (
    <nav
      className="bg-jhh-white border-b border-jhh-border px-8 py-2"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-1 text-sm max-w-content mx-auto">

        {/* Stufe 1: Justizplattform – immer externer Link zur JVP */}
        <li>
          <a
            href={JVP_URL}
            className="text-jhh-secondary hover:text-jhh-primary hover:underline
                       font-medium transition-colors"
            aria-label="Zurück zur Justizvollzugsplattform"
          >
            Justizplattform
          </a>
        </li>

        {/* Stufe 2: Fachverfahren – interner Link zum FV-Dashboard */}
        {fachverfahren && (
          <>
            <li aria-hidden="true" className="text-jhh-border select-none">›</li>
            <li>
              {fachverfahren.href ? (
                <a
                  href={fachverfahren.href}
                  className="text-jhh-secondary hover:text-jhh-primary hover:underline
                             font-medium transition-colors"
                >
                  {fachverfahren.label}
                </a>
              ) : (
                <span className="text-jhh-primary font-semibold" aria-current="page">
                  {fachverfahren.label}
                </span>
              )}
            </li>
          </>
        )}

        {/* Stufe 3+: Unterseiten */}
        {seiten.map((seite, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span aria-hidden="true" className="text-jhh-border select-none">›</span>
            {seite.href ? (
              <a
                href={seite.href}
                className="text-jhh-secondary hover:underline font-medium"
              >
                {seite.label}
              </a>
            ) : (
              <span
                className="text-jhh-primary font-semibold"
                aria-current="page"
              >
                {seite.label}
              </span>
            )}
          </li>
        ))}

      </ol>
    </nav>
  )
}
