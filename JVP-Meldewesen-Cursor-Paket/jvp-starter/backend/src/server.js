// ============================================================
// server.js – HEUREKA 2.0
// Express-Server: API-Einstiegspunkt
// ============================================================

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { mockAuth } from './middleware/mockAuth.js'
import router from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 3001

// ---- Middleware ----
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(morgan('dev'))
app.use(mockAuth)         // Mock-Rollen-Header für alle Routen

// ---- Routen ----
app.use('/api', router)

// ---- Healthcheck für Railway ----
app.get('/health', (req, res) => res.json({
  status: 'ok',
  projekt: 'HEUREKA 2.0 – JVP',
  version: '1.0.0',
}))

// ---- Fehler-Middleware ----
app.use((err, req, res, next) => {
  console.error('Fehler:', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'Interner Serverfehler',
  })
})

app.listen(PORT, () => {
  console.log(`✅ JVP-Backend läuft auf Port ${PORT}`)
  console.log(`   Umgebung: ${process.env.NODE_ENV || 'development'}`)
})
