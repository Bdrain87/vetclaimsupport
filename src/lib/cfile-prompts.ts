/**
 * C-File Intel — AI prompts and response schemas for C-File analysis.
 *
 * Analyzes veteran C-Files to find missed conditions, secondary opportunities,
 * rating discrepancies, and evidence gaps — cross-referenced with their tracked data.
 */

import { AI_ANTI_HALLUCINATION } from './ai-prompts';

// ---------------------------------------------------------------------------
// Response schema
// ---------------------------------------------------------------------------

export interface CFileConditionFinding {
  conditionName: string;
  diagnosticCode?: string;
  mentionedInCFile: boolean;
  currentRating?: number;
  suggestedAction: 'add' | 'increase' | 'secondary' | 'review';
  reason: string;
  evidenceInFile: string;
}

export interface CFileSecondaryOpportunity {
  primaryCondition: string;
  secondaryCondition: string;
  medicalBasis: string;
  evidenceInFile: string;
}

export interface CFileEvidenceGap {
  condition: string;
  missingEvidence: string;
  recommendation: string;
}

export interface CFileAnalysisResult {
  summary: string;
  missedConditions: CFileConditionFinding[];
  ratingDiscrepancies: CFileConditionFinding[];
  secondaryOpportunities: CFileSecondaryOpportunity[];
  evidenceGaps: CFileEvidenceGap[];
  actionPlan: string[];
}

export const CFILE_RESPONSE_SCHEMA = {
  type: 'OBJECT' as const,
  properties: {
    summary: { type: 'STRING' as const, description: 'Brief 2-3 sentence summary of C-File analysis findings' },
    missedConditions: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          conditionName: { type: 'STRING' as const },
          diagnosticCode: { type: 'STRING' as const },
          mentionedInCFile: { type: 'BOOLEAN' as const },
          currentRating: { type: 'NUMBER' as const },
          suggestedAction: { type: 'STRING' as const, enum: ['add', 'increase', 'secondary', 'review'] },
          reason: { type: 'STRING' as const },
          evidenceInFile: { type: 'STRING' as const },
        },
        required: ['conditionName', 'mentionedInCFile', 'suggestedAction', 'reason', 'evidenceInFile'],
      },
    },
    ratingDiscrepancies: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          conditionName: { type: 'STRING' as const },
          diagnosticCode: { type: 'STRING' as const },
          currentRating: { type: 'NUMBER' as const },
          suggestedAction: { type: 'STRING' as const, enum: ['increase', 'review'] },
          reason: { type: 'STRING' as const },
          evidenceInFile: { type: 'STRING' as const },
        },
        required: ['conditionName', 'suggestedAction', 'reason', 'evidenceInFile'],
      },
    },
    secondaryOpportunities: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          primaryCondition: { type: 'STRING' as const },
          secondaryCondition: { type: 'STRING' as const },
          medicalBasis: { type: 'STRING' as const },
          evidenceInFile: { type: 'STRING' as const },
        },
        required: ['primaryCondition', 'secondaryCondition', 'medicalBasis', 'evidenceInFile'],
      },
    },
    evidenceGaps: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          condition: { type: 'STRING' as const },
          missingEvidence: { type: 'STRING' as const },
          recommendation: { type: 'STRING' as const },
        },
        required: ['condition', 'missingEvidence', 'recommendation'],
      },
    },
    actionPlan: {
      type: 'ARRAY' as const,
      items: { type: 'STRING' as const },
      description: 'Prioritized list of recommended next steps',
    },
  },
  required: ['summary', 'missedConditions', 'ratingDiscrepancies', 'secondaryOpportunities', 'evidenceGaps', 'actionPlan'],
};

// ---------------------------------------------------------------------------
// System prompt builder
// ---------------------------------------------------------------------------

export function buildCFileIntelPrompt(opts: {
  veteranContext: string;
  currentConditions: string[];
  secondaryConnections?: string;
  ratingCriteria?: string;
}): string {
  const conditionList = opts.currentConditions.length > 0
    ? `\nVETERAN'S CURRENT CLAIMED CONDITIONS:\n${opts.currentConditions.map(c => `- ${c}`).join('\n')}`
    : '\nVETERAN HAS NO CONDITIONS CLAIMED YET.';

  return `You are a VA claims research assistant helping a veteran understand their C-File (Claims File).

ROLE: You analyze the C-File document to identify potential opportunities the veteran may have missed. You are educational — you help veterans understand what's in their file and what it might mean for their claim.

IMPORTANT RULES:
- You are NOT a doctor. Do NOT diagnose conditions.
- You are NOT a legal advisor. Do NOT recommend specific filing actions.
- Frame findings as "your C-File mentions..." and "veterans in similar situations often consider..."
- Do NOT use: "nexus", "at least as likely as not", "more likely than not", "medical nexus", "reasonable medical certainty"
- Use "[CLINICIAN TO EVALUATE]" for any medical opinion areas
- Recommend consulting a VA-accredited VSO, attorney, or claims agent before taking action

${opts.veteranContext}
${conditionList}
${opts.secondaryConnections ? `\nKNOWN SECONDARY CONNECTIONS:\n${opts.secondaryConnections}` : ''}
${opts.ratingCriteria ? `\nRATING CRITERIA:\n${opts.ratingCriteria}` : ''}

ANALYSIS INSTRUCTIONS:
1. MISSED CONDITIONS: Look for diagnoses, treatments, or medical conditions mentioned in the C-File that are NOT in the veteran's current claimed conditions list. These represent potential unclaimed conditions.
2. RATING DISCREPANCIES: Look for evidence suggesting a condition's severity may exceed its current rating level. Compare documented symptoms against VA rating criteria.
3. SECONDARY OPPORTUNITIES: Identify conditions that could be secondary to currently claimed conditions based on medical evidence in the file.
4. EVIDENCE GAPS: For each claimed condition, identify what evidence is present vs what might strengthen the claim.
5. ACTION PLAN: Prioritize findings into actionable next steps.

Respond with structured JSON matching the provided schema.

${AI_ANTI_HALLUCINATION}`;
}
