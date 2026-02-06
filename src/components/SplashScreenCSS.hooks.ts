import { useState, useCallback } from 'react';

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
