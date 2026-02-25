/**
 * Notification System — copy logic tests
 *
 * Validates the platform-specific notification copy strings from
 * @/data/legalCopy.ts to ensure correct wording for iOS vs web
 * and proper disabled helper text.
 */

import { describe, it, expect } from 'vitest';

import { NOTIFICATION_COPY } from '@/data/legalCopy';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Notification System', () => {
  // -----------------------------------------------------------------------
  // Platform Copy
  // -----------------------------------------------------------------------
  describe('Platform Copy', () => {
    it('iOS copy says "Enable notifications to get daily symptom reminders."', () => {
      expect(NOTIFICATION_COPY.ios.enable).toBe(
        'Enable notifications to get daily symptom reminders.',
      );
    });

    it('iOS copy does NOT contain "browser notifications"', () => {
      expect(NOTIFICATION_COPY.ios.enable).not.toContain('browser notification');
    });

    it('iOS denied copy mentions iOS Settings', () => {
      expect(NOTIFICATION_COPY.ios.denied).toContain('iOS Settings');
    });

    it('iOS denied copy says notifications are blocked', () => {
      expect(NOTIFICATION_COPY.ios.denied).toContain('blocked');
    });

    it('web copy says "Enable browser notifications"', () => {
      expect(NOTIFICATION_COPY.web.enable).toContain('browser notifications');
    });

    it('web copy contains "symptom logging reminders"', () => {
      expect(NOTIFICATION_COPY.web.enable).toContain('symptom logging reminders');
    });

    it('web copy does NOT mention iOS Settings', () => {
      expect(NOTIFICATION_COPY.web.enable).not.toContain('iOS Settings');
    });

    it('web denied copy mentions browser settings', () => {
      expect(NOTIFICATION_COPY.web.denied).toContain('browser settings');
    });

    it('web denied copy mentions notifications are blocked', () => {
      expect(NOTIFICATION_COPY.web.denied).toContain('blocked');
    });
  });

  // -----------------------------------------------------------------------
  // Reminder Settings
  // -----------------------------------------------------------------------
  describe('Reminder Settings', () => {
    it('disabled helper text says "Enable reminders to set frequency."', () => {
      expect(NOTIFICATION_COPY.disabledHelper).toBe(
        'Enable reminders to set frequency.',
      );
    });

    it('disabled helper text is a non-empty string', () => {
      expect(typeof NOTIFICATION_COPY.disabledHelper).toBe('string');
      expect(NOTIFICATION_COPY.disabledHelper.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // Structure Completeness
  // -----------------------------------------------------------------------
  describe('Copy Structure', () => {
    it('NOTIFICATION_COPY has ios, web, and disabledHelper keys', () => {
      expect(NOTIFICATION_COPY).toHaveProperty('ios');
      expect(NOTIFICATION_COPY).toHaveProperty('web');
      expect(NOTIFICATION_COPY).toHaveProperty('disabledHelper');
    });

    it('ios has enable and denied keys', () => {
      expect(NOTIFICATION_COPY.ios).toHaveProperty('enable');
      expect(NOTIFICATION_COPY.ios).toHaveProperty('denied');
    });

    it('web has enable and denied keys', () => {
      expect(NOTIFICATION_COPY.web).toHaveProperty('enable');
      expect(NOTIFICATION_COPY.web).toHaveProperty('denied');
    });

    it('all copy values are non-empty strings', () => {
      expect(NOTIFICATION_COPY.ios.enable.length).toBeGreaterThan(0);
      expect(NOTIFICATION_COPY.ios.denied.length).toBeGreaterThan(0);
      expect(NOTIFICATION_COPY.web.enable.length).toBeGreaterThan(0);
      expect(NOTIFICATION_COPY.web.denied.length).toBeGreaterThan(0);
      expect(NOTIFICATION_COPY.disabledHelper.length).toBeGreaterThan(0);
    });
  });
});
