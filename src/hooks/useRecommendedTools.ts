/**
 * useRecommendedTools — condition-aware tool recommendations for PrepHub.
 * Pure conditional logic, no AI calls. Replaces the static MOST_USED array.
 */
import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useShallow } from 'zustand/react/shallow';
import type { UserCondition } from '@/store/useAppStore';

export interface RecommendedTool {
  label: string;
  route: string;
  description: string;
  reason: string;
}

export function useRecommendedTools(): RecommendedTool[] {
  const {
    userConditions,
    symptoms,
    migraines,
    buddyContacts,
    formDrafts,
    deadlines,
    medicalVisits,
    ptsdSymptoms,
    sleepEntries,
    medications,
  } = useAppStore(
    useShallow((s) => ({
      userConditions: s.userConditions,
      symptoms: s.symptoms,
      migraines: s.migraines,
      buddyContacts: s.buddyContacts,
      formDrafts: s.formDrafts,
      deadlines: s.deadlines ?? [],
      medicalVisits: s.medicalVisits,
      ptsdSymptoms: s.ptsdSymptoms,
      sleepEntries: s.sleepEntries,
      medications: s.medications,
    })),
  );
  const claimGoal = useProfileStore((s) => s.claimGoal);

  return useMemo(() => {
    const recs: RecommendedTool[] = [];
    const condNames = new Set(
      userConditions.map((uc: UserCondition) => (uc.displayName ?? uc.conditionId).toLowerCase()),
    );
    const hasPTSD =
      [...condNames].some((n) => n.includes('ptsd') || n.includes('post-traumatic'));
    const hasMigraines = [...condNames].some((n) => n.includes('migraine'));
    const hasSleepApnea = [...condNames].some((n) => n.includes('sleep'));

    // --- PTSD + no stressor draft ---
    if (hasPTSD && !formDrafts['stressor-statement']) {
      recs.push({
        label: 'Stressor Statement',
        route: '/prep/stressor',
        description: 'Document your PTSD stressors for your claim',
        reason: 'You have PTSD — a stressor statement is essential',
      });
    }

    // --- Migraines + low log count ---
    if (hasMigraines && migraines.length < 5) {
      recs.push({
        label: 'Migraine Log',
        route: '/health/migraines',
        description: 'Track migraine frequency and severity',
        reason: `Only ${migraines.length} migraine${migraines.length !== 1 ? 's' : ''} logged — VA looks at monthly frequency`,
      });
    }

    // --- Exam deadline within 30 days ---
    const now = Date.now();
    const upcomingExam = deadlines.find(
      (d) =>
        !d.completed &&
        d.type === 'exam' &&
        new Date(d.dueDate).getTime() - now < 30 * 86_400_000 &&
        new Date(d.dueDate).getTime() > now,
    );
    if (upcomingExam) {
      recs.push({
        label: 'C&P Exam Prep',
        route: '/prep/exam',
        description: 'Prepare for your compensation exam',
        reason: 'Your exam is coming up — get ready now',
      });
    }

    // --- No buddy contacts ---
    if (buddyContacts.length === 0 && userConditions.length > 0) {
      recs.push({
        label: 'Buddy Statement',
        route: '/prep/buddy-statement',
        description: 'Build a buddy/lay statement',
        reason: 'Third-party evidence strengthens every claim',
      });
    }

    // --- No symptoms logged ---
    if (symptoms.length === 0 && userConditions.length > 0) {
      recs.push({
        label: 'Symptom Log',
        route: '/health/symptoms',
        description: 'Log daily symptoms to build evidence',
        reason: 'No symptoms logged yet — the VA values consistent documentation',
      });
    }

    // --- Sleep apnea + no sleep entries ---
    if (hasSleepApnea && sleepEntries.length < 3) {
      recs.push({
        label: 'Sleep Tracker',
        route: '/health/sleep',
        description: 'Track sleep quality and disturbances',
        reason: 'Sleep data supports your sleep condition claim',
      });
    }

    // --- No medical visits documented ---
    if (medicalVisits.length === 0 && userConditions.length > 0) {
      recs.push({
        label: 'Medical Visits',
        route: '/health/visits',
        description: 'Document your medical treatment history',
        reason: 'Medical visit records are critical evidence',
      });
    }

    // --- Has enough data for evidence strength ---
    if (symptoms.length >= 5) {
      recs.push({
        label: 'Evidence Strength',
        route: '/claims/evidence-strength',
        description: 'See how your logs align with rating criteria',
        reason: `${symptoms.length} symptom logs — check your evidence alignment`,
      });
    }

    // --- PTSD + no PTSD symptom logs ---
    if (hasPTSD && ptsdSymptoms.length === 0) {
      recs.push({
        label: 'PTSD Symptom Tracker',
        route: '/health/ptsd',
        description: 'Track PTSD-specific symptoms',
        reason: 'Detailed PTSD symptom tracking strengthens your claim',
      });
    }

    // --- No medications tracked ---
    if (medications.length === 0 && userConditions.length > 0) {
      recs.push({
        label: 'Medication Tracker',
        route: '/health/medications',
        description: 'Track medications and side effects',
        reason: 'Medication documentation shows treatment history',
      });
    }

    // --- Appeal goal + denied conditions ---
    if (
      claimGoal === 'appeal' &&
      userConditions.some((uc: UserCondition) => uc.claimStatus === 'denied')
    ) {
      recs.push({
        label: 'Decision Decoder',
        route: '/claims/decision-decoder',
        description: 'Understand your denial in plain English',
        reason: 'Analyze your denial to plan a stronger appeal',
      });
    }

    // --- Secondary claim goal ---
    if (claimGoal === 'secondary') {
      recs.push({
        label: 'Secondary Finder',
        route: '/claims',
        description: 'Discover secondary conditions linked to your primaries',
        reason: 'Find secondary conditions to strengthen your claim',
      });
    }

    // Return top 4 most relevant
    return recs.slice(0, 4);
  }, [
    userConditions,
    symptoms,
    migraines,
    buddyContacts,
    formDrafts,
    deadlines,
    medicalVisits,
    ptsdSymptoms,
    sleepEntries,
    medications,
    claimGoal,
  ]);
}
