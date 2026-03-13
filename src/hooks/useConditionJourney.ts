/**
 * useConditionJourney — Per-condition step-by-step pathway with completion tracking.
 * Steps: Document symptoms → Review criteria → Gather evidence → Build statement →
 * Prepare for C&P → Find secondaries.
 */
import { useMemo } from 'react';
import { useConditionData } from '@/hooks/useConditionData';
import { getConditionById } from '@/data/vaConditions';
import { conditionProfiles } from '@/data/secondaryConditions';
import { getRatingCriteria } from '@/data/ratingCriteria';
import { getRatingCriteriaByCondition } from '@/data/vaResources/ratingCriteria';
import useAppStore from '@/store/useAppStore';

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  route: string;
  isComplete: boolean;
  progress: number; // 0-100
  detail?: string;
}

export interface ConditionJourneyData {
  conditionName: string;
  conditionId: string;
  steps: JourneyStep[];
  overallProgress: number;
  completedSteps: number;
  totalSteps: number;
}

export function useConditionJourney(conditionId: string, conditionName: string): ConditionJourneyData {
  const condData = useConditionData(conditionName);
  const formDrafts = useAppStore((s) => s.formDrafts);

  return useMemo(() => {
    const details = getConditionById(conditionId);
    const profile = conditionProfiles.find((cp) => cp.id === conditionId);
    const hasRatingCriteria = !!(getRatingCriteria(conditionId) || getRatingCriteriaByCondition(conditionId));

    // Step 1: Document Symptoms
    const symptomCount = condData.symptoms.length;
    const symptomProgress = Math.min(100, Math.round((symptomCount / 10) * 100));
    const symptomComplete = symptomCount >= 5;

    // Step 2: Review Rating Criteria
    const criteriaProgress = hasRatingCriteria ? 100 : 0;
    const criteriaComplete = hasRatingCriteria;

    // Step 3: Gather Medical Evidence
    const visitCount = condData.medicalVisits.length;
    const medProgress = Math.min(100, Math.round((visitCount / 3) * 100));
    const medComplete = visitCount >= 2;

    // Step 4: Build Personal Statement
    const hasDraft = !!formDrafts['personal-statement'];
    const stmtProgress = hasDraft ? 100 : 0;
    const stmtComplete = hasDraft;

    // Step 5: Buddy Statements (reactive — auto-tracks received/submitted)
    const buddyContacts = condData.buddyContacts;
    const buddyTotal = buddyContacts.length;
    const buddyReceived = buddyContacts.filter(
      (b) => b.statementStatus === 'Received' || b.statementStatus === 'Submitted',
    ).length;
    const buddyProgress = buddyTotal > 0
      ? Math.round((buddyReceived / buddyTotal) * 100)
      : 0;
    const buddyComplete = buddyReceived >= 1;

    // Step 6: C&P Exam Prep
    const hasExamDraft = !!formDrafts['tool:cp-exam-prep'];
    const examProgress = hasExamDraft ? 100 : 0;
    const examComplete = hasExamDraft;

    // Step 7: Secondary Connections
    const secondaryCount = profile?.possibleSecondaries?.length ?? 0;
    const secProgress = secondaryCount > 0 ? 100 : 0;
    const secComplete = secondaryCount > 0;

    const steps: JourneyStep[] = [
      {
        id: 'symptoms',
        title: 'Document Symptoms',
        description: 'Log daily symptoms to build your evidence trail',
        route: '/health/symptoms',
        isComplete: symptomComplete,
        progress: symptomProgress,
        detail: symptomCount > 0 ? `${symptomCount} entries logged` : undefined,
      },
      {
        id: 'criteria',
        title: 'Review Rating Criteria',
        description: 'Understand what the VA looks for at each rating level',
        route: '/claims/evidence-strength',
        isComplete: criteriaComplete,
        progress: criteriaProgress,
        detail: hasRatingCriteria ? 'Criteria available' : 'No specific criteria found',
      },
      {
        id: 'evidence',
        title: 'Gather Medical Evidence',
        description: 'Document medical visits and treatment records',
        route: '/health/visits',
        isComplete: medComplete,
        progress: medProgress,
        detail: visitCount > 0 ? `${visitCount} visit${visitCount !== 1 ? 's' : ''} documented` : undefined,
      },
      {
        id: 'statement',
        title: 'Build Personal Statement',
        description: 'Write a compelling personal statement for this condition',
        route: `/prep/personal-statement?conditionId=${conditionId}`,
        isComplete: stmtComplete,
        progress: stmtProgress,
        detail: hasDraft ? 'Draft saved' : undefined,
      },
      {
        id: 'buddy',
        title: 'Get Buddy Statements',
        description: 'Collect witness statements from people who know your condition',
        route: '/prep/buddy-statements',
        isComplete: buddyComplete,
        progress: buddyProgress,
        detail: buddyTotal > 0
          ? `${buddyReceived} of ${buddyTotal} received`
          : undefined,
      },
      {
        id: 'exam',
        title: 'Prepare for C&P Exam',
        description: 'Know what the examiner will ask and how to respond',
        route: '/prep/exam',
        isComplete: examComplete,
        progress: examProgress,
        detail: hasExamDraft ? 'Prep in progress' : undefined,
      },
      {
        id: 'secondaries',
        title: 'Explore Secondary Connections',
        description: 'Find conditions commonly linked to yours',
        route: '/claims',
        isComplete: secComplete,
        progress: secProgress,
        detail: secondaryCount > 0 ? `${secondaryCount} potential secondaries` : undefined,
      },
    ];

    const completedSteps = steps.filter((s) => s.isComplete).length;
    const overallProgress = Math.round(steps.reduce((sum, s) => sum + s.progress, 0) / steps.length);

    return {
      conditionName,
      conditionId,
      steps,
      overallProgress,
      completedSteps,
      totalSteps: steps.length,
    };
  }, [conditionId, conditionName, condData, formDrafts]);
}
