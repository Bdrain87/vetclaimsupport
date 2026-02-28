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
          {/* Layer 1: Deep background + gold dust field */}
          {!prefersReducedMotion && (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(197,165,90,0.07) 0%, transparent 70%)',
                }}
              />
              <Vignette />
              <GoldDustField />
            </>
          )}

          {/* Layer 2: Converging particle burst */}
          {!prefersReducedMotion && <ConvergenceBurst />}

          <div className="flex flex-col items-center gap-5 text-center px-6 relative z-10">
            {/* Layer 3: Logo reveal */}
            <LogoBlock prefersReducedMotion={!!prefersReducedMotion} />

            {/* Layer 4: Cinematic typography */}
            {prefersReducedMotion ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
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
                <div
                  className="mx-auto mt-2 h-[1px] rounded-full"
                  style={{ background: GOLD_GRADIENT, width: '80%' }}
                />
              </motion.div>
            ) : (
              <CinematicTitle />
            )}

            {/* Tagline */}
            <motion.p
              className="text-base m-0"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, letterSpacing: '0.15em' }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, letterSpacing: '0.02em' }
              }
              transition={{
                duration: prefersReducedMotion ? 0.3 : 0.5,
                delay: prefersReducedMotion ? 0.5 : 1.4,
                ease: 'easeOut',
              }}
            >
              Get the rating you earned
            </motion.p>

            {/* Layer 5: Premium loading bar */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0.6 : 1.5 }}
            >
              <PremiumLoadingBar prefersReducedMotion={!!prefersReducedMotion} />
            </motion.div>
          </div>

          {/* Layer 6: Gold flash on exit */}
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

// ─── Layer 1 helpers ────────────────────────────────────────────────────────

/** Edge-darkening vignette */
function Vignette() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)',
      }}
    />
  );
}

/** 35 tiny gold particles floating with slow random drift + opacity pulse */
function GoldDustField() {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 1 + Math.random();
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 2;
      return { id: i, x, y, size, duration, delay };
    });
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(197,165,90,0.5)',
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            x: [0, (Math.random() - 0.5) * 20, 0],
            y: [0, (Math.random() - 0.5) * 20, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

// ─── Layer 2: Convergence burst ─────────────────────────────────────────────

/** 24 particles converge to center, then starburst on impact */
function ConvergenceBurst() {
  const [impacted, setImpacted] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 200 + Math.random() * 80;
      return {
        id: i,
        startX: Math.cos(angle) * radius,
        startY: Math.sin(angle) * radius,
        size: 2 + Math.random(),
        delay: i * 0.02,
      };
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setImpacted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Converging particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: '50%',
            top: '50%',
            boxShadow: '0 0 4px rgba(197,165,90,0.6)',
            backgroundColor: 'rgba(197,165,90,0.8)',
          }}
          initial={{ x: p.startX, y: p.startY, opacity: 0.9 }}
          animate={{ x: 0, y: 0, opacity: 0 }}
          transition={{
            duration: 0.5,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      {/* Central flash on impact */}
      {impacted && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 40,
            height: 40,
            left: '50%',
            top: '50%',
            marginLeft: -20,
            marginTop: -20,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(245,214,128,0.8) 0%, rgba(197,165,90,0.3) 50%, transparent 70%)',
          }}
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}

      {/* 8 radial light rays on impact */}
      {impacted &&
        Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <motion.div
              key={`ray-${i}`}
              className="absolute pointer-events-none"
              style={{
                width: 2,
                height: 60,
                left: '50%',
                top: '50%',
                marginLeft: -1,
                marginTop: -30,
                background:
                  'linear-gradient(to bottom, rgba(245,214,128,0.6), transparent)',
                transformOrigin: 'center center',
                rotate: `${(angle * 180) / Math.PI}deg`,
              }}
              initial={{ scaleY: 0, opacity: 0.8 }}
              animate={{ scaleY: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          );
        })}
    </>
  );
}

// ─── Layer 3: Logo reveal ───────────────────────────────────────────────────

/** Logo with enhanced blur-in, double gold ring draw, and dual shimmer sweep */
function LogoBlock({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  const size = 120;
  const borderRadius = 20;
  const straight = (size - 2) - 2 * borderRadius;
  const perimeter = 4 * straight + 2 * Math.PI * borderRadius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Logo image: enhanced blur-in materialization */}
      <motion.img
        src="/app-icon.png"
        alt="Vet Claim Support"
        width={size}
        height={size}
        style={{ borderRadius, display: 'block' }}
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.5, filter: 'blur(30px)' }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{
          duration: prefersReducedMotion ? 0.2 : 0.7,
          delay: prefersReducedMotion ? 0.1 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Double gold ring draw */}
      {!prefersReducedMotion && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <filter id="ring-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer ring — subtle */}
          <rect
            x="1"
            y="1"
            width={size - 2}
            height={size - 2}
            rx={borderRadius}
            ry={borderRadius}
            fill="none"
            stroke="rgba(197,165,90,0.35)"
            strokeWidth="1"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter}
            style={{
              animation: 'splashRingDrawOuter 800ms ease-out 500ms forwards',
            }}
          />
          {/* Inner ring — brighter with glow */}
          <rect
            x="3"
            y="3"
            width={size - 6}
            height={size - 6}
            rx={borderRadius - 2}
            ry={borderRadius - 2}
            fill="none"
            stroke="rgba(217,190,108,0.6)"
            strokeWidth="1.5"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter}
            filter="url(#ring-glow)"
            style={{
              animation:
                'splashRingDrawInner 600ms ease-out 600ms forwards, splashRingBreathe 2s ease-in-out 1200ms infinite',
            }}
          />
        </svg>
      )}

      {/* First shimmer sweep — warm white at 800ms */}
      {!prefersReducedMotion && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ borderRadius }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.18) 55%, transparent 70%)',
              animation: 'splashShimmerSweep 600ms ease-in-out 800ms forwards',
              transform: 'translateX(-100%)',
            }}
          />
        </div>
      )}

      {/* Second shimmer sweep — gold-tinted at 1100ms */}
      {!prefersReducedMotion && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ borderRadius }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, transparent 30%, rgba(245,214,128,0.15) 45%, rgba(197,165,90,0.1) 50%, rgba(245,214,128,0.15) 55%, transparent 70%)',
              animation: 'splashShimmerSweep 600ms ease-in-out 1100ms forwards',
              transform: 'translateX(-100%)',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Layer 4: Cinematic typography ──────────────────────────────────────────

/** Word-by-word reveal: "Vet" → "Claim" → "Support" */
function CinematicTitle() {
  const words = [
    { text: 'Vet', delay: 0.9 },
    { text: 'Claim', delay: 1.05 },
    { text: 'Support', delay: 1.2 },
  ];

  return (
    <div>
      <h1
        className="text-[28px] font-semibold tracking-[-0.02em] m-0"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          ...GOLD_GRADIENT_TEXT,
        }}
      >
        {words.map((w, i) => (
          <motion.span
            key={w.text}
            className="inline-block"
            style={{ marginRight: i < words.length - 1 ? '0.3em' : 0 }}
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.4,
              delay: w.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w.text}
          </motion.span>
        ))}
      </h1>

      {/* Gold underline with shimmer */}
      <motion.div
        className="mx-auto mt-2 h-[1.5px] rounded-full relative overflow-hidden"
        style={{ background: GOLD_GRADIENT, width: '80%' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 1.35, ease: 'easeOut' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'splashShimmerSweep 500ms ease-in-out 1750ms forwards',
            transform: 'translateX(-100%)',
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── Layer 5: Premium loading bar ───────────────────────────────────────────

/** Wider, thicker loading bar with glowing leading edge */
function PremiumLoadingBar({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <div
      className="rounded-full overflow-hidden relative"
      style={{
        width: 140,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.06)',
        boxShadow: '0 0 8px rgba(197,165,90,0.1)',
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          background: GOLD_GRADIENT,
          animation: prefersReducedMotion
            ? 'none'
            : 'splashBarFill 1.4s ease-in-out infinite',
          width: prefersReducedMotion ? '100%' : undefined,
          opacity: prefersReducedMotion ? 0.6 : undefined,
        }}
      />
      {/* Bright leading-edge head */}
      {!prefersReducedMotion && (
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            width: 8,
            background:
              'radial-gradient(ellipse at center, rgba(245,214,128,0.9), transparent)',
            animation: 'splashBarHead 1.4s ease-in-out infinite',
            boxShadow: '0 0 6px rgba(245,214,128,0.6)',
          }}
        />
      )}
    </div>
  );
}

export default SplashScreen;
