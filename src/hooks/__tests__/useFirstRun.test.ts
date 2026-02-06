import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFirstRun, isFirstVisit, hasCompletedOnboarding, hasAcceptedDisclaimer } from '../useFirstRun';

describe('useFirstRun', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show splash on initial render', () => {
    const { result } = renderHook(() => useFirstRun());
    expect(result.current.showSplash).toBe(true);
  });

  it('should show disclaimer after splash if not accepted', () => {
    const { result } = renderHook(() => useFirstRun());
    expect(result.current.showDisclaimer).toBe(true);
    expect(result.current.isReady).toBe(false);
  });

  it('should handle splash complete', () => {
    const { result } = renderHook(() => useFirstRun());
    act(() => {
      result.current.handleSplashComplete();
    });
    expect(result.current.showSplash).toBe(false);
  });

  it('should handle disclaimer accept', () => {
    const { result } = renderHook(() => useFirstRun());
    act(() => {
      result.current.handleDisclaimerAccept();
    });
    expect(result.current.showDisclaimer).toBe(false);
    expect(localStorage.getItem('liabilityAccepted')).toBe('true');
  });

  it('should show onboarding after disclaimer if not completed', () => {
    const { result } = renderHook(() => useFirstRun());
    act(() => {
      result.current.handleDisclaimerAccept();
    });
    expect(result.current.showOnboarding).toBe(true);
    expect(result.current.isReady).toBe(false);
  });

  it('should be ready after onboarding complete', () => {
    const { result } = renderHook(() => useFirstRun());
    act(() => {
      result.current.handleDisclaimerAccept();
    });
    act(() => {
      result.current.handleOnboardingComplete();
    });
    expect(result.current.isReady).toBe(true);
    expect(result.current.showOnboarding).toBe(false);
  });

  it('should handle onboarding skip', () => {
    const { result } = renderHook(() => useFirstRun());
    act(() => {
      result.current.handleDisclaimerAccept();
    });
    act(() => {
      result.current.handleOnboardingSkip();
    });
    expect(result.current.isReady).toBe(true);
    expect(localStorage.getItem('hasSeenOnboarding')).toBe('true');
  });

  it('should be ready immediately if all steps previously completed', () => {
    localStorage.setItem('liabilityAccepted', 'true');
    localStorage.setItem('hasSeenOnboarding', 'true');
    const { result } = renderHook(() => useFirstRun());
    expect(result.current.isReady).toBe(true);
    expect(result.current.showDisclaimer).toBe(false);
    expect(result.current.showOnboarding).toBe(false);
  });

  it('should skip disclaimer if already accepted', () => {
    localStorage.setItem('liabilityAccepted', 'true');
    const { result } = renderHook(() => useFirstRun());
    expect(result.current.showDisclaimer).toBe(false);
    expect(result.current.showOnboarding).toBe(true);
  });

  it('should reset first run state', () => {
    localStorage.setItem('liabilityAccepted', 'true');
    localStorage.setItem('hasSeenOnboarding', 'true');
    const { result } = renderHook(() => useFirstRun());
    act(() => {
      result.current.resetFirstRun();
    });
    expect(result.current.showSplash).toBe(true);
    expect(result.current.showDisclaimer).toBe(true);
    expect(result.current.isReady).toBe(false);
    expect(localStorage.getItem('liabilityAccepted')).toBeNull();
    expect(localStorage.getItem('hasSeenOnboarding')).toBeNull();
  });
});

describe('isFirstVisit', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return true on first visit', () => {
    expect(isFirstVisit()).toBe(true);
  });

  it('should return false after disclaimer accepted', () => {
    localStorage.setItem('liabilityAccepted', 'true');
    expect(isFirstVisit()).toBe(false);
  });
});

describe('hasCompletedOnboarding', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return false initially', () => {
    expect(hasCompletedOnboarding()).toBe(false);
  });

  it('should return true after onboarding', () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    expect(hasCompletedOnboarding()).toBe(true);
  });
});

describe('hasAcceptedDisclaimer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return false initially', () => {
    expect(hasAcceptedDisclaimer()).toBe(false);
  });

  it('should return true after accepting', () => {
    localStorage.setItem('liabilityAccepted', 'true');
    expect(hasAcceptedDisclaimer()).toBe(true);
  });
});
