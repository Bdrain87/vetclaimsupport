/**
 * Calculator & Tool Pages User Tests
 *
 * Tests user interactions for TravelPayCalculator, BackPayEstimator,
 * VASpeakTranslator, and IntentToFile pages.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
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

// ── TravelPayCalculator ────────────────────────────────────────────────────

describe('TravelPayCalculator User Interactions', () => {
  let TravelPayCalculator: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/TravelPayCalculator');
    TravelPayCalculator = mod.default;
  });

  it('renders the calculator with all input fields', async () => {
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Travel Pay Calculator')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    expect(screen.getByLabelText(/one-way distance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tolls/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/parking/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deductible waived/i)).toBeInTheDocument();
  }, RENDER_TIMEOUT);

  it('calculates mileage when user enters distance', async () => {
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
    await user.type(milesInput, '25');

    // Should show round trip distance
    await waitFor(() => {
      expect(screen.getByText(/round trip: 50\.0 miles/i)).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('shows $0.00 for per-trip total when no miles entered', async () => {
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Per Trip')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const perTripLabel = screen.getByText('Per Trip');
    const perTripRow = perTripLabel.closest('div')!;
    expect(within(perTripRow).getByText('$0.00')).toBeInTheDocument();
  }, RENDER_TIMEOUT);

  it('shows deductible line by default', async () => {
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/deductible \(round trip\)/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('hides deductible line when deductible is waived', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByLabelText(/deductible waived/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    await user.click(screen.getByLabelText(/deductible waived/i));

    await waitFor(() => {
      expect(screen.queryByText(/deductible \(round trip\)/i)).not.toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('shows tolls in breakdown when tolls are entered', async () => {
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

    await user.type(screen.getByLabelText(/tolls/i), '5.50');

    await waitFor(() => {
      expect(screen.getByText('Tolls')).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('renders eligibility and how-to-submit sections', async () => {
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/who qualifies for travel pay/i)).toBeInTheDocument();
        expect(screen.getByText(/how to submit a travel claim/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('links to the VA BTSSS portal', async () => {
    render(
      <TestWrapper>
        <TravelPayCalculator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Travel Pay Calculator')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    // Find the link by href
    const btsssLink = document.querySelector(
      'a[href="https://dvagov-btsss.dynamics365portals.us/"]',
    );
    expect(btsssLink).toBeTruthy();
    expect(btsssLink).toHaveAttribute('target', '_blank');
  }, RENDER_TIMEOUT);
});

// ── BackPayEstimator ───────────────────────────────────────────────────────

describe('BackPayEstimator User Interactions', () => {
  let BackPayEstimator: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/BackPayEstimator');
    BackPayEstimator = mod.default;
  });

  it('renders the back pay estimator page', async () => {
    render(
      <TestWrapper>
        <BackPayEstimator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Back Pay Estimator')).toBeInTheDocument();
        expect(screen.getByText(/calculator inputs/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows effective date input and rating selectors', async () => {
    render(
      <TestWrapper>
        <BackPayEstimator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Effective Date')).toBeInTheDocument();
        expect(screen.getByText(/current combined rating/i)).toBeInTheDocument();
        expect(screen.getByText(/new expected rating/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    // Date input should exist (not linked with htmlFor)
    const dateInput = document.querySelector('input[type="date"]');
    expect(dateInput).toBeTruthy();
  }, RENDER_TIMEOUT);

  it('shows empty state when form is incomplete', async () => {
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

  it('allows user to enter an effective date', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <BackPayEstimator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(document.querySelector('input[type="date"]')).toBeTruthy();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    await user.type(dateInput, '2024-01-15');
    expect(dateInput).toHaveValue('2024-01-15');
  }, RENDER_TIMEOUT);

  it('shows dependent information section', async () => {
    render(
      <TestWrapper>
        <BackPayEstimator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/dependent information/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── VASpeakTranslator ──────────────────────────────────────────────────────

describe('VASpeakTranslator User Interactions', () => {
  let VASpeakTranslator: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/VASpeakTranslator');
    VASpeakTranslator = mod.default;
  });

  it('renders the translator with input area and glossary', async () => {
    render(
      <TestWrapper>
        <VASpeakTranslator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('VA-Speak Translator')).toBeInTheDocument();
        expect(screen.getByText('VA Terms Glossary')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('allows typing in the translation textarea', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <VASpeakTranslator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('VA-Speak Translator')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const textareas = screen.getAllByRole('textbox');
    const translatorTextarea = textareas[0];
    await user.type(translatorTextarea, 'My back hurts all the time');
    expect(translatorTextarea).toHaveValue('My back hurts all the time');
  }, RENDER_TIMEOUT);

  it('shows translate button', async () => {
    render(
      <TestWrapper>
        <VASpeakTranslator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: /translate/i })).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('displays glossary terms', async () => {
    render(
      <TestWrapper>
        <VASpeakTranslator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Service Connection')).toBeInTheDocument();
        expect(screen.getByText('Nexus')).toBeInTheDocument();
        expect(screen.getByText('C&P Exam')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('allows filtering glossary by category', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <VASpeakTranslator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Service Connection')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const medicalButtons = screen.getAllByText('Medical');
    const categoryButton = medicalButtons.find((el) => el.closest('button'))!;
    await user.click(categoryButton.closest('button')!);

    await waitFor(() => {
      expect(screen.getByText('Nexus')).toBeInTheDocument();
      expect(screen.getByText('Bilateral')).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('allows searching glossary terms', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <VASpeakTranslator />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByPlaceholderText(/search terms or definitions/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const searchInput = screen.getByPlaceholderText(/search terms or definitions/i);
    await user.type(searchInput, 'bilateral');

    await waitFor(() => {
      expect(screen.getByText('Bilateral')).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);
});

// ── IntentToFile ───────────────────────────────────────────────────────────

describe('IntentToFile User Interactions', () => {
  let IntentToFile: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/IntentToFile');
    IntentToFile = mod.default;
  });

  it('renders the intent to file page', async () => {
    render(
      <TestWrapper>
        <IntentToFile />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Intent to File')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows the date input form with ITF Filing Date label', async () => {
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
  }, RENDER_TIMEOUT);

  it('allows entering an ITF date and saving', async () => {
    const user = userEvent.setup();
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

    const dateInput = screen.getByLabelText(/itf filing date/i);
    await user.type(dateInput, '2025-06-15');

    const saveButton = screen.getByText(/save itf date/i).closest('button')!;
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/days remaining/i)).toBeInTheDocument();
    });
  }, RENDER_TIMEOUT);

  it('shows educational content about ITF', async () => {
    render(
      <TestWrapper>
        <IntentToFile />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/what is an intent to file/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows how to file section', async () => {
    render(
      <TestWrapper>
        <IntentToFile />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/how to file an intent to file/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});
