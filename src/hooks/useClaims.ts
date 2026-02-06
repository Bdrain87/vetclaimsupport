import { useContext } from 'react';
import { ClaimsContext } from '@/context/claims-context';

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
}
