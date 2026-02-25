/**
 * Delete Account Friction Flow Tests — Section 13
 *
 * Tests that delete account is properly placed in a "Danger Zone"
 * and requires multiple deliberate steps.
 */
import { describe, it, expect } from 'vitest';
import { DELETE_ACCOUNT_COPY } from '@/data/legalCopy';

// ---------------------------------------------------------------------------
// 13A: Location and Visibility
// ---------------------------------------------------------------------------
describe('Delete Account — Location and Visibility', () => {
  it('has a Danger Zone label', () => {
    expect(DELETE_ACCOUNT_COPY.dangerZoneLabel).toBe('Danger Zone');
  });

  it('has a Delete Account title', () => {
    expect(DELETE_ACCOUNT_COPY.title).toBe('Delete Account');
  });

  it('requires re-authentication', () => {
    expect(DELETE_ACCOUNT_COPY.requiresReauth).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 13B: Friction Flow
// ---------------------------------------------------------------------------
describe('Delete Account — Friction Flow', () => {
  it('consequences text mentions permanent deletion', () => {
    expect(DELETE_ACCOUNT_COPY.consequences).toContain('permanently deleted');
  });

  it('consequences text mentions data removal', () => {
    expect(DELETE_ACCOUNT_COPY.consequences).toContain('removed');
  });

  it('consequences text warns about irreversibility', () => {
    expect(DELETE_ACCOUNT_COPY.consequences).toContain('cannot be undone');
  });

  it('consequences text mentions local data', () => {
    expect(DELETE_ACCOUNT_COPY.consequences).toContain('local data');
  });

  it('consequences text mentions server-side data', () => {
    expect(DELETE_ACCOUNT_COPY.consequences).toContain('server-side data');
  });
});
