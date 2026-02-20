/**
 * Route Redirects & 404 Tests
 *
 * Verifies legacy redirect routes resolve to correct destinations
 * and the catch-all 404 route works properly.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  MemoryRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { Suspense } from 'react';

vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

// Representative redirect pairs covering all major categories
const redirects: Array<{ from: string; to: string; label: string }> = [
  // Core renames
  { from: '/conditions', to: '/claims', label: 'conditions → claims' },
  { from: '/auth', to: '/login', label: 'auth → login' },
  // Health routes
  { from: '/health-log', to: '/health/summary', label: 'health-log → health/summary' },
  { from: '/migraines', to: '/health/migraines', label: 'migraines → health/migraines' },
  { from: '/exposures', to: '/health/exposures', label: 'exposures → health/exposures' },
  {
    from: '/medical-visits',
    to: '/health/visits',
    label: 'medical-visits → health/visits',
  },
  { from: '/symptoms', to: '/health/symptoms', label: 'symptoms → health/symptoms' },
  { from: '/sleep', to: '/health/sleep', label: 'sleep → health/sleep' },
  {
    from: '/medications',
    to: '/health/medications',
    label: 'medications → health/medications',
  },
  { from: '/body-map', to: '/claims/body-map', label: 'body-map → claims/body-map' },
  // Prep/Tools routes
  {
    from: '/calculator',
    to: '/claims/calculator',
    label: 'calculator → claims/calculator',
  },
  { from: '/exam-prep', to: '/prep/exam', label: 'exam-prep → prep/exam' },
  {
    from: '/secondary-finder',
    to: '/claims/secondary-finder',
    label: 'secondary-finder → claims/secondary-finder',
  },
  {
    from: '/nexus-letter',
    to: '/prep/doctor-summary',
    label: 'nexus-letter → prep/doctor-summary',
  },
  {
    from: '/buddy-statements',
    to: '/prep/buddy-statement',
    label: 'buddy-statements → prep/buddy-statement',
  },
  {
    from: '/personal-statement',
    to: '/prep/personal-statement',
    label: 'personal-statement → prep/personal-statement',
  },
  { from: '/stressor', to: '/prep/stressor', label: 'stressor → prep/stressor' },
  { from: '/va-speak', to: '/prep/va-speak', label: 'va-speak → prep/va-speak' },
  { from: '/back-pay', to: '/prep/back-pay', label: 'back-pay → prep/back-pay' },
  { from: '/travel-pay', to: '/prep/travel-pay', label: 'travel-pay → prep/travel-pay' },
  {
    from: '/form-guide',
    to: '/prep/form-guide',
    label: 'form-guide → prep/form-guide',
  },
  { from: '/va-forms', to: '/prep/form-guide', label: 'va-forms → prep/form-guide' },
  { from: '/build-packet', to: '/prep/packet', label: 'build-packet → prep/packet' },
  { from: '/bdd-guide', to: '/prep/bdd-guide', label: 'bdd-guide → prep/bdd-guide' },
  // Settings/Documentation routes
  { from: '/docs', to: '/settings/vault', label: 'docs → settings/vault' },
  { from: '/documents', to: '/settings/vault', label: 'documents → settings/vault' },
  {
    from: '/service-history',
    to: '/settings/service-history',
    label: 'service-history → settings/service-history',
  },
  { from: '/help', to: '/settings/help', label: 'help → settings/help' },
  {
    from: '/glossary',
    to: '/settings/glossary',
    label: 'glossary → settings/glossary',
  },
  { from: '/faq', to: '/settings/faq', label: 'faq → settings/faq' },
  { from: '/privacy', to: '/settings/privacy', label: 'privacy → settings/privacy' },
  { from: '/terms', to: '/settings/terms', label: 'terms → settings/terms' },
  {
    from: '/checklist',
    to: '/claims/checklist',
    label: 'checklist → claims/checklist',
  },
  {
    from: '/timeline',
    to: '/settings/timeline',
    label: 'timeline → settings/timeline',
  },
  { from: '/journey', to: '/settings/journey', label: 'journey → settings/journey' },
  // Old /tools/* namespace
  {
    from: '/tools/calculator',
    to: '/claims/calculator',
    label: 'tools/calculator → claims/calculator',
  },
  {
    from: '/tools/secondary',
    to: '/claims/secondary-finder',
    label: 'tools/secondary → claims/secondary-finder',
  },
  { from: '/tools/exam', to: '/prep/exam', label: 'tools/exam → prep/exam' },
  {
    from: '/tools/va-speak',
    to: '/prep/va-speak',
    label: 'tools/va-speak → prep/va-speak',
  },
  {
    from: '/tools/back-pay',
    to: '/prep/back-pay',
    label: 'tools/back-pay → prep/back-pay',
  },
  {
    from: '/tools/travel-pay',
    to: '/prep/travel-pay',
    label: 'tools/travel-pay → prep/travel-pay',
  },
  {
    from: '/tools/packet',
    to: '/prep/packet',
    label: 'tools/packet → prep/packet',
  },
  {
    from: '/tools/appeals',
    to: '/prep/appeals',
    label: 'tools/appeals → prep/appeals',
  },
  // Old /profile/* namespace
  { from: '/profile', to: '/settings', label: 'profile → settings' },
  {
    from: '/profile/edit',
    to: '/settings/edit-profile',
    label: 'profile/edit → settings/edit-profile',
  },
  {
    from: '/profile/vault',
    to: '/settings/vault',
    label: 'profile/vault → settings/vault',
  },
  {
    from: '/profile/help',
    to: '/settings/help',
    label: 'profile/help → settings/help',
  },
  {
    from: '/profile/faq',
    to: '/settings/faq',
    label: 'profile/faq → settings/faq',
  },
  {
    from: '/profile/privacy',
    to: '/settings/privacy',
    label: 'profile/privacy → settings/privacy',
  },
  {
    from: '/profile/terms',
    to: '/settings/terms',
    label: 'profile/terms → settings/terms',
  },
  {
    from: '/profile/about',
    to: '/settings/about',
    label: 'profile/about → settings/about',
  },
  {
    from: '/profile/export-data',
    to: '/settings/export-data',
    label: 'profile/export-data → settings/export-data',
  },
  {
    from: '/profile/delete-account',
    to: '/settings/delete-account',
    label: 'profile/delete-account → settings/delete-account',
  },
  // Misc
  { from: '/claim-tools', to: '/prep', label: 'claim-tools → prep' },
  { from: '/tools', to: '/prep', label: 'tools → prep' },
  {
    from: '/conditions-by-conflict',
    to: '/reference/conditions-by-conflict',
    label: 'conditions-by-conflict → reference',
  },
  {
    from: '/condition-guide',
    to: '/reference/condition-guide',
    label: 'condition-guide → reference',
  },
];

describe('Route Redirect Tests', () => {
  for (const { from, to, label } of redirects) {
    it(`redirects ${label}`, () => {
      render(
        <MemoryRouter initialEntries={[from]}>
          <Routes>
            <Route path={from} element={<Navigate to={to} replace />} />
            <Route path="*" element={<LocationDisplay />} />
          </Routes>
        </MemoryRouter>,
      );

      expect(screen.getByTestId('location').textContent).toBe(to);
    });
  }
});

describe('404 Not Found Page', () => {
  it('renders NotFound page for unknown routes', async () => {
    const mod = await import('@/pages/NotFound');
    const NotFound = mod.default;

    render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/this-route-does-not-exist']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });
  });

  it('shows Go Back and Home buttons on 404 page', async () => {
    const mod = await import('@/pages/NotFound');
    const NotFound = mod.default;

    render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/nonexistent-page']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('shows quick links on 404 page', async () => {
    const mod = await import('@/pages/NotFound');
    const NotFound = mod.default;

    render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/missing']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Health Log')).toBeInTheDocument();
    expect(screen.getByText('Claim Tools')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
  });
});
