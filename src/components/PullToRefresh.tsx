import { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => void | Promise<void>;
}

const PULL_THRESHOLD = 80;

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const pullY = useMotionValue(0);
  const indicatorOpacity = useTransform(pullY, [0, PULL_THRESHOLD / 2, PULL_THRESHOLD], [0, 0.5, 1]);
  const indicatorRotation = useTransform(pullY, [0, PULL_THRESHOLD], [0, 180]);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = (e.currentTarget as HTMLElement).scrollTop;
    if (scrollTop <= 0) {
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pullingRef.current || refreshing) return;
    const diff = Math.max(0, (e.touches[0].clientY - startYRef.current) * 0.4);
    pullY.set(Math.min(diff, PULL_THRESHOLD + 20));
  }, [refreshing, pullY]);

  const handleTouchEnd = useCallback(async () => {
    if (!pullingRef.current) return;
    pullingRef.current = false;
    if (pullY.get() >= PULL_THRESHOLD && !refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    pullY.set(0);
  }, [pullY, refreshing, onRefresh]);

  return (
    <div
      className="relative overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className="flex justify-center items-center overflow-hidden"
        style={{ height: pullY, opacity: indicatorOpacity }}
      >
        <motion.div
          style={{ rotate: refreshing ? undefined : indicatorRotation }}
          className={refreshing ? 'animate-spin' : ''}
        >
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
}
