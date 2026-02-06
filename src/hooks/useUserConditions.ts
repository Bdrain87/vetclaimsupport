import { useContext } from 'react';
import { UserConditionsContext } from '@/context/user-conditions-context';
export type { UserCondition } from '@/context/user-conditions-context';

export function useUserConditions() {
  const context = useContext(UserConditionsContext);
  if (context === undefined) {
    throw new Error('useUserConditions must be used within a UserConditionsProvider');
  }
  return context;
}
