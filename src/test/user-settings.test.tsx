/**
 * Settings & Account Pages User Tests
 *
 * Tests user interactions for Settings, DeleteAccount, and ExportData pages.
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

// ── Settings Page ──────────────────────────────────────────────────────────

describe('Settings User Interactions', () => {
  let Settings: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/Settings');
    Settings = mod.default;
  });

  it('renders the settings page with key sections', async () => {
    render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });
  });

  it('shows profile name inputs', async () => {
    render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  });

  it('allows user to edit their name', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    const firstName = screen.getByLabelText(/first name/i);
    await user.clear(firstName);
    await user.type(firstName, 'John');
    expect(firstName).toHaveValue('John');
  });

  it('shows appearance section with dark mode toggle', async () => {
    render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/appearance/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/dark mode/i)).toBeInTheDocument();
  });

  it('shows legal links', async () => {
    render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(() => {
      // Multiple Privacy Policy elements exist (description + link)
      const privacyLinks = screen.getAllByText(/privacy policy/i);
      expect(privacyLinks.length).toBeGreaterThanOrEqual(1);
      const termsLinks = screen.getAllByText(/terms of service/i);
      expect(termsLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('has Reset Onboarding button', async () => {
    render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText(/reset onboarding/i)).toBeInTheDocument();
    });
  });
});

// ── DeleteAccountPage ──────────────────────────────────────────────────────

describe('DeleteAccountPage User Interactions', () => {
  let DeleteAccountPage: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/account/DeleteAccountPage');
    DeleteAccountPage = mod.default;
  });

  it('renders the delete account page with warning', async () => {
    render(
      <TestWrapper>
        <DeleteAccountPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Delete Your Account')).toBeInTheDocument();
    });

    // Should list what gets deleted
    expect(screen.getByText(/profile and account information/i)).toBeInTheDocument();
  });

  it('has delete button disabled initially', async () => {
    render(
      <TestWrapper>
        <DeleteAccountPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Delete Your Account')).toBeInTheDocument();
    });

    // The "Delete My Account" action button should be disabled
    const deleteButton = screen.getByRole('button', { name: /delete my account/i });
    expect(deleteButton).toBeDisabled();
  });

  it('enables delete button only after typing DELETE', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <DeleteAccountPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type delete/i)).toBeInTheDocument();
    });

    const confirmInput = screen.getByPlaceholderText(/type delete/i);
    await user.type(confirmInput, 'DELETE');
    expect(confirmInput).toHaveValue('DELETE');

    // Button should now be enabled
    const deleteButton = screen.getByRole('button', { name: /delete my account/i });
    expect(deleteButton).not.toBeDisabled();
  });
});

// ── ExportDataPage ─────────────────────────────────────────────────────────

describe('ExportDataPage User Interactions', () => {
  let ExportDataPage: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/account/ExportDataPage');
    ExportDataPage = mod.default;
  });

  it('renders the export data page', async () => {
    render(
      <TestWrapper>
        <ExportDataPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Export Your Data')).toBeInTheDocument();
    });
  });

  it('has distinct PDF and Data export options', async () => {
    render(
      <TestWrapper>
        <ExportDataPage />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('PDF Claim Packet')).toBeInTheDocument();
    });

    // Should have both export option cards
    expect(screen.getByText('Data Export (JSON)')).toBeInTheDocument();
  });
});
