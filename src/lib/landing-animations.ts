export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const scaleOnHover = {
  whileHover: { scale: 1.03, y: -2 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
};

export const goldSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};
