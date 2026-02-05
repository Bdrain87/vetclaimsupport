import { useEffect, useState, useCallback } from 'react';

interface SplashScreenCSSProps {
  onComplete: () => void;
  minimumDuration?: number;
}

/**
 * CSS-only splash screen fallback
 * Uses pure CSS animations for better compatibility
 * with iOS WebViews and slower devices
 */
export function SplashScreenCSS({
  onComplete,
  minimumDuration = 1500
}: SplashScreenCSSProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // Wait for fade out animation to complete
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 500);
    }, minimumDuration);

    return () => clearTimeout(timer);
  }, [minimumDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* Static Logo */}
        <div className="splash-logo">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Shield */}
            <path
              d="M40 4L8 16V36C8 54.78 21.42 72.12 40 76C58.58 72.12 72 54.78 72 36V16L40 4Z"
              fill="#1e2844"
              stroke="#C9A227"
              strokeWidth="2"
            />
            {/* Checkmark */}
            <path
              d="M30 40L37 47L50 34"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* App Name */}
        <h1 className="splash-title">
          Service Evidence Tracker
        </h1>

        {/* Tagline */}
        <p className="splash-tagline">
          Get the rating you earned
        </p>

        {/* Loading dots */}
        <div className="loading-dots">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      </div>
    </div>
  );
}

// Hook for managing CSS splash screen state
export function useSplashScreenCSS(minimumDuration = 1500) {
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

  return {
    isLoading,
    handleSplashComplete,
    markAppReady,
    minimumDuration
  };
}

export default SplashScreenCSS;
