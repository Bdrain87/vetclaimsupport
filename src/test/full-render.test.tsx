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

  it('should render the header brand text', () => {
    const { container } = render(<App />);
    const text = container.textContent || '';

    // The LoadingFallback renders "Vet Claim Support" while routes load,
    // and MobileHeader renders "VCS" once loaded. Check for either.
    expect(text.includes('VCS') || text.includes('Vet Claim Support')).toBe(true);
  });
});
