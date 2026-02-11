import { describe, it, expect } from 'vitest';
import { sanitizePHI } from '@/utils/phiSanitizer';

const R = '[REDACTED]';

// ---------------------------------------------------------------------------
// SSN patterns
// ---------------------------------------------------------------------------
describe('SSN sanitization', () => {
  it('strips dashed SSN (XXX-XX-XXXX)', () => {
    expect(sanitizePHI('My SSN is 123-45-6789 ok')).toBe(`My SSN is ${R} ok`);
  });

  it('strips spaced SSN (XXX XX XXXX)', () => {
    expect(sanitizePHI('SSN: 123 45 6789')).toBe(`SSN: ${R}`);
  });

  it('strips plain 9-digit SSN', () => {
    expect(sanitizePHI('SSN 123456789 here')).toBe(`SSN ${R} here`);
  });

  it('strips multiple SSNs in one string', () => {
    const input = 'SSN: 123-45-6789 and 987-65-4321';
    expect(sanitizePHI(input)).toBe(`SSN: ${R} and ${R}`);
  });
});

// ---------------------------------------------------------------------------
// Phone numbers
// ---------------------------------------------------------------------------
describe('phone number sanitization', () => {
  it('strips (xxx) xxx-xxxx', () => {
    expect(sanitizePHI('Call (555) 123-4567')).toBe(`Call ${R}`);
  });

  it('strips xxx-xxx-xxxx', () => {
    expect(sanitizePHI('Phone: 555-123-4567')).toBe(`Phone: ${R}`);
  });

  it('strips xxx.xxx.xxxx', () => {
    expect(sanitizePHI('Phone: 555.123.4567')).toBe(`Phone: ${R}`);
  });

  it('strips xxx xxx xxxx', () => {
    expect(sanitizePHI('Phone: 555 123 4567')).toBe(`Phone: ${R}`);
  });

  it('strips +1 prefixed numbers', () => {
    expect(sanitizePHI('Call +1 555-123-4567')).toBe(`Call ${R}`);
  });

  it('strips 1- prefixed numbers', () => {
    expect(sanitizePHI('Call 1-555-123-4567')).toBe(`Call ${R}`);
  });
});

// ---------------------------------------------------------------------------
// Email addresses
// ---------------------------------------------------------------------------
describe('email sanitization', () => {
  it('strips a standard email', () => {
    expect(sanitizePHI('Email: john.doe@example.com')).toBe(`Email: ${R}`);
  });

  it('strips email with subdomains', () => {
    expect(sanitizePHI('contact vet@mail.va.gov asap')).toBe(`contact ${R} asap`);
  });

  it('strips email with plus alias', () => {
    expect(sanitizePHI('user+test@gmail.com')).toBe(R);
  });
});

// ---------------------------------------------------------------------------
// DOB patterns
// ---------------------------------------------------------------------------
describe('date of birth sanitization', () => {
  it('strips DOB: MM/DD/YYYY', () => {
    expect(sanitizePHI('DOB: 03/15/1985')).toBe(`DOB: ${R}`);
  });

  it('strips DOB MM-DD-YYYY (no colon)', () => {
    expect(sanitizePHI('DOB 03-15-1985')).toBe(`DOB ${R}`);
  });

  it('strips date of birth with full date', () => {
    expect(sanitizePHI('date of birth: January 15, 1985')).toBe(
      `date of birth: ${R}`,
    );
  });

  it('strips "born" label with date', () => {
    expect(sanitizePHI('born 01/02/1990 in Texas')).toBe(
      `born ${R} in Texas`,
    );
  });

  it('strips "birthday" label with date', () => {
    expect(sanitizePHI('birthday: 1990-01-02')).toBe(`birthday: ${R}`);
  });

  it('does not strip standalone dates without DOB label', () => {
    // A date by itself (e.g., a visit date) should pass through
    const input = 'Visit on 03/15/2024 was routine';
    expect(sanitizePHI(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// Street addresses
// ---------------------------------------------------------------------------
describe('street address sanitization', () => {
  it('strips a standard street address', () => {
    expect(sanitizePHI('Lives at 123 Main St')).toBe(`Lives at ${R}`);
  });

  it('strips address with Avenue', () => {
    expect(sanitizePHI('456 Oak Avenue is nearby')).toBe(`${R} is nearby`);
  });

  it('strips address with Boulevard', () => {
    expect(sanitizePHI('789 Sunset Blvd')).toBe(R);
  });

  it('strips address with Drive', () => {
    expect(sanitizePHI('Address: 1024 Elm Drive')).toBe(`Address: ${R}`);
  });

  it('strips address with Road', () => {
    expect(sanitizePHI('at 42 Veterans Memorial Rd today')).toBe(`at ${R} today`);
  });
});

// ---------------------------------------------------------------------------
// MRN patterns
// ---------------------------------------------------------------------------
describe('MRN sanitization', () => {
  it('strips MRN with colon', () => {
    expect(sanitizePHI('MRN: 12345678')).toBe(R);
  });

  it('strips MRN with hash', () => {
    expect(sanitizePHI('MRN# ABC1234')).toBe(R);
  });

  it('strips MRN with no separator', () => {
    expect(sanitizePHI('MRN 987654')).toBe(R);
  });

  it('does not strip short IDs (fewer than 4 chars)', () => {
    // "MRN 12" should NOT match because 2 digits is below threshold
    const input = 'MRN 12';
    expect(sanitizePHI(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// Pass-through (non-PII text)
// ---------------------------------------------------------------------------
describe('non-PII pass-through', () => {
  it('leaves medical descriptions untouched', () => {
    const input =
      'Patient reports chronic lower back pain rated 7/10 with radiculopathy to the left leg. Prescribed gabapentin 300mg TID.';
    expect(sanitizePHI(input)).toBe(input);
  });

  it('leaves VA condition names untouched', () => {
    const input = 'PTSD, Tinnitus, Sleep Apnea, Migraines';
    expect(sanitizePHI(input)).toBe(input);
  });

  it('leaves short numbers alone', () => {
    const input = 'Rating: 70% combined from 50% and 30%';
    expect(sanitizePHI(input)).toBe(input);
  });

  it('handles empty string', () => {
    expect(sanitizePHI('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// Edge cases / combined
// ---------------------------------------------------------------------------
describe('edge cases', () => {
  it('strips multiple PII types in one string', () => {
    const input =
      'Vet John, SSN 123-45-6789, DOB: 03/15/1985, phone (555) 123-4567, email john@mail.com, MRN: AB12345';
    const result = sanitizePHI(input);
    expect(result).not.toContain('123-45-6789');
    expect(result).not.toContain('03/15/1985');
    expect(result).not.toContain('555');
    expect(result).not.toContain('john@mail.com');
    expect(result).not.toContain('AB12345');
    // DOB label should still be preserved
    expect(result).toContain('DOB:');
  });

  it('does not double-redact already redacted text', () => {
    const input = `My SSN is ${R}`;
    expect(sanitizePHI(input)).toBe(input);
  });

  it('handles text with no PII gracefully', () => {
    const input = 'Veteran served in Army from 2005 to 2010 and deployed to Iraq.';
    expect(sanitizePHI(input)).toBe(input);
  });
});
