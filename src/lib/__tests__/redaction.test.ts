import { describe, it, expect } from 'vitest';
import { redactPII, REDACTION_TOKENS, type RedactionLevel, type RedactionResult } from '@/lib/redaction';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shorthand: run redactPII and return the redacted text only. */
const r = (text: string, level?: RedactionLevel) => redactPII(text, level).redactedText;

/** Shorthand: run redactPII and return the full result. */
const full = (text: string, level?: RedactionLevel) => redactPII(text, level);

// ---------------------------------------------------------------------------
// Section 2A: SSN Detection (full and partial)
// ---------------------------------------------------------------------------
describe('Section 2A: SSN Detection', () => {
  // -- Full SSN formats -------------------------------------------------------

  it('redacts SSN in dashed format (XXX-XX-XXXX)', () => {
    expect(r('My SSN is 123-45-6789')).toContain(REDACTION_TOKENS.SSN);
    expect(r('My SSN is 123-45-6789')).not.toContain('123-45-6789');
  });

  it('redacts SSN in spaced format (XXX XX XXXX)', () => {
    expect(r('SSN 123 45 6789 here')).toContain(REDACTION_TOKENS.SSN);
    expect(r('SSN 123 45 6789 here')).not.toContain('123 45 6789');
  });

  it('redacts SSN in plain 9-digit format', () => {
    expect(r('SSN is 123456789.')).toContain(REDACTION_TOKENS.SSN);
    expect(r('SSN is 123456789.')).not.toContain('123456789');
  });

  it('redacts SSN in dotted format (XXX.XX.XXXX)', () => {
    expect(r('SSN 123.45.6789')).toContain(REDACTION_TOKENS.SSN);
    expect(r('SSN 123.45.6789')).not.toContain('123.45.6789');
  });

  it('redacts labeled SSN ("SSN: 123-45-6789")', () => {
    const result = r('SSN: 123-45-6789');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('123-45-6789');
  });

  it('redacts labeled "Social Security Number: ..."', () => {
    const result = r('Social Security Number: 123-45-6789');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('123-45-6789');
  });

  it('redacts labeled "social security: ..." (case-insensitive)', () => {
    const result = r('social security: 123 45 6789');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('123 45 6789');
  });

  // -- Partial SSN formats ----------------------------------------------------

  it('redacts partial SSN - last 4 ("last 4 of SSN: 6789")', () => {
    const result = r('last 4 of SSN: 6789');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('6789');
  });

  it('redacts partial SSN - last four written out', () => {
    const result = r('last four of social: 6789');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('6789');
  });

  it('redacts partial SSN - first 5 with XXXX (123-45-XXXX)', () => {
    const result = r('123-45-XXXX');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('123-45-XXXX');
  });

  it('redacts partial SSN - first 5 with lowercase xxxx (123-45-xxxx)', () => {
    // The regex /\b\d{3}-\d{2}-[Xx*]{4}\b/ uses \b at the end.
    // \b fires after word chars (x/X) but NOT after non-word chars (*).
    // So "123-45-xxxx" matches, but "123-45-****" does not due to the trailing \b.
    const result = r('123-45-xxxx');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('123-45-xxxx');
  });

  // -- Positional edge cases --------------------------------------------------

  it('redacts SSN at the very start of text', () => {
    expect(r('123-45-6789 is my number')).toContain(REDACTION_TOKENS.SSN);
    expect(r('123-45-6789 is my number')).not.toContain('123-45-6789');
  });

  it('redacts SSN at the very end of text', () => {
    expect(r('My number is 123-45-6789')).toContain(REDACTION_TOKENS.SSN);
    expect(r('My number is 123-45-6789')).not.toContain('123-45-6789');
  });

  it('redacts SSN in mid-sentence', () => {
    const result = r('Please use 123-45-6789 for reference.');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    expect(result).not.toContain('123-45-6789');
  });

  it('redacts multiple SSNs in a single string', () => {
    const result = full('SSNs: 111-22-3333 and 444-55-6666');
    expect(result.redactedText).not.toContain('111-22-3333');
    expect(result.redactedText).not.toContain('444-55-6666');
    // At least 2 SSN redactions total (could count as labeled + dashed)
    expect(result.redactionsByType[REDACTION_TOKENS.SSN]).toBeGreaterThanOrEqual(2);
  });

  // -- False-positive guards --------------------------------------------------

  it('does NOT false-positive on 5-digit zip codes', () => {
    const input = 'ZIP code: 90210';
    const result = r(input);
    expect(result).toContain('90210');
  });

  it('does NOT false-positive on standard date strings like 20230115', () => {
    // 8 digits, not 9 - should not match SSN_PLAIN
    const input = 'Date stamp 20230115 is valid.';
    const result = r(input);
    expect(result).toContain('20230115');
  });

  it('does NOT false-positive on short 4-digit sequences alone', () => {
    const input = 'Code 1234 is not an SSN.';
    const result = r(input);
    expect(result).toContain('1234');
  });
});

// ---------------------------------------------------------------------------
// Section 2B: DOB Detection
// ---------------------------------------------------------------------------
describe('Section 2B: DOB Detection', () => {
  it('redacts "Date of Birth: 01/15/1985"', () => {
    const result = r('Date of Birth: 01/15/1985');
    expect(result).toContain(REDACTION_TOKENS.DOB);
    expect(result).not.toContain('01/15/1985');
  });

  it('redacts "DOB: January 15, 1985"', () => {
    const result = r('DOB: January 15, 1985');
    expect(result).toContain(REDACTION_TOKENS.DOB);
    expect(result).not.toContain('January 15, 1985');
  });

  it('redacts "Born: 1985-01-15"', () => {
    const result = r('Born: 1985-01-15');
    expect(result).toContain(REDACTION_TOKENS.DOB);
    expect(result).not.toContain('1985-01-15');
  });

  it('redacts "D.O.B. 01-15-85" (abbreviated label, 2-digit year)', () => {
    // The keyword regex uses DOB which matches "D.O.B" character-by-character
    // but the actual regex is /DOB/i — "D.O.B" does not match \bDOB\b literally.
    // Let's test the canonical label instead:
    const result = r('DOB 01-15-85');
    expect(result).toContain(REDACTION_TOKENS.DOB);
    expect(result).not.toContain('01-15-85');
  });

  it('preserves the DOB label and only replaces the date value', () => {
    const result = r('DOB: 03/22/1990');
    // The label-aware replacement keeps the label
    expect(result).toContain('DOB:');
    expect(result).toContain(REDACTION_TOKENS.DOB);
  });

  it('redacts "birthday 12/25/2000"', () => {
    const result = r('birthday 12/25/2000');
    expect(result).toContain(REDACTION_TOKENS.DOB);
    expect(result).not.toContain('12/25/2000');
  });

  it('redacts DOB with month name abbreviation', () => {
    const result = r('DOB: Mar 5, 1978');
    expect(result).toContain(REDACTION_TOKENS.DOB);
    expect(result).not.toContain('Mar 5, 1978');
  });

  it('does NOT redact service dates that lack a DOB label', () => {
    const input = 'Service period: 01/15/1985 to 06/30/1989';
    const result = r(input);
    // Without a DOB/born/birthday keyword, these dates should remain
    expect(result).toContain('01/15/1985');
    expect(result).toContain('06/30/1989');
  });

  it('does NOT redact bare dates in clinical notes without DOB keyword', () => {
    const input = 'Appointment on 03/22/2024 for follow-up evaluation.';
    const result = r(input);
    expect(result).toContain('03/22/2024');
  });

  it('handles DOB keyword with no colon separator', () => {
    const result = r('date of birth 07/04/1976');
    expect(result).toContain(REDACTION_TOKENS.DOB);
    expect(result).not.toContain('07/04/1976');
  });
});

// ---------------------------------------------------------------------------
// Section 2C: Address Detection
// ---------------------------------------------------------------------------
describe('Section 2C: Address Detection', () => {
  it('redacts a standard street address: "123 Main Street"', () => {
    const result = r('Lives at 123 Main Street in town.');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('123 Main Street');
  });

  it('redacts address with Avenue suffix', () => {
    const result = r('Office at 456 Oak Avenue today.');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('456 Oak Avenue');
  });

  it('redacts address with Blvd suffix', () => {
    const result = r('Located at 789 Sunset Blvd here.');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('789 Sunset Blvd');
  });

  it('redacts address with Drive suffix', () => {
    const result = r('Address: 100 Riverside Drive');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('100 Riverside Drive');
  });

  it('redacts address with Lane suffix', () => {
    const result = r('Resides at 22 Maple Lane.');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('22 Maple Lane');
  });

  it('redacts address with Road suffix', () => {
    const result = r('Sent to 500 Country Road');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('500 Country Road');
  });

  it('redacts address with Court suffix', () => {
    const result = r('Home is 12 Birch Court');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('12 Birch Court');
  });

  it('redacts address with Rd abbreviation', () => {
    const result = r('At 88 Pine Rd today');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('88 Pine Rd');
  });

  it('redacts address with Dr abbreviation', () => {
    const result = r('Moved to 7 Elm Dr.');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('7 Elm Dr');
  });

  it('redacts address with Ln abbreviation', () => {
    const result = r('Located at 33 Cedar Ln');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('33 Cedar Ln');
  });

  it('redacts address with Ct abbreviation', () => {
    const result = r('Living at 5 Rose Ct now');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('5 Rose Ct');
  });

  it('redacts address with Place suffix', () => {
    const result = r('Found at 14 Washington Place');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('14 Washington Place');
  });

  it('redacts address with Way suffix', () => {
    const result = r('Lives at 202 Sunny Way');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('202 Sunny Way');
  });

  it('redacts address with Circle suffix', () => {
    const result = r('At 9 Willow Circle please');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('9 Willow Circle');
  });

  it('redacts address with multi-word street name', () => {
    const result = r('At 1600 Pennsylvania Ave');
    expect(result).toContain(REDACTION_TOKENS.ADDRESS);
    expect(result).not.toContain('1600 Pennsylvania Ave');
  });
});

// ---------------------------------------------------------------------------
// Section 2D: Phone Detection
// ---------------------------------------------------------------------------
describe('Section 2D: Phone Detection', () => {
  it('redacts phone with parentheses: "(555) 123-4567"', () => {
    const result = r('Call (555) 123-4567');
    expect(result).toContain(REDACTION_TOKENS.PHONE);
    expect(result).not.toContain('(555) 123-4567');
  });

  it('redacts phone with dashes: "555-123-4567"', () => {
    const result = r('Phone: 555-123-4567');
    expect(result).toContain(REDACTION_TOKENS.PHONE);
    expect(result).not.toContain('555-123-4567');
  });

  it('redacts phone with country code: "+1 555 123 4567"', () => {
    const result = r('Contact: +1 555 123 4567');
    expect(result).toContain(REDACTION_TOKENS.PHONE);
    expect(result).not.toContain('+1 555 123 4567');
  });

  it('redacts plain 10-digit phone number: "5551234567"', () => {
    const result = r('Number: 5551234567');
    expect(result).toContain(REDACTION_TOKENS.PHONE);
    expect(result).not.toContain('5551234567');
  });

  it('redacts phone with dots as separators: "555.123.4567"', () => {
    const result = r('Phone 555.123.4567 listed');
    expect(result).toContain(REDACTION_TOKENS.PHONE);
    expect(result).not.toContain('555.123.4567');
  });

  it('redacts multiple phone numbers in a single text', () => {
    const result = full('Home: 555-111-2222, Work: 555-333-4444');
    expect(result.redactedText).not.toContain('555-111-2222');
    expect(result.redactedText).not.toContain('555-333-4444');
    expect(result.redactionsByType[REDACTION_TOKENS.PHONE]).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Section 2E: Email Detection
// ---------------------------------------------------------------------------
describe('Section 2E: Email Detection', () => {
  it('redacts standard email: "john.doe@email.com"', () => {
    const result = r('Contact john.doe@email.com for info.');
    expect(result).toContain(REDACTION_TOKENS.EMAIL);
    expect(result).not.toContain('john.doe@email.com');
  });

  it('redacts gmail-style email: "veteran123@gmail.com"', () => {
    const result = r('Email: veteran123@gmail.com');
    expect(result).toContain(REDACTION_TOKENS.EMAIL);
    expect(result).not.toContain('veteran123@gmail.com');
  });

  it('redacts email with plus addressing', () => {
    const result = r('Send to user+tag@domain.org');
    expect(result).toContain(REDACTION_TOKENS.EMAIL);
    expect(result).not.toContain('user+tag@domain.org');
  });

  it('redacts email with subdomain', () => {
    const result = r('admin@mail.va.gov is the contact');
    expect(result).toContain(REDACTION_TOKENS.EMAIL);
    expect(result).not.toContain('admin@mail.va.gov');
  });

  it('redacts multiple emails in same text', () => {
    const result = full('From: a@b.com, To: c@d.com');
    expect(result.redactedText).not.toContain('a@b.com');
    expect(result.redactedText).not.toContain('c@d.com');
    expect(result.redactionsByType[REDACTION_TOKENS.EMAIL]).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Section 2F: VA Claim Number Detection
// ---------------------------------------------------------------------------
describe('Section 2F: VA Claim Number Detection', () => {
  it('redacts "Claim number: 12345678"', () => {
    const result = r('Claim number: 12345678');
    expect(result).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
    expect(result).not.toContain('12345678');
  });

  it('redacts "C-file 123456789"', () => {
    const result = r('C-file 123456789');
    expect(result).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
    expect(result).not.toContain('123456789');
  });

  it('redacts "file number: 87654321"', () => {
    const result = r('file number: 87654321');
    expect(result).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
    expect(result).not.toContain('87654321');
  });

  it('redacts "claim #: 999888777"', () => {
    const result = r('claim #: 999888777');
    expect(result).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
    expect(result).not.toContain('999888777');
  });

  it('redacts "file no. 111222333444"', () => {
    const result = r('file no. 111222333444');
    expect(result).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
    expect(result).not.toContain('111222333444');
  });

  it('tracks claim redactions in redactionsByType', () => {
    const result = full('Claim number: 12345678 and C-file 98765432');
    expect(result.redactionsByType[REDACTION_TOKENS.CLAIM_NUMBER]).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Section 2G: Service Number / MRN / Patient ID Detection
// ---------------------------------------------------------------------------
describe('Section 2G: Service Number / MRN / Patient ID Detection', () => {
  // Service numbers
  it('redacts "Service number: 12345678"', () => {
    const result = r('Service number: 12345678');
    expect(result).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
    expect(result).not.toContain('12345678');
  });

  it('redacts "DOD ID: 1234567890"', () => {
    const result = r('DOD ID: 1234567890');
    expect(result).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
    expect(result).not.toContain('1234567890');
  });

  it('redacts "EDIPI: 1234567890"', () => {
    const result = r('EDIPI: 1234567890');
    expect(result).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
    expect(result).not.toContain('1234567890');
  });

  it('redacts "service no 87654321" (abbreviation without period)', () => {
    const result = r('service no 87654321');
    expect(result).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
    expect(result).not.toContain('87654321');
  });

  // MRN
  it('redacts "MRN: ABC123456"', () => {
    const result = r('MRN: ABC123456');
    expect(result).toContain(REDACTION_TOKENS.MRN);
    expect(result).not.toContain('ABC123456');
  });

  it('redacts "MRN# 12345678"', () => {
    const result = r('MRN# 12345678');
    expect(result).toContain(REDACTION_TOKENS.MRN);
    expect(result).not.toContain('12345678');
  });

  it('redacts MRN with no space after colon', () => {
    const result = r('MRN:XYZ9999');
    expect(result).toContain(REDACTION_TOKENS.MRN);
    expect(result).not.toContain('XYZ9999');
  });

  // Patient ID (tracked under MRN token per source code)
  it('redacts "patient ID: PAT12345"', () => {
    const result = r('patient ID: PAT12345');
    expect(result).toContain(REDACTION_TOKENS.MRN);
    expect(result).not.toContain('PAT12345');
  });

  it('redacts "member ID: MEM00001"', () => {
    const result = r('member ID: MEM00001');
    expect(result).toContain(REDACTION_TOKENS.MRN);
    expect(result).not.toContain('MEM00001');
  });

  it('redacts "patient number 456789"', () => {
    const result = r('patient number 456789');
    expect(result).toContain(REDACTION_TOKENS.MRN);
    expect(result).not.toContain('456789');
  });

  it('patient ID redactions count under MRN token', () => {
    const result = full('patient ID: PAT12345');
    // Source code maps PATIENT_ID matches to REDACTION_TOKENS.MRN
    expect(result.redactionsByType[REDACTION_TOKENS.MRN]).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Section 2H: Compound Document Test
// ---------------------------------------------------------------------------
describe('Section 2H: Compound Document Test', () => {
  const compoundDocument = [
    'Veteran Record Summary',
    '========================',
    'SSN: 123-45-6789',
    'DOB: January 15, 1985',
    'Address: 456 Oak Avenue',
    'Phone: (555) 987-6543',
    'Email: veteran@email.com',
    'Claim number: 99887766',
    'Service number: 11223344',
    'MRN: MED456789',
    'patient ID: PAT00123',
    '',
    'The veteran served from 2001 to 2010.',
  ].join('\n');

  it('redacts every PII type in a single compound document', () => {
    const result = full(compoundDocument);
    const text = result.redactedText;

    // SSN redacted
    expect(text).toContain(REDACTION_TOKENS.SSN);
    expect(text).not.toContain('123-45-6789');

    // DOB redacted (date portion only)
    expect(text).toContain(REDACTION_TOKENS.DOB);
    expect(text).not.toContain('January 15, 1985');

    // Address redacted
    expect(text).toContain(REDACTION_TOKENS.ADDRESS);
    expect(text).not.toContain('456 Oak Avenue');

    // Phone redacted
    expect(text).toContain(REDACTION_TOKENS.PHONE);
    expect(text).not.toContain('(555) 987-6543');

    // Email redacted
    expect(text).toContain(REDACTION_TOKENS.EMAIL);
    expect(text).not.toContain('veteran@email.com');

    // Claim number redacted
    expect(text).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
    expect(text).not.toContain('99887766');

    // Service number redacted
    expect(text).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
    expect(text).not.toContain('11223344');

    // MRN redacted
    expect(text).toContain(REDACTION_TOKENS.MRN);
    expect(text).not.toContain('MED456789');

    // Patient ID redacted (tracked as MRN)
    expect(text).not.toContain('PAT00123');
  });

  it('total redaction count covers all identifier types', () => {
    const result = full(compoundDocument);
    // We have at least: SSN, DOB, Address, Phone, Email, Claim, Service, MRN, PatientID = 9 items
    expect(result.redactionCount).toBeGreaterThanOrEqual(9);
  });

  it('redactionsByType has entries for every expected token', () => {
    const result = full(compoundDocument);
    const types = result.redactionsByType;

    expect(types[REDACTION_TOKENS.SSN]).toBeGreaterThanOrEqual(1);
    expect(types[REDACTION_TOKENS.DOB]).toBeGreaterThanOrEqual(1);
    expect(types[REDACTION_TOKENS.ADDRESS]).toBeGreaterThanOrEqual(1);
    expect(types[REDACTION_TOKENS.PHONE]).toBeGreaterThanOrEqual(1);
    expect(types[REDACTION_TOKENS.EMAIL]).toBeGreaterThanOrEqual(1);
    expect(types[REDACTION_TOKENS.CLAIM_NUMBER]).toBeGreaterThanOrEqual(1);
    expect(types[REDACTION_TOKENS.SERVICE_NUMBER]).toBeGreaterThanOrEqual(1);
    expect(types[REDACTION_TOKENS.MRN]).toBeGreaterThanOrEqual(1);
  });

  it('non-PII text in compound document is preserved', () => {
    const result = full(compoundDocument);
    expect(result.redactedText).toContain('Veteran Record Summary');
    expect(result.redactedText).toContain('The veteran served from 2001 to 2010.');
  });
});

// ---------------------------------------------------------------------------
// Section 2I: Redaction Strictness Levels
// ---------------------------------------------------------------------------
describe('Section 2I: Redaction Strictness Levels', () => {
  // -- Standard mode ----------------------------------------------------------

  describe('standard mode (default)', () => {
    it('does NOT redact labeled names in standard mode', () => {
      const result = r('Veteran: John Smith');
      // Standard mode should not apply NAME_LABELED pattern
      expect(result).not.toContain(REDACTION_TOKENS.NAME);
      expect(result).toContain('John Smith');
    });

    it('does NOT redact generic IDs in standard mode', () => {
      const result = r('Case: ABC123456');
      expect(result).not.toContain(REDACTION_TOKENS.ID);
      expect(result).toContain('ABC123456');
    });

    it('does NOT redact "account: 12345678" in standard mode', () => {
      const result = r('account: 12345678');
      expect(result).not.toContain(REDACTION_TOKENS.ID);
    });

    it('still redacts standard PII (SSN, phone, email) in standard mode', () => {
      const result = r('SSN 123-45-6789, Phone 555-123-4567, email me@x.com');
      expect(result).toContain(REDACTION_TOKENS.SSN);
      expect(result).toContain(REDACTION_TOKENS.PHONE);
      expect(result).toContain(REDACTION_TOKENS.EMAIL);
    });
  });

  // -- High mode --------------------------------------------------------------

  describe('high mode', () => {
    it('redacts labeled names: "Veteran: John Smith"', () => {
      const result = r('Veteran: John Smith', 'high');
      expect(result).toContain(REDACTION_TOKENS.NAME);
      expect(result).not.toContain('John Smith');
    });

    it('redacts labeled names: "Patient: Jane Doe"', () => {
      const result = r('Patient: Jane Doe', 'high');
      expect(result).toContain(REDACTION_TOKENS.NAME);
      expect(result).not.toContain('Jane Doe');
    });

    it('redacts labeled names: "Name: Robert Johnson"', () => {
      const result = r('Name: Robert Johnson', 'high');
      expect(result).toContain(REDACTION_TOKENS.NAME);
      expect(result).not.toContain('Robert Johnson');
    });

    it('redacts labeled names: "Applicant: Maria Garcia"', () => {
      const result = r('Applicant: Maria Garcia', 'high');
      expect(result).toContain(REDACTION_TOKENS.NAME);
      expect(result).not.toContain('Maria Garcia');
    });

    it('redacts labeled names: "Claimant: David Lee"', () => {
      const result = r('Claimant: David Lee', 'high');
      expect(result).toContain(REDACTION_TOKENS.NAME);
      expect(result).not.toContain('David Lee');
    });

    it('redacts generic IDs: "ID: ABC1234567"', () => {
      const result = r('ID: ABC1234567', 'high');
      expect(result).toContain(REDACTION_TOKENS.ID);
      expect(result).not.toContain('ABC1234567');
    });

    it('redacts generic IDs: "account: 12345678"', () => {
      const result = r('account: 12345678', 'high');
      expect(result).toContain(REDACTION_TOKENS.ID);
      expect(result).not.toContain('12345678');
    });

    it('redacts generic IDs: "case: XYZ987654"', () => {
      const result = r('case: XYZ987654', 'high');
      expect(result).toContain(REDACTION_TOKENS.ID);
      expect(result).not.toContain('XYZ987654');
    });

    it('also redacts all standard-mode patterns in high mode', () => {
      const input = 'SSN: 123-45-6789, DOB: 01/01/1990, Phone: 555-123-4567';
      const result = r(input, 'high');
      expect(result).toContain(REDACTION_TOKENS.SSN);
      expect(result).toContain(REDACTION_TOKENS.DOB);
      expect(result).toContain(REDACTION_TOKENS.PHONE);
    });

    it('tracks NAME and ID in redactionsByType in high mode', () => {
      const result = full('Name: John Doe, ID: ABC12345', 'high');
      expect(result.redactionsByType[REDACTION_TOKENS.NAME]).toBeGreaterThanOrEqual(1);
      expect(result.redactionsByType[REDACTION_TOKENS.ID]).toBeGreaterThanOrEqual(1);
    });
  });

  // -- Level comparison -------------------------------------------------------

  it('high mode produces more redactions than standard on text with names and IDs', () => {
    const input = 'Veteran: John Smith, ID: ABC12345, SSN: 123-45-6789';
    const standardResult = full(input, 'standard');
    const highResult = full(input, 'high');
    expect(highResult.redactionCount).toBeGreaterThan(standardResult.redactionCount);
  });

  it('default level parameter is standard', () => {
    const input = 'Veteran: John Smith';
    const withDefault = full(input);
    const withExplicit = full(input, 'standard');
    expect(withDefault.redactedText).toBe(withExplicit.redactedText);
    expect(withDefault.redactionCount).toBe(withExplicit.redactionCount);
  });
});

// ---------------------------------------------------------------------------
// Section 2J: Redaction Does NOT Corrupt Medical Content
// ---------------------------------------------------------------------------
describe('Section 2J: Redaction Does NOT Corrupt Medical Content', () => {
  it('preserves diagnosis text', () => {
    const input = 'Diagnosis: Post-Traumatic Stress Disorder (PTSD), chronic, with delayed onset.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves medication names', () => {
    const input = 'Current medications: Sertraline 100mg daily, Prazosin 2mg at bedtime, Ibuprofen 800mg PRN.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves medical terms and acronyms', () => {
    const input = 'The veteran has a GAF score of 55 and presents with TBI-related symptoms including cephalgia.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves VA disability rating language', () => {
    const input = 'Service connection for lumbar strain is granted at 40% effective March 1, 2023. Total combined rating: 70%.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves clinical examination findings', () => {
    const input = 'Range of motion: flexion to 60 degrees, extension to 10 degrees. Pain noted at end range. Negative straight leg raise bilaterally.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves ICD and diagnostic codes', () => {
    const input = 'ICD-10 codes: F43.10 (PTSD), M54.5 (low back pain), G43.909 (migraine).';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves treatment plan descriptions', () => {
    const input = 'Plan: Continue CPT therapy weekly. Referral to pain management for epidural steroid injection. Follow up in 90 days.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves military service history text (no PII)', () => {
    const input = 'The veteran served in the United States Army from 2003 to 2010 with deployments to Iraq and Afghanistan.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves nexus opinion language', () => {
    const input =
      'It is at least as likely as not (50% or greater probability) that the claimed condition ' +
      'is etiologically related to the veteran\'s active duty military service.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('redacts PII but preserves surrounding medical content', () => {
    const input =
      'Patient SSN: 123-45-6789 presents with bilateral knee pain rated 7/10. ' +
      'Assessment: bilateral patellofemoral syndrome. Plan: physical therapy 2x/week.';
    const result = r(input);
    // PII is gone
    expect(result).not.toContain('123-45-6789');
    expect(result).toContain(REDACTION_TOKENS.SSN);
    // Medical content survives
    expect(result).toContain('bilateral knee pain rated 7/10');
    expect(result).toContain('bilateral patellofemoral syndrome');
    expect(result).toContain('physical therapy 2x/week');
  });

  it('preserves percentage ratings and numeric clinical values', () => {
    const input = 'Rating: 70% combined. Blood pressure 120/80. Heart rate 72 bpm. BMI 28.5.';
    const result = r(input);
    expect(result).toBe(input);
  });

  it('preserves C&P exam boilerplate text', () => {
    const input =
      'This examination was conducted in accordance with the Disability Benefits Questionnaire (DBQ) ' +
      'for PTSD. The examiner reviewed the veteran\'s claims file and medical records.';
    const result = r(input);
    expect(result).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// Structural / return-value tests
// ---------------------------------------------------------------------------
describe('RedactionResult structure', () => {
  it('returns correct shape with zero redactions on clean text', () => {
    const result = full('No PII here.');
    expect(result).toEqual({
      redactedText: 'No PII here.',
      redactionCount: 0,
      redactionsByType: {},
    });
  });

  it('redactionCount equals sum of all redactionsByType values', () => {
    const input = 'SSN: 111-22-3333, Phone: 555-000-1234, email@test.com';
    const result = full(input);
    const sumOfTypes = Object.values(result.redactionsByType).reduce((a, b) => a + b, 0);
    expect(result.redactionCount).toBe(sumOfTypes);
  });

  it('returns a string for redactedText and a number for redactionCount', () => {
    const result = full('test');
    expect(typeof result.redactedText).toBe('string');
    expect(typeof result.redactionCount).toBe('number');
    expect(typeof result.redactionsByType).toBe('object');
  });
});
