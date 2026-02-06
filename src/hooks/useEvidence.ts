import { useContext } from 'react';
import { EvidenceContext } from '@/context/evidence-context';

export function useEvidence() {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error('useEvidence must be used within an EvidenceProvider');
  }
  return context;
}
