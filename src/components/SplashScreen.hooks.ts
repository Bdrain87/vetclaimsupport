import { useEffect, useState, useCallback } from 'react';

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
