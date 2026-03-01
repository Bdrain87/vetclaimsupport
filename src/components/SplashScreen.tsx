import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
  ready?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SplashScreen({
  onComplete,
  minimumDuration = 2200,
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
      ? Math.min(minimumDuration, 600)
      : minimumDuration;
    const timer = setTimeout(() => setTimerDone(true), t);
    return () => clearTimeout(timer);
  }, [minimumDuration, prefersReducedMotion]);

  useEffect(() => {
    if (!timerDone || !ready) return;
    setIsVisible(false);
    const exit = prefersReducedMotion ? 150 : 350;
    const timer = setTimeout(completeOnce, exit);
    return () => clearTimeout(timer);
  }, [timerDone, ready, prefersReducedMotion]);

  useEffect(() => {
    const safety = setTimeout(completeOnce, 8000);
    return () => clearTimeout(safety);
  }, []);

  const r = !!prefersReducedMotion;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#000' }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: r ? 0.15 : 0.35, ease: 'easeInOut' },
          }}
        >
          {/* Absolute black base */}
          <div className="absolute inset-0 bg-black" />

          {/* Atmospheric glow — large warm ambient layer */}
          {!r && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: 480,
                height: 480,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(197,165,90,0.06) 0%, rgba(197,165,90,0.01) 40%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: 0.15, ease: 'easeOut' }}
            />
          )}

          {/* Breathing inner glow */}
          {!r && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(217,190,108,0.08) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.5, 0.7] }}
              transition={{
                duration: 3,
                delay: 0.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          )}

          {/* Cinematic light sweep */}
          {!r && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.015) 45%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.015) 55%, transparent 60%)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, delay: 1.1, ease: EASE }}
            />
          )}

          {/* Content */}
          <div className="flex flex-col items-center text-center relative z-10">
            {/* App Icon */}
            <motion.div
              className="relative mb-10"
              initial={r ? { opacity: 0 } : { opacity: 0, scale: 0.88, y: 8 }}
              animate={r ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: r ? 0.2 : 0.9,
                delay: r ? 0.05 : 0.25,
                ease: EASE,
              }}
            >
              {/* Breathing glow behind icon */}
              {!r && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    inset: -16,
                    borderRadius: 32,
                    boxShadow:
                      '0 0 40px rgba(197,165,90,0.12), 0 0 80px rgba(197,165,90,0.04)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0.5, 0.8] }}
                  transition={{
                    duration: 2.5,
                    delay: 0.7,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Expanding ring */}
              {!r && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: 88,
                    height: 88,
                    marginTop: -44,
                    marginLeft: -44,
                    borderRadius: 26,
                    border: '1px solid rgba(197,165,90,0.2)',
                  }}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: [0, 0.6, 0] }}
                  transition={{ duration: 1.1, delay: 0.8, ease: 'easeOut' }}
                />
              )}

              <img
                src="/app-icon.png"
                alt=""
                width={80}
                height={80}
                style={{
                  borderRadius: 22,
                  display: 'block',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.6)',
                }}
              />
            </motion.div>

            {/* App Name — gold gradient, wide tracking */}
            <motion.h1
              className="m-0 font-semibold"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                fontSize: 20,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background:
                  'linear-gradient(135deg, #D9BE6C 0%, #C5A55A 40%, #A68B3C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={r ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={r ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: r ? 0.2 : 0.6,
                delay: r ? 0.15 : 0.85,
                ease: EASE,
              }}
            >
              Vet Claim Support
            </motion.h1>

            {/* Gold accent divider */}
            <motion.div
              className="mx-auto mt-4 rounded-full"
              style={{
                height: 1,
                width: 32,
                background:
                  'linear-gradient(90deg, transparent, rgba(197,165,90,0.4), transparent)',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: r ? 0.15 : 0.4,
                delay: r ? 0.2 : 1.15,
                ease: EASE,
              }}
            />

            {/* Tagline */}
            <motion.p
              className="m-0 mt-3"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
                fontSize: 13,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.03em',
                fontWeight: 400,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: r ? 0.2 : 0.5,
                delay: r ? 0.25 : 1.3,
              }}
            >
              Get the rating you earned
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
