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

  it('renders the VCS brand or Dashboard title', async () => {
    render(<App />);
    // The LoadingFallback and MobileHeader may both render "Vet Claim Support",
    // so use queryAllByText to tolerate multiple matches.
    await waitFor(() => {
      const matches = [
        ...screen.queryAllByText('VCS'),
        ...screen.queryAllByText('Vet Claim Support'),
      ];
      expect(matches.length).toBeGreaterThan(0);
    });
  });
});
