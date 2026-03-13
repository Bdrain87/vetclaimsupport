/**
 * Export Guard — Centralized banned-phrase check for ALL export paths.
 *
 * Every function that exports text to PDF, clipboard, or file must call
 * `guardExport()` before proceeding. If banned phrases are found the export
 * is blocked and the caller receives the list of matches so it can display
 * a modal to the user.
 */

import {
  scanForBannedPhrases,
  type BannedPhraseMatch,
  EXPORT_BLOCKED_MESSAGE,
} from '@/utils/bannedPhrases';

export interface ExportGuardResult {
  allowed: boolean;
  matches: BannedPhraseMatch[];
  message: string;
}

/**
 * Scan `text` for banned phrases. Returns `{ allowed: true }` when clean,
 * or `{ allowed: false, matches, message }` when blocked.
 */
export function guardExport(text: string): ExportGuardResult {
  const matches = scanForBannedPhrases(text);
  if (matches.length === 0) {
    return { allowed: true, matches: [], message: '' };
  }
  return { allowed: false, matches, message: EXPORT_BLOCKED_MESSAGE };
}
