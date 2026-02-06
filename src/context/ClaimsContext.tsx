import { ReactNode } from 'react';
import { useClaimsData } from '@/hooks/useClaimsData';
import { ClaimsContext } from './claims-context';

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const claimsData = useClaimsData();
  return (
    <ClaimsContext.Provider value={claimsData}>
      {children}
    </ClaimsContext.Provider>
  );
}
