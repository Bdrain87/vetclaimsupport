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

  it('renders a loading state or brand text', async () => {
    const { container } = render(<App />);
    // App may render a spinner (LoadingFallback with role="status") or brand text
    // depending on auth/hydration state in the test environment.
    await waitFor(() => {
      const hasSpinner = container.querySelector('[role="status"]') !== null;
      const matches = [
        ...screen.queryAllByText('VCS'),
        ...screen.queryAllByText('Vet Claim Support'),
      ];
      expect(hasSpinner || matches.length > 0).toBe(true);
    });
  });
});
