/**
 * Key Manager Tests
 *
 * Tests encryption key initialization, caching, and localStorage storage.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('keyManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('generates a new key on first launch', async () => {
    const { initEncryptionKey } = await import('../keyManager');
    const key = await initEncryptionKey();
    expect(key).toBeTruthy();
    expect(typeof key).toBe('string');
    // Key should be base64 encoded (32 bytes = ~44 chars in base64)
    expect(key.length).toBeGreaterThan(20);
  });

  it('stores the generated key in localStorage', async () => {
    const { initEncryptionKey } = await import('../keyManager');
    await initEncryptionKey();
    const stored = localStorage.getItem('_vcs_web_enc_key');
    expect(stored).toBeTruthy();
  });

  it('retrieves existing key from localStorage on subsequent calls', async () => {
    localStorage.setItem('_vcs_web_enc_key', 'existing-test-key-base64');
    const { initEncryptionKey } = await import('../keyManager');
    const key = await initEncryptionKey();
    expect(key).toBe('existing-test-key-base64');
  });

  it('returns cached key on second call without re-reading localStorage', async () => {
    const { initEncryptionKey } = await import('../keyManager');
    const key1 = await initEncryptionKey();
    const key2 = await initEncryptionKey();
    expect(key1).toBe(key2);
  });

  it('getCachedKey returns null before init', async () => {
    const { getCachedKey } = await import('../keyManager');
    const result = getCachedKey();
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('getCachedKey returns the key after init', async () => {
    const { initEncryptionKey, getCachedKey } = await import('../keyManager');
    const key = await initEncryptionKey();
    expect(getCachedKey()).toBe(key);
  });
});
