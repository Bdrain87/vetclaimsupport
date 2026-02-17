// src/theme/tokens.ts
// ============================================
// VCS DESIGN SYSTEM — BLACK, GOLD & GRAY PALETTE
// ============================================
// To change the app's color scheme, edit ONLY this file.
// Every component imports from here. Zero hardcoded colors anywhere else.

export const colors = {
  // === BACKGROUNDS ===
  navy: {
    900: '#000000',    // Page background (primary) — true black
    800: '#111111',    // Elevated background (modals, drawers)
    700: '#1a1a1a',    // Card background
    600: '#2a2a2a',    // Card border / input background
    500: '#333333',    // Hover states on cards
  },

  // === GOLD ACCENT (Primary Interactive) ===
  blue: {
    500: '#D4AF37',    // Primary buttons, links, active nav, focus rings
    600: '#B38728',    // Hover state for primary buttons
    700: '#7B5E1A',    // Active/pressed state
    400: '#F0D78C',    // Light accent (tags, badges, subtle highlights)
    100: 'rgba(212, 175, 55, 0.1)',  // Tinted backgrounds
    200: 'rgba(212, 175, 55, 0.2)',  // Slightly more visible tinted bg
  },

  // === TEXT HIERARCHY (Platinum/Silver) ===
  text: {
    primary: '#F8FAFC',      // white/97 — headings, important text
    secondary: '#94A3B8',    // slate-400 — descriptions, labels
    muted: '#64748B',        // slate-500 — captions, timestamps
    disabled: '#475569',     // slate-600 — disabled states
    inverse: '#0F172A',      // For text on light backgrounds
  },

  // === SEMANTIC STATUS (Use sparingly — only for actual status) ===
  status: {
    success: '#10B981',     // Emerald — completed, verified, good
    successBg: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',     // Amber — needs attention (NOT for cards)
    warningBg: 'rgba(245, 158, 11, 0.1)',
    danger: '#EF4444',      // Red — errors, destructive, competitor cards
    dangerBg: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',        // Same as blue accent
    infoBg: 'rgba(59, 130, 246, 0.1)',
  },

  // === BRAND MARK ONLY — NOT for UI elements ===
  brand: {
    gold: '#D4AF37',        // Brand mark icon ONLY
    goldLight: '#FFD700',   // Brand mark gradient light
    goldDark: '#B8860B',    // Brand mark gradient dark
  },

  // === LIGHT MODE COUNTERPARTS ===
  light: {
    bgPage: '#F1F5F9',       // slate-100
    bgCard: '#FFFFFF',
    bgCardHover: '#F8FAFC',
    border: '#E2E8F0',       // slate-200
    borderHover: '#CBD5E1',  // slate-300
    inputBg: '#F1F5F9',
  },
} as const;

export const card = {
  borderRadius: '12px',
  padding: '16px',
  border: `1px solid ${colors.navy[600]}`,
  borderLight: `1px solid ${colors.light.border}`,
  background: colors.navy[700],
  backgroundLight: colors.light.bgCard,
  shadow: '0 1px 2px rgba(0, 0, 0, 0.05)',         // Subtle only
  shadowHover: '0 4px 6px rgba(0, 0, 0, 0.1)',      // On hover
  // NO gradients, NO glow, NO colored backgrounds per card
  // Differentiate by ICONS and TEXT, never by background color
} as const;

export const typography = {
  pageTitle:    { size: '1.5rem',    weight: 700, color: colors.text.primary,   lightColor: '#0F172A' },
  sectionTitle: { size: '1.125rem',  weight: 600, color: colors.text.primary,   lightColor: '#1E293B' },
  cardTitle:    { size: '1rem',      weight: 600, color: colors.text.primary,   lightColor: '#1E293B' },
  body:         { size: '0.9375rem', weight: 400, color: colors.text.secondary, lightColor: '#475569' },
  caption:      { size: '0.8125rem', weight: 400, color: colors.text.muted,     lightColor: '#64748B' },
  // ALL text renders HORIZONTALLY — no vertical text anywhere
  // Readability rules:
  //   Primary text: white/97 (#F8FAFC) — headings and important content
  //   Secondary text: white/60 equivalent (#94A3B8) — descriptions
  //   Muted text: white/40 equivalent (#64748B) — captions, timestamps
  //   NEVER go below #64748B for any readable text (minimum contrast 4.5:1)
} as const;

export const transitions = {
  tabSwitch: '150ms ease-out',     // Tab crossfade
  slideIn:   '200ms ease-out',     // Detail pages slide from right
  slideOut:  '200ms ease-out',     // Back navigation slide from left
  modal:     '200ms ease-out',     // Modal fade + scale from 95%
  hover:     '150ms ease-in-out',  // Button/card hover transitions
} as const;

export const animation = {
  // All animations MUST respect prefers-reduced-motion:
  // @media (prefers-reduced-motion: reduce) { transition: none !important; }
  reducedMotion: 'prefers-reduced-motion: reduce',
  spring: { stiffness: 300, damping: 30 },  // Default spring config for Framer Motion
  // Target 60fps — never drop below on any animation
} as const;

export const icons = {
  inline: 20,      // px — inline with text
  card: 24,        // px — inside cards
  navigation: 28,  // px — bottom tab bar
  // Color matches text context — never standalone color
  // Every icon MUST have a text label (no icon-only buttons except top bar)
} as const;
