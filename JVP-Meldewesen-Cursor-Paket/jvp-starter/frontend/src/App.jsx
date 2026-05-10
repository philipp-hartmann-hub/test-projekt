// ============================================================
// App.jsx – HEUREKA 2.0
// Routing-Konfiguration der JVP
// Teams A1 und A2 ergänzen hier ihre eigenen Routen
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RollenProvider } from './context/RollenContext'
import JVPDashboard from './pages/JVPDashboard'

// TODO A1: Seiten hier importieren und eintragen
// import AntraegeListe from './pages/AntraegeListe'
// import AntragDetail from './pages/AntragDetail'

// TODO A2: Seiten hier importieren und eintragen
// import MeldungenListe from './pages/MeldungenListe'

export default function App() {
  return (
    <RollenProvider>
      <BrowserRouter>
        <Routes>
          {/* JVP-Startseite */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<JVPDashboard />} />

          {/* TODO A1: Routen eintragen */}
          {/* <Route path="/antraege" element={<AntraegeListe />} /> */}
          {/* <Route path="/antraege/neu" element={<AntragNeu />} /> */}
          {/* <Route path="/antraege/:id" element={<AntragDetail />} /> */}

          {/* TODO A2: Routen eintragen */}
          {/* <Route path="/meldungen" element={<MeldungenListe />} /> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </RollenProvider>
  )
}
