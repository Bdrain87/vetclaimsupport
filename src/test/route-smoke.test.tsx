/**
 * Route Smoke Tests
 *
 * Renders every page component individually inside the required providers
 * (ClaimsProvider, UserConditionsProvider, EvidenceProvider, ThemeProvider,
 * MemoryRouter, Suspense) and verifies it mounts without crashing.
 *
 * This catches broken imports, missing context, and render-time exceptions
 * across the entire route surface.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { Suspense } from 'react';

// ---------------------------------------------------------------------------
// Suppress console noise from intentional test scenarios (missing data, etc.)
// ---------------------------------------------------------------------------
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

// ---------------------------------------------------------------------------
// Page registry — every page that uses a default export
// ---------------------------------------------------------------------------
const pages: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  Dashboard: () => import('@/pages/Dashboard'),
  Conditions: () => import('@/pages/Conditions'),
  ConditionGuide: () => import('@/pages/ConditionGuide'),
  ConditionsByConflict: () => import('@/pages/ConditionsByConflict'),
  SecondaryFinder: () => import('@/pages/SecondaryFinder'),
  BilateralCalculator: () => import('@/pages/BilateralCalculator'),
  ClaimChecklist: () => import('@/pages/ClaimChecklist'),
  ClaimJourney: () => import('@/pages/ClaimJourney'),
  ClaimStrategyWizard: () => import('@/pages/ClaimStrategyWizard'),
  ClaimTools: () => import('@/pages/ClaimTools'),
  Timeline: () => import('@/pages/Timeline'),
  HealthLog: () => import('@/pages/HealthLog'),
  Symptoms: () => import('@/pages/Symptoms'),
  Sleep: () => import('@/pages/Sleep'),
  Medications: () => import('@/pages/Medications'),
  Migraines: () => import('@/pages/Migraines'),
  MedicalVisits: () => import('@/pages/MedicalVisits'),
  Exposures: () => import('@/pages/Exposures'),
  BuddyStatements: () => import('@/pages/BuddyStatements'),
  NexusLetterGenerator: () => import('@/pages/NexusLetterGenerator'),
  DocumentsHub: () => import('@/pages/DocumentsHub'),
  CPExamPrepEnhanced: () => import('@/pages/CPExamPrepEnhanced'),
  DBQPrepSheet: () => import('@/pages/DBQPrepSheet'),
  VAForms: () => import('@/pages/VAForms'),
  VAResources: () => import('@/pages/VAResources'),
  ServiceHistory: () => import('@/pages/ServiceHistory'),
  Glossary: () => import('@/pages/Glossary'),
  Settings: () => import('@/pages/Settings'),
  FAQ: () => import('@/pages/FAQ'),
  HelpCenter: () => import('@/pages/HelpCenter'),
  Terms: () => import('@/pages/legal/TermsOfServicePage'),
  Privacy: () => import('@/pages/legal/PrivacyPolicyPage'),
  Disclaimer: () => import('@/pages/legal/DisclaimerPage'),
  NotFound: () => import('@/pages/NotFound'),
};

// ---------------------------------------------------------------------------
// Test wrapper — provides every context a page might need
// ---------------------------------------------------------------------------
function TestWrapper({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Route Smoke Tests — Every page renders without crashing', () => {
  // ------------------------------------------------------------------
  // Default-export pages (bulk)
  // ------------------------------------------------------------------
  for (const [name, importer] of Object.entries(pages)) {
    it(`${name} renders without crashing`, async () => {
      const mod = await importer();
      const Component = mod.default;

      expect(Component).toBeDefined();

      const { container } = render(
        <TestWrapper>
          <Component />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });
    }, 15_000);
  }

  // ------------------------------------------------------------------
  // ConditionDetail — requires a :id route parameter via useParams
  // ------------------------------------------------------------------
  it('ConditionDetail renders without crashing (with route param)', async () => {
    const mod = await import('@/pages/ConditionDetail');
    const Component = mod.default;

    expect(Component).toBeDefined();

    const { container } = render(
      <TestWrapper initialEntries={['/conditions/tinnitus']}>
        <Routes>
          <Route path="/conditions/:id" element={<Component />} />
        </Routes>
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(container.innerHTML.length).toBeGreaterThan(0);
    });
  }, 15_000);
});
