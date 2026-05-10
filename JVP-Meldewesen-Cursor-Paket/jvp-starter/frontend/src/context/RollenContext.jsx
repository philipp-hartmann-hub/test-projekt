// ============================================================
// RollenContext.jsx – HEUREKA 2.0 | NICHT VERÄNDERN
// Gemeinsamer Rollen-Context für JVP, A1 und A2
// Simuliert Authentifizierung (Prototyp-Modus)
// Produktivsystem: AD für Bedienstete, eigenes IAM für Gefangene
// ============================================================

import { createContext, useContext, useState } from 'react'

// Bediensteten-Portal (Zielarchitektur: FHH-Behördennetz + Active Directory)
const ROLLEN_BEDIENSTETE = {
  BEAMTER: {
    id: 'BD-001',
    name: 'M. Hoffmann',
    initials: 'MH',
    label: 'Vollzugsbeamtin/-beamter',
    jva: 'JVA Billwerder',
    portal: 'bedienstete',
  },
  ABTL: {
    id: 'BD-002',
    name: 'K. Schreiber',
    initials: 'KS',
    label: 'Abteilungsleitung',
    jva: 'JVA Billwerder',
    portal: 'bedienstete',
  },
  ANSTL: {
    id: 'BD-003',
    name: 'Dr. R. Meier',
    initials: 'RM',
    label: 'Anstaltsleitung',
    jva: 'JVA Billwerder',
    portal: 'bedienstete',
  },
  SOZIAL: {
    id: 'BD-004',
    name: 'S. Brandt',
    initials: 'SB',
    label: 'Sozialdienst',
    jva: 'JVA Fuhlsbüttel',
    portal: 'bedienstete',
  },
  MEDIZIN: {
    id: 'BD-005',
    name: 'Dr. A. Becker',
    initials: 'AB',
    label: 'Medizinischer Dienst',
    jva: 'JVA Billwerder',
    portal: 'bedienstete',
  },
  PFORTE: {
    id: 'BD-006',
    name: 'T. Krause',
    initials: 'TK',
    label: 'Pforte / Empfang',
    jva: 'JVA Hahnöfersand',
    portal: 'bedienstete',
  },
}

// Gefangenen-Portal (Zielarchitektur: Non-Behördennetz + eigenes IAM)
const ROLLEN_GEFANGENE = {
  GEFANGENER: {
    id: 'GEF-021',
    name: 'M. Yilmaz',
    initials: 'MY',
    label: 'Gefangene/r',
    jva: 'JVA Billwerder',
    portal: 'gefangene',
  },
}

export const ALLE_ROLLEN = { ...ROLLEN_BEDIENSTETE, ...ROLLEN_GEFANGENE }

const RollenContext = createContext(null)

export function RollenProvider({ children }) {
  const [aktiveRolle, setAktiveRolle] = useState('BEAMTER')

  const aktiverNutzer = ALLE_ROLLEN[aktiveRolle] || ALLE_ROLLEN.BEAMTER

  // Berechtigungs-Flags (Validierungshypothesen – in Workshops anpassen)
  const istGefangener    = aktiveRolle === 'GEFANGENER'
  const kannBearbeiten   = !istGefangener
  const kannGenehmigen   = ['ABTL', 'ANSTL'].includes(aktiveRolle)
  const siehtAlleJVAs    = aktiveRolle === 'ANSTL'
  const darfVerakten     = ['ABTL', 'ANSTL'].includes(aktiveRolle)

  return (
    <RollenContext.Provider value={{
      aktiveRolle,
      setAktiveRolle,
      aktiverNutzer,
      istGefangener,
      kannBearbeiten,
      kannGenehmigen,
      siehtAlleJVAs,
      darfVerakten,
      alleRollen: ALLE_ROLLEN,
    }}>
      {children}
    </RollenContext.Provider>
  )
}

export function useRolle() {
  const ctx = useContext(RollenContext)
  if (!ctx) throw new Error('useRolle muss innerhalb von RollenProvider verwendet werden')
  return ctx
}
