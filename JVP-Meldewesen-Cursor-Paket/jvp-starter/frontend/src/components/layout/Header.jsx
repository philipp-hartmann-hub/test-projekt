// ============================================================
// Header.jsx – HEUREKA 2.0 | NICHT VERÄNDERN
// FHH-konformer Header für JVP, A1 und A2
// Enthält: BJV-Logo, Plattformtitel, Nutzerinfo, JVP-Rücksprung
// ============================================================

import { useRolle } from '../../context/RollenContext'

const JVP_URL = import.meta.env.VITE_JVP_URL || '/'

// Props:
// - plattformTitel: string  z.B. "eGefangenenanträge" oder "eMeldewesen"
//   (leer lassen für JVP-Dashboard selbst)
export default function Header({ plattformTitel = '' }) {
  const { aktiverNutzer } = useRolle()

  return (
    <header
      className="sticky z-40 bg-jhh-primary shadow-md"
      style={{ top: '38px' }}   // unterhalb PrototypBanner
    >
      <div className="max-w-content mx-auto px-8 h-16 flex items-center gap-0">

        {/* BJV-Logo – auf weißem Hintergrund, kein Filter */}
        <a href={JVP_URL} aria-label="Zurück zur Justizvollzugsplattform">
          <div className="bg-white rounded px-2 py-1 mr-5 flex-shrink-0">
            <img
              src="/assets/Justizvollzug-Hamburg-logo.png"
              alt="Hamburg – Behörde für Justiz und Verbraucherschutz"
              className="h-9 w-auto"
            />
          </div>
        </a>

        {/* Trennlinie */}
        <div className="w-px h-9 bg-white/25 mr-6 flex-shrink-0" aria-hidden="true" />

        {/* Plattformtitel */}
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-base leading-tight">
            Justizvollzugsplattform Hamburg
            {plattformTitel && (
              <span className="text-white/70 font-normal">
                {' '}– {plattformTitel}
              </span>
            )}
          </div>
          <div className="text-white/60 text-xs mt-0.5">
            Digitale Fachverfahren für den Hamburger Justizvollzug
          </div>
        </div>

        {/* Rücksprung zur JVP (nur wenn in Fachverfahren) */}
        {plattformTitel && (
          <a
            href={JVP_URL}
            className="text-white/75 hover:text-white text-sm flex items-center gap-1
                       mr-4 flex-shrink-0 transition-colors"
            aria-label="Zurück zur Justizvollzugsplattform"
          >
            ← Zur Justizplattform
          </a>
        )}

        {/* Nutzerinformation */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-white text-sm font-semibold leading-tight">
              {aktiverNutzer.name}
            </div>
            <div className="text-white/65 text-xs">
              {aktiverNutzer.label} · {aktiverNutzer.jva}
            </div>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-white/15 border-2 border-white/30
                       flex items-center justify-center text-white font-bold text-sm
                       flex-shrink-0"
            aria-hidden="true"
          >
            {aktiverNutzer.initials}
          </div>
        </div>

      </div>
    </header>
  )
}
