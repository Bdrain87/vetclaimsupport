/**
 * Smart Context Router
 *
 * Selectively injects only relevant context blocks into AI prompts
 * based on query intent, reducing token waste and improving response quality.
 */

export type ContextBlock =
  | 'criteria'
  | 'compensation'
  | 'appeals'
  | 'benefits'
  | 'secondary'
  | 'm21'
  | 'medical'
  | 'evidence'
  | 'cpExam'
  | 'outcomes';

interface RouteResult {
  blocks: ContextBlock[];
  confidence: number;
}

// Keyword groups mapped to context blocks
const BLOCK_KEYWORDS: Record<ContextBlock, string[]> = {
  criteria: [
    'rating', 'rated', 'percentage', 'percent', 'criteria', 'diagnostic code',
    'vasrd', 'schedule', 'cfr', 'dbq', 'rom', 'range of motion',
    'functional loss', 'impairment', 'severity',
  ],
  compensation: [
    'compensation', 'pay', 'money', 'back pay', 'retro', 'retroactive',
    'smc', 'special monthly', 'tdiu', 'unemployability', 'individual unemployability',
    'va math', 'combined rating', 'bilateral', 'rate', 'rates',
    'effective date', 'protection', 'how much',
  ],
  appeals: [
    'appeal', 'denied', 'denial', 'hlr', 'higher-level review', 'higher level review',
    'supplemental', 'board', 'bva', 'remand', 'cavc', 'notice of disagreement',
    'nod', 'decision', 'reconsider', 'disagree', 'fight', 'overturn',
    'duty to assist', 'cue', 'clear and unmistakable',
  ],
  benefits: [
    'benefit', 'education', 'gi bill', 'housing', 'voc rehab', 'vocational',
    'champva', 'healthcare', 'caregiver', 'state benefit', 'property tax',
    'license plate', 'commissary',
  ],
  secondary: [
    'secondary', 'caused by', 'aggravated', 'aggravation', 'connection',
    'linked', 'related to', 'due to', 'result of',
  ],
  m21: [
    'm21', 'adjudication', 'rater', 'duty to assist', 'benefit of the doubt',
    'presumptive', 'pact act', 'gulf war', 'agent orange', 'burn pit',
    'service connection', 'direct connection', 'aggravation',
    'favorable finding', 'reduction', 'staged rating', 'effective date',
    'adequate exam', 'insufficient exam', 'deferred', 'claim strategy',
    'what does the va look for', 'how does the va decide', 'rater error',
  ],
  medical: [
    'nexus', 'imo', 'independent medical', 'medical opinion', 'doctor',
    'physician', 'study', 'studies', 'research', 'literature', 'peer-reviewed',
    'journal', 'citation', 'medical evidence', 'doctor summary',
  ],
  evidence: [
    'evidence', 'documentation', 'records', 'what do i need', 'checklist',
    'gap', 'missing', 'insufficient', 'buddy letter', 'lay statement',
    'treatment record', 'service record', 'medical record', 'dbq',
    'what evidence', 'prove', 'support my claim',
  ],
  cpExam: [
    'c&p', 'cp exam', 'c and p', 'compensation and pension', 'exam prep',
    'examination', 'examiner', 'what to expect', 'exam day',
    'rom test', 'range of motion test', 'flare', 'flare-up',
    'functional test', 'worst day',
  ],
  outcomes: [
    'grant rate', 'success rate', 'approval rate', 'denial rate',
    'chances', 'odds', 'likely', 'likelihood', 'statistics', 'stats',
    'data', 'how often', 'win', 'outcome', 'average time', 'processing time',
    'how long', 'wait time', 'remand rate',
  ],
};

/**
 * Detect which context blocks are relevant to a query.
 *
 * @param query - The user's message text
 * @param conditions - Optional array of veteran's condition names (triggers criteria block)
 * @returns Array of relevant ContextBlock identifiers
 */
export function detectRelevantBlocks(
  query: string,
  conditions?: string[],
): ContextBlock[] {
  const lower = query.toLowerCase();
  const matched = new Set<ContextBlock>();

  // Always include criteria if conditions are present (baseline context)
  if (conditions && conditions.length > 0) {
    matched.add('criteria');
  }

  // Score each block by keyword hits
  for (const [block, keywords] of Object.entries(BLOCK_KEYWORDS) as [ContextBlock, string[]][]) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        matched.add(block);
        break;
      }
    }
  }

  // If no specific blocks matched (generic question), include criteria + secondary as defaults
  if (matched.size === 0) {
    if (conditions && conditions.length > 0) {
      matched.add('criteria');
      matched.add('secondary');
    }
  }

  // Co-occurrence rules: certain blocks logically pair together
  if (matched.has('appeals') && !matched.has('m21')) {
    matched.add('m21'); // Appeal questions benefit from M21-1 procedural rules
  }
  if (matched.has('cpExam') && !matched.has('criteria')) {
    matched.add('criteria'); // Exam prep needs rating criteria context
  }
  if (matched.has('evidence') && !matched.has('criteria')) {
    matched.add('criteria'); // Evidence gap analysis needs criteria reference
  }
  if (matched.has('medical') && !matched.has('criteria')) {
    matched.add('criteria'); // Nexus/IMO questions need condition criteria
  }

  return Array.from(matched);
}

/**
 * Check if a specific block should be included.
 */
export function shouldIncludeBlock(
  block: ContextBlock,
  relevantBlocks: ContextBlock[],
): boolean {
  return relevantBlocks.includes(block);
}
