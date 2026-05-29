// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIG — the only file you need to edit to make this site yours
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_CONFIG = {
  // The name shown in the navbar, gate page, and browser tab
  siteName: 'our little corner',

  // The password for the gate page — change this to something personal
  gatePassword: 'ourlittlecorner',

  // The day your relationship started
  relationshipStart: new Date('2024-01-01'), // ← update this

  // Which day of the month is your monthly anniversary (1–31)
  anniversaryDay: 1, // ← update this

  // The secret word that triggers the sword easter egg (type it anywhere on the page)
  easterEggWord: 'riptide', // ← change to your own inside joke

  // Fill these in after both users log in once (Supabase → Auth → Users)
  owners: {
    user1: 'TBD', // ← paste UUID here
    user2: 'TBD', // ← paste UUID here
  },

  // ── Theme colours ─────────────────────────────────────────────────────────
  // These are applied as CSS variables and used throughout the site.
  // Also update tailwind.config.js to match if you want Tailwind classes to work.
  colors: {
    sunflower: '#F5C842', // primary accent — buttons, active nav, highlights
    sunflowerDark: '#E2A500', // hover state for sunflower
    orchid: '#9B7FD4', // secondary accent — labels, badges
    orchidDeep: '#6A5ACD', // darker orchid — links, active text
    cream: '#FFFDF4', // page background
    chocolate: '#3B1F0E', // main text colour
    riptide: '#3B82C4', // map, playlist, tertiary accent
  },

  // ── Nav icons ─────────────────────────────────────────────────────────────
  // Emoji shown as fallback labels on small screens.
  // The SVG icons in Navbar.tsx are the primary nav — these are display hints.
  navEmoji: {
    home: '🌻',
    gallery: '📸',
    letters: '💌',
    jar: '🥚',
    puns: '😆',
    map: '📍',
    playlist: '🎵',
    bucketlist: '♟️',
    secret: '🔒',
  },
}

// ── CSS variable injection ─────────────────────────────────────────────────
// Called once in main.tsx to apply theme colours as CSS custom properties.
// This means colours from config.ts flow into inline styles automatically.
export function applyTheme() {
  const root = document.documentElement
  const c = SITE_CONFIG.colors
  root.style.setProperty('--color-sunflower', c.sunflower)
  root.style.setProperty('--color-sunflower-dark', c.sunflowerDark)
  root.style.setProperty('--color-orchid', c.orchid)
  root.style.setProperty('--color-orchid-deep', c.orchidDeep)
  root.style.setProperty('--color-cream', c.cream)
  root.style.setProperty('--color-chocolate', c.chocolate)
  root.style.setProperty('--color-riptide', c.riptide)
}