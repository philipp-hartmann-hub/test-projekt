// ============================================================
// PrototypBanner.jsx – HEUREKA 2.0 | NICHT VERÄNDERN
// Gelber Testmodus-Banner – nur im Prototyp sichtbar
// Schaltet Rollen für Validierungsworkshops um
// ============================================================

import { useRolle, ALLE_ROLLEN } from '../../context/RollenContext'

export default function PrototypBanner() {
  const { aktiveRolle, setAktiveRolle, aktiverNutzer } = useRolle()

  return (
    <div
      className="sticky top-0 z-50 bg-jhh-proto border-b-2 border-yellow-400
                 px-6 py-2 flex flex-wrap items-center gap-3 text-sm text-yellow-900"
      role="banner"
      aria-label="Prototyp-Testmodus"
    >
      <span className="font-bold flex items-center gap-1">
        🔧 Prototyp-Modus
      </span>

      <label htmlFor="rolle-select" className="font-semibold">
        Anmelden als:
      </label>

      <select
        id="rolle-select"
        value={aktiveRolle}
        onChange={e => setAktiveRolle(e.target.value)}
        className="text-sm px-2 py-1 border border-yellow-500 rounded
                   bg-yellow-50 text-yellow-900 font-semibold"
        aria-label="Testrolle auswählen"
      >
        <optgroup label="— Bediensteten-Portal —">
          <option value="BEAMTER">Vollzugsbeamtin/-beamter</option>
          <option value="ABTL">Abteilungsleitung</option>
          <option value="ANSTL">Anstaltsleitung</option>
          <option value="SOZIAL">Sozialdienst</option>
          <option value="MEDIZIN">Medizinischer Dienst</option>
          <option value="PFORTE">Pforte / Empfang</option>
        </optgroup>
        <optgroup label="— Gefangenen-Portal —">
          <option value="GEFANGENER">Gefangene/r (eingeschränkte Ansicht)</option>
        </optgroup>
      </select>

      <span className="text-yellow-700 hidden sm:inline">
        {aktiverNutzer.name} · {aktiverNutzer.jva}
      </span>

      <span className="ml-auto text-yellow-600 italic text-xs hidden md:inline">
        Nur im Prototyp sichtbar · Rollenauswahl simuliert Berechtigungen
      </span>
    </div>
  )
}
