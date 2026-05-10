// ============================================================
// routes/index.js – HEUREKA 2.0
// Alle API-Endpunkte der JVP
// A1 und A2 ergänzen hier ihre eigenen Router
// ============================================================

import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// ---- Gefangene ----
router.get('/gefangene', async (req, res, next) => {
  try {
    const { search } = req.query
    const { jva, siehtAlleJVAs, istGefangener } = req.mockNutzer
    if (istGefangener) return res.status(403).json({ error: 'Keine Berechtigung' })

    const where = {
      ...(search ? {
        OR: [
          { nachname:     { contains: search, mode: 'insensitive' } },
          { vorname:      { contains: search, mode: 'insensitive' } },
          { gefangenenNr: { contains: search, mode: 'insensitive' } },
        ]
      } : {}),
      ...(!siehtAlleJVAs ? { jva } : {}),
    }

    const gefangene = await prisma.gefangene.findMany({
      where, orderBy: { nachname: 'asc' }, take: 50,
    })
    res.json({ data: gefangene, total: gefangene.length })
  } catch (err) { next(err) }
})

router.get('/gefangene/:id', async (req, res, next) => {
  try {
    const { istGefangener, nutzerId } = req.mockNutzer
    const gefangene = await prisma.gefangene.findUnique({ where: { id: req.params.id } })
    if (!gefangene) return res.status(404).json({ error: 'Nicht gefunden' })
    // Gefangene: nur eigene Daten
    if (istGefangener && gefangene.gefangenenNr !== nutzerId)
      return res.status(403).json({ error: 'Keine Berechtigung' })
    res.json({ data: gefangene })
  } catch (err) { next(err) }
})

// ---- Bedienstete ----
router.get('/bedienstete', async (req, res, next) => {
  try {
    const { istGefangener, jva, siehtAlleJVAs } = req.mockNutzer
    if (istGefangener) return res.status(403).json({ error: 'Keine Berechtigung' })
    const bedienstete = await prisma.bedienstete.findMany({
      where: siehtAlleJVAs ? {} : { bediensteterJVA: jva },
      orderBy: { bediensteterName: 'asc' },
    })
    res.json({ data: bedienstete, total: bedienstete.length })
  } catch (err) { next(err) }
})

router.get('/bedienstete/me', async (req, res, next) => {
  try {
    const { nutzerId, istGefangener } = req.mockNutzer
    if (istGefangener) return res.status(403).json({ error: 'Keine Berechtigung' })
    const bedienstete = await prisma.bedienstete.findUnique({
      where: { bediensteterID: nutzerId }
    })
    res.json({ data: bedienstete })
  } catch (err) { next(err) }
})

// ---- Anträge (A1) ----
router.get('/antraege', async (req, res, next) => {
  try {
    const { status, clusterTyp, jva: filterJva, search, page = 1, limit = 20 } = req.query
    const { rolle, nutzerId, jva, siehtAlleJVAs, istGefangener } = req.mockNutzer

    let where = {}
    if (istGefangener) {
      where.gefangene = { gefangenenNr: nutzerId }
    } else if (!siehtAlleJVAs) {
      where.gefangene = { jva: filterJva || jva }
    } else if (filterJva) {
      where.gefangene = { jva: filterJva }
    }
    if (status)     where.status     = status
    if (clusterTyp) where.clusterTyp = clusterTyp
    if (search) {
      where.OR = [
        { antragNr:   { contains: search, mode: 'insensitive' } },
        { gefangene:  { OR: [
          { nachname: { contains: search, mode: 'insensitive' } },
          { vorname:  { contains: search, mode: 'insensitive' } },
          { gefangenenNr: { contains: search, mode: 'insensitive' } },
        ]}},
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [antraege, total] = await Promise.all([
      prisma.antrag.findMany({
        where,
        include: { gefangene: true, zustaendig: true },
        orderBy: [{ prioritaet: 'desc' }, { erstelltAm: 'desc' }],
        skip, take: Number(limit),
      }),
      prisma.antrag.count({ where }),
    ])
    res.json({ data: antraege, total, page: Number(page), limit: Number(limit) })
  } catch (err) { next(err) }
})

router.get('/antraege/:id', async (req, res, next) => {
  try {
    const antrag = await prisma.antrag.findUnique({
      where: { id: req.params.id },
      include: { gefangene: true, zustaendig: true, statusVerlauf: {
        include: { bedienstete: true }, orderBy: { erstelltAm: 'asc' }
      }, veraktungen: true },
    })
    if (!antrag) return res.status(404).json({ error: 'Antrag nicht gefunden' })
    res.json({ data: antrag })
  } catch (err) { next(err) }
})

router.post('/antraege', async (req, res, next) => {
  try {
    const { kannBearbeiten, nutzerId } = req.mockNutzer
    if (!kannBearbeiten) return res.status(403).json({ error: 'Keine Berechtigung' })
    const { gefangeneId, clusterTyp, begruendung, metadaten } = req.body
    // Antragsnummer auto-generieren
    const count = await prisma.antrag.count()
    const antragNr = `ANT-${String(count + 100).padStart(3, '0')}`
    const antrag = await prisma.antrag.create({
      data: { antragNr, gefangeneId, clusterTyp, begruendung, metadaten,
               zustaendigId: nutzerId !== 'GEF-021' ? null : null },
      include: { gefangene: true },
    })
    res.status(201).json({ data: antrag })
  } catch (err) { next(err) }
})

router.patch('/antraege/:id/status', async (req, res, next) => {
  try {
    const { kannBearbeiten, kannGenehmigen, nutzerId } = req.mockNutzer
    const { status, kommentar } = req.body
    const genehmigungsStatus = ['APPROVED', 'REJECTED', 'FORWARDED']
    if (genehmigungsStatus.includes(status) && !kannGenehmigen)
      return res.status(403).json({ error: 'Nur Abteilungsleitung oder Anstaltsleitung darf genehmigen' })
    if (!kannBearbeiten)
      return res.status(403).json({ error: 'Keine Berechtigung' })

    const bedienstete = await prisma.bedienstete.findUnique({ where: { bediensteterID: nutzerId } })
    const [antrag] = await prisma.$transaction([
      prisma.antrag.update({ where: { id: req.params.id }, data: { status } }),
      prisma.statusVerlauf.create({
        data: { antragId: req.params.id, status, kommentar,
                bediensteteId: bedienstete?.id },
      }),
    ])
    res.json({ data: antrag })
  } catch (err) { next(err) }
})

// ---- Cluster-Übersicht ----
router.get('/cluster', (req, res) => {
  res.json({ data: [
    { id: 'AUSGANG_URLAUB',         label: 'Ausgang & Urlaub',          aktiv: true,  offenCount: 5  },
    { id: 'BESUCH_KOMMUNIKATION',   label: 'Besuch & Kommunikation',    aktiv: true,  offenCount: 8  },
    { id: 'EINKAUF_FINANZEN',       label: 'Einkauf & Finanzen',        aktiv: true,  offenCount: 5  },
    { id: 'GESUNDHEIT_SOZIALES',    label: 'Gesundheit & Soziales',     aktiv: false, offenCount: 0  },
    { id: 'ARBEIT_BILDUNG',         label: 'Arbeit & Bildung',          aktiv: false, offenCount: 0  },
    { id: 'RECHTLICHES',            label: 'Rechtliches',               aktiv: false, offenCount: 0  },
    { id: 'UNTERBRINGUNG_VERLEGUNG',label: 'Unterbringung & Verlegung', aktiv: false, offenCount: 0  },
  ]})
})

// TODO A2: Router hier einbinden
// import meldungenRouter from './meldungen.js'
// router.use('/meldungen', meldungenRouter)

export default router
