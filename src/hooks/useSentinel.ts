import { useMemo } from 'react';
import { useClaims } from './useClaims';
import { useUserConditions } from './useUserConditions';
import { useProfileStore } from '@/store/useProfileStore';
import { ClaimIntelligence } from '@/services/claimIntelligence';

export interface SentinelReadiness {
  score: number;
  label: 'Early' | 'Building' | 'Strong';
  conditionCount: number;
  hasProfile: boolean;
}

/**
 * Reusable hook for claim readiness scoring.
 * Wraps ClaimIntelligence.getOverallReadiness with a clean interface
 * for use in Dashboard, SentinelCore, and future components.
 */
export function useSentinel(): SentinelReadiness {
  const { data } = useClaims();
  const { conditions: userConditions } = useUserConditions();
  const profile = useProfileStore();

  return useMemo(() => {
    const score = ClaimIntelligence.getOverallReadiness(userConditions, data, profile);
    const label = score >= 70 ? 'Strong' : score >= 40 ? 'Building' : 'Early';

    return {
      score,
      label,
      conditionCount: userConditions.length,
      hasProfile: !!(profile.firstName && profile.branch),
    };
  }, [userConditions, data, profile]);
}
