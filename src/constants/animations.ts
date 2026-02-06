export const vcsSpring = { type: "spring" as const, stiffness: 400, damping: 30 };
export const vcsSpringGentle = { type: "spring" as const, stiffness: 300, damping: 25 };

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: vcsSpringGentle,
};

export const staggerChild = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { ...vcsSpring, delay: index * 0.05 },
});
