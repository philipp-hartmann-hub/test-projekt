// ============================================================
// seed.js – HEUREKA 2.0 | NICHT VERÄNDERN
// Gemeinsame Mock-Daten für JVP, A1 und A2
// Feldnamen = BASIS-Web / AD Schnittstellenspezifikation
// ============================================================

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed-Daten werden geladen...')

  // ---- Bedienstete (Mock: Active Directory) ----
  const bedienstete = await Promise.all([
    prisma.bedienstete.upsert({
      where: { bediensteterID: 'BD-001' },
      update: {},
      create: {
        bediensteterID: 'BD-001', bediensteterName: 'M. Hoffmann',
        bediensteterRolle: 'BEAMTER', bediensteterJVA: 'JVA Billwerder',
        bediensteterAbteilung: 'Abteilung B',
      },
    }),
    prisma.bedienstete.upsert({
      where: { bediensteterID: 'BD-002' },
      update: {},
      create: {
        bediensteterID: 'BD-002', bediensteterName: 'K. Schreiber',
        bediensteterRolle: 'ABTL', bediensteterJVA: 'JVA Billwerder',
        bediensteterAbteilung: 'Abteilung B',
      },
    }),
    prisma.bedienstete.upsert({
      where: { bediensteterID: 'BD-003' },
      update: {},
      create: {
        bediensteterID: 'BD-003', bediensteterName: 'Dr. R. Meier',
        bediensteterRolle: 'ANSTL', bediensteterJVA: 'JVA Billwerder',
        bediensteterAbteilung: 'Anstaltsleitung',
      },
    }),
    prisma.bedienstete.upsert({
      where: { bediensteterID: 'BD-004' },
      update: {},
      create: {
        bediensteterID: 'BD-004', bediensteterName: 'S. Brandt',
        bediensteterRolle: 'SOZIAL', bediensteterJVA: 'JVA Fuhlsbüttel',
        bediensteterAbteilung: 'Sozialdienst',
      },
    }),
    prisma.bedienstete.upsert({
      where: { bediensteterID: 'BD-005' },
      update: {},
      create: {
        bediensteterID: 'BD-005', bediensteterName: 'T. Müller',
        bediensteterRolle: 'BEAMTER', bediensteterJVA: 'JVA Fuhlsbüttel',
        bediensteterAbteilung: 'Abteilung A',
      },
    }),
  ])

  // ---- Gefangene (Mock: BASIS-Web) ----
  const gefangene = await Promise.all([
    prisma.gefangene.upsert({
      where: { gefangenenNr: 'GEF-001' },
      update: {},
      create: {
        gefangenenNr: 'GEF-001', nachname: 'Müller', vorname: 'Hans',
        geburtsdatum: new Date('1980-03-15'), staatsangehoerigkeit: 'Deutsch',
        muttersprache: 'Deutsch', jva: 'JVA Billwerder',
        haftraum: 'A2-11', haftart: 'Strafhaft',
        strafende: new Date('2027-06-30'), vollzugsabteilung: 'Abteilung A',
        betreuenderBeamter: 'BD-001',
      },
    }),
    prisma.gefangene.upsert({
      where: { gefangenenNr: 'GEF-008' },
      update: {},
      create: {
        gefangenenNr: 'GEF-008', nachname: 'Petrov', vorname: 'Alexei',
        geburtsdatum: new Date('1975-11-22'), staatsangehoerigkeit: 'Russisch',
        muttersprache: 'Russisch', jva: 'JVA Billwerder',
        haftraum: 'A1-07', haftart: 'Untersuchungshaft',
        vollzugsabteilung: 'Abteilung A', betreuenderBeamter: 'BD-001',
      },
    }),
    prisma.gefangene.upsert({
      where: { gefangenenNr: 'GEF-017' },
      update: {},
      create: {
        gefangenenNr: 'GEF-017', nachname: 'Ibrahim', vorname: 'Omar',
        geburtsdatum: new Date('1990-07-04'), staatsangehoerigkeit: 'Syrisch',
        muttersprache: 'Arabisch', jva: 'JVA Fuhlsbüttel',
        haftraum: 'B1-09', haftart: 'Strafhaft',
        strafende: new Date('2026-12-31'), vollzugsabteilung: 'Abteilung B',
        betreuenderBeamter: 'BD-005',
      },
    }),
    prisma.gefangene.upsert({
      where: { gefangenenNr: 'GEF-021' },
      update: {},
      create: {
        gefangenenNr: 'GEF-021', nachname: 'Yilmaz', vorname: 'Mehmet',
        geburtsdatum: new Date('1988-05-12'), staatsangehoerigkeit: 'Türkisch',
        muttersprache: 'Türkisch', jva: 'JVA Billwerder',
        haftraum: 'B2-14', haftart: 'Strafhaft',
        strafende: new Date('2028-03-15'), vollzugsabteilung: 'Abteilung B',
        betreuenderBeamter: 'BD-001',
      },
    }),
    prisma.gefangene.upsert({
      where: { gefangenenNr: 'GEF-034' },
      update: {},
      create: {
        gefangenenNr: 'GEF-034', nachname: 'Schneider', vorname: 'Klaus',
        geburtsdatum: new Date('1965-09-30'), staatsangehoerigkeit: 'Deutsch',
        muttersprache: 'Deutsch', jva: 'JVA Billwerder',
        haftraum: 'C3-02', haftart: 'Strafhaft',
        strafende: new Date('2026-09-01'), vollzugsabteilung: 'Abteilung C',
        betreuenderBeamter: 'BD-002',
      },
    }),
  ])

  // ---- Anträge (Mock-Daten für A1) ----
  const gefangeneMap = Object.fromEntries(gefangene.map(g => [g.gefangenenNr, g]))
  const bediensteteMap = Object.fromEntries(bedienstete.map(b => [b.bediensteterID, b]))

  const antraegeData = [
    {
      antragNr: 'ANT-047', clusterTyp: 'AUSGANG_URLAUB', status: 'SUBMITTED',
      begruendung: 'Besuch der erkrankten Mutter', prioritaet: 1,
      gefangeneId: gefangeneMap['GEF-021'].id,
      zustaendigId: bediensteteMap['BD-001'].id,
      metadaten: { zeitraumVon: '2026-05-10', zeitraumBis: '2026-05-10', begleitperson: 'keine' },
    },
    {
      antragNr: 'ANT-046', clusterTyp: 'BESUCH_KOMMUNIKATION', status: 'IN_PROGRESS',
      begruendung: 'Besuch der Ehefrau', prioritaet: 0,
      gefangeneId: gefangeneMap['GEF-008'].id,
      zustaendigId: bediensteteMap['BD-002'].id,
      metadaten: { besuchsperson: 'Natalia Petrov', verwandtschaftsgrad: 'Ehefrau' },
    },
    {
      antragNr: 'ANT-045', clusterTyp: 'EINKAUF_FINANZEN', status: 'APPROVED',
      begruendung: 'Monatlicher Sondereinkauf', prioritaet: 0,
      gefangeneId: gefangeneMap['GEF-034'].id,
      zustaendigId: bediensteteMap['BD-001'].id,
      metadaten: { betrag: 50, kategorie: 'Lebensmittel' },
    },
    {
      antragNr: 'ANT-044', clusterTyp: 'BESUCH_KOMMUNIKATION', status: 'IN_PROGRESS',
      begruendung: 'Telefonantrag für Anwaltsgespräch', prioritaet: 1,
      gefangeneId: gefangeneMap['GEF-017'].id,
      zustaendigId: bediensteteMap['BD-005'].id,
      metadaten: { anwalt: 'RA Fischer', telefonnummer: '+49401234567' },
    },
    {
      antragNr: 'ANT-043', clusterTyp: 'AUSGANG_URLAUB', status: 'IN_PROGRESS',
      begruendung: 'Arzttermin außerhalb der JVA', prioritaet: 1,
      gefangeneId: gefangeneMap['GEF-001'].id,
      zustaendigId: bediensteteMap['BD-002'].id,
      metadaten: { arzt: 'Dr. Schmitt, Neurologie', adresse: 'Eppendorfer Landstr. 42' },
    },
    {
      antragNr: 'ANT-038', clusterTyp: 'BESUCH_KOMMUNIKATION', status: 'DRAFT',
      begruendung: 'Besuchsantrag Kind', prioritaet: 0,
      gefangeneId: gefangeneMap['GEF-001'].id,
      metadaten: {},
    },
  ]

  for (const daten of antraegeData) {
    await prisma.antrag.upsert({
      where: { antragNr: daten.antragNr },
      update: {},
      create: daten,
    })
  }

  console.log(`✅ Seed abgeschlossen:
  - ${bedienstete.length} Bedienstete
  - ${gefangene.length} Gefangene
  - ${antraegeData.length} Anträge`)
}

main()
  .catch(e => { console.error('❌ Seed-Fehler:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
