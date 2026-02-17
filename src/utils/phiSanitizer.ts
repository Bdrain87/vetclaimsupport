/**
 * PHI / PII Sanitizer
 *
 * Strips personally-identifiable and protected health information patterns
 * from free-text before it is sent to external AI services (e.g. Google Gemini).
 *
 * Regex-based, zero external dependencies.
 */

const REDACTED = '[REDACTED]';

// ---------------------------------------------------------------------------
// 1. SSN  (XXX-XX-XXXX | XXX XX XXXX | XXXXXXXXX)
//    Must use word-boundaries so we don't match inside longer digit strings
//    for the purely-numeric variant.
// ---------------------------------------------------------------------------
const SSN_DASHED = /\b\d{3}-\d{2}-\d{4}\b/g;
const SSN_SPACED = /\b\d{3}\s\d{2}\s\d{4}\b/g;
const SSN_PLAIN  = /\b\d{9}\b/g;
const SSN_DOTTED = /\b\d{3}\.\d{2}\.\d{4}\b/g;

// ---------------------------------------------------------------------------
// 2. US phone numbers
//    Matches (xxx) xxx-xxxx, xxx-xxx-xxxx, xxx.xxx.xxxx, xxx xxx xxxx,
//    with optional +1 / 1- prefix
// ---------------------------------------------------------------------------
const PHONE =
  /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b/g;
const PHONE_PLAIN = /\b\d{10}\b/g;

// ---------------------------------------------------------------------------
// 3. Email addresses
// ---------------------------------------------------------------------------
const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// ---------------------------------------------------------------------------
// 4. Dates of birth  — only when preceded by a label keyword.
//    We keep the label and replace the date value.
//    Supported date forms: MM/DD/YYYY, MM-DD-YYYY, Month DD YYYY, YYYY-MM-DD
// ---------------------------------------------------------------------------
const DOB_KEYWORD = 'DOB|date\\s+of\\s+birth|born|birthday';
const DATE_PATTERN =
  '(?:' +
    '\\d{1,2}[/\\-]\\d{1,2}[/\\-]\\d{2,4}' +           // MM/DD/YYYY or M/D/YY
    '|\\d{4}[/\\-]\\d{1,2}[/\\-]\\d{1,2}' +             // YYYY-MM-DD
    '|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)' +
      '\\s+\\d{1,2},?\\s+\\d{2,4}' +                    // Month DD, YYYY
  ')';
const DOB = new RegExp(
  `(\\b(?:${DOB_KEYWORD})(?:\\s*:)?)\\s*(${DATE_PATTERN})`,
  'gi',
);

// ---------------------------------------------------------------------------
// 5. Street addresses  — number + street name + optional suffix
// ---------------------------------------------------------------------------
const STREET_SUFFIXES =
  'St(?:reet)?|Ave(?:nue)?|Blvd|Boulevard|Dr(?:ive)?|Ln|Lane|Rd|Road|Ct|Court|Pl(?:ace)?|Way|Cir(?:cle)?|Pkwy|Parkway|Hwy|Highway|Ter(?:race)?';
const ADDRESS = new RegExp(
  `\\b\\d{1,6}\\s+[A-Za-z0-9 .'-]{1,40}\\b(?:${STREET_SUFFIXES})\\b\\.?`,
  'gi',
);

// ---------------------------------------------------------------------------
// 6. Medical Record Numbers  (MRN: XXXXXXX)
//    Matches "MRN" followed by optional colon/space then 4-12 alphanumeric chars.
// ---------------------------------------------------------------------------
const MRN = /\bMRN\s*[:#]?\s*[A-Za-z0-9]{4,12}\b/gi;

// ---------------------------------------------------------------------------
// Exported sanitizer
// ---------------------------------------------------------------------------
export function sanitizePHI(text: string): string {
  let result = text;

  // Order matters: replace more specific patterns first.

  // DOB (label-aware) — keep the label, replace the date
  result = result.replace(DOB, (_match, label: string) => `${label} ${REDACTED}`);

  result = result.replace(SSN_DASHED, REDACTED);
  result = result.replace(SSN_SPACED, REDACTED);
  result = result.replace(SSN_DOTTED, REDACTED);
  result = result.replace(SSN_PLAIN, REDACTED);

  result = result.replace(PHONE, REDACTED);
  result = result.replace(PHONE_PLAIN, REDACTED);

  // Email
  result = result.replace(EMAIL, REDACTED);

  // Street addresses
  result = result.replace(ADDRESS, REDACTED);

  // MRN
  result = result.replace(MRN, REDACTED);

  return result;
}
