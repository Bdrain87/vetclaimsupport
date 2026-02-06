import { useState, useEffect, useCallback, ReactNode } from 'react';
import { getConditionById } from '@/data/vaConditions';
import { UserCondition, UserConditionsContext, UserConditionsContextType } from './user-conditions-context';

const STORAGE_KEY = 'user-va-conditions';

function calculateCombinedRating(conditions: UserCondition[]): number {
  const approvedRatings = conditions
    .filter(c => c.claimStatus === 'approved' && c.rating && c.rating > 0)
    .map(c => c.rating!)
    .sort((a, b) => b - a); // Sort descending

  if (approvedRatings.length === 0) return 0;

  // VA Combined Rating Formula
  let remaining = 100;
  for (const rating of approvedRatings) {
    remaining = remaining - (remaining * rating / 100);
  }

  const combined = 100 - remaining;

  // Round to nearest 10
  return Math.round(combined / 10) * 10;
}

export function UserConditionsProvider({ children }: { children: ReactNode }) {
  const [conditions, setConditions] = useState<UserCondition[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conditions));
    } catch (error) {
      console.error('Failed to save conditions to localStorage:', error);
    }
  }, [conditions]);

  const hasCondition = useCallback((conditionId: string): boolean => {
    return conditions.some(c => c.conditionId === conditionId);
  }, [conditions]);

  const addCondition = useCallback((conditionId: string, options?: Partial<UserCondition>): UserCondition | null => {
    // Check if condition exists in database
    const vaCondition = getConditionById(conditionId);
    if (!vaCondition) {
      console.warn(`Condition ${conditionId} not found in database`);
      return null;
    }

    // Check for duplicates (unless it's a bilateral condition with different body parts)
    const existingWithSameId = conditions.filter(c => c.conditionId === conditionId);
    if (existingWithSameId.length > 0 && !options?.bodyPart) {
      // Allow duplicates only if body part is specified (for bilateral)
      console.warn(`Condition ${conditionId} already added`);
      return null;
    }

    // If body part specified, check if same body part already exists
    if (options?.bodyPart) {
      const existingWithBodyPart = existingWithSameId.find(c => c.bodyPart === options.bodyPart);
      if (existingWithBodyPart) {
        console.warn(`Condition ${conditionId} with body part ${options.bodyPart} already added`);
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

    setConditions(prev => [...prev, newCondition]);
    return newCondition;
  }, [conditions]);

  const removeCondition = useCallback((id: string) => {
    setConditions(prev => {
      // Also remove any secondary conditions linked to this primary
      const conditionToRemove = prev.find(c => c.id === id);
      if (conditionToRemove?.isPrimary) {
        return prev.filter(c => c.id !== id && c.linkedPrimaryId !== id);
      }
      return prev.filter(c => c.id !== id);
    });
  }, []);

  const updateCondition = useCallback((id: string, updates: Partial<UserCondition>) => {
    setConditions(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ));
  }, []);

  const clearAllConditions = useCallback(() => {
    setConditions([]);
  }, []);

  const getCondition = useCallback((id: string): UserCondition | undefined => {
    return conditions.find(c => c.id === id);
  }, [conditions]);

  const getConditionsByStatus = useCallback((status: UserCondition['claimStatus']): UserCondition[] => {
    return conditions.filter(c => c.claimStatus === status);
  }, [conditions]);

  const getPrimaryConditions = useCallback((): UserCondition[] => {
    return conditions.filter(c => c.isPrimary);
  }, [conditions]);

  const getSecondaryConditions = useCallback((primaryId?: string): UserCondition[] => {
    if (primaryId) {
      return conditions.filter(c => !c.isPrimary && c.linkedPrimaryId === primaryId);
    }
    return conditions.filter(c => !c.isPrimary);
  }, [conditions]);

  const getConditionDetails = useCallback((userCondition: UserCondition) => {
    return getConditionById(userCondition.conditionId);
  }, []);

  const totalRating = calculateCombinedRating(conditions);
  const approvedConditionsCount = conditions.filter(c => c.claimStatus === 'approved').length;
  const pendingConditionsCount = conditions.filter(c => c.claimStatus === 'pending').length;

  const value: UserConditionsContextType = {
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    clearAllConditions,
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

  return (
    <UserConditionsContext.Provider value={value}>
      {children}
    </UserConditionsContext.Provider>
  );
}
