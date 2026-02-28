import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GOLD_GRADIENT, GOLD_GRADIENT_TEXT } from '@/lib/landing-animations';

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
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.15,
            transition: {
              duration: prefersReducedMotion ? 0.3 : 0.6,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Ambient gold glow */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(197,165,90,0.06) 0%, transparent 60%)',
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Converging gold particles */}
          {!prefersReducedMotion && <GoldParticles />}

          <div className="flex flex-col items-center gap-5 text-center px-6 relative z-10">
            {/* Logo with materialization + ring + shimmer */}
            <LogoBlock prefersReducedMotion={!!prefersReducedMotion} />

            {/* App Name — gold gradient text */}
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24, filter: 'blur(8px)' }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, filter: 'blur(0px)' }
              }
              transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
            >
              <h1
                className="text-[28px] font-semibold tracking-[-0.02em] m-0"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  ...GOLD_GRADIENT_TEXT,
                }}
              >
                Vet Claim Support
              </h1>

              {/* Gold underline */}
              <motion.div
                className="mx-auto mt-2 h-[1px] rounded-full"
                style={{ background: GOLD_GRADIENT, width: '80%' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 1.0, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-base m-0"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.1, ease: 'easeOut' }}
            >
              Get the rating you earned
            </motion.p>

            {/* Slim loading bar */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <PremiumLoadingBar prefersReducedMotion={!!prefersReducedMotion} />
            </motion.div>
          </div>

          {/* Brief gold flash on exit */}
          {!prefersReducedMotion && !isVisible && (
            <motion.div
              className="absolute inset-0 z-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(197,165,90,0.15) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** 14 tiny gold circles that converge inward toward center */
function GoldParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const radius = 150 + Math.random() * 50;
      return {
        id: i,
        startX: Math.cos(angle) * radius,
        startY: Math.sin(angle) * radius,
        size: 2 + Math.random(),
        delay: i * 0.025,
      };
    });
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(197,165,90,0.7)',
            left: '50%',
            top: '50%',
          }}
          initial={{ x: p.startX, y: p.startY, opacity: 0.8 }}
          animate={{ x: 0, y: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </>
  );
}

/** Logo with materialization, SVG ring draw, and shimmer sweep */
function LogoBlock({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  const size = 120;
  const borderRadius = 20;
  // Accurate rounded-rect perimeter: 4 straight edges + 4 quarter-circle arcs
  const straight = (size - 2) - 2 * borderRadius; // each straight segment
  const perimeter = 4 * straight + 2 * Math.PI * borderRadius; // ~438

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Logo image: blur-in materialization */}
      <motion.img
        src="/app-icon.png"
        alt="Vet Claim Support"
        width={size}
        height={size}
        style={{ borderRadius, display: 'block' }}
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.6, filter: 'blur(24px)' }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{
          duration: prefersReducedMotion ? 0.2 : 0.6,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Gold ring drawing around logo */}
      {!prefersReducedMotion && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <rect
            x="1"
            y="1"
            width={size - 2}
            height={size - 2}
            rx={borderRadius}
            ry={borderRadius}
            fill="none"
            stroke="rgba(197,165,90,0.5)"
            strokeWidth="1.5"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter}
            style={{
              animation: 'goldRingDraw 700ms ease-out 400ms forwards',
            }}
          />
        </svg>
      )}

      {/* Shimmer sweep across logo surface */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ borderRadius }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(245,214,128,0.12) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)',
              animation: 'shimmerSlide 800ms ease-in-out 700ms forwards',
              transform: 'translateX(-100%)',
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

/** Slim 2px loading bar with gold shimmer */
function PremiumLoadingBar({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <div
      className="rounded-full overflow-hidden"
      style={{
        width: 120,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          background: GOLD_GRADIENT,
          animation: prefersReducedMotion
            ? 'none'
            : 'shimmerBar 1.2s ease-in-out infinite',
          width: prefersReducedMotion ? '100%' : undefined,
          opacity: prefersReducedMotion ? 0.6 : undefined,
        }}
      />
    </div>
  );
}

export default SplashScreen;
