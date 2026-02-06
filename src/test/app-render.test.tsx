/**
 * App Render Tests
 *
 * Verifies the root App component mounts correctly with its full provider
 * tree: ErrorBoundary, ClaimsProvider, BrowserRouter, Suspense, and
 * lazy-loaded routes.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '@/App';

describe('App Render', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });

  it('renders with content (innerHTML.length > 0)', () => {
    const { container } = render(<App />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('renders the Vet Claim Support brand name', async () => {
    render(<App />);
    // The brand name lives in the PlatinumNavbar and is visible on md+ screens.
    // waitFor handles the Suspense / lazy-load boundary.
    await waitFor(() => {
      expect(screen.getByText('Vet Claim Support')).toBeInTheDocument();
    });
  });
});
