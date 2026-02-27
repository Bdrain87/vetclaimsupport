/**
 * Dashboard User Interaction Tests
 *
 * Tests real user flows on the Dashboard: navigation links, profile display,
 * and conditional rendering.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { Suspense } from 'react';

vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <MemoryRouter initialEntries={['/app']}>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

let Dashboard: React.ComponentType;

beforeEach(async () => {
  const mod = await import('@/pages/Dashboard');
  Dashboard = mod.default;
});

describe('Dashboard User Interactions', () => {
  it('renders the dashboard page with key sections', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('My Combined Rating')).toBeInTheDocument();
    });
  });

  it('shows "What to Do Next" section with action steps', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('What to Do Next')).toBeInTheDocument();
    });
  });

  it('displays edit profile button', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/edit profile/i)).toBeInTheDocument();
    });
  });

  it('displays the Quick Access Grid with key links', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    expect(screen.getByText('Deadlines')).toBeInTheDocument();
    expect(screen.getByText('Journey')).toBeInTheDocument();
  });
});
