import * as React from 'react';

// Animated counter hook
export function useAnimatedCounter(
  end: number,
  duration: number = 1000,
  enabled: boolean = true
): number {
  const [count, setCount] = React.useState(0);
  const startTime = React.useRef<number | null>(null);
  const animationFrame = React.useRef<number>();

  React.useEffect(() => {
    if (!enabled) {
      setCount(end);
      return;
    }

    setCount(0);
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [end, duration, enabled]);

  return count;
}
