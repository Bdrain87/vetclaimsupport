import type { Variants, Transition } from 'framer-motion';

// ============================================================
// PREMIUM DESIGN SYSTEM — Based on Linear/Vercel/Fey/Antimetal
// ============================================================

// --- EASING CURVES (extracted from production sites) ---
export const EASE_VERCEL: [number, number, number, number] = [0.175, 0.885, 0.32, 1.1];
export const EASE_DEVIN: [number, number, number, number] = [0.17, 0.67, 0.1, 0.99];
export const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

// --- TRANSITION PRESETS ---
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 15,
  mass: 0.8,
};

export const easeSmooth: Transition = {
  duration: 0.6,
  ease: EASE_SMOOTH,
};

export const easeSlow: Transition = {
  duration: 0.8,
  ease: EASE_SMOOTH,
};

export const easeMicro: Transition = {
  duration: 0.15,
  ease: EASE_VERCEL,
};

// --- FADE VARIANTS ---
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: easeSmooth },
};

export const fadeInUpLarge: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: easeSlow },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: easeSmooth },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: easeSmooth },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: easeSmooth },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// --- COMPOUND CARD VARIANTS ---
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: EASE_SMOOTH },
  },
};

export const cardRevealRotate: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, rotate: 3 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotate: 0,
    transition: { duration: 0.8, ease: EASE_DEVIN },
  },
};

export const cardRevealScale: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: EASE_SMOOTH },
  },
};

// --- STAGGER CONTAINERS ---
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

// --- SCALE / POP VARIANTS ---
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: springBouncy },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 20 },
  },
};

// --- HOVER PRESETS ---
export const hoverLift = {
  y: -6,
  scale: 1.02,
  transition: { duration: 0.25, ease: EASE_VERCEL },
};

export const hoverTap = { scale: 0.98 };

export const hoverGlow = (color: string = 'rgba(191,149,63,0.3)') => ({
  y: -4,
  boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`,
  transition: { duration: 0.3 },
});

// --- METALLIC GOLD GRADIENT CONSTANTS ---
export const GOLD_GRADIENT = 'linear-gradient(90deg, #D4AA40 0%, #F0D050 25%, #FFD700 50%, #F0D050 75%, #D4AA40 100%)';
export const GOLD_GRADIENT_TEXT = {
  background: GOLD_GRADIENT,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
} as React.CSSProperties;

export const SILVER_GRADIENT = 'linear-gradient(135deg, #D0D0D0 0%, #A0A0A0 50%, #B8B8B8 100%)';
export const SILVER_GRADIENT_TEXT = {
  background: SILVER_GRADIENT,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
} as React.CSSProperties;

// --- PREMIUM CARD STYLING (Antimetal 3-layer shadow + Raycast borders) ---
export const CARD_STYLE = {
  backgroundColor: '#111111',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '24px',
} as React.CSSProperties;

export const CARD_SHADOW = '0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15), 0 12px 24px -8px rgba(0,0,0,0.2)';

export const CARD_STYLE_GOLD = {
  backgroundColor: '#111111',
  border: '1px solid rgba(191, 149, 63, 0.12)',
  borderRadius: '24px',
} as React.CSSProperties;

// --- SECTION BACKGROUND OVERLAYS ---
export const SECTION_TOP_GLOW = 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 30%)';
export const SECTION_TOP_GLOW_GOLD = 'linear-gradient(180deg, rgba(191,149,63,0.04) 0%, transparent 30%)';

// --- PILL LABEL STYLE ---
export const PILL_STYLE = {
  background: 'linear-gradient(90deg, #D4AA40 0%, #F0D050 25%, #FFD700 50%, #F0D050 75%, #D4AA40 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text' as const,
  border: '1px solid rgba(191, 149, 63, 0.25)',
  borderRadius: '9999px',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  padding: '8px 20px',
  display: 'inline-block',
} as React.CSSProperties;

// --- NAV GLASSMORPHISM ---
export const NAV_GLASS = {
  backgroundColor: 'rgba(10, 10, 10, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
} as React.CSSProperties;

// --- HEADING STYLE TOKENS ---
export const HEADING_H1_STYLE = {
  letterSpacing: '-0.03em',
  fontWeight: 600,
  lineHeight: 1.1,
} as React.CSSProperties;

export const HEADING_H2_STYLE = {
  letterSpacing: '-0.025em',
  fontWeight: 500,
  lineHeight: 1.15,
} as React.CSSProperties;

export const HEADING_H3_STYLE = {
  letterSpacing: '-0.02em',
  fontWeight: 500,
  lineHeight: 1.2,
} as React.CSSProperties;

// --- MARQUEE KEYFRAMES ---
export const MARQUEE_STYLES = `
@keyframes marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(191,149,63,0.1); }
  50% { box-shadow: 0 0 40px rgba(191,149,63,0.25); }
}
`;

// --- VIEWPORT PRESETS ---
export const viewportOnce: { once: true; margin: string } = { once: true, margin: '-80px' };
export const viewportOnceEager = { once: true, amount: 0.2 };
