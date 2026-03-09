import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';

export interface ConditionNameEntry {
  id: string;
  name: string;
  conditionId: string;
}

/**
 * Shared hook for getting a standardized condition name list.
 * Use this in any component that needs a condition dropdown/picker
 * (Symptoms, Sleep, Migraines, BuddyStatements, HealthLog, DBQPrepSheet, etc.)
 */
export function useConditionNames(): ConditionNameEntry[] {
  const userConditions = useAppStore((s) => s.userConditions);

  return useMemo(() => {
    return userConditions.map((uc) => ({
      id: uc.id,
      name: uc.displayName || uc.conditionId,
      conditionId: uc.conditionId,
    }));
  }, [userConditions]);
}
