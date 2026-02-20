/**
 * Dashboard User Interaction Tests
 *
 * Tests real user flows on the Dashboard: quick daily log form,
 * navigation links, profile display, and conditional rendering.
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

  it('displays the quick daily log form with mood buttons', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Quick Daily Log')).toBeInTheDocument();
    });

    // Mood buttons use aria-label="Mood: Good" etc.
    expect(screen.getByRole('radio', { name: /mood: good/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /mood: okay/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /mood: bad/i })).toBeInTheDocument();
  });

  it('allows user to select a mood in the quick log', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: /mood: good/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('radio', { name: /mood: good/i }));

    // Save Log button should become enabled after selecting mood
    const saveButton = screen.getByRole('button', { name: /save log/i });
    expect(saveButton).not.toBeDisabled();
  });

  it('disables Save Log button when no mood is selected', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save log/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /save log/i })).toBeDisabled();
  });

  it('shows notes textarea for user input', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/symptoms, triggers, activities/i),
      ).toBeInTheDocument();
    });

    const notesInput = screen.getByPlaceholderText(/symptoms, triggers, activities/i);
    await user.type(notesInput, 'Knee pain was worse today');
    expect(notesInput).toHaveValue('Knee pain was worse today');
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

  it('saves a quick log entry when form is filled and submitted', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: /mood: bad/i })).toBeInTheDocument();
    });

    // Select a mood
    await user.click(screen.getByRole('radio', { name: /mood: bad/i }));

    // Type notes
    await user.type(
      screen.getByPlaceholderText(/symptoms, triggers/i),
      'Flare-up today',
    );

    // Save
    await user.click(screen.getByRole('button', { name: /save log/i }));

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('Logged')).toBeInTheDocument();
    });
  });
});
