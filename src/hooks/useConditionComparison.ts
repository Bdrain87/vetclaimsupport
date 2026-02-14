import { useMemo } from 'react';
import useAppStore from '@/store/useAppStore';
import { getConditionById } from '@/data/conditions';
import { getRequiredFormsForCondition } from '@/data/vaRequiredForms';

export interface ComparedCondition {
  id: string;
  name: string;
  diagnosticCode: string;
  rating: number | undefined;
  claimStatus: string;
  evidenceCount: number;
  symptomCount: number;
  medicalVisitCount: number;
  documentCount: number;
  requiredForms: string[];
  bodyPart?: string;
}

export function useConditionComparison(conditionIdA: string, conditionIdB: string) {
  const userConditions = useAppStore((s) => s.userConditions);
  const symptoms = useAppStore((s) => s.symptoms);
  const medicalVisits = useAppStore((s) => s.medicalVisits);
  const evidenceDocuments = useAppStore((s) => s.evidenceDocuments);

  return useMemo(() => {
    const build = (condId: string): ComparedCondition | null => {
      const uc = userConditions.find((c) => c.id === condId);
      if (!uc) return null;

      const vaCondition = getConditionById(uc.conditionId);
      const name = vaCondition?.name ?? uc.conditionId;
      const dc = vaCondition?.diagnosticCode ?? '';

      const relatedSymptoms = symptoms.filter(
        (s) => s.conditionTags?.includes(uc.conditionId) || s.conditionTags?.includes(condId),
      );
      const relatedVisits = medicalVisits.filter(
        (v) => v.relatedCondition === condId || v.relatedCondition === uc.conditionId,
      );
      const relatedDocs = evidenceDocuments.filter(
        (d) => d.linkedEntries?.some((l) => l.entryId === condId),
      );

      const forms = getRequiredFormsForCondition(name);

      return {
        id: condId,
        name,
        diagnosticCode: dc,
        rating: uc.rating,
        claimStatus: uc.claimStatus,
        evidenceCount: relatedSymptoms.length + relatedVisits.length + relatedDocs.length,
        symptomCount: relatedSymptoms.length,
        medicalVisitCount: relatedVisits.length,
        documentCount: relatedDocs.length,
        requiredForms: forms.map((f) => f.name ?? f.formNumber ?? ''),
        bodyPart: uc.bodyPart,
      };
    };

    return {
      conditionA: build(conditionIdA),
      conditionB: build(conditionIdB),
    };
  }, [conditionIdA, conditionIdB, userConditions, symptoms, medicalVisits, evidenceDocuments]);
}
