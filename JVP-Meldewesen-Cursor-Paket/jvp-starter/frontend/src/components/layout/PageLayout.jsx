// ============================================================
// PageLayout.jsx – HEUREKA 2.0 | NICHT VERÄNDERN
// Gemeinsame Seitenstruktur für alle Seiten
//
// Verwendung:
// <PageLayout
//   plattformTitel="eGefangenenanträge"
//   fachverfahren={{ label: 'eGefangenenanträge', href: '/dashboard' }}
//   seiten={[{ label: 'Antrag ANT-047' }]}
// >
//   <IhrSeiteninhalt />
// </PageLayout>
// ============================================================

import PrototypBanner from './PrototypBanner'
import Header from './Header'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'

export default function PageLayout({
  children,
  plattformTitel = '',      // z.B. "eGefangenenanträge"
  fachverfahren = null,     // { label, href } – null für JVP selbst
  seiten = [],              // weitere Breadcrumb-Stufen
}) {
  return (
    <div className="min-h-screen flex flex-col bg-jhh-bg">

      {/* Prototyp-Testmodus Banner */}
      <PrototypBanner />

      {/* FHH-konformer Header */}
      <Header plattformTitel={plattformTitel} />

      {/* Breadcrumb-Navigation */}
      <Breadcrumb fachverfahren={fachverfahren} seiten={seiten} />

      {/* Seiteninhalt */}
      <main className="flex-1">
        <div className="max-w-content mx-auto px-8 py-7">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer fachverfahren={plattformTitel || 'Justizvollzugsplattform'} />

    </div>
  )
}
