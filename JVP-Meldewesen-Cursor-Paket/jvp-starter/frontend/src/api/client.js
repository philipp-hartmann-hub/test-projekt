// ============================================================
// api/client.js – HEUREKA 2.0 | NICHT VERÄNDERN
// Zentraler API-Client mit Mock-Rollen-Header
// Alle API-Calls laufen über diesen Client
// ============================================================

import { useRolle } from '../context/RollenContext'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Hook-basierter Client (in Komponenten verwenden)
export function useApiClient() {
  const { aktiveRolle, aktiverNutzer } = useRolle()

  async function apiFetch(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        // Mock-Rollen-Header – Backend filtert danach serverseitig
        'X-Mock-Rolle':     aktiveRolle,
        'X-Mock-Portal':    aktiverNutzer.portal,
        'X-Mock-Nutzer-ID': aktiverNutzer.id,
        'X-Mock-JVA':       aktiverNutzer.jva,
        ...options.headers,
      },
      ...options,
    })

    if (!res.ok) {
      const fehler = await res.json().catch(() => ({ message: 'Unbekannter Fehler' }))
      throw new Error(fehler.message || `API Fehler: ${res.status}`)
    }

    // PDF-Antworten als Blob zurückgeben
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/pdf')) return res.blob()

    return res.json()
  }

  return {
    get:    (path)         => apiFetch(path),
    post:   (path, data)   => apiFetch(path, { method: 'POST',  body: JSON.stringify(data) }),
    put:    (path, data)   => apiFetch(path, { method: 'PUT',   body: JSON.stringify(data) }),
    patch:  (path, data)   => apiFetch(path, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (path)         => apiFetch(path, { method: 'DELETE' }),
  }
}

// Direkter Client ohne Hook (in utilities/services verwenden)
export async function apiFetchDirect(path, rolle = 'BEAMTER', options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Mock-Rolle': rolle,
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) throw new Error(`API Fehler: ${res.status}`)
  return res.json()
}
