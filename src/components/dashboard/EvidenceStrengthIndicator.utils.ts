import type { ClaimCondition, ClaimsData } from '@/types/claims';

export function calculateEvidenceStrength(condition: ClaimCondition, data: ClaimsData) {
  // Calculate based on: symptoms (25%), medical visits (25%), medications (25%), exposures (25%)
  let score = 0;

  const hasSymptoms = condition.linkedSymptoms.length > 0;
  const hasMedicalVisits = condition.linkedMedicalVisits.length > 0;
  const hasExposures = condition.linkedExposures.length > 0;
  const hasBuddyStatements = condition.linkedBuddyContacts.length > 0;

  // Check if there are medications that might relate to this condition
  const hasMedications = data.medications.some(med =>
    (med.prescribedFor ?? '').toLowerCase().includes(condition.name.toLowerCase()) ||
    condition.name.toLowerCase().includes((med.prescribedFor ?? '').toLowerCase())
  );

  if (hasSymptoms) score += 25;
  if (hasMedicalVisits) score += 25;
  if (hasMedications || hasExposures) score += 25; // Combined: medications OR exposures/service connection
  if (hasBuddyStatements) score += 25;

  return {
    score,
    hasSymptoms,
    hasMedicalVisits,
    hasMedications,
    hasExposures,
    hasBuddyStatements,
  };
}

export function getStrengthLevel(score: number): {
  label: string;
  variant: 'destructive' | 'warning' | 'success';
  bgClass: string;
  textClass: string;
} {
  if (score >= 75) {
    return {
      label: 'Strong',
      variant: 'success',
      bgClass: 'bg-success/15',
      textClass: 'text-success',
    };
  }
  if (score >= 50) {
    return {
      label: 'Building',
      variant: 'warning',
      bgClass: 'bg-warning/15',
      textClass: 'text-warning',
    };
  }
  return {
    label: 'Needs Work',
    variant: 'destructive',
    bgClass: 'bg-destructive/15',
    textClass: 'text-destructive',
  };
}
