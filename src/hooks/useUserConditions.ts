import { useCallback, useEffect, useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/vaConditions';
import type { VACondition } from '@/data/vaConditions';
import { combineRatings } from '@/utils/vaMath';
import { isSuspiciousConditionId } from '@/utils/conditionResolver';

// Re-export the UserCondition type from the store
export type { UserCondition } from '@/store/useAppStore';
import type { UserCondition } from '@/store/useAppStore';

function calculateCombinedRating(conditions: UserCondition[]): number {
  const approvedRatings = conditions
    .filter((c): c is UserCondition & { rating: number } =>
      c.claimStatus === 'approved' && typeof c.rating === 'number' && c.rating > 0
    )
    .map((c) => c.rating);
  return combineRatings(approvedRatings);
}

/**
 * Adapter hook — returns the same shape as the old UserConditionsContext.
 * All consuming components continue to work unchanged.
 *
 * Uses a single subscription for data and getState() for stable action
 * references (matching useClaims.ts pattern).
 */
export function useUserConditions() {
  const conditions = useAppStore((s) => s.userConditions);

  // Actions are stable references from the store — read once and reuse.
  // Using getState() avoids subscribing the component to action identity changes.
  const actions = useMemo(() => {
    const s = useAppStore.getState();
    return {
      addUserCondition: s.addUserCondition,
      removeUserCondition: s.removeUserCondition,
      updateUserCondition: s.updateUserCondition,
      clearAllUserConditions: s.clearAllUserConditions,
      incrementConditionUsage: s.incrementConditionUsage,
      addClaimCondition: s.addClaimCondition,
    };
  }, []);

  const {
    addUserCondition: addUserConditionAction,
    removeUserCondition,
    updateUserCondition: updateUserConditionAction,
    clearAllUserConditions,
    incrementConditionUsage: incrementConditionUsageAction,
    addClaimCondition: addClaimConditionAction,
  } = actions;

  const addCondition = useCallback(
    (conditionId: string, options?: Partial<UserCondition>): UserCondition | null => {
      if (import.meta.env.DEV && isSuspiciousConditionId(conditionId)) {
        console.warn(
          `[useUserConditions] Suspicious conditionId: "${conditionId}". ` +
          'This looks like a slugified name instead of a database ID. ' +
          'Use resolveConditionId() to convert names to IDs.',
        );
      }
      const vaCondition = getConditionById(conditionId);
      if (!vaCondition && !options?.displayName) {
        // Condition not found in database and no displayName fallback provided
        return null;
      }

      const current = useAppStore.getState().userConditions;

      const existingWithSameId = current.filter((c) => c.conditionId === conditionId);
      if (existingWithSameId.length > 0 && !options?.bodyPart) {
        if (options && (options.claimStatus !== undefined || options.rating !== undefined)) {
          const existing = existingWithSameId[0];
          updateUserConditionAction(existing.id, options);
          return { ...existing, ...options };
        }
        return null;
      }

      if (options?.bodyPart) {
        const existingWithBodyPart = existingWithSameId.find((c) => c.bodyPart === options.bodyPart);
        if (existingWithBodyPart) {
          // Condition with body part already added
          return null;
        }
      }

      // Always populate displayName for resilient display
      const displayName = options?.displayName || vaCondition?.abbreviation || vaCondition?.name || conditionId;

      const newCondition: UserCondition = {
        id: crypto.randomUUID(),
        conditionId,
        displayName,
        serviceConnected: true,
        claimStatus: 'pending',
        isPrimary: true,
        dateAdded: new Date().toISOString(),
        ...options,
      };

      addUserConditionAction(newCondition);
      return newCondition;
    },
    [actions],
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

  // Sync userConditions → claimConditions so legacy components see the same data
  useEffect(() => {
    const existingNames = new Set(
      (useAppStore.getState().claimConditions || []).map((c) => c.name.toLowerCase()),
    );
    for (const uc of conditions) {
      const details = getConditionById(uc.conditionId);
      const name = uc.displayName || details?.name || uc.conditionId;
      if (!existingNames.has(name.toLowerCase())) {
        addClaimConditionAction({
          id: uc.id,
          name,
          linkedMedicalVisits: [],
          linkedExposures: [],
          linkedSymptoms: [],
          linkedDocuments: [],
          linkedBuddyContacts: [],
          notes: uc.notes ?? '',
          createdAt: uc.dateAdded,
        });
        existingNames.add(name.toLowerCase());
      }
    }
  }, [conditions, actions]);

  const totalRating = useMemo(() => calculateCombinedRating(conditions), [conditions]);
  const approvedConditionsCount = useMemo(
    () => conditions.filter((c) => c.claimStatus === 'approved').length,
    [conditions],
  );
  const pendingConditionsCount = useMemo(
    () => conditions.filter((c) => c.claimStatus === 'pending').length,
    [conditions],
  );

  const incrementUsage = useCallback(
    (id: string) => {
      incrementConditionUsageAction(id);
    },
    [actions],
  );

  /** Conditions sorted by usage count (most-used first) for ConditionSelector */
  const conditionsByUsage = useMemo(() => {
    return [...conditions].sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0));
  }, [conditions]);

  return {
    conditions,
    conditionsByUsage,
    addCondition,
    removeCondition: removeUserCondition,
    updateCondition: updateUserConditionAction,
    clearAllConditions: clearAllUserConditions,
    incrementUsage,
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
