import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GOLD_GRADIENT, GOLD_GRADIENT_TEXT } from '@/lib/landing-animations';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
  ready?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SplashScreen({
  onComplete,
  minimumDuration = 2800,
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
    const exit = prefersReducedMotion ? 200 : 450;
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
            scale: 1.06,
            transition: { duration: reduced ? 0.2 : 0.45, ease: 'easeInOut' },
          }}
        >
          {/* Absolute black — nothing bleeds through */}
          <div className="absolute inset-0 bg-black" />

          {/* Ambient gold glow behind emblem */}
          {!reduced && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: 320,
                height: 320,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(197,165,90,0.08) 0%, rgba(197,165,90,0.02) 50%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
            />
          )}

          {/* Content */}
          <div className="flex flex-col items-center gap-8 text-center px-6 relative z-10">
            {/* Animated Shield + V Emblem */}
            <ShieldEmblem reduced={reduced} />

            {/* App name */}
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduced ? 0.2 : 0.7,
                delay: reduced ? 0.2 : 1.4,
                ease: EASE_OUT,
              }}
            >
              <h1
                className="text-[28px] font-semibold tracking-[-0.01em] m-0 relative overflow-hidden"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  ...GOLD_GRADIENT_TEXT,
                }}
              >
                Vet Claim Support

                {/* Shimmer pass over text */}
                {!reduced && (
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 49%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 51%, transparent 60%)',
                    }}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.6, delay: 2.0, ease: 'easeInOut' }}
                  />
                )}
              </h1>

              {/* Gold underline draws in */}
              <motion.div
                className="mx-auto mt-3 rounded-full"
                style={{ height: 1.5, background: GOLD_GRADIENT, width: '60%' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.6 }}
                transition={{
                  duration: reduced ? 0.15 : 0.5,
                  delay: reduced ? 0.3 : 1.7,
                  ease: EASE,
                }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-[15px] m-0 -mt-2"
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                letterSpacing: '0.02em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduced ? 0.2 : 0.6,
                delay: reduced ? 0.35 : 1.9,
              }}
            >
              Get the rating you earned
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0.4 : 2.1 }}
            >
              <LoadingBar reduced={reduced} />
            </motion.div>
          </div>

          {/* Gold flash ripple on exit */}
          {!reduced && !isVisible && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: '1px solid rgba(197,165,90,0.3)',
              }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Animated Shield + V Emblem ──────────────────────────────────────────────
// No app icon. Pure SVG animation. Shield outline draws, V draws, gold fill washes in.

function ShieldEmblem({ reduced }: { reduced: boolean }) {
  const [showFill, setShowFill] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShowFill(true);
      return;
    }
    const timer = setTimeout(() => setShowFill(true), 1100);
    return () => clearTimeout(timer);
  }, [reduced]);

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="90" height="108" viewBox="0 0 100 120">
          <defs>
            <linearGradient id="goldFillR" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A68B3C" />
              <stop offset="50%" stopColor="#D9BE6C" />
              <stop offset="100%" stopColor="#C5A55A" />
            </linearGradient>
          </defs>
          <path
            d="M50,6 C70,6 88,10 88,20 L88,58 C88,82 70,102 50,112 C30,102 12,82 12,58 L12,20 C12,10 30,6 50,6 Z"
            fill="none"
            stroke="url(#goldFillR)"
            strokeWidth="2"
            opacity="0.7"
          />
          <path
            d="M33,38 L50,80 L67,38"
            fill="none"
            stroke="url(#goldFillR)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    );
  }

  return (
    <div className="relative" style={{ width: 90, height: 108 }}>
      <svg width="90" height="108" viewBox="0 0 100 120">
        <defs>
          <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A68B3C" />
            <stop offset="50%" stopColor="#D9BE6C" />
            <stop offset="100%" stopColor="#A68B3C" />
          </linearGradient>
          <linearGradient id="goldFill" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#A68B3C" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D9BE6C" stopOpacity="0.03" />
          </linearGradient>
          <filter id="emblemGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="vGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shield outline — draws itself */}
        <motion.path
          d="M50,6 C70,6 88,10 88,20 L88,58 C88,82 70,102 50,112 C30,102 12,82 12,58 L12,20 C12,10 30,6 50,6 Z"
          fill="none"
          stroke="url(#goldStroke)"
          strokeWidth="2"
          filter="url(#emblemGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.0, ease: 'easeInOut', delay: 0.15 },
            opacity: { duration: 0.3, delay: 0.15 },
          }}
        />

        {/* Shield gold fill — washes in after outline completes */}
        <motion.path
          d="M50,6 C70,6 88,10 88,20 L88,58 C88,82 70,102 50,112 C30,102 12,82 12,58 L12,20 C12,10 30,6 50,6 Z"
          fill="url(#goldFill)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: showFill ? 1 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* V letterform — draws after shield starts */}
        <motion.path
          d="M33,38 L50,80 L67,38"
          fill="none"
          stroke="url(#goldStroke)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#vGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.6 },
            opacity: { duration: 0.2, delay: 0.6 },
          }}
        />
      </svg>

      {/* Pulse ring that radiates outward after emblem completes */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          width: 90,
          height: 90,
          marginTop: -45,
          marginLeft: -45,
          borderRadius: '50%',
          border: '1px solid rgba(197,165,90,0.4)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 2.2, opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.0, delay: 1.15, ease: 'easeOut' }}
      />

      {/* Second smaller pulse */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          width: 60,
          height: 60,
          marginTop: -30,
          marginLeft: -30,
          borderRadius: '50%',
          border: '1px solid rgba(217,190,108,0.3)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 2.5, opacity: [0, 0.4, 0] }}
        transition={{ duration: 0.8, delay: 1.35, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Loading bar ─────────────────────────────────────────────────────────────

function LoadingBar({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="rounded-full overflow-hidden relative"
      style={{
        width: 100,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          background: GOLD_GRADIENT,
          animation: reduced ? 'none' : 'splashBarTravel 1.8s ease-in-out infinite',
          width: reduced ? '100%' : undefined,
          opacity: reduced ? 0.4 : undefined,
        }}
      />
      {!reduced && (
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            width: 10,
            background:
              'radial-gradient(ellipse at center, rgba(217,190,108,0.9), transparent)',
            animation: 'splashBarGlow 1.8s ease-in-out infinite',
            boxShadow: '0 0 6px rgba(217,190,108,0.4)',
          }}
        />
      )}
    </div>
  );
}

export default SplashScreen;
