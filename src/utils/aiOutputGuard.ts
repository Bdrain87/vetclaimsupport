/**
 * AI Output Guard — Post-generation scanning of AI responses.
 *
 * Run on every AI response before displaying to the user.
 * Does NOT block display — flags with a warning so veterans can review.
 */

import {
  scanForBannedPhrases,
  type BannedPhraseMatch,
} from '@/utils/bannedPhrases';

export interface AIOutputScanResult {
  clean: boolean;
  warnings: BannedPhraseMatch[];
}

/**
 * Scan AI-generated text for banned phrases.
 *
 * - `clean: true` → safe to display without warning
 * - `clean: false` → display with a warning badge
 */
export function scanAIOutput(text: string): AIOutputScanResult {
  const warnings = scanForBannedPhrases(text);
  return { clean: warnings.length === 0, warnings };
}

/** User-facing warning shown above flagged AI responses. */
export const AI_OUTPUT_WARNING =
  'This response contains language that may not be appropriate for VA submissions. Review carefully before using.';
