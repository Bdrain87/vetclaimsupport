import { describe, it, expect } from 'vitest';
import { redactPII, REDACTION_TOKENS } from '../lib/redaction';

describe('redactPII', () => {
  // --- SSN patterns ---
  it('redacts SSN with dashes', () => {
    const { redactedText } = redactPII('My SSN is 123-45-6789.');
    expect(redactedText).toContain(REDACTION_TOKENS.SSN);
    expect(redactedText).not.toContain('123-45-6789');
  });

  it('redacts SSN with spaces', () => {
    const { redactedText } = redactPII('SSN: 123 45 6789');
    expect(redactedText).toContain(REDACTION_TOKENS.SSN);
    expect(redactedText).not.toContain('123 45 6789');
  });

  it('redacts SSN with dots', () => {
    const { redactedText } = redactPII('Social: 123.45.6789');
    expect(redactedText).toContain(REDACTION_TOKENS.SSN);
    expect(redactedText).not.toContain('123.45.6789');
  });

  it('redacts plain 9-digit SSN', () => {
    const { redactedText } = redactPII('SSN 123456789 on file');
    expect(redactedText).toContain(REDACTION_TOKENS.SSN);
  });

  // --- Partial SSN ---
  it('redacts partial SSN (last 4)', () => {
    const { redactedText } = redactPII('last 4 of SSN: 6789');
    expect(redactedText).toContain(REDACTION_TOKENS.SSN);
    expect(redactedText).not.toContain('6789');
  });

  it('redacts partial SSN (first 5 with XXX)', () => {
    const { redactedText } = redactPII('SSN: 123-45-XXXX');
    expect(redactedText).toContain(REDACTION_TOKENS.SSN);
    expect(redactedText).not.toContain('123-45-XXXX');
  });

  it('redacts labeled SSN', () => {
    const { redactedText } = redactPII('Social Security Number: 123 45 6789');
    expect(redactedText).toContain(REDACTION_TOKENS.SSN);
  });

  // --- Phone numbers ---
  it('redacts phone with dashes', () => {
    const { redactedText } = redactPII('Call me at 555-123-4567');
    expect(redactedText).toContain(REDACTION_TOKENS.PHONE);
    expect(redactedText).not.toContain('555-123-4567');
  });

  it('redacts phone with parens', () => {
    const { redactedText } = redactPII('Phone: (555) 123-4567');
    expect(redactedText).toContain(REDACTION_TOKENS.PHONE);
  });

  it('redacts phone with country code', () => {
    const { redactedText } = redactPII('Call +1-555-123-4567');
    expect(redactedText).toContain(REDACTION_TOKENS.PHONE);
  });

  // --- Email ---
  it('redacts email addresses', () => {
    const { redactedText } = redactPII('Email: john.doe@example.com');
    expect(redactedText).toContain(REDACTION_TOKENS.EMAIL);
    expect(redactedText).not.toContain('john.doe@example.com');
  });

  // --- DOB ---
  it('redacts DOB with label', () => {
    const { redactedText } = redactPII('DOB: 01/15/1985');
    expect(redactedText).toContain(REDACTION_TOKENS.DOB);
    expect(redactedText).not.toContain('01/15/1985');
  });

  it('redacts date of birth with label', () => {
    const { redactedText } = redactPII('Date of birth: January 15, 1985');
    expect(redactedText).toContain(REDACTION_TOKENS.DOB);
    expect(redactedText).not.toContain('January 15, 1985');
  });

  it('redacts born label with date', () => {
    const { redactedText } = redactPII('born 1985-01-15');
    expect(redactedText).toContain(REDACTION_TOKENS.DOB);
  });

  // --- Address ---
  it('redacts street addresses', () => {
    const { redactedText } = redactPII('Lives at 123 Main Street');
    expect(redactedText).toContain(REDACTION_TOKENS.ADDRESS);
    expect(redactedText).not.toContain('123 Main Street');
  });

  it('redacts various street suffixes', () => {
    const { redactedText: r1 } = redactPII('456 Oak Avenue');
    expect(r1).toContain(REDACTION_TOKENS.ADDRESS);

    const { redactedText: r2 } = redactPII('789 Elm Blvd');
    expect(r2).toContain(REDACTION_TOKENS.ADDRESS);
  });

  // --- VA claim numbers ---
  it('redacts VA claim numbers', () => {
    const { redactedText } = redactPII('Claim number: 12345678');
    expect(redactedText).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
    expect(redactedText).not.toContain('12345678');
  });

  it('redacts C-file numbers', () => {
    const { redactedText } = redactPII('C-file 123456789');
    expect(redactedText).toContain(REDACTION_TOKENS.CLAIM_NUMBER);
  });

  // --- Service numbers ---
  it('redacts service numbers', () => {
    const { redactedText } = redactPII('Service number: 12345678');
    expect(redactedText).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
  });

  it('redacts DOD ID numbers', () => {
    const { redactedText } = redactPII('DOD ID: 1234567890');
    expect(redactedText).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
  });

  it('redacts EDIPI numbers', () => {
    const { redactedText } = redactPII('EDIPI: 1234567890');
    expect(redactedText).toContain(REDACTION_TOKENS.SERVICE_NUMBER);
  });

  // --- MRN ---
  it('redacts medical record numbers', () => {
    const { redactedText } = redactPII('MRN: ABC123456');
    expect(redactedText).toContain(REDACTION_TOKENS.MRN);
    expect(redactedText).not.toContain('ABC123456');
  });

  // --- Counts ---
  it('returns accurate redaction counts', () => {
    const text = 'SSN: 123-45-6789, Phone: 555-123-4567, Email: test@test.com';
    const { redactionCount, redactionsByType } = redactPII(text);
    expect(redactionCount).toBeGreaterThanOrEqual(3);
    expect(redactionsByType[REDACTION_TOKENS.SSN]).toBeGreaterThanOrEqual(1);
    expect(redactionsByType[REDACTION_TOKENS.PHONE]).toBeGreaterThanOrEqual(1);
    expect(redactionsByType[REDACTION_TOKENS.EMAIL]).toBeGreaterThanOrEqual(1);
  });

  // --- No false positives ---
  it('does not redact clean text', () => {
    const text = 'The veteran served in Afghanistan from 2010 to 2014.';
    const { redactedText, redactionCount } = redactPII(text);
    expect(redactedText).toBe(text);
    expect(redactionCount).toBe(0);
  });

  // --- Complex document ---
  it('handles a complex document with multiple patterns', () => {
    const text = [
      'Patient: John Doe',
      'DOB: 03/15/1988',
      'SSN: 123-45-6789',
      'Phone: (555) 867-5309',
      'Address: 742 Evergreen Terrace',
      'Email: john.doe@va.gov',
      'Claim number: 12345678',
      'MRN: MR1234567',
    ].join('\n');

    const { redactedText, redactionCount } = redactPII(text);
    expect(redactionCount).toBeGreaterThanOrEqual(6);
    expect(redactedText).not.toContain('123-45-6789');
    expect(redactedText).not.toContain('03/15/1988');
    expect(redactedText).not.toContain('john.doe@va.gov');
    expect(redactedText).not.toContain('867-5309');
  });
});
