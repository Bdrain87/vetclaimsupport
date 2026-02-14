const BANNED_PHRASES: string[] = [
  'to whom it may concern',
  'nexus letter',
  'nexus',
  'at least as likely as not',
  'more likely than not',
  'less likely than not',
  'reasonable medical certainty',
  'medical certainty',
  'professional medical opinion',
  'physician signature',
  'printed name',
  'credentials',
  'license #',
  'license number',
  'npi',
  'respectfully submitted',
  'independent medical examination',
  'ime',
  'medical nexus',
  'within a reasonable degree of medical probability',
  'board-certified',
  'i have reviewed',
  'based on my review',
  'it is my professional opinion',
];

const CONCLUSION_PHRASES: RegExp[] = [
  /\bdirectly related to\b/i,
  /\bdue to\b/i,
  /\bcaused by\b/i,
  /\b(?:as a |the )result of\b/i,
];

const LETTER_FORMAT_TOKENS: string[] = [
  'sincerely',
  'respectfully',
  'dear ',
  'to whom it may concern',
  'physician signature',
  'printed name, credentials',
  'license number / npi',
  'license number',
  'npi',
  'attestation',
];

export interface BannedPhraseMatch {
  phrase: string;
  index: number;
  context: string;
}

export function scanForBannedPhrases(text: string): BannedPhraseMatch[] {
  const matches: BannedPhraseMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of BANNED_PHRASES) {
    let searchFrom = 0;
    let idx = lowerText.indexOf(phrase, searchFrom);
    while (idx !== -1) {
      const start = Math.max(0, idx - 20);
      const end = Math.min(text.length, idx + phrase.length + 20);
      matches.push({
        phrase,
        index: idx,
        context: text.slice(start, end),
      });
      searchFrom = idx + phrase.length;
      idx = lowerText.indexOf(phrase, searchFrom);
    }
  }

  for (const regex of CONCLUSION_PHRASES) {
    const globalRegex = new RegExp(regex.source, 'gi');
    let match = globalRegex.exec(text);
    while (match !== null) {
      const idx = match.index;
      const start = Math.max(0, idx - 20);
      const end = Math.min(text.length, idx + match[0].length + 20);
      matches.push({
        phrase: match[0].toLowerCase(),
        index: idx,
        context: text.slice(start, end),
      });
      match = globalRegex.exec(text);
    }
  }

  return matches;
}

export function containsBannedPhrases(text: string): boolean {
  return scanForBannedPhrases(text).length > 0;
}

export function hasLetterFormatTokens(text: string): boolean {
  const lowerText = text.toLowerCase();
  return LETTER_FORMAT_TOKENS.some(token => lowerText.includes(token));
}

export const DOCTOR_SUMMARY_DISCLAIMER =
  'DISCLAIMER: This document was prepared by the veteran to organize information for a clinical visit. It is not medical or legal advice and does not provide a medical opinion or determine service connection. A licensed clinician must independently evaluate the veteran and author any clinical statements or medical opinions.';

export const EXPORT_BLOCKED_MESSAGE =
  'This export contains wording that could be interpreted as a clinician-authored medical opinion or letter. Please edit your inputs to remove that wording.';
