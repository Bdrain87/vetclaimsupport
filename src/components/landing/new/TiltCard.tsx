import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TiltCard({ children, className = '', style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      rotateX.set((y - 0.5) * -10); // ±5 degrees
      rotateY.set((x - 0.5) * 10);
      glareX.set(x * 100);
      glareY.set(y * 100);
    },
    [rotateX, rotateY, glareX, glareY],
  );

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  // Disable on touch devices
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  if (isTouchDevice) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        perspective: 800,
        transformStyle: 'preserve-3d',
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
        style={{
          opacity: hovering ? 0.07 : 0,
          background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.8), transparent 60%)`,
          borderRadius: 'inherit',
        }}
      />
    </motion.div>
  );
}
