/** @type {import('tailwindcss').Config} */
// HEUREKA 2.0 – FHH Hamburg Design-Tokens
// NICHT VERÄNDERN – gilt für JVP, A1 und A2 gleichermassen
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'jhh-primary':    '#003063', // Dunkelblau – Header, primäre Buttons, H1/H2
        'jhh-accent':     '#E10019', // Rot – Schiffsbug, Ablehnen, Warnungen
        'jhh-secondary':  '#005CA9', // Mittelblau – Links, Fokus-Indikator
        'jhh-bg':         '#EEF0F3', // Seitenhintergrund
        'jhh-white':      '#FFFFFF', // Karten, Formulare, Tabellen
        'jhh-text':       '#1A1A1A', // Fließtext
        'jhh-text-light': '#5A6472', // Labels, Sekundärtext
        'jhh-border':     '#C8CDD5', // Rahmen, Trennlinien
        'jhh-hover':      '#E8EEF5', // Hover-Hintergrund
        'jhh-stripe':     '#F7F9FB', // Tabellen-Zeilen alternierend
        'jhh-success':    '#2E7D32', // Grün – Genehmigt, Abgeschlossen
        'jhh-warning':    '#E65100', // Orange – In Bearbeitung
        'jhh-danger':     '#E10019', // Rot – Abgelehnt, Fehler
        'jhh-info':       '#005CA9', // Blau – Eingereicht, Hinweise
        'jhh-inactive':   '#9EA8B3', // Grau – Inaktive Elemente
        'jhh-proto':      '#FFF8C5', // Gelb – Prototyp-Banner (nur Testmodus)
      },
      fontFamily: {
        sans: ['HamburgSans', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['12px', { lineHeight: '1.5' }],
        'sm':   ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.6' }],
        'lg':   ['18px', { lineHeight: '1.5' }],
        'xl':   ['22px', { lineHeight: '1.4' }],
        '2xl':  ['28px', { lineHeight: '1.3' }],
      },
      spacing: {
        // 4px-Raster (FHH Styleguide)
        '1': '4px', '2': '8px', '3': '12px', '4': '16px',
        '5': '20px', '6': '24px', '8': '32px', '10': '40px',
        '12': '48px', '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 1px 4px rgba(0,0,0,0.10)',
        'md': '0 3px 12px rgba(0,48,99,0.12)',
        'tile': '0 2px 10px rgba(0,48,99,0.10)',
      },
      maxWidth: {
        'content': '1340px',
        'form': '640px',
      },
    },
  },
  plugins: [],
}
