import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [videoDone, setVideoDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);
  onCompleteRef.current = onComplete;

  const completeOnce = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onCompleteRef.current();
  }, []);

  const r = !!prefersReducedMotion;

  // If reduced motion, skip video and use a short timer
  useEffect(() => {
    if (!r) return;
    const timer = setTimeout(() => setVideoDone(true), Math.min(minimumDuration, 600));
    return () => clearTimeout(timer);
  }, [minimumDuration, r]);

  // Begin exit when video done + ready
  useEffect(() => {
    if (!videoDone || !ready) return;
    setIsVisible(false);
    const exit = r ? 150 : 300;
    const timer = setTimeout(completeOnce, exit);
    return () => clearTimeout(timer);
  }, [videoDone, ready, r, completeOnce]);

  // Safety timeout
  useEffect(() => {
    const safety = setTimeout(completeOnce, 8000);
    return () => clearTimeout(safety);
  }, [completeOnce]);

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
            <video
              src="/splash.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setVideoDone(true)}
              onError={() => setVideoDone(true)}
              style={{
                width: 200,
                height: 200,
                objectFit: 'contain',
                display: 'block',
                borderRadius: 32,
              }}
            />

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
                delay: r ? 0.15 : 0.3,
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
