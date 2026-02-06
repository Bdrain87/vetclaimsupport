import { createContext } from 'react';
import type { useClaimsData } from '@/hooks/useClaimsData';

export type ClaimsContextType = ReturnType<typeof useClaimsData>;
export const ClaimsContext = createContext<ClaimsContextType | null>(null);
