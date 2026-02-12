import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
}

export function SplashScreen({
  onComplete,
  minimumDuration = 1500
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let innerTimer: ReturnType<typeof setTimeout>;
    const displayTime = prefersReducedMotion
      ? Math.min(minimumDuration, 800)
      : minimumDuration;

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for the exit animation to finish before unmounting
      const exitDuration = prefersReducedMotion ? 300 : 600;
      innerTimer = setTimeout(() => onCompleteRef.current(), exitDuration);
    }, displayTime);

    return () => {
      clearTimeout(timer);
      clearTimeout(innerTimer);
    };
  }, [minimumDuration, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(160deg, #000000 0%, #000000 50%, #000000 100%)'
          }}
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.5,
            transition: {
              duration: prefersReducedMotion ? 0.3 : 0.6,
              ease: 'easeInOut'
            }
          }}
        >
          <div className="flex flex-col items-center gap-5 text-center px-6">
            {/* Logo with blur-in and lens sweep */}
            <LogoWithLens prefersReducedMotion={!!prefersReducedMotion} />

            {/* App Name */}
            <motion.h1
              className="text-[28px] font-semibold text-white tracking-[-0.02em] m-0"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            >
              Vet Claim Support
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-base m-0"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            >
              Get the rating you earned
            </motion.p>

            {/* Gold loading dots */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <LoadingDots />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Logo image that resolves from blurred to crisp with a lens sweep overlay */
function LogoWithLens({
  prefersReducedMotion
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.div
      className="relative"
      style={{ width: 96, height: 96 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* The logo image: blur-in animation */}
      <motion.img
        src="/app-icon.png"
        alt="Vet Claim Support"
        width={96}
        height={96}
        style={{ borderRadius: 20, display: 'block' }}
        initial={{ filter: prefersReducedMotion ? 'blur(0px)' : 'blur(20px)' }}
        animate={{ filter: 'blur(0px)' }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.8,
          ease: 'easeOut'
        }}
      />

      {/* Lens sweep: a diagonal highlight that moves across the logo */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-20%',
            borderRadius: 20,
            overflow: 'hidden',
            pointerEvents: 'none' as const,
            background:
              'linear-gradient(105deg, transparent 40%, rgba(245,214,128,0.10) 45%, rgba(255,255,255,0.12) 50%, rgba(245,214,128,0.10) 55%, transparent 60%)'
          }}
          initial={{ x: '-200%', opacity: 1 }}
          animate={{ x: '200%', opacity: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  );
}

/** Three gold pulsing dots */
function LoadingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--gold-md, #C5A442)' }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

export default SplashScreen;
