// ============================================================
// JVPDashboard.jsx – HEUREKA 2.0
// Zentraler Eingangsbereich der Justizvollzugsplattform
// Von hier aus: Navigation zu A1 (eGefangenenanträge) und A2 (eMeldewesen)
// ============================================================

import { useRolle } from '../context/RollenContext'
import PageLayout from '../components/layout/PageLayout'

const A1_URL = import.meta.env.VITE_A1_URL || '/a1'
const A2_URL = import.meta.env.VITE_A2_URL || '/a2'

// Fachverfahren-Konfiguration
// aktiv: true = klickbar | false = ausgegraut (in Planung)
// rollenFilter: welche Rollen diese Kachel sehen
const FACHVERFAHREN = [
  {
    id: 'a1',
    titel: 'eGefangenenanträge',
    beschreibung: 'Digitale Erfassung, Bearbeitung und Nachverfolgung von Gefangenenanträgen aller Antragscluster.',
    icon: '📋',
    url: A1_URL,
    aktiv: true,
    rollenFilter: ['BEAMTER', 'ABTL', 'ANSTL', 'SOZIAL', 'MEDIZIN', 'PFORTE'],
    offenCount: 8,
  },
  {
    id: 'a2',
    titel: 'eMeldewesen',
    beschreibung: 'Digitales Meldewesen: Strafanzeigen, interne Vorfallsmeldungen und externe Berichte.',
    icon: '📨',
    url: A2_URL,
    aktiv: true,
    rollenFilter: ['BEAMTER', 'ABTL', 'ANSTL', 'SOZIAL', 'MEDIZIN'],
    offenCount: 3,
  },
  {
    id: 'statistik',
    titel: 'Statistik & Auswertungen',
    beschreibung: 'Übergreifende Berichte, Bearbeitungszeiten und Kennzahlen für die Anstaltsleitung.',
    icon: '📈',
    url: '#',
    aktiv: true,
    rollenFilter: ['ANSTL'],
    offenCount: null,
  },
  {
    id: 'urlaub',
    titel: 'Urlaubsanträge (Bedienstete)',
    beschreibung: 'Digitale Beantragung und Genehmigung von Urlaub und Dienstbefreiungen.',
    icon: '🏖️',
    url: '#',
    aktiv: false,
    rollenFilter: ['BEAMTER', 'ABTL', 'ANSTL'],
    offenCount: null,
  },
  {
    id: 'hr',
    titel: 'HR / Personalthemen',
    beschreibung: 'Personalverwaltung, Qualifikationsnachweise und dienstliche Beurteilungen.',
    icon: '👤',
    url: '#',
    aktiv: false,
    rollenFilter: ['ABTL', 'ANSTL'],
    offenCount: null,
  },
  {
    id: 'platzhalter',
    titel: 'Weiteres Fachverfahren',
    beschreibung: 'Platzhalter für zukünftige digitale Prozesse auf der Justizvollzugsplattform.',
    icon: '➕',
    url: '#',
    aktiv: false,
    rollenFilter: ['BEAMTER', 'ABTL', 'ANSTL'],
    offenCount: null,
  },
]

// Kennzahlen je Rolle
const STATS = {
  BEAMTER: { antraege: 8,   meldungen: 3,  urgent: 2  },
  ABTL:    { antraege: 24,  meldungen: 11, urgent: 5  },
  ANSTL:   { antraege: 147, meldungen: 38, urgent: 12 },
  SOZIAL:  { antraege: 12,  meldungen: 1,  urgent: 1  },
  MEDIZIN: { antraege: 5,   meldungen: 2,  urgent: 0  },
  PFORTE:  { antraege: 0,   meldungen: 4,  urgent: 0  },
  GEFANGENER: { antraege: 2, meldungen: 0, urgent: 0  },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen'
  if (h < 18) return 'Guten Tag'
  return 'Guten Abend'
}

function formatDatum() {
  return new Date().toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function JVPDashboard() {
  const { aktiveRolle, aktiverNutzer, istGefangener } = useRolle()
  const stats = STATS[aktiveRolle] || STATS.BEAMTER

  // Sichtbare Fachverfahren je Rolle
  const sichtbareFV = FACHVERFAHREN.filter(fv =>
    fv.rollenFilter.includes(aktiveRolle)
  )

  // Gefangene: vereinfachte Ansicht
  if (istGefangener) {
    return (
      <PageLayout plattformTitel="">
        <div className="max-w-form mx-auto">
          <div className="card p-6 mb-6 border-l-4 border-jhh-info">
            <h1 className="text-xl mb-2">Willkommen, {aktiverNutzer.name}</h1>
            <p className="text-jhh-text-light">
              Sie sind im Gefangenen-Portal angemeldet. Hier können Sie Ihre eigenen
              Anträge einsehen und den Status verfolgen.
            </p>
          </div>
          <a
            href={A1_URL}
            className="card p-5 flex items-center gap-4 hover:bg-jhh-hover
                       transition-colors cursor-pointer block"
          >
            <span className="text-3xl">📋</span>
            <div>
              <div className="font-bold text-jhh-primary">Meine Anträge</div>
              <div className="text-sm text-jhh-text-light">
                {stats.antraege} Antrag/Anträge – Status einsehen
              </div>
            </div>
            <span className="ml-auto text-jhh-secondary">→</span>
          </a>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout plattformTitel="">
      {/* Willkommens-Banner */}
      <section
        className="rounded bg-gradient-to-r from-jhh-primary to-blue-800
                   p-6 mb-7 flex flex-wrap items-center justify-between gap-4"
        aria-label="Willkommensbereich"
      >
        <div>
          <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
            Willkommen zurück
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">
            {getGreeting()}, {aktiverNutzer.name}
          </h1>
          <p className="text-white/70 text-sm">
            Angemeldet als <strong className="text-white">{aktiverNutzer.label}</strong>
            {' · '}{aktiverNutzer.jva}
          </p>
        </div>
        <div className="text-right">
          <div className="text-white text-lg font-bold">{formatDatum()}</div>
          <div className="text-white/60 text-xs mt-1">
            Hamburgischer Justizvollzug
          </div>
        </div>
      </section>

      {/* Kennzahlen */}
      <div
        className="grid grid-cols-3 gap-4 mb-7"
        aria-label="Kennzahlenübersicht"
      >
        <div className="card p-4 border-l-4 border-jhh-primary">
          <div className="text-2xl font-bold text-jhh-primary">{stats.antraege}</div>
          <div className="text-xs text-jhh-text-light mt-1">offene Gefangenenanträge</div>
        </div>
        <div className="card p-4 border-l-4 border-jhh-secondary">
          <div className="text-2xl font-bold text-jhh-secondary">{stats.meldungen}</div>
          <div className="text-xs text-jhh-text-light mt-1">Meldungen in Bearbeitung</div>
        </div>
        <div className="card p-4 border-l-4 border-jhh-danger">
          <div className="text-2xl font-bold text-jhh-danger">{stats.urgent}</div>
          <div className="text-xs text-jhh-text-light mt-1">überfällig (&gt;5 Tage)</div>
        </div>
      </div>

      {/* Fachverfahren-Kacheln */}
      <h2 className="text-base font-bold text-jhh-primary mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-jhh-primary/10 rounded flex items-center
                         justify-center text-sm" aria-hidden="true">🗂️</span>
        Fachverfahren
      </h2>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="Verfügbare Fachverfahren"
      >
        {sichtbareFV.map(fv => (
          <Kachel key={fv.id} fv={fv} />
        ))}
      </div>
    </PageLayout>
  )
}

function Kachel({ fv }) {
  const baseClasses = `card p-5 flex flex-col gap-3 transition-all duration-150
                       focus-visible:ring-2 focus-visible:ring-jhh-secondary`

  if (!fv.aktiv) {
    return (
      <div
        className={`${baseClasses} opacity-60 cursor-not-allowed`}
        role="listitem"
        aria-label={`${fv.titel} – demnächst verfügbar`}
        aria-disabled="true"
      >
        <KachelInhalt fv={fv} inaktiv />
      </div>
    )
  }

  return (
    <a
      href={fv.url}
      className={`${baseClasses} hover:-translate-y-0.5 hover:shadow-md
                  hover:border-jhh-secondary border border-jhh-border`}
      role="listitem"
      aria-label={`${fv.titel} öffnen`}
    >
      <KachelInhalt fv={fv} />
    </a>
  )
}

function KachelInhalt({ fv, inaktiv = false }) {
  return (
    <>
      {/* Badge */}
      {fv.offenCount !== null && !inaktiv && (
        <span className="self-end bg-jhh-primary text-white text-xs font-bold
                         px-2 py-0.5 rounded-full -mt-1 -mr-1">
          {fv.offenCount}
        </span>
      )}
      {inaktiv && (
        <span className="self-end bg-jhh-inactive text-white text-xs font-bold
                         px-2 py-0.5 rounded-full -mt-1 -mr-1">
          Demnächst
        </span>
      )}

      {/* Icon */}
      <div className="w-12 h-12 rounded bg-jhh-primary/8 flex items-center
                      justify-center text-2xl" aria-hidden="true">
        {fv.icon}
      </div>

      {/* Titel & Beschreibung */}
      <div className="font-bold text-jhh-primary text-sm leading-snug">
        {fv.titel}
      </div>
      <div className="text-xs text-jhh-text-light leading-relaxed flex-1">
        {fv.beschreibung}
      </div>

      {/* Footer */}
      {!inaktiv && (
        <div className="flex items-center justify-between pt-2
                        border-t border-jhh-border text-xs">
          {fv.offenCount !== null ? (
            <span className="text-jhh-primary font-bold">
              {fv.offenCount} offen
            </span>
          ) : (
            <span />
          )}
          <span className="text-jhh-secondary font-medium">→</span>
        </div>
      )}
    </>
  )
}
