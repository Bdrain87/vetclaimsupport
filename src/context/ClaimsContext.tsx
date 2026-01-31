import { createContext, useContext, ReactNode } from 'react';
import { useClaimsData } from '@/hooks/useClaimsData';

type ClaimsContextType = ReturnType<typeof useClaimsData>;

const ClaimsContext = createContext<ClaimsContextType | null>(null);

export function ClaimsProvider({ children }: { children: ReactNode }) {
  const claimsData = useClaimsData();
  
  return (
    <ClaimsContext.Provider value={claimsData}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
}
