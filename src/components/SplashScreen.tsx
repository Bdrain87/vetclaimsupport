import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
}

export function SplashScreen({
  onComplete,
  minimumDuration = 1500
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete
      setTimeout(onComplete, 500);
    }, minimumDuration);

    return () => clearTimeout(timer);
  }, [minimumDuration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #14192b 0%, #1e2844 100%)'
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-5 text-center px-6">
            {/* Animated Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <AnimatedLogo />
            </motion.div>

            {/* App Name */}
            <motion.h1
              className="text-[28px] font-semibold text-white tracking-[-0.02em] m-0"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Service Evidence Tracker
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-base text-white/70 m-0"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Get the rating you earned
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <LoadingDots />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Animated shield logo with draw effect
function AnimatedLogo() {
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield outline */}
      <motion.path
        d="M40 4L8 16V36C8 54.78 21.42 72.12 40 76C58.58 72.12 72 54.78 72 36V16L40 4Z"
        fill="#1e2844"
        stroke="#C9A227"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      {/* Checkmark inside */}
      <motion.path
        d="M30 40L37 47L50 34"
        stroke="#10B981"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

// Loading dots animation
function LoadingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#C9A227' }}
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

// Hook for managing splash screen state
export function useSplashScreen(minimumDuration = 1500) {
  const [isLoading, setIsLoading] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const handleSplashComplete = useCallback(() => {
    if (appReady) {
      setIsLoading(false);
    }
  }, [appReady]);

  const markAppReady = useCallback(() => {
    setAppReady(true);
  }, []);

  // Auto-complete if app ready before splash duration
  useEffect(() => {
    if (appReady && !isLoading) {
      // App is fully ready
    }
  }, [appReady, isLoading]);

  return {
    isLoading,
    handleSplashComplete,
    markAppReady,
    minimumDuration
  };
}

export default SplashScreen;
