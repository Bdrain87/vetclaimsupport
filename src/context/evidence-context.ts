import { createContext } from 'react';
import type { useEvidenceDocuments } from '@/hooks/useEvidenceDocuments';

export type EvidenceContextType = ReturnType<typeof useEvidenceDocuments>;
export const EvidenceContext = createContext<EvidenceContextType | null>(null);
