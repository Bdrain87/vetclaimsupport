/**
 * INTERROGATION TEST: Force-mount the entire App tree.
 * If ANY component in the chain throws, this test catches the exact error.
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('Full App Render Interrogation', () => {
  it('should mount the entire component tree without throwing', () => {
    const { container } = render(<App />);
    // If we get here, the tree mounted. Check if there's actual content.
    const html = container.innerHTML;

    // Check if the root actually rendered something
    expect(html.length).toBeGreaterThan(0);
  });

  it('should render a loading state or brand text', () => {
    const { container } = render(<App />);

    // The app may render a spinner (LoadingFallback) or brand text
    // depending on auth/hydration state in the test environment.
    const hasContent = container.innerHTML.length > 0;
    const hasLoadingSpinner = container.querySelector('[role="status"]') !== null;
    const text = container.textContent || '';
    const hasBrandText = text.includes('VCS') || text.includes('Vet Claim Support');

    expect(hasContent && (hasLoadingSpinner || hasBrandText)).toBe(true);
  });
});
