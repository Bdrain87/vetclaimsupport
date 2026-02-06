/**
 * Navigation Tests — PlatinumNavbar
 *
 * Validates that the Navbar renders its logo, desktop links, and mobile
 * hamburger button with the expected structure and href values.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlatinumNavbar } from '@/components/PlatinumNavbar';

const renderNavbar = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <PlatinumNavbar />
    </MemoryRouter>,
  );

describe('PlatinumNavbar', () => {
  it('renders the logo', () => {
    renderNavbar();
    // The logo is a gold "V" square + "Vet Claim Support" text, linking to "/"
    const logoLink = screen.getByRole('link', { name: /Vet Claim Support/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders desktop nav links', () => {
    renderNavbar();
    // The first four NAV_ITEMS are shown in the desktop nav bar
    const expectedLabels = ['Dashboard', 'Evidence Vault', 'Conditions', 'Claim Tools'];
    for (const label of expectedLabels) {
      const links = screen.getAllByText(label);
      expect(links.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders the hamburger button with lg:hidden class', () => {
    renderNavbar();
    const hamburger = screen.getByLabelText('Open menu');
    expect(hamburger).toBeInTheDocument();
    expect(hamburger.className).toContain('lg:hidden');
  });

  it('all nav links have correct href values', () => {
    renderNavbar();
    const expectedLinks: Record<string, string> = {
      Dashboard: '/dashboard',
      'Evidence Vault': '/documents',
      Conditions: '/conditions',
      'Claim Tools': '/claim-tools',
      Calculator: '/bilateral-calculator',
      'Health Log': '/health-log',
      'Exam Prep': '/exam-prep',
      Settings: '/settings',
    };

    for (const [label, href] of Object.entries(expectedLinks)) {
      // Multiple instances may exist (desktop + mobile drawer), so use getAll
      const links = screen.getAllByRole('link', { name: label });
      links.forEach((link) => {
        expect(link).toHaveAttribute('href', href);
      });
    }
  });
});
