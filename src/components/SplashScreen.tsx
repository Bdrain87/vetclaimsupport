import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GOLD_GRADIENT, GOLD_GRADIENT_TEXT } from '@/lib/landing-animations';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
  ready?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SplashScreen({
  onComplete,
  minimumDuration = 2400,
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
    const exit = prefersReducedMotion ? 200 : 400;
    const timer = setTimeout(completeOnce, exit);
    return () => clearTimeout(timer);
  }, [timerDone, ready, prefersReducedMotion]);

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
          style={{ backgroundColor: '#000000' }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            transition: { duration: reduced ? 0.2 : 0.4, ease: 'easeInOut' },
          }}
        >
          {/* Opaque black base — blocks everything behind */}
          <div className="absolute inset-0 bg-black" />

          {/* Ambient gold glow */}
          {!reduced && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: 400,
                height: 400,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(197,165,90,0.10) 0%, rgba(197,165,90,0.03) 45%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0.7, 1], scale: [0.5, 1.1, 1] }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            />
          )}

          {/* Content */}
          <div className="flex flex-col items-center gap-5 text-center px-6 relative z-10">
            {/* Logo with ring */}
            <LogoWithRing reduced={reduced} />

            {/* App name */}
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.2 : 0.6,
                delay: reduced ? 0.2 : 0.7,
                ease: EASE,
              }}
            >
              <h1
                className="text-[28px] font-semibold tracking-[-0.02em] m-0 relative"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  ...GOLD_GRADIENT_TEXT,
                }}
              >
                Vet Claim Support

                {/* Shimmer sweep over text */}
                {!reduced && (
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.25) 48%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.25) 52%, transparent 65%)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      animation: 'splashTextShimmer 1.2s ease-in-out 1.1s forwards',
                    }}
                  />
                )}
              </h1>

              {/* Gold underline */}
              <motion.div
                className="mx-auto mt-2.5 rounded-full"
                style={{ height: 1.5, background: GOLD_GRADIENT, width: '70%' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.7 }}
                transition={{
                  duration: reduced ? 0.15 : 0.5,
                  delay: reduced ? 0.3 : 1.0,
                  ease: EASE,
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
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.2 : 0.5,
                delay: reduced ? 0.35 : 1.2,
                ease: EASE,
              }}
            >
              Get the rating you earned
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0.4 : 1.5 }}
            >
              <LoadingBar reduced={reduced} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Logo with animated gold ring ────────────────────────────────────────────

function LogoWithRing({ reduced }: { reduced: boolean }) {
  const size = 110;
  const borderRadius = 22;
  const straight = size - 2 - 2 * borderRadius;
  const perimeter = 4 * straight + 2 * Math.PI * borderRadius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Logo image */}
      <motion.img
        src="/app-icon.png"
        alt="Vet Claim Support"
        width={size}
        height={size}
        style={{ borderRadius, display: 'block' }}
        initial={
          reduced
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.85 }
        }
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, scale: 1 }
        }
        transition={
          reduced
            ? { duration: 0.2, delay: 0.05 }
            : { type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }
        }
      />

      {/* Gold ring draw */}
      {!reduced && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A68B3C" />
              <stop offset="50%" stopColor="#D9BE6C" />
              <stop offset="100%" stopColor="#A68B3C" />
            </linearGradient>
            <filter id="ringGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect
            x="2"
            y="2"
            width={size - 4}
            height={size - 4}
            rx={borderRadius - 1}
            ry={borderRadius - 1}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter}
            filter="url(#ringGlow)"
            style={{
              animation: 'splashRingDraw 0.8s ease-out 0.5s forwards',
            }}
          />
        </svg>
      )}

      {/* Shimmer sweep over logo */}
      {!reduced && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ borderRadius }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.2) 55%, transparent 70%)',
              animation: 'splashLogoShimmer 0.7s ease-in-out 0.9s forwards',
              transform: 'translateX(-120%)',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Premium loading bar ─────────────────────────────────────────────────────

function LoadingBar({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="rounded-full overflow-hidden relative"
      style={{
        width: 120,
        height: 2.5,
        backgroundColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Gold fill that travels */}
      <div
        className="h-full rounded-full"
        style={{
          background: GOLD_GRADIENT,
          animation: reduced ? 'none' : 'splashBarTravel 1.6s ease-in-out infinite',
          width: reduced ? '100%' : undefined,
          opacity: reduced ? 0.5 : undefined,
        }}
      />
      {/* Bright leading edge */}
      {!reduced && (
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            width: 12,
            background:
              'radial-gradient(ellipse at center, rgba(217,190,108,0.9), transparent)',
            animation: 'splashBarGlow 1.6s ease-in-out infinite',
            boxShadow: '0 0 8px rgba(217,190,108,0.5)',
          }}
        />
      )}
    </div>
  );
}

export default SplashScreen;
