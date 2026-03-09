/**
 * useEvidenceStrength — Maps tracked data against ratingCriteriaData keywords.
 * Returns factual comparisons like: "You logged 8.3 migraines/month — VA criteria
 * at 50%: 'prostrating attacks once a month.'" NO rating predictions.
 */
import { useMemo } from 'react';
import { useConditionData } from '@/hooks/useConditionData';
import { getRatingCriteriaByCondition } from '@/data/vaResources/ratingCriteria';
import { getRatingCriteria } from '@/data/ratingCriteria';
import type { RatingLevel as VaRatingLevel } from '@/data/vaResources/ratingCriteria';

export interface EvidenceComparison {
  conditionName: string;
  hasRatingCriteria: boolean;
  dataPoints: EvidenceDataPoint[];
  criteriaMatches: CriteriaMatch[];
}

export interface EvidenceDataPoint {
  label: string;
  value: string;
  category: 'symptom' | 'medication' | 'frequency' | 'impact';
}

export interface CriteriaMatch {
  percentage: number;
  description: string;
  matchedKeywords: string[];
  unmatchedKeywords: string[];
  matchStrength: 'strong' | 'partial' | 'none';
}

function matchKeywords(
  keywords: string[],
  textPool: string,
): { matched: string[]; unmatched: string[] } {
  const lower = textPool.toLowerCase();
  const matched: string[] = [];
  const unmatched: string[] = [];

  for (const kw of keywords) {
    const words = kw.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const found =
      words.length > 0
        ? words.some((w) => lower.includes(w))
        : lower.includes(kw.toLowerCase());
    if (found) {
      matched.push(kw);
    } else {
      unmatched.push(kw);
    }
  }
  return { matched, unmatched };
}

export function useEvidenceStrength(conditionName: string, conditionId?: string): EvidenceComparison {
  const condData = useConditionData(conditionName);

  return useMemo(() => {
    // Build text pool from all evidence
    const symptomTexts = condData.symptoms.map(
      (s) => `${s.symptom} ${s.bodyArea} ${s.notes} severity:${s.severity} frequency:${s.frequency} impact:${s.dailyImpact}`,
    );
    const medTexts = condData.medications.map(
      (m) => `${m.name} ${m.prescribedFor ?? ''} ${(m.sideEffects ?? []).join(' ')}`,
    );
    const textPool = [...symptomTexts, ...medTexts].join(' ');

    // Data points
    const dataPoints: EvidenceDataPoint[] = [];
    if (condData.symptoms.length > 0) {
      const avgSeverity =
        condData.symptoms.reduce((sum, s) => sum + s.severity, 0) / condData.symptoms.length;
      dataPoints.push({
        label: 'Symptom entries',
        value: `${condData.symptoms.length} logged (avg severity ${avgSeverity.toFixed(1)}/10)`,
        category: 'symptom',
      });
    }
    if (condData.medications.length > 0) {
      dataPoints.push({
        label: 'Medications tracked',
        value: `${condData.medications.length} medication${condData.medications.length !== 1 ? 's' : ''}`,
        category: 'medication',
      });
    }
    if (condData.migraines.length > 0) {
      const days90 = condData.migraines.filter((m) => {
        const d = new Date(m.date).getTime();
        return Date.now() - d < 90 * 86_400_000;
      });
      const monthlyRate = days90.length > 0 ? (days90.length / 3).toFixed(1) : '0';
      const prostratingCount = days90.filter((m) => m.wasProstrating).length;
      dataPoints.push({
        label: 'Migraine frequency (90-day)',
        value: `${monthlyRate}/month, ${prostratingCount} prostrating`,
        category: 'frequency',
      });
    }
    if (condData.employmentImpact.length > 0) {
      const totalHours = condData.employmentImpact.reduce((sum, e) => sum + e.hoursLost, 0);
      dataPoints.push({
        label: 'Work impact',
        value: `${totalHours} hours lost across ${condData.employmentImpact.length} incidents`,
        category: 'impact',
      });
    }

    // Try both rating criteria sources
    const lookupId = conditionId || conditionName.toLowerCase().replace(/\s+/g, '-');
    const vaResCriteria = getRatingCriteriaByCondition(lookupId);
    const legacyCriteria = getRatingCriteria(lookupId);

    const ratingLevels: { percentage: number; description: string; keywords: string[] }[] = [];
    if (vaResCriteria) {
      for (const level of vaResCriteria.ratingLevels) {
        ratingLevels.push({
          percentage: level.percentage,
          description: level.description,
          keywords: level.keywords,
        });
      }
    } else if (legacyCriteria) {
      for (const level of legacyCriteria.ratingLevels) {
        ratingLevels.push({
          percentage: level.percent,
          description: level.criteria,
          keywords: level.keywords,
        });
      }
    }

    const criteriaMatches: CriteriaMatch[] = ratingLevels.map((level) => {
      const { matched, unmatched } = matchKeywords(level.keywords, textPool);
      const ratio = level.keywords.length > 0 ? matched.length / level.keywords.length : 0;
      return {
        percentage: level.percentage,
        description: level.description,
        matchedKeywords: matched,
        unmatchedKeywords: unmatched,
        matchStrength: ratio >= 0.5 ? 'strong' : ratio > 0 ? 'partial' : 'none',
      };
    });

    return {
      conditionName,
      hasRatingCriteria: ratingLevels.length > 0,
      dataPoints,
      criteriaMatches,
    };
  }, [conditionName, conditionId, condData]);
}
