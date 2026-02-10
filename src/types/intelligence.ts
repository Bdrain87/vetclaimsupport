/**
 * Type definitions for the ClaimIntelligence engine.
 * Used by claimIntelligence.ts, useIntelligence.ts, and consuming pages.
 */

// Re-export hazard types from the data layer
export type { HazardCondition, HazardCategory } from '@/data/hazardConditionMap';

// Re-export the job code type from the data layer
export type { MilitaryJobCode } from '@/data/militaryMOS';

/** Suggestion returned by getJobCodeConditions() */
export interface JobCodeSuggestion {
  conditionName: string;
  diagnosticCode: string;
  category: string;
  prevalence: 'very_common' | 'common' | 'moderate' | 'less_common';
  description: string;
  sourceHazards: string[];
  alreadyClaimed: boolean;
}

/** Evidence item within a documentation status */
export interface EvidenceItem {
  type: string;
  label: string;
  status: 'needed' | 'collected' | 'submitted';
  id?: string;
}

/** Documentation status for a single condition */
export interface DocumentationStatus {
  conditionId: string;
  conditionName: string;
  needed: EvidenceItem[];
  collected: EvidenceItem[];
  percentComplete: number;
}

/** Rating increase opportunity for a claimed condition */
export interface RatingOpportunity {
  conditionId: string;
  conditionName: string;
  diagnosticCode: string;
  currentRating: number | null;
  nextTier: number | null;
  generalGuidance: string;
}

/** Comprehensive claim summary for export / dashboard */
export interface ClaimSummary {
  veteranName: string;
  branch: string;
  jobCode: string;
  jobTitle: string;
  serviceStartDate: string;
  serviceEndDate: string;
  intentToFileDate: string | null;

  conditions: {
    id: string;
    name: string;
    diagnosticCode: string;
    status: string;
    claimedRating: number | null;
    isSecondary: boolean;
    evidenceStatus: DocumentationStatus;
  }[];

  totalConditions: number;
  totalEvidenceNeeded: number;
  totalEvidenceCollected: number;
  overallReadinessPercent: number;

  totalHealthLogs: number;
  healthLogsByType: Record<string, number>;
  recentLogDate: string | null;

  totalDocuments: number;
  documentsByType: Record<string, number>;

  nextSteps: string[];

  generatedAt: string;
}

/** Symptom pattern analysis result */
export interface SymptomAnalysis {
  conditionId?: string;
  conditionName?: string;
  totalEntries: number;
  dateRange: { start: string; end: string } | null;
  frequencyPerWeek: number;
  severityTrend: 'improving' | 'stable' | 'worsening' | 'insufficient_data';
  commonTriggers: string[];
  peakDays: string[];
  insights: string[];
}
