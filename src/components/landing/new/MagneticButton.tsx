import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number; // max pixel movement, default 4
}

export function MagneticButton({ children, className = '', style, strength = 4 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      // Proximity zone ~100px around button
      const dist = Math.sqrt(distX * distX + distY * distY);
      const maxDist = 100;
      if (dist < maxDist) {
        const factor = (1 - dist / maxDist) * strength;
        x.set((distX / maxDist) * factor);
        y.set((distY / maxDist) * factor);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [x, y, strength],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Disable on touch
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
  if (isTouchDevice) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      className="inline-block"
      style={{ padding: '40px', margin: '-40px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        className={className}
        style={{ ...style, x: springX, y: springY }}
      >
        {children}
      </motion.div>
    </div>
  );
}
