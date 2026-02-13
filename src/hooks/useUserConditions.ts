import { useCallback, useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/vaConditions';
import type { VACondition } from '@/data/vaConditions';

// Re-export the UserCondition type from the store
export type { UserCondition } from '@/store/useAppStore';
import type { UserCondition } from '@/store/useAppStore';

function calculateCombinedRating(conditions: UserCondition[]): number {
  const approvedRatings = conditions
    .filter((c): c is UserCondition & { rating: number } =>
      c.claimStatus === 'approved' && typeof c.rating === 'number' && c.rating > 0
    )
    .map((c) => c.rating)
    .sort((a, b) => b - a);

  if (approvedRatings.length === 0) return 0;

  let remaining = 100;
  for (const rating of approvedRatings) {
    remaining = remaining - (remaining * rating) / 100;
  }

  const combined = 100 - remaining;
  return Math.round(combined / 10) * 10;
}

/**
 * Adapter hook — returns the same shape as the old UserConditionsContext.
 * All consuming components continue to work unchanged.
 */
export function useUserConditions() {
  const store = useAppStore();
  const conditions = store.userConditions;

  const addCondition = useCallback(
    (conditionId: string, options?: Partial<UserCondition>): UserCondition | null => {
      const vaCondition = getConditionById(conditionId);
      if (!vaCondition) {
        // Condition not found in database
        return null;
      }

      const current = useAppStore.getState().userConditions;

      const existingWithSameId = current.filter((c) => c.conditionId === conditionId);
      if (existingWithSameId.length > 0 && !options?.bodyPart) {
        // Condition already added
        return null;
      }

      if (options?.bodyPart) {
        const existingWithBodyPart = existingWithSameId.find((c) => c.bodyPart === options.bodyPart);
        if (existingWithBodyPart) {
          // Condition with body part already added
          return null;
        }
      }

      const newCondition: UserCondition = {
        id: crypto.randomUUID(),
        conditionId,
        serviceConnected: true,
        claimStatus: 'pending',
        isPrimary: true,
        dateAdded: new Date().toISOString(),
        ...options,
      };

      store.addUserCondition(newCondition);
      return newCondition;
    },
    [store],
  );

  const hasCondition = useCallback(
    (conditionId: string): boolean => {
      return conditions.some((c) => c.conditionId === conditionId);
    },
    [conditions],
  );

  const getCondition = useCallback(
    (id: string): UserCondition | undefined => {
      return conditions.find((c) => c.id === id);
    },
    [conditions],
  );

  const getConditionsByStatus = useCallback(
    (status: UserCondition['claimStatus']): UserCondition[] => {
      return conditions.filter((c) => c.claimStatus === status);
    },
    [conditions],
  );

  const getPrimaryConditions = useCallback((): UserCondition[] => {
    return conditions.filter((c) => c.isPrimary);
  }, [conditions]);

  const getSecondaryConditions = useCallback(
    (primaryId?: string): UserCondition[] => {
      if (primaryId) {
        return conditions.filter((c) => !c.isPrimary && c.linkedPrimaryId === primaryId);
      }
      return conditions.filter((c) => !c.isPrimary);
    },
    [conditions],
  );

  const getConditionDetails = useCallback(
    (userCondition: UserCondition): VACondition | undefined => {
      return getConditionById(userCondition.conditionId);
    },
    [],
  );

  const totalRating = useMemo(() => calculateCombinedRating(conditions), [conditions]);
  const approvedConditionsCount = useMemo(
    () => conditions.filter((c) => c.claimStatus === 'approved').length,
    [conditions],
  );
  const pendingConditionsCount = useMemo(
    () => conditions.filter((c) => c.claimStatus === 'pending').length,
    [conditions],
  );

  return {
    conditions,
    addCondition,
    removeCondition: store.removeUserCondition,
    updateCondition: store.updateUserCondition,
    clearAllConditions: store.clearAllUserConditions,
    hasCondition,
    getCondition,
    getConditionsByStatus,
    getPrimaryConditions,
    getSecondaryConditions,
    getConditionDetails,
    totalRating,
    approvedConditionsCount,
    pendingConditionsCount,
  };
}
