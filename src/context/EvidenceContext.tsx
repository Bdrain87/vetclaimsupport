import { createContext, useContext, ReactNode } from 'react';
import { useEvidenceDocuments } from '@/hooks/useEvidenceDocuments';

type EvidenceContextType = ReturnType<typeof useEvidenceDocuments>;

const EvidenceContext = createContext<EvidenceContextType | null>(null);

export function EvidenceProvider({ children }: { children: ReactNode }) {
  const evidenceData = useEvidenceDocuments();
  
  return (
    <EvidenceContext.Provider value={evidenceData}>
      {children}
    </EvidenceContext.Provider>
  );
}

export function useEvidence() {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error('useEvidence must be used within an EvidenceProvider');
  }
  return context;
}
