import { useEffect, useState } from 'react';

interface SplashScreenCSSProps {
  onComplete: () => void;
  minimumDuration?: number;
}

/**
 * CSS-only splash screen fallback
 * Uses pure CSS animations — no framer-motion dependency.
 * Designed for iOS WebViews and slower devices.
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
      // Wait for the dissolve animation (0.6s) to finish
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 600);
    }, minimumDuration);

    return () => clearTimeout(timer);
  }, [minimumDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* Logo with lens sweep overlay */}
        <div className="splash-logo">
          <img
            src="/app-icon.png"
            alt="Vet Claim Support"
            className="splash-logo-img"
          />
          <div className="splash-lens-sweep" aria-hidden="true" />
        </div>

        {/* App Name */}
        <h1 className="splash-title">Vet Claim Support</h1>

        {/* Tagline */}
        <p className="splash-tagline">Get the rating you earned</p>

        {/* Gold loading dots */}
        <div className="loading-dots">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
      </div>
    </div>
  );
}

export default SplashScreenCSS;
