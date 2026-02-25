/**
 * Platform Detection — tests for src/lib/platform.ts
 *
 * The platform module reads Capacitor.isNativePlatform() at import time,
 * so we must use vi.mock with different return values and dynamically
 * re-import the module for each scenario.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Platform Detection', () => {
  beforeEach(() => {
    // Clear the module cache so re-imports get fresh evaluations
    vi.resetModules();
  });

  it('correctly identifies native platform', async () => {
    // Mock Capacitor to report native
    vi.doMock('@capacitor/core', () => ({
      Capacitor: {
        isNativePlatform: () => true,
        getPlatform: () => 'ios',
      },
    }));

    const platform = await import('@/lib/platform');
    expect(platform.isNativeApp).toBe(true);
    expect(platform.isWeb).toBe(false);
  });

  it('correctly identifies web platform', async () => {
    // Mock Capacitor to report web
    vi.doMock('@capacitor/core', () => ({
      Capacitor: {
        isNativePlatform: () => false,
        getPlatform: () => 'web',
      },
    }));

    const platform = await import('@/lib/platform');
    expect(platform.isNativeApp).toBe(false);
    expect(platform.isWeb).toBe(true);
  });

  it('isNativeApp and isWeb are always opposite', async () => {
    vi.doMock('@capacitor/core', () => ({
      Capacitor: {
        isNativePlatform: () => true,
        getPlatform: () => 'android',
      },
    }));

    const platform = await import('@/lib/platform');
    expect(platform.isNativeApp).not.toBe(platform.isWeb);
  });

  it('isWeb is derived as the negation of isNativeApp', async () => {
    vi.doMock('@capacitor/core', () => ({
      Capacitor: {
        isNativePlatform: () => false,
        getPlatform: () => 'web',
      },
    }));

    const platform = await import('@/lib/platform');
    expect(platform.isWeb).toBe(!platform.isNativeApp);
  });
});
