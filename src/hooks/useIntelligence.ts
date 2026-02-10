import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ClaimIntelligence } from '@/services/claimIntelligence';
import type {
  JobCodeSuggestion,
  DocumentationStatus,
  RatingOpportunity,
  ClaimSummary,
  SymptomAnalysis,
} from '@/types/intelligence';

/**
 * React hook that provides memoized access to intelligence engine methods.
 * Re-computes when store data changes.
 */
export function useIntelligence() {
  const conditions = useAppStore((s) => s.userConditions);
  const symptoms = useAppStore((s) => s.symptoms);
  const quickLogs = useAppStore((s) => s.quickLogs);
  const migraines = useAppStore((s) => s.migraines);
  const sleepEntries = useAppStore((s) => s.sleepEntries);
  const ptsdSymptoms = useAppStore((s) => s.ptsdSymptoms);
  const evidenceDocuments = useAppStore((s) => s.evidenceDocuments);
  const claimDocuments = useAppStore((s) => s.claimDocuments);
  const approvedConditions = useAppStore((s) => s.approvedConditions);

  const branch = useProfileStore((s) => s.branch);
  const mosCode = useProfileStore((s) => s.mosCode);

  const jobCodeSuggestions: JobCodeSuggestion[] = useMemo(
    () => ClaimIntelligence.getJobCodeConditions(mosCode, branch || undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mosCode, branch, conditions],
  );

  const documentationStatus: DocumentationStatus[] = useMemo(
    () => ClaimIntelligence.getDocumentationNeeded(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conditions, evidenceDocuments, claimDocuments],
  );

  const ratingOpportunities: RatingOpportunity[] = useMemo(
    () => ClaimIntelligence.getRatingIncreaseOpportunities(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conditions, approvedConditions],
  );

  const claimSummary: ClaimSummary = useMemo(
    () => ClaimIntelligence.getClaimSummary(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conditions, evidenceDocuments, claimDocuments, symptoms, quickLogs, migraines, sleepEntries, ptsdSymptoms, branch, mosCode],
  );

  return {
    jobCodeSuggestions,
    documentationStatus,
    ratingOpportunities,
    claimSummary,
    // Expose methods that take params (can't memoize without knowing params)
    getSymptomPatterns: ClaimIntelligence.getSymptomPatterns.bind(ClaimIntelligence) as (conditionId?: string) => SymptomAnalysis,
    getDocumentationNeeded: ClaimIntelligence.getDocumentationNeeded.bind(ClaimIntelligence) as (conditionId?: string) => DocumentationStatus[],
    getJobCodeConditions: ClaimIntelligence.getJobCodeConditions.bind(ClaimIntelligence) as (jobCode?: string, branch?: string) => JobCodeSuggestion[],
  };
}
