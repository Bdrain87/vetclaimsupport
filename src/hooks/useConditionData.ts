/**
 * useConditionData — Central hook that returns ALL relevant data for a given condition.
 * Replaces the pattern of each tool manually calling individual prefill functions.
 */
import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useShallow } from 'zustand/react/shallow';
import {
  getConditionSymptoms,
  getConditionMedications,
  buildSymptomSummary,
  buildMedicationSummary,
  buildFunctionalImpactSummary,
} from '@/utils/prefillHelpers';
import type {
  SymptomEntry,
  Medication,
  MigraineEntry,
  SleepEntry,
  PTSDSymptomEntry,
  EmploymentImpactEntry,
  MedicalVisit,
  BuddyContact,
} from '@/types/claims';

export interface ConditionData {
  conditionName: string;
  symptoms: SymptomEntry[];
  medications: Medication[];
  migraines: MigraineEntry[];
  sleepEntries: SleepEntry[];
  ptsdSymptoms: PTSDSymptomEntry[];
  employmentImpact: EmploymentImpactEntry[];
  medicalVisits: MedicalVisit[];
  buddyContacts: BuddyContact[];
  formDrafts: Record<string, Record<string, string> & { lastModified: string }>;
  // Pre-built text summaries
  symptomSummary: string;
  medicationSummary: string;
  functionalImpactSummary: string;
  // Counts
  totalDataPoints: number;
}

function filterByCondition<T extends { conditionTags?: string[]; notes?: string }>(
  entries: T[],
  conditionName: string,
): T[] {
  const lower = conditionName.toLowerCase();
  return entries.filter(
    (e) =>
      e.conditionTags?.some((t) => t.toLowerCase().includes(lower)) ||
      (e.notes && e.notes.toLowerCase().includes(lower)),
  );
}

export function useConditionData(conditionName: string): ConditionData {
  const {
    symptoms: allSymptoms,
    medications: allMedications,
    migraines: allMigraines,
    sleepEntries: allSleep,
    ptsdSymptoms: allPtsd,
    employmentImpactEntries: allEmployment,
    medicalVisits: allVisits,
    buddyContacts,
    formDrafts,
  } = useAppStore(
    useShallow((s) => ({
      symptoms: s.symptoms,
      medications: s.medications,
      migraines: s.migraines,
      sleepEntries: s.sleepEntries,
      ptsdSymptoms: s.ptsdSymptoms,
      employmentImpactEntries: s.employmentImpactEntries,
      medicalVisits: s.medicalVisits,
      buddyContacts: s.buddyContacts,
      formDrafts: s.formDrafts,
    })),
  );

  return useMemo(() => {
    const symptoms = getConditionSymptoms(conditionName, allSymptoms);
    const medications = getConditionMedications(conditionName, allMedications);
    const migraines = filterByCondition(allMigraines, conditionName);
    const sleepEntries = filterByCondition(allSleep, conditionName);
    const ptsdSymptoms = filterByCondition(allPtsd, conditionName);
    const employmentImpact = allEmployment.filter(
      (e) => e.condition.toLowerCase().includes(conditionName.toLowerCase()),
    );
    const medicalVisits = allVisits.filter(
      (v) =>
        v.reason?.toLowerCase().includes(conditionName.toLowerCase()) ||
        v.notes?.toLowerCase().includes(conditionName.toLowerCase()),
    );

    const symptomSummary = buildSymptomSummary(symptoms);
    const medicationSummary = buildMedicationSummary(medications);
    const functionalImpactSummary = buildFunctionalImpactSummary(symptoms);

    const totalDataPoints =
      symptoms.length +
      medications.length +
      migraines.length +
      sleepEntries.length +
      ptsdSymptoms.length +
      employmentImpact.length +
      medicalVisits.length;

    return {
      conditionName,
      symptoms,
      medications,
      migraines,
      sleepEntries,
      ptsdSymptoms,
      employmentImpact,
      medicalVisits,
      buddyContacts,
      formDrafts,
      symptomSummary,
      medicationSummary,
      functionalImpactSummary,
      totalDataPoints,
    };
  }, [
    conditionName,
    allSymptoms,
    allMedications,
    allMigraines,
    allSleep,
    allPtsd,
    allEmployment,
    allVisits,
    buddyContacts,
    formDrafts,
  ]);
}
