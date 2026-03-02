import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
  ready?: boolean;
}

export function SplashScreen({
  onComplete,
  minimumDuration = 2000,
  ready = true,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timerDone, setTimerDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);
  onCompleteRef.current = onComplete;

  const completeOnce = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onCompleteRef.current();
  };

  const r = !!prefersReducedMotion;

  // Minimum display timer
  useEffect(() => {
    const t = r ? Math.min(minimumDuration, 600) : minimumDuration;
    const timer = setTimeout(() => setTimerDone(true), t);
    return () => clearTimeout(timer);
  }, [minimumDuration, r]);

  // Begin exit when timer done + ready
  useEffect(() => {
    if (!timerDone || !ready) return;
    setIsVisible(false);
    const exit = r ? 150 : 300;
    const timer = setTimeout(completeOnce, exit);
    return () => clearTimeout(timer);
  }, [timerDone, ready, r]);

  // Safety timeout
  useEffect(() => {
    const safety = setTimeout(completeOnce, 8000);
    return () => clearTimeout(safety);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: '#000' }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: r ? 0.15 : 0.3, ease: 'easeIn' },
          }}
        >
          <div className="flex flex-col items-center text-center">
            {/* App Icon */}
            <motion.div
              initial={r ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={r ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{
                duration: r ? 0.2 : 0.6,
                delay: r ? 0.05 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <img
                src="/app-icon.png"
                alt=""
                width={72}
                height={72}
                style={{
                  borderRadius: 20,
                  display: 'block',
                  boxShadow: '0 0 60px rgba(197,165,90,0.15)',
                }}
              />
            </motion.div>

            {/* Wordmark */}
            <motion.p
              className="m-0 mt-5"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                fontSize: 14,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 500,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: r ? 0.2 : 0.5,
                delay: r ? 0.15 : 0.6,
              }}
            >
              Vet Claim Support
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
