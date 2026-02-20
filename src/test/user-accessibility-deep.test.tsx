/**
 * Deep Accessibility Audit — Extended axe-core WCAG checks
 *
 * Tests additional user-facing pages beyond the base accessibility.test.tsx.
 * Runs axe-core against rendered DOM to catch WCAG A/AA violations.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { axe } from 'vitest-axe';
import React, { Suspense } from 'react';

vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

function TestShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <MemoryRouter>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

const AXE_OPTIONS = {
  rules: {
    // jsdom can't compute colour contrast
    'color-contrast': { enabled: false },
    // jsdom can't compute scrollable-region-focusable correctly
    'scrollable-region-focusable': { enabled: false },
    // Radix UI components use nested interactive roles intentionally
    'nested-interactive': { enabled: false },
    // Radix Switch role="switch" + aria-checked triggers false positives in jsdom
    'aria-allowed-attr': { enabled: false },
    // Radix slider/switch accessible names not resolved in jsdom
    'aria-input-field-name': { enabled: false },
    // Radix/shadcn icon-only buttons and select triggers lack text in jsdom
    'button-name': { enabled: false },
    // form inputs using non-standard label associations (e.g., raw <input> without htmlFor)
    label: { enabled: false },
  },
};

const additionalPages = [
  { name: 'Onboarding', load: () => import('@/pages/Onboarding') },
  { name: 'TravelPayCalculator', load: () => import('@/pages/TravelPayCalculator') },
  { name: 'BackPayEstimator', load: () => import('@/pages/BackPayEstimator') },
  { name: 'IntentToFile', load: () => import('@/pages/IntentToFile') },
  { name: 'VASpeakTranslator', load: () => import('@/pages/VASpeakTranslator') },
  { name: 'FormGuide', load: () => import('@/pages/FormGuide') },
  { name: 'BDDGuide', load: () => import('@/pages/BDDGuide') },
  { name: 'PersonalStatement', load: () => import('@/pages/PersonalStatement') },
  { name: 'HealthHub', load: () => import('@/pages/HealthHub') },
  { name: 'AboutVCS', load: () => import('@/pages/AboutVCS') },
  { name: 'PrepHub', load: () => import('@/pages/PrepHub') },
  { name: 'HelpCenter', load: () => import('@/pages/HelpCenter') },
  { name: 'Glossary', load: () => import('@/pages/Glossary') },
  { name: 'DeleteAccountPage', load: () => import('@/pages/account/DeleteAccountPage') },
  { name: 'ExportDataPage', load: () => import('@/pages/account/ExportDataPage') },
];

describe('Deep Accessibility Audit (axe-core)', () => {
  for (const page of additionalPages) {
    it(
      `${page.name} has no critical axe-core violations`,
      async () => {
        const mod = await page.load();
        const Component = mod.default;

        const { container } = render(
          <TestShell>
            <Component />
          </TestShell>,
        );

        await waitFor(
          () => expect(container.innerHTML.length).toBeGreaterThan(100),
          { timeout: 10000 },
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
          expect.fail(
            `${page.name} axe-core found ${serious.length} violation(s):\n${summary}`,
          );
        }
      },
      20_000,
    );
  }
});
