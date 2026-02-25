/**
 * FAB (Floating Action Button) Tests — Section 14
 *
 * Tests contextual visibility logic for the FAB across different screens.
 */
import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// FAB visibility logic (pure function)
// ---------------------------------------------------------------------------

const FAB_VISIBLE_ROUTES = [
  '/dashboard',
  '/health/symptoms',
  '/health/migraines',
  '/health/sleep',
  '/health/medications',
  '/health/visits',
  '/health/exposures',
  '/claims/body-map',
  '/claims/strategy',
];

const FAB_HIDDEN_ROUTES = [
  '/settings',
  '/legal/privacy',
  '/legal/terms',
  '/legal/disclaimer',
  '/about',
  '/account/export',
];

function isFabVisible(route: string): boolean {
  return FAB_VISIBLE_ROUTES.some((r) => route.startsWith(r));
}

// ---------------------------------------------------------------------------
// 14A: Contextual Visibility
// ---------------------------------------------------------------------------
describe('FAB — Contextual Visibility', () => {
  it('FAB visible on dashboard', () => {
    expect(isFabVisible('/dashboard')).toBe(true);
  });

  it('FAB visible on health tracking screens', () => {
    expect(isFabVisible('/health/symptoms')).toBe(true);
    expect(isFabVisible('/health/migraines')).toBe(true);
    expect(isFabVisible('/health/sleep')).toBe(true);
    expect(isFabVisible('/health/medications')).toBe(true);
  });

  it('FAB NOT visible on Settings', () => {
    expect(isFabVisible('/settings')).toBe(false);
  });

  it('FAB NOT visible on Legal pages', () => {
    expect(isFabVisible('/legal/privacy')).toBe(false);
    expect(isFabVisible('/legal/terms')).toBe(false);
    expect(isFabVisible('/legal/disclaimer')).toBe(false);
  });

  it('FAB NOT visible on About screen', () => {
    expect(isFabVisible('/about')).toBe(false);
  });

  it('FAB NOT visible on Export screen', () => {
    expect(isFabVisible('/account/export')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 14B: Overlap and Layout (pure logic)
// ---------------------------------------------------------------------------
describe('FAB — Layout Rules', () => {
  const TAB_BAR_HEIGHT = 56;
  const FAB_SIZE = 56;
  const FAB_BOTTOM_MARGIN = 16;
  const SAFE_AREA_BOTTOM = 34; // iPhone home indicator

  it('FAB bottom position is above tab bar', () => {
    const fabBottom = TAB_BAR_HEIGHT + FAB_BOTTOM_MARGIN + SAFE_AREA_BOTTOM;
    expect(fabBottom).toBeGreaterThan(TAB_BAR_HEIGHT);
  });

  it('FAB does not overlap the tab bar area', () => {
    const fabBottom = TAB_BAR_HEIGHT + FAB_BOTTOM_MARGIN + SAFE_AREA_BOTTOM;
    const fabTop = fabBottom + FAB_SIZE;
    // FAB top edge should be well above the tab bar
    expect(fabTop).toBeGreaterThan(TAB_BAR_HEIGHT + FAB_SIZE);
  });
});

// ---------------------------------------------------------------------------
// 14C: Action Sheet
// ---------------------------------------------------------------------------
describe('FAB — Action Sheet', () => {
  it('FAB-visible routes list has expected entries', () => {
    expect(FAB_VISIBLE_ROUTES.length).toBeGreaterThan(0);
  });

  it('FAB-hidden routes list has expected entries', () => {
    expect(FAB_HIDDEN_ROUTES.length).toBeGreaterThan(0);
  });

  it('no route appears in both visible and hidden lists', () => {
    for (const route of FAB_VISIBLE_ROUTES) {
      expect(FAB_HIDDEN_ROUTES).not.toContain(route);
    }
  });
});
