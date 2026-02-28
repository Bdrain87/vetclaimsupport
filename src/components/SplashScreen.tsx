import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
  /**
   * When provided, the splash screen will not dismiss until `ready` is true
   * AND the minimum duration has elapsed.  This allows callers to gate
   * dismissal on async work such as store rehydration.
   */
  ready?: boolean;
}

export function SplashScreen({
  onComplete,
  minimumDuration = 1500,
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

  // Track when the minimum display time has elapsed.
  useEffect(() => {
    const displayTime = prefersReducedMotion
      ? Math.min(minimumDuration, 800)
      : minimumDuration;

    const timer = setTimeout(() => setTimerDone(true), displayTime);

    return () => clearTimeout(timer);
  }, [minimumDuration, prefersReducedMotion]);

  // Dismiss only when both the timer has elapsed and the caller signals ready.
  useEffect(() => {
    if (!timerDone || !ready) return;

    setIsVisible(false);

    const exitDuration = prefersReducedMotion ? 300 : 600;
    const innerTimer = setTimeout(completeOnce, exitDuration);

    return () => clearTimeout(innerTimer);
  }, [timerDone, ready, prefersReducedMotion]);

  // Safety timeout: force-complete after 8 seconds no matter what.
  // (Raised from 5 s to accommodate slow decryption on cold boot.)
  useEffect(() => {
    const safety = setTimeout(completeOnce, 8000);
    return () => clearTimeout(safety);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#000000' }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: prefersReducedMotion ? 0.25 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          <div className="flex flex-col items-center text-center px-6 relative z-10">
            {/* Logo — clean materialization, no border, no ring */}
            <motion.img
              src="/app-icon.png"
              alt="Vet Claim Support"
              width={100}
              height={100}
              style={{ borderRadius: 22, display: 'block' }}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.85, filter: 'blur(16px)' }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, filter: 'blur(0px)' }
              }
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            {/* App name — clean white, not gold */}
            <motion.h1
              className="text-[22px] font-semibold tracking-[-0.02em] mt-5 mb-0"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                color: 'rgba(255, 255, 255, 0.9)',
              }}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.15 : 0.5,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Vet Claim Support
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-sm m-0 mt-1.5"
              style={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.15 : 0.4,
                delay: 0.8,
              }}
            >
              Get the rating you earned
            </motion.p>

            {/* Minimal loading dots */}
            <motion.div
              className="flex items-center gap-1.5 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  }}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { opacity: [0.25, 0.8, 0.25] }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
