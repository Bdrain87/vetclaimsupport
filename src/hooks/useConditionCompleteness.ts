/**
 * useConditionCompleteness — Per-condition completeness scoring.
 * Aggregates data-driven counts + ClaimIntelligence readiness into a unified percent-complete.
 */
import { useMemo } from 'react';
import { useClaims } from '@/hooks/useClaims';
import { useConditionData } from '@/hooks/useConditionData';
import { ClaimIntelligence } from '@/services/claimIntelligence';

export interface ConditionCompleteness {
  conditionName: string;
  overallPercent: number;
  categories: {
    symptomLogs: { count: number; target: number; percent: number };
    medicalEvidence: { count: number; target: number; percent: number };
    medications: { count: number; target: number; percent: number };
    statements: { count: number; target: number; percent: number };
    examPrep: { score: number; percent: number };
  };
}

export function useConditionCompleteness(conditionName: string): ConditionCompleteness {
  const condData = useConditionData(conditionName);
  const { data: claimsData } = useClaims();

  return useMemo(() => {
    const readiness = ClaimIntelligence.getConditionReadiness(conditionName, claimsData);

    // Symptom logs: target 10 entries for good coverage
    const symptomCount = condData.symptoms.length;
    const symptomTarget = 10;
    const symptomPercent = Math.min(100, Math.round((symptomCount / symptomTarget) * 100));

    // Medical evidence: target 3 visits
    const visitCount = condData.medicalVisits.length;
    const visitTarget = 3;
    const visitPercent = Math.min(100, Math.round((visitCount / visitTarget) * 100));

    // Medications: target 1+
    const medCount = condData.medications.length;
    const medTarget = 1;
    const medPercent = Math.min(100, Math.round((medCount / medTarget) * 100));

    // Statements: target 2 buddy contacts
    const stmtCount = condData.buddyContacts.length;
    const stmtTarget = 2;
    const stmtPercent = Math.min(100, Math.round((stmtCount / stmtTarget) * 100));

    // Exam prep from ClaimIntelligence
    const examPrep = readiness.components.examPrep;

    const overallPercent = Math.round(
      symptomPercent * 0.3 +
      visitPercent * 0.25 +
      medPercent * 0.15 +
      stmtPercent * 0.15 +
      examPrep * 0.15,
    );

    return {
      conditionName,
      overallPercent: Math.min(100, overallPercent),
      categories: {
        symptomLogs: { count: symptomCount, target: symptomTarget, percent: symptomPercent },
        medicalEvidence: { count: visitCount, target: visitTarget, percent: visitPercent },
        medications: { count: medCount, target: medTarget, percent: medPercent },
        statements: { count: stmtCount, target: stmtTarget, percent: stmtPercent },
        examPrep: { score: examPrep, percent: examPrep },
      },
    };
  }, [conditionName, condData, claimsData]);
}
