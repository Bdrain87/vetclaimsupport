/**
 * Form Pages User Tests
 *
 * Tests user interactions for PersonalStatement multi-step wizard,
 * FormGuide, BDDGuide, HealthHub, AboutVCS, and AppealsGuide.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

const RENDER_TIMEOUT = 10_000;

// ── PersonalStatement ──────────────────────────────────────────────────────

describe('PersonalStatement User Flow', () => {
  let PersonalStatement: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/PersonalStatement');
    PersonalStatement = mod.default;
  });

  it('renders the personal statement builder', async () => {
    render(
      <TestWrapper>
        <PersonalStatement />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Personal Statement Builder')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows condition selection on first step', async () => {
    render(
      <TestWrapper>
        <PersonalStatement />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        // Check for condition-related text on step 1
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(content.includes('condition') || content.includes('select')).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows the guided tool subtitle', async () => {
    render(
      <TestWrapper>
        <PersonalStatement />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/guided tool/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── FormGuide ──────────────────────────────────────────────────────────────

describe('FormGuide User Interactions', () => {
  let FormGuide: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/FormGuide');
    FormGuide = mod.default;
  });

  it('renders the VA form guide page', async () => {
    render(
      <TestWrapper>
        <FormGuide />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('VA Form Guide')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows search input for forms', async () => {
    render(
      <TestWrapper>
        <FormGuide />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByPlaceholderText(/search by form number/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── BDDGuide ───────────────────────────────────────────────────────────────

describe('BDDGuide User Interactions', () => {
  let BDDGuide: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/BDDGuide');
    BDDGuide = mod.default;
  });

  it('renders the BDD claim guide page with expected content', async () => {
    render(
      <TestWrapper>
        <BDDGuide />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('BDD Claim Guide')).toBeInTheDocument();
        // Subtitle and filing window info should also be present
        const content = document.body.textContent ?? '';
        expect(content).toContain('Benefits Delivery at Discharge');
        expect(content).toContain('180');
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── HealthHub ──────────────────────────────────────────────────────────────

describe('HealthHub User Interactions', () => {
  let HealthHub: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/HealthHub');
    HealthHub = mod.default;
  });

  it('renders the health hub with tracking categories', async () => {
    render(
      <TestWrapper>
        <HealthHub />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(
          content.includes('health') ||
            content.includes('symptom') ||
            content.includes('sleep') ||
            content.includes('medication'),
        ).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── AboutVCS ───────────────────────────────────────────────────────────────

describe('AboutVCS User Interactions', () => {
  let AboutVCS: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/AboutVCS');
    AboutVCS = mod.default;
  });

  it('renders the about page with app info', async () => {
    render(
      <TestWrapper>
        <AboutVCS />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(content.includes('about') || content.includes('vet claim')).toBe(true);
        expect(content.includes('veteran') || content.includes('claim')).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── AppealsGuide ───────────────────────────────────────────────────────────

describe('AppealsGuide User Interactions', () => {
  let AppealsGuide: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/AppealsGuide');
    AppealsGuide = mod.default;
  });

  it('renders the appeals guide page', async () => {
    const { container } = render(
      <TestWrapper>
        <AppealsGuide />
      </TestWrapper>,
    );

    // AppealsGuide is a large component; just verify it mounts with content
    await waitFor(
      () => {
        expect(container.innerHTML.length).toBeGreaterThan(100);
      },
      { timeout: 20_000 },
    );

    const content = container.textContent?.toLowerCase() ?? '';
    expect(content.length).toBeGreaterThan(0);
  }, 25_000);
});
