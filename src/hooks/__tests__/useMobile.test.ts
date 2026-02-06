import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

// ---------------------------------------------------------------------------
// The test setup (src/test/setup.ts) already mocks window.matchMedia with
// `matches: false`. We test against that default and can override per-test.
// ---------------------------------------------------------------------------

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset innerWidth to a desktop default before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('returns a boolean', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(typeof result.current).toBe('boolean');
  });

  it('returns false when window.innerWidth is >= 768 (desktop)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true when window.innerWidth is < 768 (mobile)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false when window.innerWidth is exactly 768', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true when window.innerWidth is 767 (one below breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('registers and cleans up a matchMedia change listener', () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();

    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: addSpy,
        removeEventListener: removeSpy,
        dispatchEvent: vi.fn(),
      }),
    );

    const { unmount } = renderHook(() => useIsMobile());

    expect(addSpy).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('responds to matchMedia change events', () => {
    let changeHandler: (() => void) | null = null;

    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (_event: string, handler: () => void) => {
          changeHandler = handler;
        },
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate a resize to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    act(() => {
      changeHandler?.();
    });

    expect(result.current).toBe(true);
  });
});
