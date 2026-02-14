import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}

const THRESHOLD = -80;

export function SwipeToDelete({ children, onDelete, disabled }: SwipeToDeleteProps) {
  const x = useMotionValue(0);
  const bg = useTransform(x, [0, THRESHOLD], ['rgba(239,68,68,0)', 'rgba(239,68,68,0.15)']);
  const iconOpacity = useTransform(x, [0, THRESHOLD / 2, THRESHOLD], [0, 0.5, 1]);
  const [swiping, setSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (disabled) return <>{children}</>;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setSwiping(false);
    if (info.offset.x < THRESHOLD) {
      onDelete();
    }
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-xl">
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-6"
        style={{ backgroundColor: bg }}
      >
        <motion.div style={{ opacity: iconOpacity }}>
          <Trash2 className="h-5 w-5 text-destructive" />
        </motion.div>
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: THRESHOLD, right: 0 }}
        dragElastic={0.1}
        dragSnapToOrigin
        onDragStart={() => setSwiping(true)}
        onDragEnd={handleDragEnd}
        style={{ x, touchAction: swiping ? 'none' : 'pan-y' }}
        className="relative bg-card"
      >
        {children}
      </motion.div>
    </div>
  );
}
