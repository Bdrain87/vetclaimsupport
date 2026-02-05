import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  DISCLAIMER_ACCEPTED: 'liabilityAccepted',
  ONBOARDING_COMPLETED: 'hasSeenOnboarding',
  FIRST_LAUNCH: 'vcs_first_launch'
};

export interface FirstRunState {
  showSplash: boolean;
  showDisclaimer: boolean;
  showOnboarding: boolean;
  isReady: boolean;
}

export interface FirstRunActions {
  handleSplashComplete: () => void;
  handleDisclaimerAccept: () => void;
  handleOnboardingComplete: () => void;
  handleOnboardingSkip: () => void;
  resetFirstRun: () => void;
}

export type UseFirstRunReturn = FirstRunState & FirstRunActions;

/**
 * Hook to manage the first-run experience flow
 *
 * The flow is:
 * 1. Splash Screen (always shows briefly)
 * 2. Disclaimer/Liability Modal (if not previously accepted)
 * 3. Onboarding Modal (if not previously completed)
 * 4. Main App (when everything is done)
 */
export function useFirstRun(): UseFirstRunReturn {
  const [showSplash, setShowSplash] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Check stored state on mount
  useEffect(() => {
    const disclaimerAccepted = localStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED) === 'true';
    const onboardingCompleted = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';

    // Determine what to show after splash
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
    } else if (!onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setIsReady(true);
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleDisclaimerAccept = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, 'true');
    setShowDisclaimer(false);

    const onboardingCompleted = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setIsReady(true);
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setShowOnboarding(false);
    setIsReady(true);
  }, []);

  const handleOnboardingSkip = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setShowOnboarding(false);
    setIsReady(true);
  }, []);

  const resetFirstRun = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    localStorage.removeItem(STORAGE_KEYS.FIRST_LAUNCH);
    setShowSplash(true);
    setShowDisclaimer(true);
    setShowOnboarding(false);
    setIsReady(false);
  }, []);

  return {
    // State
    showSplash,
    showDisclaimer,
    showOnboarding,
    isReady,

    // Actions
    handleSplashComplete,
    handleDisclaimerAccept,
    handleOnboardingComplete,
    handleOnboardingSkip,
    resetFirstRun
  };
}

/**
 * Check if this is the user's first visit
 */
export function isFirstVisit(): boolean {
  return localStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED) !== 'true';
}

/**
 * Check if onboarding has been completed
 */
export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
}

/**
 * Check if disclaimer has been accepted
 */
export function hasAcceptedDisclaimer(): boolean {
  return localStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED) === 'true';
}

export default useFirstRun;
