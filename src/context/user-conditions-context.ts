import { createContext } from 'react';
import type { VACondition } from '@/data/vaConditions';

export interface UserCondition {
  id: string;
  conditionId: string;
  rating?: number;
  serviceConnected: boolean;
  claimStatus: 'pending' | 'approved' | 'denied' | 'appeal';
  isPrimary: boolean;
  linkedPrimaryId?: string;
  notes?: string;
  dateAdded: string;
  bodyPart?: string;
}

export interface UserConditionsContextType {
  conditions: UserCondition[];
  addCondition: (conditionId: string, options?: Partial<UserCondition>) => UserCondition | null;
  removeCondition: (id: string) => void;
  updateCondition: (id: string, updates: Partial<UserCondition>) => void;
  clearAllConditions: () => void;
  hasCondition: (conditionId: string) => boolean;
  getCondition: (id: string) => UserCondition | undefined;
  getConditionsByStatus: (status: UserCondition['claimStatus']) => UserCondition[];
  getPrimaryConditions: () => UserCondition[];
  getSecondaryConditions: (primaryId?: string) => UserCondition[];
  getConditionDetails: (userCondition: UserCondition) => VACondition | undefined;
  totalRating: number;
  approvedConditionsCount: number;
  pendingConditionsCount: number;
}

export const UserConditionsContext = createContext<UserConditionsContextType | undefined>(undefined);
