/**
 * AI Safe Mode System
 *
 * Three levels of AI data handling:
 * - Level 0 (Default): AI only processes text the user types. No document upload to AI.
 * - Level 1 (Redacted): User selects a document → app strips identifiers → sends redacted text to AI
 * - Level 2 (On-device only): Local-only processing. Coming soon.
 */

export type AISafeLevel = 0 | 1 | 2;

const STORAGE_KEY = 'vcs-ai-safe-mode-level';

export function getAISafeLevel(): AISafeLevel {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') return 1;
    if (stored === '2') return 2;
  } catch {
    // ignore
  }
  return 0;
}

export function setAISafeLevel(level: AISafeLevel): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(level));
  } catch {
    // Storage unavailable
  }
}

export const AI_SAFE_MODE_LABELS: Record<AISafeLevel, string> = {
  0: 'Text Only — AI only processes text you type. No document upload to AI.',
  1: 'Redacted Documents — Documents are stripped of identifiers before AI analysis.',
  2: 'On-Device Only — Coming soon. Local processing without third-party AI.',
};

export const AI_SAFE_MODE_SHORT: Record<AISafeLevel, string> = {
  0: 'Text Only (Default)',
  1: 'Redacted Documents',
  2: 'On-Device Only (Coming soon)',
};
