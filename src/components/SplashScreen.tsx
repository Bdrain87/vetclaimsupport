import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GOLD_GRADIENT, GOLD_GRADIENT_TEXT } from '@/lib/landing-animations';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
  ready?: boolean;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

  useEffect(() => {
    const t = prefersReducedMotion
      ? Math.min(minimumDuration, 800)
      : minimumDuration;
    const timer = setTimeout(() => setTimerDone(true), t);
    return () => clearTimeout(timer);
  }, [minimumDuration, prefersReducedMotion]);

  useEffect(() => {
    if (!timerDone || !ready) return;
    setIsVisible(false);
    const exit = prefersReducedMotion ? 200 : 500;
    const timer = setTimeout(completeOnce, exit);
    return () => clearTimeout(timer);
  }, [timerDone, ready, prefersReducedMotion]);

  // Safety: force-complete after 8s no matter what.
  useEffect(() => {
    const safety = setTimeout(completeOnce, 8000);
    return () => clearTimeout(safety);
  }, []);

  const reduced = !!prefersReducedMotion;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: '#000' }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: reduced ? 0.2 : 0.5, ease: EASE_OUT_EXPO },
          }}
        >
          {/* Soft ambient glow behind logo */}
          {!reduced && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: 300,
                height: 300,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(197,165,90,0.12) 0%, rgba(197,165,90,0.04) 40%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
            />
          )}

          <div className="flex flex-col items-center gap-6 text-center px-6 relative z-10">
            {/* Logo */}
            <motion.img
              src="/app-icon.png"
              alt="Vet Claim Support"
              width={100}
              height={100}
              style={{ borderRadius: 22, display: 'block' }}
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, filter: 'blur(12px)' }
              }
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, filter: 'blur(0px)' }
              }
              transition={{
                duration: reduced ? 0.2 : 0.7,
                delay: reduced ? 0.05 : 0.15,
                ease: EASE_OUT_EXPO,
              }}
            />

            {/* App name */}
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.2 : 0.6,
                delay: reduced ? 0.2 : 0.55,
                ease: EASE_OUT_EXPO,
              }}
            >
              <h1
                className="text-[26px] font-semibold tracking-[-0.02em] m-0"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  ...GOLD_GRADIENT_TEXT,
                }}
              >
                Vet Claim Support
              </h1>

              {/* Thin gold line */}
              <motion.div
                className="mx-auto mt-3 rounded-full"
                style={{
                  height: 1,
                  background: GOLD_GRADIENT,
                  width: '60%',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.6 }}
                transition={{
                  duration: reduced ? 0.15 : 0.5,
                  delay: reduced ? 0.3 : 0.8,
                  ease: EASE_OUT_EXPO,
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-[15px] m-0"
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduced ? 0.2 : 0.5,
                delay: reduced ? 0.35 : 1.0,
              }}
            >
              Get the rating you earned
            </motion.p>

            {/* Loading indicator — minimal pulsing dot row */}
            <motion.div
              className="flex gap-1.5 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0.4 : 1.3 }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: 'rgba(197,165,90,0.5)',
                    animation: reduced
                      ? 'none'
                      : `splashDotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
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
