import { verifiedCases } from './appealsData';
import type { VerifiedCase } from './appealsData';
import type { ConditionCategory } from './conditions/types';

export interface DenialReason {
  id: string;
  label: string;
  description: string;
  mappedTopics: string[];
  mappedKeywords: string[];
}

export interface MatchedCase {
  caseData: VerifiedCase;
  relevanceScore: number;
  matchReasons: string[];
}

export interface AppealContext {
  conditionName: string;
  conditionCategory?: ConditionCategory;
  denialReasonIds: string[];
  additionalContext?: string;
  claimStatus?: 'denied' | 'appeal' | 'pending';
  isSecondary?: boolean;
  primaryConditionName?: string;
}

export const denialReasons: DenialReason[] = [
  {
    id: 'no-nexus',
    label: 'No Nexus to Service',
    description: 'VA says there is no medical link between your condition and your military service.',
    mappedTopics: ['nexus', 'service-connection', 'medical-opinion', 'elements-of-claim'],
    mappedKeywords: ['nexus', 'medical opinion', 'service connection', 'causal relationship', 'at least as likely as not'],
  },
  {
    id: 'no-current-diagnosis',
    label: 'No Current Diagnosis',
    description: 'VA says you do not have a current diagnosis for the claimed condition.',
    mappedTopics: ['service-connection', 'elements-of-claim', 'lay-evidence', 'competency'],
    mappedKeywords: ['current disability', 'present disability', 'diagnosis', 'lay observation', 'competent evidence'],
  },
  {
    id: 'no-in-service-event',
    label: 'No In-Service Event',
    description: 'VA says there is no evidence of the claimed event, injury, or disease during service.',
    mappedTopics: ['service-connection', 'lay-evidence', 'credibility', 'benefit-of-the-doubt'],
    mappedKeywords: ['in-service event', 'in-service incurrence', 'lay evidence', 'lay testimony', 'credibility', 'benefit of the doubt'],
  },
  {
    id: 'inadequate-exam',
    label: 'Inadequate C&P Exam',
    description: 'The C&P exam was too short, did not address your symptoms, or the examiner did not review your records.',
    mappedTopics: ['duty-to-assist', 'c-and-p-exam', 'adequate-examination', 'medical-opinion'],
    mappedKeywords: ['inadequate exam', 'adequate examination', 'duty to assist', 'C&P exam', 'reasoned explanation', 'sufficient detail'],
  },
  {
    id: 'preexisting-condition',
    label: 'Pre-Existing Condition',
    description: 'VA claims your condition existed before service and was not aggravated by service.',
    mappedTopics: ['presumption-of-soundness', 'aggravation', 'preexisting-condition'],
    mappedKeywords: ['presumption of soundness', 'preexisting', 'aggravation', 'clear and unmistakable evidence', 'entrance examination'],
  },
  {
    id: 'rating-too-low',
    label: 'Rating Too Low',
    description: 'You were granted service connection but the rating percentage does not reflect your actual disability level.',
    mappedTopics: ['increased-rating', 'staged-ratings', 'rating-criteria'],
    mappedKeywords: ['increased rating', 'staged ratings', 'varying severity', 'rating criteria', 'functional loss'],
  },
  {
    id: 'secondary-denied',
    label: 'Secondary Connection Denied',
    description: 'VA denied that your condition is caused by or aggravated by a service-connected disability.',
    mappedTopics: ['secondary-service-connection', 'aggravation', 'adequate-examination'],
    mappedKeywords: ['secondary', 'aggravation', 'proximately due to', '38 CFR 3.310', 'causation and aggravation', 'not caused by'],
  },
  {
    id: 'tdiu-denied',
    label: 'TDIU Denied',
    description: 'VA denied your Total Disability based on Individual Unemployability claim.',
    mappedTopics: ['TDIU', 'unemployability', 'duty-to-assist'],
    mappedKeywords: ['TDIU', 'total disability', 'unemployability', 'gainful occupation', 'unable to work'],
  },
  {
    id: 'effective-date-wrong',
    label: 'Effective Date Wrong',
    description: 'The effective date assigned for your benefits does not reflect when you should have started receiving them.',
    mappedTopics: ['effective-date', 'reopened-claim'],
    mappedKeywords: ['effective date', 'date of claim', 'reopened claim', 'new and material evidence'],
  },
  {
    id: 'mental-health-underrated',
    label: 'Mental Health Rating Too Low',
    description: 'Your PTSD, depression, anxiety, or other mental health rating does not reflect the severity of your symptoms.',
    mappedTopics: ['mental-health-rating', 'symptoms-not-exhaustive', 'rating-criteria', 'benefit-of-the-doubt'],
    mappedKeywords: ['mental health rating', 'symptoms not exhaustive', '38 CFR 4.130', 'occupational and social impairment', 'PTSD rating', 'Mittleider', 'indistinguishable'],
  },
  {
    id: 'musculoskeletal-underrated',
    label: 'Musculoskeletal Rating Too Low',
    description: 'Your back, knee, shoulder, or joint condition rating does not account for pain, flare-ups, or functional loss.',
    mappedTopics: ['increased-rating', 'functional-loss', 'pain', 'flare-ups', 'musculoskeletal', 'c-and-p-exam'],
    mappedKeywords: ['DeLuca factors', 'functional loss', 'pain on motion', 'flare-ups', 'range of motion', 'Correia', 'Sharp', 'musculoskeletal'],
  },
  {
    id: 'favorable-evidence-ignored',
    label: 'Favorable Evidence Ignored',
    description: 'The VA did not discuss favorable evidence in your file or did not explain why it was not persuasive.',
    mappedTopics: ['reasons-and-bases', 'favorable-evidence', 'board-duties', 'evidence-analysis'],
    mappedKeywords: ['favorable evidence', 'reasons and bases', 'must address', 'material evidence', 'credibility', 'probative value'],
  },
  {
    id: 'remand-not-followed',
    label: 'Remand Instructions Not Followed',
    description: 'The VA was ordered to take specific actions on remand but failed to comply with those instructions.',
    mappedTopics: ['duty-to-assist', 'remand-compliance', 'board-duties'],
    mappedKeywords: ['remand', 'compliance', 'Stegall violation', 'remand instructions', 'substantial compliance'],
  },
  {
    id: 'hearing-loss-denied',
    label: 'Hearing Loss Denied',
    description: 'VA denied hearing loss because your hearing was normal at separation from service.',
    mappedTopics: ['hearing-loss', 'service-connection', 'normal-at-separation'],
    mappedKeywords: ['hearing loss', 'normal at separation', 'noise exposure', '38 CFR 3.385', 'tinnitus'],
  },
  {
    id: 'cue',
    label: 'Clear and Unmistakable Error (CUE)',
    description: 'A prior final VA decision contains an obvious error in fact or law that changed the outcome.',
    mappedTopics: ['CUE', 'prior-decisions', 'finality'],
    mappedKeywords: ['clear and unmistakable error', 'CUE', 'prior decision', 'undebatable', 'manifestly changed'],
  },
];

const conditionCategoryToTopics: Record<string, string[]> = {
  'mental-health': ['mental-health-rating', 'symptoms-not-exhaustive', 'benefit-of-the-doubt'],
  musculoskeletal: ['musculoskeletal', 'functional-loss', 'pain', 'flare-ups', 'range-of-motion'],
  neurological: ['service-connection', 'secondary-service-connection'],
  respiratory: ['service-connection', 'secondary-service-connection', 'presumptive-service-connection'],
  cardiovascular: ['secondary-service-connection', 'service-connection'],
  digestive: ['secondary-service-connection', 'service-connection'],
  skin: ['service-connection', 'presumptive-service-connection'],
  endocrine: ['secondary-service-connection', 'presumptive-service-connection'],
  genitourinary: ['secondary-service-connection'],
  hematologic: ['service-connection'],
  infectious: ['presumptive-service-connection', 'service-connection'],
  dental: ['secondary-service-connection'],
  eye: ['secondary-service-connection', 'service-connection'],
  ear: ['hearing-loss', 'service-connection'],
  gynecological: ['service-connection'],
  other: ['service-connection'],
};

function scoreCaseForContext(c: VerifiedCase, context: AppealContext): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const selectedReasons = denialReasons.filter((dr) => context.denialReasonIds.includes(dr.id));

  for (const reason of selectedReasons) {
    const topicMatches = c.relevantTopics.filter((t) =>
      reason.mappedTopics.some((mt) => t.toLowerCase() === mt.toLowerCase())
    );
    if (topicMatches.length > 0) {
      score += topicMatches.length * 15;
      reasons.push(`Directly addresses "${reason.label}" denial basis`);
    }

    const keywordText = [...c.keywords, c.holding].join(' ').toLowerCase();
    const keywordHits = reason.mappedKeywords.filter((kw) => keywordText.includes(kw.toLowerCase()));
    if (keywordHits.length > 0) {
      score += keywordHits.length * 3;
    }
  }

  if (context.conditionCategory) {
    const categoryTopics = conditionCategoryToTopics[context.conditionCategory] || [];
    const categoryTopicMatches = c.relevantTopics.filter((t) =>
      categoryTopics.some((ct) => t.toLowerCase() === ct.toLowerCase())
    );
    if (categoryTopicMatches.length > 0) {
      score += categoryTopicMatches.length * 8;
      reasons.push(`Relevant to ${context.conditionCategory} conditions`);
    }

    const conditionMatches = c.relevantConditions.filter(
      (rc) => rc.toLowerCase() === context.conditionCategory!.toLowerCase() ||
        rc.toLowerCase().includes(context.conditionCategory!.toLowerCase())
    );
    if (conditionMatches.length > 0) {
      score += 12;
      reasons.push(`Specifically cites ${context.conditionCategory} cases`);
    }
  }

  if (context.conditionName) {
    const nameTerms = context.conditionName
      .toLowerCase()
      .replace(/[()[\]{}]/g, '')
      .split(/\s+/)
      .filter((t) => t.length >= 3);
    const caseText = [...c.keywords, c.holding, ...c.relevantConditions, ...c.relevantTopics]
      .join(' ')
      .toLowerCase();
    const nameHits = nameTerms.filter((term) => caseText.includes(term));
    if (nameHits.length > 0) {
      score += nameHits.length * 6;
      reasons.push(`Related to ${context.conditionName}`);
    }
  }

  if (c.relevantConditions.includes('all')) {
    score += 2;
  }

  if (context.isSecondary) {
    const secondaryTopicMatch = c.relevantTopics.some(
      (t) => t.toLowerCase().includes('secondary') || t.toLowerCase().includes('aggravation')
    );
    if (secondaryTopicMatch) {
      score += 20;
      reasons.push('Addresses secondary service connection');
    }
  }

  if (context.additionalContext) {
    const contextLower = context.additionalContext.toLowerCase();
    const contextKeywordHits = c.keywords.filter((kw) => contextLower.includes(kw.toLowerCase()));
    if (contextKeywordHits.length > 0) {
      score += contextKeywordHits.length * 5;
      reasons.push('Matches details from your description');
    }
  }

  const uniqueReasons = [...new Set(reasons)];
  return { score, reasons: uniqueReasons };
}

export function findRelevantCases(context: AppealContext): MatchedCase[] {
  if (context.denialReasonIds.length === 0) return [];

  const scored = verifiedCases
    .map((c) => {
      const { score, reasons } = scoreCaseForContext(c, context);
      return { caseData: c, relevanceScore: score, matchReasons: reasons };
    })
    .filter((m) => m.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scored;
}

export function getDenialReasonById(id: string): DenialReason | undefined {
  return denialReasons.find((dr) => dr.id === id);
}

export function getSuggestedDenialReasons(conditionCategory?: ConditionCategory): DenialReason[] {
  if (!conditionCategory) return denialReasons;

  const priorityMap: Record<string, string[]> = {
    'mental-health': ['mental-health-underrated', 'inadequate-exam', 'no-nexus', 'favorable-evidence-ignored'],
    musculoskeletal: ['musculoskeletal-underrated', 'inadequate-exam', 'rating-too-low', 'no-nexus'],
    ear: ['hearing-loss-denied', 'no-nexus', 'inadequate-exam', 'rating-too-low'],
    neurological: ['secondary-denied', 'no-nexus', 'inadequate-exam', 'rating-too-low'],
    respiratory: ['secondary-denied', 'no-nexus', 'inadequate-exam', 'preexisting-condition'],
    cardiovascular: ['secondary-denied', 'no-nexus', 'rating-too-low'],
    digestive: ['secondary-denied', 'no-nexus', 'rating-too-low'],
  };

  const priorityIds = priorityMap[conditionCategory] || [];

  return [
    ...denialReasons.filter((dr) => priorityIds.includes(dr.id)),
    ...denialReasons.filter((dr) => !priorityIds.includes(dr.id)),
  ];
}

export function generateRelevanceSummary(matched: MatchedCase, context: AppealContext): string {
  const { caseData, matchReasons } = matched;
  const selectedReasons = denialReasons.filter((dr) => context.denialReasonIds.includes(dr.id));
  const denialLabels = selectedReasons.map((r) => r.label).join(', ');

  let summary = `${caseData.caseName} (${caseData.citation}) is relevant to your appeal of "${context.conditionName}" `;
  summary += `because it ${matchReasons[0]?.toLowerCase() || 'addresses key legal principles in your case'}. `;

  if (selectedReasons.length > 0) {
    summary += `Your denial was based on: ${denialLabels}. `;
  }

  summary += `The court held: "${caseData.holding.substring(0, 200)}${caseData.holding.length > 200 ? '...' : ''}"`;

  return summary;
}
