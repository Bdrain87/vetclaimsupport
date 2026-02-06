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
    console.log('[INTERROGATION] Rendered HTML length:', html.length);
    console.log('[INTERROGATION] First 500 chars:', html.substring(0, 500));

    // Check if the root actually rendered something
    expect(html.length).toBeGreaterThan(0);
  });

  it('should render the Landing page content', () => {
    const { container } = render(<App />);
    const text = container.textContent || '';
    console.log('[INTERROGATION] Full text content:', text.substring(0, 1000));

    // The PlatinumLanding should have this text
    expect(text).toContain('CLAIM THE');
  });
});
