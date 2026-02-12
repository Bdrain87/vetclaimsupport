import type { Transition, Variants } from 'framer-motion';

// ---------------------------------------------------------------------------
// Spring configs
// ---------------------------------------------------------------------------
export const vcsSpring: Transition = { type: 'spring', stiffness: 400, damping: 30 };
export const vcsSpringGentle: Transition = { type: 'spring', stiffness: 300, damping: 25 };

// ---------------------------------------------------------------------------
// Page-level entrance (used by Dashboard, etc.)
// ---------------------------------------------------------------------------
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: vcsSpringGentle,
};

// ---------------------------------------------------------------------------
// Staggered children
// ---------------------------------------------------------------------------
export const staggerChild = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { ...vcsSpring, delay: index * 0.05 },
});

// ---------------------------------------------------------------------------
// Stagger container + item variants (for AnimatePresence lists)
// ---------------------------------------------------------------------------
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: vcsSpring,
  },
};

// ---------------------------------------------------------------------------
// Fade variants
// ---------------------------------------------------------------------------
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: vcsSpringGentle },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Modal / overlay
// ---------------------------------------------------------------------------
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Reduced motion helper — returns static variants (no movement)
// ---------------------------------------------------------------------------
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
};
