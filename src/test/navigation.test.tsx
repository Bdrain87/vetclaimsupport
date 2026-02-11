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
  it('renders the brand text', () => {
    renderNavbar();
    // The brand shows "VCS" text — there are two (desktop + mobile) so use getAll
    const logoLinks = screen.getAllByRole('link', { name: /VCS/i });
    expect(logoLinks.length).toBeGreaterThanOrEqual(1);
    expect(logoLinks[0]).toHaveAttribute('href', '/');
  });

  it('renders desktop nav links', () => {
    renderNavbar();
    // The first four NAV_ITEMS are shown in the desktop nav bar
    const expectedLabels = ['Dashboard', 'Conditions', 'Tools', 'Health Log'];
    for (const label of expectedLabels) {
      const links = screen.getAllByText(label);
      expect(links.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders the hamburger/menu buttons with aria-labels', () => {
    renderNavbar();
    const menuButtons = screen.getAllByLabelText('Open menu');
    expect(menuButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('all nav links have correct href values', () => {
    renderNavbar();
    const expectedLinks: Record<string, string> = {
      Dashboard: '/',
      Conditions: '/claims',
      'Health Log': '/health',
      'Claim Tools': '/prep',
      'Evidence Vault': '/settings/vault',
      'Exam Prep': '/prep/exam',
      Calculator: '/claims/bilateral',
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
