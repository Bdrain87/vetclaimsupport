/**
 * Template Resolvers
 *
 * Merges category-level templates with condition-specific overrides
 * to produce fully-typed objects for any of the 792 VA conditions.
 *
 * Flow: Category Template (base) + Condition Override (specifics) = Resolved Object
 */

import { findTemplateForCondition } from './categoryTemplates';
import type {
  CategoryTemplate,
  EvidenceTemplate,
  ExamTemplate,
  RatingTemplate,
  LiteratureTemplate,
} from './categoryTemplates';
import { getConditionOverride } from './conditionOverrides';
import type { ConditionOverride } from './conditionOverrides';

// ---------------------------------------------------------------------------
// VACondition shape (compatible with conditions/types.ts, not imported)
// ---------------------------------------------------------------------------

interface VACondition {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  diagnosticCode: string;
  diagnosticCodes?: string[];
  typicalRatings: string;
  description: string;
  ratingCriteria?: string;
  commonSecondaries: string[];
  keywords: string[];
  bodySystem: string;
  cfrReference?: string;
  requiredFormKeys?: string[];
}

// ---------------------------------------------------------------------------
// Resolved types
// ---------------------------------------------------------------------------

export interface ResolvedEvidence {
  conditionId: string;
  conditionName: string;
  diagnosticCode: string;
  requiredEvidence: Array<{
    type: 'required' | 'recommended' | 'strongly-recommended';
    description: string;
    dbqForm?: string;
    source?: string;
  }>;
  recommendedEvidence: Array<{
    type: 'required' | 'recommended' | 'strongly-recommended';
    description: string;
    dbqForm?: string;
    source?: string;
  }>;
  commonEvidenceGaps: string[];
  ratingLevelEvidence: Array<{ ratingPercent: number; keyEvidence: string[] }>;
  tips: string[];
}

export interface ResolvedExamTest {
  name: string;
  purpose: string;
  whatExaminerDocuments: string;
  ratingImpact: string;
}

export interface ResolvedROMRange {
  movement: string;
  normalRange: string;
  ratingThresholds: { percent: number; range: string }[];
}

export interface ResolvedCPExam {
  conditionId: string;
  conditionName: string;
  diagnosticCode: string;
  examType: string;
  dbqFormNumber?: string;
  typicalDuration: string;
  physicalTests: ResolvedExamTest[];
  romRanges?: ResolvedROMRange[];
  examinerDocuments: string[];
  redFlags: string[];
  flareUpGuidance?: {
    typicalQuestions: string[];
    documentationNeeded: string;
    legalBasis: string;
  };
  functionalLimitationTips: string[];
  whatToExpect: string[];
  questionsToAsk: string[];
  commonPitfalls: string[];
}

export interface ResolvedRatingLevel {
  percent: number;
  criteria: string;
  keywords: string[];
}

export interface ResolvedRatingCriteria {
  conditionId: string;
  conditionName: string;
  diagnosticCode: string;
  cfrReference: string;
  scheduleUrl: string;
  ratingLevels: ResolvedRatingLevel[];
  examTips?: string[];
  commonMistakes?: string[];
}

export interface ResolvedCitation {
  id: string;
  conditionId: string;
  conditionName: string;
  studyTitle: string;
  journal: string;
  year: number;
  authors?: string;
  keyFinding: string;
  serviceConnectionRelevance: string;
  evidenceType:
    | 'epidemiological'
    | 'clinical'
    | 'meta-analysis'
    | 'longitudinal'
    | 'cohort'
    | 'case-control'
    | 'systematic-review';
}

// ---------------------------------------------------------------------------
// Placeholder replacement helper
// ---------------------------------------------------------------------------

function replacePlaceholders(
  text: string,
  condition: { name: string; diagnosticCode: string; id: string },
): string {
  return text
    .replace(/\{conditionName\}/g, condition.name)
    .replace(/\{diagnosticCode\}/g, condition.diagnosticCode)
    .replace(/\{conditionId\}/g, condition.id);
}

/**
 * Recursively walks an object or array and applies placeholder replacement
 * to every string value encountered.
 */
function deepReplacePlaceholders<T>(
  value: T,
  condition: { name: string; diagnosticCode: string; id: string },
): T {
  if (typeof value === 'string') {
    return replacePlaceholders(value, condition) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepReplacePlaceholders(item, condition)) as unknown as T;
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>)) {
      result[key] = deepReplacePlaceholders(
        (value as Record<string, unknown>)[key],
        condition,
      );
    }
    return result as T;
  }

  return value;
}

// ---------------------------------------------------------------------------
// resolveEvidence
// ---------------------------------------------------------------------------

export function resolveEvidence(condition: VACondition): ResolvedEvidence | undefined {
  const template = findTemplateForCondition(condition.category, condition.diagnosticCode);
  if (!template) {
    return undefined;
  }

  const evidence: EvidenceTemplate = template.evidence;

  // Start with template values as base
  let requiredEvidence = [...evidence.requiredEvidence];
  let recommendedEvidence = [...evidence.recommendedEvidence];
  let commonEvidenceGaps = [...evidence.commonEvidenceGaps];
  let ratingLevelEvidence = evidence.ratingLevelEvidence.map((r) => ({
    ratingPercent: r.ratingPercent,
    keyEvidence: [...r.keyEvidence],
  }));
  let tips = [...evidence.tips];

  // Apply condition-specific overrides
  const override = getConditionOverride(condition.id);
  if (override?.evidence) {
    const oe = override.evidence;

    if (oe.additionalRequired) {
      requiredEvidence = [...oe.additionalRequired, ...requiredEvidence];
    }
    if (oe.additionalRecommended) {
      recommendedEvidence = [...oe.additionalRecommended, ...recommendedEvidence];
    }
    if (oe.additionalGaps) {
      commonEvidenceGaps = [...oe.additionalGaps, ...commonEvidenceGaps];
    }
    if (oe.ratingLevelEvidence) {
      ratingLevelEvidence = oe.ratingLevelEvidence.map((r) => ({
        ratingPercent: r.ratingPercent,
        keyEvidence: [...r.keyEvidence],
      }));
    }
    if (oe.additionalTips) {
      tips = [...oe.additionalTips, ...tips];
    }
  }

  const resolved: ResolvedEvidence = {
    conditionId: condition.id,
    conditionName: condition.name,
    diagnosticCode: condition.diagnosticCode,
    requiredEvidence,
    recommendedEvidence,
    commonEvidenceGaps,
    ratingLevelEvidence,
    tips,
  };

  return deepReplacePlaceholders(resolved, condition);
}

// ---------------------------------------------------------------------------
// resolveCPExam
// ---------------------------------------------------------------------------

export function resolveCPExam(condition: VACondition): ResolvedCPExam | undefined {
  const template = findTemplateForCondition(condition.category, condition.diagnosticCode);
  if (!template) {
    return undefined;
  }

  const exam: ExamTemplate = template.exam;

  // Start with template values as base
  let examType = exam.examType;
  let dbqFormNumber: string | undefined = exam.dbqFormNumber;
  let physicalTests: ResolvedExamTest[] = exam.physicalTests.map((t) => ({
    name: t.name,
    purpose: t.purpose,
    whatExaminerDocuments: t.whatExaminerDocuments,
    ratingImpact: t.ratingImpact,
  }));
  let romRanges: ResolvedROMRange[] | undefined = exam.romRanges
    ? exam.romRanges.map((r) => ({
        movement: r.movement,
        normalRange: r.normalRange,
        ratingThresholds: r.ratingThresholds.map((th) => ({
          percent: th.percent,
          range: th.range,
        })),
      }))
    : undefined;
  let redFlags = [...exam.redFlags];
  let commonPitfalls = [...exam.commonPitfalls];

  // Standard lists
  const examinerDocuments = [
    'Diagnosis confirmation',
    'Severity assessment',
    'Functional impact on occupational and daily activities',
  ];
  const functionalLimitationTips = [
    'Describe your worst days, not your best',
    'Explain how the condition limits work tasks',
    'Document all assistive devices used',
  ];
  const questionsToAsk = [
    'Can you document the functional impact?',
    'Did you review my full medical history?',
    'Can you assess for secondary conditions?',
  ];

  // Apply condition-specific overrides
  const override = getConditionOverride(condition.id);
  if (override?.exam) {
    const oe = override.exam;

    if (oe.examType) {
      examType = oe.examType;
    }
    if (oe.dbqFormNumber) {
      dbqFormNumber = oe.dbqFormNumber;
    }
    if (oe.additionalTests) {
      physicalTests = [
        ...oe.additionalTests.map((t) => ({
          name: t.name,
          purpose: t.purpose,
          whatExaminerDocuments: t.whatExaminerDocuments,
          ratingImpact: t.ratingImpact,
        })),
        ...physicalTests,
      ];
    }
    if (oe.additionalRomRanges) {
      const additionalRanges: ResolvedROMRange[] = oe.additionalRomRanges.map((r) => ({
        movement: r.movement,
        normalRange: r.normalRange,
        ratingThresholds: r.ratingThresholds.map((th) => ({
          percent: th.percent,
          range: th.range,
        })),
      }));
      romRanges = romRanges
        ? [...additionalRanges, ...romRanges]
        : additionalRanges;
    }
    if (oe.additionalRedFlags) {
      redFlags = [...oe.additionalRedFlags, ...redFlags];
    }
    if (oe.additionalPitfalls) {
      commonPitfalls = [...oe.additionalPitfalls, ...commonPitfalls];
    }
  }

  const resolved: ResolvedCPExam = {
    conditionId: condition.id,
    conditionName: condition.name,
    diagnosticCode: condition.diagnosticCode,
    examType,
    dbqFormNumber,
    typicalDuration: exam.typicalDuration,
    physicalTests,
    romRanges,
    examinerDocuments,
    redFlags,
    flareUpGuidance: exam.flareUpGuidance
      ? {
          typicalQuestions: [...exam.flareUpGuidance.typicalQuestions],
          documentationNeeded: exam.flareUpGuidance.documentationNeeded,
          legalBasis: exam.flareUpGuidance.legalBasis,
        }
      : undefined,
    functionalLimitationTips,
    whatToExpect: [...exam.whatToExpect],
    questionsToAsk,
    commonPitfalls,
  };

  return deepReplacePlaceholders(resolved, condition);
}

// ---------------------------------------------------------------------------
// resolveRatingCriteria
// ---------------------------------------------------------------------------

export function resolveRatingCriteria(condition: VACondition): ResolvedRatingCriteria | undefined {
  const template = findTemplateForCondition(condition.category, condition.diagnosticCode);
  if (!template) {
    return undefined;
  }

  const rating: RatingTemplate = template.rating;

  // Build base rating levels from template
  let ratingLevels: ResolvedRatingLevel[] = rating.ratingLevels.map((l) => ({
    percent: l.percent,
    criteria: l.criteria,
    keywords: [...l.keywords],
  }));
  let examTips: string[] | undefined = rating.examTips ? [...rating.examTips] : undefined;
  let commonMistakes: string[] | undefined = rating.commonMistakes
    ? [...rating.commonMistakes]
    : undefined;

  // Determine CFR reference: prefer condition-level, fall back to template
  const cfrReference = condition.cfrReference || rating.cfrSection;

  // Apply condition-specific overrides
  const override = getConditionOverride(condition.id);
  if (override?.rating) {
    const or = override.rating;

    if (or.ratingLevels) {
      ratingLevels = or.ratingLevels.map((l) => ({
        percent: l.percent,
        criteria: l.criteria,
        keywords: [...l.keywords],
      }));
    }
    if (or.examTips) {
      examTips = examTips ? [...or.examTips, ...examTips] : [...or.examTips];
    }
    if (or.commonMistakes) {
      commonMistakes = commonMistakes
        ? [...or.commonMistakes, ...commonMistakes]
        : [...or.commonMistakes];
    }
  }

  const resolved: ResolvedRatingCriteria = {
    conditionId: condition.id,
    conditionName: condition.name,
    diagnosticCode: condition.diagnosticCode,
    cfrReference,
    scheduleUrl: rating.scheduleUrl,
    ratingLevels,
    examTips,
    commonMistakes,
  };

  return deepReplacePlaceholders(resolved, condition);
}

// ---------------------------------------------------------------------------
// resolveLiterature
// ---------------------------------------------------------------------------

export function resolveLiterature(condition: VACondition): ResolvedCitation[] {
  const template = findTemplateForCondition(condition.category, condition.diagnosticCode);
  if (!template) {
    return [];
  }

  const literature: LiteratureTemplate = template.literature;
  const citations: ResolvedCitation[] = [];

  // Build citations from template
  literature.citations.forEach((cite, index) => {
    citations.push({
      id: `${condition.id}-tmpl-${index + 1}`,
      conditionId: condition.id,
      conditionName: condition.name,
      studyTitle: cite.studyTitle,
      journal: cite.journal,
      year: cite.year,
      authors: cite.authors,
      keyFinding: cite.keyFinding,
      serviceConnectionRelevance: cite.serviceConnectionRelevance,
      evidenceType: cite.evidenceType,
    });
  });

  // Add condition-specific override citations
  const override = getConditionOverride(condition.id);
  if (override?.literature?.additionalCitations) {
    override.literature.additionalCitations.forEach((cite, index) => {
      citations.push({
        id: `${condition.id}-override-${index + 1}`,
        conditionId: condition.id,
        conditionName: condition.name,
        studyTitle: cite.studyTitle,
        journal: cite.journal,
        year: cite.year,
        authors: cite.authors,
        keyFinding: cite.keyFinding,
        serviceConnectionRelevance: cite.serviceConnectionRelevance,
        evidenceType: cite.evidenceType,
      });
    });
  }

  return deepReplacePlaceholders(citations, condition);
}
