import { describe, it, expect } from 'vitest';
import {
  scanForBannedPhrases,
  containsBannedPhrases,
  hasLetterFormatTokens,
  DOCTOR_SUMMARY_DISCLAIMER,
  EXPORT_BLOCKED_MESSAGE,
} from '@/utils/bannedPhrases';

describe('bannedPhrases', () => {
  describe('scanForBannedPhrases', () => {
    it('detects "to whom it may concern"', () => {
      const matches = scanForBannedPhrases('To Whom It May Concern, I am writing...');
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].phrase).toBe('to whom it may concern');
    });

    it('detects "nexus letter"', () => {
      const matches = scanForBannedPhrases('This nexus letter establishes...');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects "nexus" alone', () => {
      const matches = scanForBannedPhrases('The nexus between service and condition');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects "at least as likely as not"', () => {
      const matches = scanForBannedPhrases('It is at least as likely as not that...');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects "more likely than not"', () => {
      const matches = scanForBannedPhrases('It is more likely than not related');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects "less likely than not"', () => {
      const matches = scanForBannedPhrases('It is less likely than not');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects "reasonable medical certainty"', () => {
      const matches = scanForBannedPhrases('Within reasonable medical certainty...');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects "medical certainty"', () => {
      const matches = scanForBannedPhrases('With medical certainty this condition...');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects "professional medical opinion"', () => {
      const matches = scanForBannedPhrases('In my professional medical opinion...');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects signature tokens', () => {
      expect(scanForBannedPhrases('Physician Signature: ___').length).toBeGreaterThan(0);
      expect(scanForBannedPhrases('Printed Name: Dr. Smith').length).toBeGreaterThan(0);
      expect(scanForBannedPhrases('License #: 12345').length).toBeGreaterThan(0);
      expect(scanForBannedPhrases('NPI: 9876543').length).toBeGreaterThan(0);
      expect(scanForBannedPhrases('Respectfully submitted').length).toBeGreaterThan(0);
    });

    it('detects conclusion phrases: "directly related to"', () => {
      const matches = scanForBannedPhrases('This condition is directly related to service');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects conclusion phrases: "caused by"', () => {
      const matches = scanForBannedPhrases('The hearing loss was caused by noise exposure');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects conclusion phrases: "due to"', () => {
      const matches = scanForBannedPhrases('Pain due to injury during deployment');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('detects conclusion phrases: "result of"', () => {
      const matches = scanForBannedPhrases('This is as a result of military service');
      expect(matches.length).toBeGreaterThan(0);
    });

    it('is case-insensitive', () => {
      expect(scanForBannedPhrases('TO WHOM IT MAY CONCERN').length).toBeGreaterThan(0);
      expect(scanForBannedPhrases('NEXUS LETTER').length).toBeGreaterThan(0);
      expect(scanForBannedPhrases('At Least As Likely As Not').length).toBeGreaterThan(0);
    });

    it('returns empty array for clean text', () => {
      const clean = 'I experienced knee pain during basic training in 2010. Symptoms have continued since separation.';
      expect(scanForBannedPhrases(clean)).toEqual([]);
    });

    it('returns multiple matches for text with multiple banned phrases', () => {
      const text = 'To Whom It May Concern, this nexus letter states it is at least as likely as not...';
      const matches = scanForBannedPhrases(text);
      expect(matches.length).toBeGreaterThanOrEqual(3);
    });

    it('provides context around each match', () => {
      const matches = scanForBannedPhrases('Hello this is a nexus letter for the veteran');
      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].context.length).toBeGreaterThan(0);
    });
  });

  describe('containsBannedPhrases', () => {
    it('returns true for text with banned phrases', () => {
      expect(containsBannedPhrases('This nexus letter proves...')).toBe(true);
    });

    it('returns false for clean text', () => {
      expect(containsBannedPhrases('Veteran reports knee pain began in 2010')).toBe(false);
    });
  });

  describe('hasLetterFormatTokens', () => {
    it('detects "sincerely"', () => {
      expect(hasLetterFormatTokens('Sincerely, Dr. Smith')).toBe(true);
    });

    it('detects "dear "', () => {
      expect(hasLetterFormatTokens('Dear Sir or Madam')).toBe(true);
    });

    it('detects "attestation"', () => {
      expect(hasLetterFormatTokens('Attestation of medical findings')).toBe(true);
    });

    it('detects "to whom it may concern"', () => {
      expect(hasLetterFormatTokens('To Whom It May Concern')).toBe(true);
    });

    it('detects "physician signature"', () => {
      expect(hasLetterFormatTokens('Physician Signature: ___')).toBe(true);
    });

    it('returns false for clean text', () => {
      expect(hasLetterFormatTokens('Patient reports daily headaches since 2018')).toBe(false);
    });
  });

  describe('DOCTOR_SUMMARY_DISCLAIMER', () => {
    it('contains the verbatim required disclaimer text', () => {
      expect(DOCTOR_SUMMARY_DISCLAIMER).toBe(
        'DISCLAIMER: This document was prepared by the veteran to organize information for a clinical visit. It is not medical or legal advice and does not provide a medical opinion or determine service connection. A licensed clinician must independently evaluate the veteran and author any clinical statements or medical opinions.'
      );
    });

    it('does not contain any banned phrases itself', () => {
      expect(containsBannedPhrases(DOCTOR_SUMMARY_DISCLAIMER)).toBe(false);
    });
  });

  describe('EXPORT_BLOCKED_MESSAGE', () => {
    it('contains the required export blocked message', () => {
      expect(EXPORT_BLOCKED_MESSAGE).toBe(
        'This export contains wording that could be interpreted as a clinician-authored medical opinion or letter. Please edit your inputs to remove that wording.'
      );
    });
  });

  describe('compliance: no banned phrases in outline export sections', () => {
    const outlineSectionHeaders = [
      'Doctor Summary Outline (Patient-Prepared)',
      'Veteran and Service Details (Facts)',
      'Conditions Selected (Labels)',
      'Service History Context (Patient-Reported)',
      'Relationship Context (Patient-Reported)',
      'Worsening Over Time (Patient-Reported)',
      'Exposures (Patient-Reported)',
      'Current Symptoms and Functional Impact (Patient-Reported)',
      'Treatment History and Response (Patient-Reported)',
      'Evidence References (Dated List)',
      'Clinician Documentation Prompts (Optional)',
      'Personal Statement Outline Prompts (Patient-Prepared)',
    ];

    outlineSectionHeaders.forEach(header => {
      it(`section header "${header}" contains no banned phrases`, () => {
        expect(containsBannedPhrases(header)).toBe(false);
      });

      it(`section header "${header}" contains no letter format tokens`, () => {
        expect(hasLetterFormatTokens(header)).toBe(false);
      });
    });
  });

  describe('compliance: clinician prompts contain no conclusions', () => {
    const clinicianPrompts = [
      'What objective findings were observed during examination?',
      'What diagnostic testing or imaging has been performed?',
      'How frequently do symptoms occur based on clinical records?',
      'What is the functional impact observed or reported?',
      'How has the veteran responded to treatment?',
      'Are there differential diagnostic considerations?',
      'What is the current clinical status compared to prior visits?',
    ];

    clinicianPrompts.forEach(prompt => {
      it(`prompt "${prompt}" contains no banned phrases`, () => {
        expect(containsBannedPhrases(prompt)).toBe(false);
      });
    });
  });
});
