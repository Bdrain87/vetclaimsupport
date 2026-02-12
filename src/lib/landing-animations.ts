import type { Variants, Transition } from 'framer-motion';

// ============================================================
// PREMIUM ANIMATION SYSTEM — Fortune 500 Level
// ============================================================

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

export const easeSlow: Transition = {
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const easeSmooth: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
};

// --- FADE VARIANTS ---
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: easeSmooth },
};

export const fadeInUpLarge: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { ...easeSmooth, duration: 0.8 } },
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

// --- COMPOUND CARD VARIANTS (like zpass.ai) ---
export const cardRevealRotate: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.85,
    rotate: 6,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const cardRevealScale: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// --- STAGGER CONTAINERS ---
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
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
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

// --- HOVER PRESETS ---
export const hoverLift = {
  whileHover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  whileTap: { scale: 0.98 },
};

export const hoverGlow = (color: string) => ({
  whileHover: {
    y: -4,
    boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`,
    transition: { duration: 0.3 },
  },
});

// --- GOLD GRADIENT CONSTANTS ---
export const GOLD_GRADIENT = 'linear-gradient(135deg, #E8C560 0%, #C5A442 40%, #A38A35 70%, #C5A442 100%)';
export const GOLD_GRADIENT_TEXT = {
  background: GOLD_GRADIENT,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
} as React.CSSProperties;

// --- MARQUEE KEYFRAMES (inject via style tag) ---
export const MARQUEE_STYLES = `
@keyframes marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
`;

// --- VIEWPORT PRESETS ---
export const viewportOnce = { once: true, margin: '-80px' as const };
export const viewportOnceEager = { once: true, margin: '-40px' as const };
