// ============================================================
// mockAuth.js – HEUREKA 2.0 | NICHT VERÄNDERN
// Liest Mock-Rollen-Header aus und hängt sie an req.mockNutzer
// Alle Controller greifen nur über req.mockNutzer auf Rolle zu
// ============================================================

const GUELTIGE_ROLLEN = [
  'BEAMTER','ABTL','ANSTL','SOZIAL','MEDIZIN','PFORTE','ITADMIN','GEFANGENER'
]

export function mockAuth(req, res, next) {
  const rolle    = req.headers['x-mock-rolle']     || 'BEAMTER'
  const portal   = req.headers['x-mock-portal']    || 'bedienstete'
  const nutzerId = req.headers['x-mock-nutzer-id'] || 'BD-001'
  const jva      = req.headers['x-mock-jva']       || 'JVA Billwerder'

  if (!GUELTIGE_ROLLEN.includes(rolle)) {
    return res.status(400).json({ error: `Ungültige Rolle: ${rolle}` })
  }

  // Berechtigungs-Flags (spiegeln Frontend-Context)
  req.mockNutzer = {
    rolle,
    portal,
    nutzerId,
    jva,
    istGefangener:  rolle === 'GEFANGENER',
    kannBearbeiten: rolle !== 'GEFANGENER',
    kannGenehmigen: ['ABTL','ANSTL'].includes(rolle),
    siehtAlleJVAs:  rolle === 'ANSTL',
    darfVerakten:   ['ABTL','ANSTL'].includes(rolle),
  }

  next()
}
