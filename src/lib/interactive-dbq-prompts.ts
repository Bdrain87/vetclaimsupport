/**
 * AI prompt builders for the Interactive DBQ Rating Analyzer.
 */
import { formatCriteriaForPrompt, AI_ANTI_HALLUCINATION } from '@/lib/ai-prompts';
import type { ConditionRatingCriteria } from '@/data/ratingCriteria';

/** Per-question analysis result shape. */
export interface QuestionAnalysisResult {
  alignedPercent: number;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  keyTermsPresent: string[];
  keyTermsMissing: string[];
  improvementSuggestion: string;
}

/** Overall summary result shape. */
export interface OverallAnalysisResult {
  overallAlignedPercent: number;
  overallConfidence: 'high' | 'medium' | 'low';
  strengths: string[];
  gaps: string[];
  nextSteps: string[];
  questionBreakdown: Array<{
    questionIndex: number;
    alignedPercent: number;
    summary: string;
  }>;
}

/** JSON schema for per-question analysis (Gemini responseSchema). */
export const questionAnalysisSchema = {
  type: 'OBJECT' as const,
  properties: {
    alignedPercent: { type: 'NUMBER' as const, description: 'The rating percentage the answer best supports' },
    confidence: { type: 'STRING' as const, enum: ['high', 'medium', 'low'] },
    explanation: { type: 'STRING' as const, description: 'Brief explanation of the alignment assessment' },
    keyTermsPresent: { type: 'ARRAY' as const, items: { type: 'STRING' as const }, description: 'Key rating criteria terms present in the answer' },
    keyTermsMissing: { type: 'ARRAY' as const, items: { type: 'STRING' as const }, description: 'Key rating criteria terms missing from the answer' },
    improvementSuggestion: { type: 'STRING' as const, description: 'What the veteran could add to support a higher rating' },
  },
  required: ['alignedPercent', 'confidence', 'explanation', 'keyTermsPresent', 'keyTermsMissing', 'improvementSuggestion'],
};

/** JSON schema for overall summary analysis. */
export const overallAnalysisSchema = {
  type: 'OBJECT' as const,
  properties: {
    overallAlignedPercent: { type: 'NUMBER' as const },
    overallConfidence: { type: 'STRING' as const, enum: ['high', 'medium', 'low'] },
    strengths: { type: 'ARRAY' as const, items: { type: 'STRING' as const } },
    gaps: { type: 'ARRAY' as const, items: { type: 'STRING' as const } },
    nextSteps: { type: 'ARRAY' as const, items: { type: 'STRING' as const } },
    questionBreakdown: {
      type: 'ARRAY' as const,
      items: {
        type: 'OBJECT' as const,
        properties: {
          questionIndex: { type: 'NUMBER' as const },
          alignedPercent: { type: 'NUMBER' as const },
          summary: { type: 'STRING' as const },
        },
        required: ['questionIndex', 'alignedPercent', 'summary'],
      },
    },
  },
  required: ['overallAlignedPercent', 'overallConfidence', 'strengths', 'gaps', 'nextSteps', 'questionBreakdown'],
};

export const INTERACTIVE_DBQ_SYSTEM_INSTRUCTION = `You are a VA disability claims preparation assistant. You help veterans understand how their documented symptoms align with published VA rating criteria (38 CFR Part 4).

IMPORTANT RULES:
- You are NOT predicting a rating. You are showing how documented evidence aligns with published criteria.
- Be truthful and accurate. Never encourage exaggeration.
- Only reference criteria that actually exist in the rating schedule.
- The alignedPercent MUST be one of the available rating percentages for this condition.
- Focus on what is documented vs what criteria require.${AI_ANTI_HALLUCINATION}`;

/** Build prompt for analyzing a single DBQ question answer against rating criteria. */
export function buildQuestionAnalysisPrompt(
  conditionName: string,
  criteria: ConditionRatingCriteria,
  question: string,
  answer: string,
): string {
  const criteriaBlock = formatCriteriaForPrompt(criteria);
  const availablePercents = criteria.ratingLevels.map((l) => l.percent).join(', ');

  return `Analyze this veteran's answer to a DBQ question against the VA rating criteria.

<condition>${conditionName}</condition>

<rating_criteria>
${criteriaBlock}
</rating_criteria>

<available_rating_percentages>${availablePercents}</available_rating_percentages>

<dbq_question>${question}</dbq_question>

<veteran_answer>${answer}</veteran_answer>

Based on the veteran's answer, determine which rating percentage level their documented symptoms best align with. The alignedPercent MUST be one of: ${availablePercents}.

Consider:
1. Which specific rating criteria terms/concepts are present in their answer?
2. Which key terms are missing that would support a higher level?
3. What could they add (truthfully) to better document their actual symptoms?

Return your analysis as structured JSON.`;
}

/** Build prompt for overall summary analysis across all questions. */
export function buildOverallAnalysisPrompt(
  conditionName: string,
  criteria: ConditionRatingCriteria,
  questionsAndAnswers: Array<{ question: string; answer: string; analysisResult?: QuestionAnalysisResult }>,
): string {
  const criteriaBlock = formatCriteriaForPrompt(criteria);
  const availablePercents = criteria.ratingLevels.map((l) => l.percent).join(', ');

  const qaBlocks = questionsAndAnswers
    .map((qa, i) => {
      let block = `Question ${i + 1}: ${qa.question}\nAnswer: ${qa.answer}`;
      if (qa.analysisResult) {
        block += `\nPrior analysis: aligned to ${qa.analysisResult.alignedPercent}% (${qa.analysisResult.confidence} confidence)`;
      }
      return block;
    })
    .join('\n\n');

  return `Provide an overall rating alignment summary for this veteran's DBQ preparation.

<condition>${conditionName}</condition>

<rating_criteria>
${criteriaBlock}
</rating_criteria>

<available_rating_percentages>${availablePercents}</available_rating_percentages>

<questions_and_answers>
${qaBlocks}
</questions_and_answers>

Considering ALL answers holistically:
1. What overall rating percentage do these documented symptoms best align with? Must be one of: ${availablePercents}.
2. What are the strongest evidence points across all answers?
3. What are the biggest gaps in documentation?
4. What specific next steps would help them better document their actual symptoms?

Return your analysis as structured JSON.`;
}
