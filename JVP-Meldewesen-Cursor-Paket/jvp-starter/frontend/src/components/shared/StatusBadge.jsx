// ============================================================
// StatusBadge.jsx – HEUREKA 2.0
// Einheitliche Status-Anzeige für A1 und A2
// Immer: Text + Farbe + Icon (WCAG 2.1 – nie nur Farbe)
// ============================================================

const STATUS_CONFIG = {
  DRAFT:       { label: 'Entwurf',         css: 'status-draft',     icon: '✏️' },
  SUBMITTED:   { label: 'Eingereicht',      css: 'status-submitted', icon: '📤' },
  IN_PROGRESS: { label: 'In Bearbeitung',   css: 'status-progress',  icon: '⏳' },
  APPROVED:    { label: 'Genehmigt',        css: 'status-approved',  icon: '✅' },
  REJECTED:    { label: 'Abgelehnt',        css: 'status-rejected',  icon: '❌' },
  FORWARDED:   { label: 'Weitergeleitet',   css: 'status-forwarded', icon: '↗️' },
  ARCHIVED:    { label: 'Archiviert',       css: 'status-archived',  icon: '🗂️' },
  // A2-spezifisch:
  IN_PRUEFUNG: { label: 'In Prüfung',      css: 'status-progress',  icon: '🔍' },
  ABGESCHLOSSEN:{ label: 'Abgeschlossen',  css: 'status-approved',  icon: '✅' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    css: 'status-draft',
    icon: '?',
  }

  return (
    <span className={config.css} role="status" aria-label={`Status: ${config.label}`}>
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
