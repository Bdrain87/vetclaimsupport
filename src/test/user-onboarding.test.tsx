/**
 * Onboarding User Flow Tests
 *
 * Tests the multi-step onboarding wizard: step navigation,
 * form inputs, validation, skip behavior, and completion.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        <MemoryRouter initialEntries={['/onboarding']}>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

let Onboarding: React.ComponentType;

beforeEach(async () => {
  localStorage.clear();
  const mod = await import('@/pages/Onboarding');
  Onboarding = mod.default;
});

/** Helper to advance past Welcome + C-File Fast Track steps to reach the Name step */
async function advanceToNameStep(user: ReturnType<typeof userEvent.setup>) {
  // Step 0: Welcome - click Get Started
  await waitFor(() => {
    expect(screen.getByText(/get started/i)).toBeInTheDocument();
  });
  await user.click(screen.getByText(/get started/i).closest('button')!);

  // Step 1: C-File Fast Track - click Continue/Skip (free users see "Continue without C-File")
  await waitFor(() => {
    expect(screen.getByText(/continue without c-file|skip for now/i)).toBeInTheDocument();
  });
  await user.click(screen.getByText(/continue without c-file|skip for now/i).closest('button')!);

  // Step 2: Name
  await waitFor(() => {
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
  });
}

describe('Onboarding User Flow', () => {
  it('renders the welcome step initially', async () => {
    render(
      <TestWrapper>
        <Onboarding />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/get started/i)).toBeInTheDocument();
    });
  });

  it('shows the name input step after clicking Get Started and skipping C-File', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Onboarding />
      </TestWrapper>,
    );

    await advanceToNameStep(user);
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
  });

  it('validates that first name is required before continuing', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Onboarding />
      </TestWrapper>,
    );

    await advanceToNameStep(user);

    // Try to continue without entering a name
    const continueButton = screen.getByText(/continue/i).closest('button')!;
    await user.click(continueButton);

    // Should show an error
    await waitFor(() => {
      expect(screen.getByText(/please enter your first name/i)).toBeInTheDocument();
    });
  });

  it('allows user to type a first name and continue', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Onboarding />
      </TestWrapper>,
    );

    await advanceToNameStep(user);

    // Enter a first name
    await user.type(screen.getByPlaceholderText(/first name/i), 'Blake');

    // Click continue
    const continueButton = screen.getByText(/continue/i).closest('button')!;
    await user.click(continueButton);

    // Should advance to branch selection step
    await waitFor(() => {
      expect(screen.getByText(/which branch/i)).toBeInTheDocument();
    });
  });

  it('advances to branch step and shows branch heading after entering name', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <TestWrapper>
        <Onboarding />
      </TestWrapper>,
    );

    await advanceToNameStep(user);

    await user.type(screen.getByPlaceholderText(/first name/i), 'Test');
    await user.click(screen.getByText(/continue/i).closest('button')!);

    // Branch step shows heading about branch selection
    await waitFor(
      () => {
        const content = document.body.textContent ?? '';
        expect(content).toContain('branch');
      },
      { timeout: 5000 },
    );

    unmount();
  }, 15_000);
});
