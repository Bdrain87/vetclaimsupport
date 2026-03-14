/**
 * Edge Case & Error State Tests
 *
 * Tests boundary values, empty submissions, validation errors,
 * and unusual inputs across forms and calculators.
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
        <MemoryRouter>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </MemoryRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

const RENDER_TIMEOUT = 10_000;

// ── TravelPayCalculator Edge Cases ────────────────────────────────────────

describe('TravelPayCalculator Edge Cases', () => {
  let TravelPayCalculator: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/TravelPayCalculator');
    TravelPayCalculator = mod.default;
  });

  it('handles zero distance gracefully', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByLabelText(/one-way distance/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const milesInput = screen.getByLabelText(/one-way distance/i);
    await user.type(milesInput, '0');

    await waitFor(() => {
      expect(screen.getByText(/round trip: 0\.0 miles/i)).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('handles very large distance values', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByLabelText(/one-way distance/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const milesInput = screen.getByLabelText(/one-way distance/i);
    await user.type(milesInput, '9999');

    await waitFor(() => {
      expect(screen.getByText(/round trip: 19998\.0 miles/i)).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('handles decimal distance input', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByLabelText(/one-way distance/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const milesInput = screen.getByLabelText(/one-way distance/i);
    await user.type(milesInput, '12.5');

    await waitFor(() => {
      expect(screen.getByText(/round trip: 25\.0 miles/i)).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('tolls and parking can be zero without errors', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByLabelText(/tolls/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    await user.type(screen.getByLabelText(/tolls/i), '0');
    await user.type(screen.getByLabelText(/parking/i), '0');

    expect(screen.getByText('Travel Pay Calculator')).toBeInTheDocument();
  }, RENDER_TIMEOUT);
});

// ── Onboarding Edge Cases ─────────────────────────────────────────────────

describe('Onboarding Edge Cases', () => {
  let Onboarding: React.ComponentType;

  beforeEach(async () => {
    localStorage.clear();
    const mod = await import('@/pages/Onboarding');
    Onboarding = mod.default;
  });

  it('rejects whitespace-only first name', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/onboarding']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Onboarding />
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/get started/i)).toBeInTheDocument();
    });

    // Welcome -> C-File Fast Track -> Name
    await user.click(screen.getByText(/get started/i).closest('button')!);
    await waitFor(() => {
      expect(screen.getByText(/skip for now/i)).toBeInTheDocument();
    });
    await user.click(screen.getByText(/skip for now/i).closest('button')!);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/first name/i), '   ');

    const continueButton = screen.getByText(/continue/i).closest('button')!;
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter your first name/i)).toBeInTheDocument();
    });
  });

  it('handles special characters in first name', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/onboarding']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Onboarding />
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/get started/i)).toBeInTheDocument();
    });

    // Welcome -> C-File Fast Track -> Name
    await user.click(screen.getByText(/get started/i).closest('button')!);
    await waitFor(() => {
      expect(screen.getByText(/skip for now/i)).toBeInTheDocument();
    });
    await user.click(screen.getByText(/skip for now/i).closest('button')!);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/first name/i), "O'Brien");
    await user.click(screen.getByText(/continue/i).closest('button')!);

    await waitFor(
      () => {
        const content = document.body.textContent ?? '';
        expect(content).toContain('branch');
      },
      { timeout: 5000 },
    );
  }, 15_000);
});

// ── DeleteAccountPage Edge Cases ──────────────────────────────────────────

describe('DeleteAccountPage Edge Cases', () => {
  let DeleteAccountPage: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/account/DeleteAccountPage');
    DeleteAccountPage = mod.default;
  });

  it('enables delete with lowercase "delete" (case-insensitive match)', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <DeleteAccountPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type delete/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/type delete/i), 'delete');

    // Component uses case-insensitive comparison
    const deleteButton = screen.getByRole('button', { name: /delete my account/i });
    expect(deleteButton).not.toBeDisabled();
  });

  it('does not enable delete with partial "DELE"', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <DeleteAccountPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type delete/i)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/type delete/i), 'DELE');

    const deleteButton = screen.getByRole('button', { name: /delete my account/i });
    expect(deleteButton).toBeDisabled();
  });

  it('disables delete button when text is cleared after typing DELETE', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <DeleteAccountPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type delete/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/type delete/i);
    await user.type(input, 'DELETE');
    expect(
      screen.getByRole('button', { name: /delete my account/i }),
    ).not.toBeDisabled();

    await user.clear(input);
    expect(screen.getByRole('button', { name: /delete my account/i })).toBeDisabled();
  });
});

// ── BackPayEstimator Edge Cases ───────────────────────────────────────────

describe('BackPayEstimator Edge Cases', () => {
  let BackPayEstimator: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/BackPayEstimator');
    BackPayEstimator = mod.default;
  });

  it('shows empty state message when no date is entered', async () => {
    render(
      <TestWrapper>
        <BackPayEstimator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/fill in all fields above/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('renders rating selectors with dropdown options', async () => {
    render(
      <TestWrapper>
        <BackPayEstimator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/current combined rating/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    // Rating selectors are dropdown menus with placeholder text
    expect(screen.getByText(/select current rating/i)).toBeInTheDocument();
    expect(screen.getByText(/select new rating/i)).toBeInTheDocument();
  }, RENDER_TIMEOUT);
});

// ── IntentToFile Edge Cases ───────────────────────────────────────────────

describe('IntentToFile Edge Cases', () => {
  let IntentToFile: React.ComponentType;

  beforeEach(async () => {
    localStorage.clear();
    const mod = await import('@/pages/IntentToFile');
    IntentToFile = mod.default;
  });

  it('shows the ITF input before any date is saved', async () => {
    render(
      <TestWrapper>
        <IntentToFile />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByLabelText(/itf filing date/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    expect(screen.getByText(/save itf date/i)).toBeInTheDocument();
  }, RENDER_TIMEOUT);
});
