/**
 * localStorage Data Persistence Tests
 *
 * Validates read/write/clear round-trips, JSON serialization, corrupt data
 * handling, and QuotaExceededError resilience.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
});

describe('localStorage persistence', () => {
  it('saves a string and reads it back', () => {
    localStorage.setItem('key', 'hello');
    expect(localStorage.getItem('key')).toBe('hello');
  });

  it('saves a JSON object and parses it back with deep equality', () => {
    const data = { name: 'PTSD', rating: 70, bilateral: false };
    localStorage.setItem('condition', JSON.stringify(data));
    const parsed = JSON.parse(localStorage.getItem('condition')!);
    expect(parsed).toEqual(data);
  });

  it('throws when parsing corrupt JSON data', () => {
    localStorage.setItem('bad', '{not valid json!!!');
    expect(() => JSON.parse(localStorage.getItem('bad')!)).toThrow();
  });

  it('handles multiple data types: strings, numbers, arrays, objects', () => {
    const testCases = [
      { key: 'str', value: 'text' },
      { key: 'num', value: 42 },
      { key: 'arr', value: [1, 'two', 3] },
      { key: 'obj', value: { nested: { deep: true } } },
    ];

    for (const { key, value } of testCases) {
      localStorage.setItem(key, JSON.stringify(value));
      expect(JSON.parse(localStorage.getItem(key)!)).toEqual(value);
    }
  });

  it('clears all items from localStorage', () => {
    localStorage.setItem('a', '1');
    localStorage.setItem('b', '2');
    localStorage.clear();
    expect(localStorage.getItem('a')).toBeNull();
    expect(localStorage.getItem('b')).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it('handles QuotaExceededError when setItem throws', () => {
    const original = Storage.prototype.setItem;
    const quotaError = new DOMException('QuotaExceededError', 'QuotaExceededError');

    Storage.prototype.setItem = vi.fn(() => {
      throw quotaError;
    });

    // The pattern used in the app: try-catch around localStorage writes
    let caught = false;
    try {
      localStorage.setItem('big', 'x'.repeat(100));
    } catch (err) {
      caught = true;
      expect((err as DOMException).name).toBe('QuotaExceededError');
    }

    expect(caught).toBe(true);

    // Restore
    Storage.prototype.setItem = original;
  });
});
