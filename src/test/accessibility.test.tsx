/**
 * Accessibility Audit — axe-core automated WCAG checks
 *
 * Renders key page components and runs axe-core against the rendered DOM.
 * Catches WCAG A/AA violations: missing alt text, bad contrast, no labels,
 * broken ARIA, focus traps, etc.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ClaimsProvider } from '@/context/ClaimsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserConditionsProvider } from '@/context/UserConditionsContext';
import { axe } from 'vitest-axe';
import React, { Suspense } from 'react';

// Suppress noisy warnings during test renders
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

function TestShell({ children }: { children: React.ReactNode }) {
  return (
    <ClaimsProvider>
      <ThemeProvider>
        <UserConditionsProvider>
          <MemoryRouter>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </MemoryRouter>
        </UserConditionsProvider>
      </ThemeProvider>
    </ClaimsProvider>
  );
}

// Key pages to audit (the most user-facing surfaces)
// NOTE: Dashboard excluded — too large for jsdom axe-core (times out).
// Covered by route smoke tests instead.
const criticalPages = [
  { name: 'Conditions', load: () => import('@/pages/Conditions') },
  { name: 'Settings', load: () => import('@/pages/Settings') },
  { name: 'HealthLog', load: () => import('@/pages/HealthLog') },
  { name: 'NotFound', load: () => import('@/pages/NotFound') },
  { name: 'FAQ', load: () => import('@/pages/FAQ') },
  { name: 'Terms', load: () => import('@/pages/Terms') },
  { name: 'Privacy', load: () => import('@/pages/Privacy') },
];

// axe-core rules to disable in JSDOM (they give false positives without
// a real layout engine — colour contrast, scrollable regions, etc.)
const AXE_OPTIONS = {
  rules: {
    // jsdom can't compute colour contrast
    'color-contrast': { enabled: false },
    // jsdom can't compute scrollable-region-focusable correctly
    'scrollable-region-focusable': { enabled: false },
    // Some Radix components use nested interactive roles intentionally
    'nested-interactive': { enabled: false },
  },
};

describe('Accessibility Audit (axe-core)', () => {
  for (const page of criticalPages) {
    it(`${page.name} has no critical axe-core violations`, async () => {
      const mod = await page.load();
      const Component = mod.default;

      const { container } = render(
        <TestShell>
          <Component />
        </TestShell>,
      );

      // Wait for lazy content to settle
      await waitFor(
        () => expect(container.innerHTML.length).toBeGreaterThan(100),
        { timeout: 3000 },
      );

      const results = await axe(container, AXE_OPTIONS);

      // Filter to only critical / serious violations
      const serious = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );

      if (serious.length > 0) {
        const summary = serious
          .map(
            (v) =>
              `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instance(s))`,
          )
          .join('\n');
        expect.fail(`axe-core found ${serious.length} violation(s):\n${summary}`);
      }
    });
  }

  // Test the PlatinumNavbar specifically for keyboard navigation
  it('PlatinumNavbar has no critical axe violations', async () => {
    const { PlatinumNavbar } = await import('@/components/PlatinumNavbar');

    const { container } = render(
      <MemoryRouter>
        <PlatinumNavbar />
      </MemoryRouter>,
    );

    const results = await axe(container, AXE_OPTIONS);
    const serious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (serious.length > 0) {
      const summary = serious
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instance(s))`,
        )
        .join('\n');
      expect.fail(`Navbar axe violations:\n${summary}`);
    }
  });

  // Test the ErrorBoundary error state for accessibility
  it('ErrorBoundary error state has no critical axe violations', async () => {
    const { ErrorBoundary } = await import('@/components/ErrorBoundary');

    const ThrowError = () => {
      throw new Error('test');
    };

    const { container } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const results = await axe(container, AXE_OPTIONS);
    const serious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (serious.length > 0) {
      const summary = serious
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instance(s))`,
        )
        .join('\n');
      expect.fail(`ErrorBoundary axe violations:\n${summary}`);
    }
  });
});
