/**
 * Feature Flag Store — R-6
 *
 * Lightweight client-side feature flags for gradual rollout,
 * A/B testing, and emergency kill switches.
 *
 * Flags are persisted to localStorage so overrides survive reloads.
 * Default values are hard-coded here; overrides are applied on top.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// Flag Definitions — add new flags here
// ---------------------------------------------------------------------------

export interface FeatureFlags {
  /** Show per-condition readiness breakdown on Dashboard */
  dashboardConditionReadiness: boolean;
  /** Show "Recommended for Your Claims" section on Dashboard */
  dashboardRecommendations: boolean;
  /** Enable AI-powered claim strategy generation */
  aiClaimStrategy: boolean;
  /** Enable AI-powered practice questions in C&P prep */
  aiPracticeQuestions: boolean;
  /** Show VA rating guidance card on Symptoms page */
  symptomRatingGuidance: boolean;
  /** Enable medication side-effect summary cards */
  medicationSideEffectStats: boolean;
  /** Show packet completeness checker in export modal */
  exportPacketCheck: boolean;
  /** Enable body map condition linking */
  bodyMapLinking: boolean;
  /** Show secondary condition suggestions */
  secondaryConditionSuggestions: boolean;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  dashboardConditionReadiness: true,
  dashboardRecommendations: true,
  aiClaimStrategy: true,
  aiPracticeQuestions: true,
  symptomRatingGuidance: true,
  medicationSideEffectStats: true,
  exportPacketCheck: true,
  bodyMapLinking: true,
  secondaryConditionSuggestions: true,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface FeatureFlagState {
  /** Overrides applied on top of DEFAULT_FLAGS */
  overrides: Partial<FeatureFlags>;
  /** Set a single flag override */
  setFlag: (key: keyof FeatureFlags, value: boolean) => void;
  /** Clear all overrides (revert to defaults) */
  resetFlags: () => void;
  /** Get the effective value of a flag */
  getFlag: (key: keyof FeatureFlags) => boolean;
}

export const useFeatureFlagStore = create<FeatureFlagState>()(
  persist(
    (set, get) => ({
      overrides: {},
      setFlag: (key, value) =>
        set((state) => ({
          overrides: { ...state.overrides, [key]: value },
        })),
      resetFlags: () => set({ overrides: {} }),
      getFlag: (key) => {
        const override = get().overrides[key];
        return override !== undefined ? override : DEFAULT_FLAGS[key];
      },
    }),
    {
      name: 'vcs-feature-flags',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// ---------------------------------------------------------------------------
// Hook — convenience accessor
// ---------------------------------------------------------------------------

export function useFeatureFlag(key: keyof FeatureFlags): boolean {
  const override = useFeatureFlagStore((s) => s.overrides[key]);
  return override !== undefined ? override : DEFAULT_FLAGS[key];
}
