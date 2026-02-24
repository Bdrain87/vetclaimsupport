/**
 * Redaction Pipeline
 *
 * Runs BEFORE any network call to strip PII/PHI from text.
 * Builds on phiSanitizer with more granular tokens and additional patterns.
 *
 * Patterns covered:
 * - SSN (full and partial — last 4, first 5)
 * - Service numbers (DOD ID numbers)
 * - DOB (label-aware and standalone)
 * - Street addresses
 * - Phone numbers
 * - Email addresses
 * - Medical Record Numbers (MRN)
 * - VA claim/file numbers
 * - Patient identifiers
 */

// ---------------------------------------------------------------------------
// Replacement tokens
// ---------------------------------------------------------------------------
export const REDACTION_TOKENS = {
  SSN: '[SSN_REDACTED]',
  DOB: '[DOB_REDACTED]',
  ADDRESS: '[ADDRESS_REDACTED]',
  PHONE: '[PHONE_REDACTED]',
  EMAIL: '[EMAIL_REDACTED]',
  CLAIM_NUMBER: '[CLAIM_NUMBER_REDACTED]',
  SERVICE_NUMBER: '[SERVICE_NUMBER_REDACTED]',
  MRN: '[MRN_REDACTED]',
} as const;

// ---------------------------------------------------------------------------
// 1. SSN patterns (full: XXX-XX-XXXX, partial: last 4, first 5)
// ---------------------------------------------------------------------------
const SSN_DASHED = /\b\d{3}-\d{2}-\d{4}\b/g;
const SSN_SPACED = /\b\d{3}\s\d{2}\s\d{4}\b/g;
const SSN_PLAIN = /(?<!\d)\d{9}(?!\d)/g;
const SSN_DOTTED = /\b\d{3}\.\d{2}\.\d{4}\b/g;

// Partial SSN: "last 4" or "last four" followed by 4 digits
const PARTIAL_SSN_LAST4 = /\b(?:last\s*(?:4|four)\s*(?:of\s*(?:SSN|social))?\s*[:#]?\s*)\d{4}\b/gi;
// Partial SSN: first 5 digits followed by XXXX or ****
const PARTIAL_SSN_FIRST5 = /\b\d{3}-\d{2}-[Xx*]{4}\b/g;
// "SSN" label followed by digits
const SSN_LABELED = /\b(?:SSN|social\s*security(?:\s*number)?)\s*[:#]?\s*\d[\d\s.-]{5,10}\d/gi;

// ---------------------------------------------------------------------------
// 2. Service numbers / DOD ID numbers
// ---------------------------------------------------------------------------
const SERVICE_NUMBER = /\b(?:service\s*(?:number|no\.?|#)|DOD\s*(?:ID|number)|EDIPI)\s*[:#]?\s*\d{6,10}\b/gi;

// ---------------------------------------------------------------------------
// 3. Phone numbers
// ---------------------------------------------------------------------------
const PHONE = /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b/g;
const PHONE_PLAIN = /\b\d{10}\b/g;

// ---------------------------------------------------------------------------
// 4. Email addresses
// ---------------------------------------------------------------------------
const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// ---------------------------------------------------------------------------
// 5. Dates of birth (label-aware)
// ---------------------------------------------------------------------------
const DOB_KEYWORD = 'DOB|date\\s+of\\s+birth|born|birthday';
const DATE_PATTERN =
  '(?:' +
    '\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{2,4}' +
    '|\\d{4}[/\\-]\\d{1,2}[/\\-]\\d{1,2}' +
    '|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)' +
      '\\s+\\d{1,2},?\\s+\\d{2,4}' +
  ')';
const DOB = new RegExp(
  `(\\b(?:${DOB_KEYWORD})(?:\\s*:)?)\\s*(${DATE_PATTERN})`,
  'gi',
);

// ---------------------------------------------------------------------------
// 6. Street addresses
// ---------------------------------------------------------------------------
const STREET_SUFFIXES =
  'St(?:reet)?|Ave(?:nue)?|Blvd|Boulevard|Dr(?:ive)?|Ln|Lane|Rd|Road|Ct|Court|Pl(?:ace)?|Way|Cir(?:cle)?|Pkwy|Parkway|Hwy|Highway|Ter(?:race)?';
const ADDRESS = new RegExp(
  `\\b\\d{1,6}\\s+[A-Za-z0-9 .'-]{1,40}\\b(?:${STREET_SUFFIXES})\\b\\.?`,
  'gi',
);

// ---------------------------------------------------------------------------
// 7. Medical Record Numbers (MRN)
// ---------------------------------------------------------------------------
const MRN = /\bMRN\s*[:#]?\s*[A-Za-z0-9]{4,12}\b/gi;

// ---------------------------------------------------------------------------
// 8. VA claim numbers / file numbers
// ---------------------------------------------------------------------------
const VA_CLAIM_NUMBER = /(?:\b(?:claim\s*(?:number|no\.?|#)|file\s*(?:number|no\.?|#))|C-file)\s*[:#]?\s*\d{6,12}\b/gi;

// ---------------------------------------------------------------------------
// 9. Patient identifiers (lab/hospital ID)
// ---------------------------------------------------------------------------
const PATIENT_ID = /\b(?:patient\s*(?:ID|number|no\.?|#)|member\s*(?:ID|number))\s*[:#]?\s*[A-Za-z0-9]{4,15}\b/gi;

// ---------------------------------------------------------------------------
// Exported redaction function
// ---------------------------------------------------------------------------
export interface RedactionResult {
  redactedText: string;
  redactionCount: number;
  redactionsByType: Record<string, number>;
}

export function redactPII(text: string): RedactionResult {
  let result = text;
  const counts: Record<string, number> = {};

  function track(token: string, count: number) {
    if (count > 0) {
      counts[token] = (counts[token] || 0) + count;
    }
  }

  function replaceAndCount(regex: RegExp, token: string, labelAware?: boolean): void {
    // Reset lastIndex for global regexes
    regex.lastIndex = 0;
    const matches = result.match(regex);
    const count = matches?.length || 0;

    if (labelAware) {
      result = result.replace(regex, (_match, label: string) => `${label} ${token}`);
    } else {
      result = result.replace(regex, token);
    }
    track(token, count);
  }

  // Order matters: more specific patterns first

  // DOB (label-aware) — keep the label, replace the date
  replaceAndCount(DOB, REDACTION_TOKENS.DOB, true);

  // SSN (labeled first, then full patterns, then partial)
  replaceAndCount(SSN_LABELED, REDACTION_TOKENS.SSN);
  replaceAndCount(SSN_DASHED, REDACTION_TOKENS.SSN);
  replaceAndCount(SSN_SPACED, REDACTION_TOKENS.SSN);
  replaceAndCount(SSN_DOTTED, REDACTION_TOKENS.SSN);

  // Service numbers / DOD IDs (before SSN_PLAIN to avoid false positives)
  replaceAndCount(SERVICE_NUMBER, REDACTION_TOKENS.SERVICE_NUMBER);

  // VA claim/file numbers (before SSN_PLAIN to avoid false positives)
  replaceAndCount(VA_CLAIM_NUMBER, REDACTION_TOKENS.CLAIM_NUMBER);

  // Plain SSN (9 digits) — after labeled patterns to avoid collisions
  replaceAndCount(SSN_PLAIN, REDACTION_TOKENS.SSN);
  replaceAndCount(PARTIAL_SSN_LAST4, REDACTION_TOKENS.SSN);
  replaceAndCount(PARTIAL_SSN_FIRST5, REDACTION_TOKENS.SSN);

  // Phone
  replaceAndCount(PHONE, REDACTION_TOKENS.PHONE);
  replaceAndCount(PHONE_PLAIN, REDACTION_TOKENS.PHONE);

  // Email
  replaceAndCount(EMAIL, REDACTION_TOKENS.EMAIL);

  // Address
  replaceAndCount(ADDRESS, REDACTION_TOKENS.ADDRESS);

  // MRN
  replaceAndCount(MRN, REDACTION_TOKENS.MRN);

  // Patient ID
  replaceAndCount(PATIENT_ID, REDACTION_TOKENS.MRN);

  const totalRedactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return {
    redactedText: result,
    redactionCount: totalRedactions,
    redactionsByType: counts,
  };
}
