import { ReactNode } from 'react';
import { useEvidenceDocuments } from '@/hooks/useEvidenceDocuments';
import { EvidenceContext } from './evidence-context';

export function EvidenceProvider({ children }: { children: ReactNode }) {
  const evidenceData = useEvidenceDocuments();
  return (
    <EvidenceContext.Provider value={evidenceData}>
      {children}
    </EvidenceContext.Provider>
  );
}
