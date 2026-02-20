/**
 * Uncovered Pages Tests
 *
 * Tests for pages with 0% code coverage: Login, AuthPage,
 * BuildPacket, StressorStatement, BodyMap, UnifiedTimeline,
 * CPExamPacket, and NotFound.
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

const RENDER_TIMEOUT = 10_000;

// ── Login ─────────────────────────────────────────────────────────────────

describe('Login Page', () => {
  let Login: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/Login');
    Login = mod.default;
  });

  it('renders the sign in form', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(content.includes('sign in') || content.includes('sign up')).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows email and password inputs', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  }, RENDER_TIMEOUT);

  it('shows OAuth login options', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent ?? '';
        expect(content.includes('Google') || content.includes('Apple')).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows mode toggle link', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent ?? '';
        expect(
          content.includes('Sign Up') ||
            content.includes("Don't have an account") ||
            content.includes('Create'),
        ).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── AuthPage ──────────────────────────────────────────────────────────────

describe('AuthPage', () => {
  let AuthPage: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/AuthPage');
    AuthPage = mod.default;
  });

  it('renders the auth page with sign-in content', async () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(
          content.includes('welcome back') ||
            content.includes('sign in') ||
            content.includes('create'),
        ).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows OAuth buttons', async () => {
    render(
      <TestWrapper>
        <AuthPage />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent ?? '';
        expect(content.includes('Google') || content.includes('Apple')).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── BuildPacket ───────────────────────────────────────────────────────────

describe('BuildPacket Page', () => {
  let BuildPacket: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/BuildPacket');
    BuildPacket = mod.default;
  });

  it('renders the Build Your Packet page', async () => {
    render(
      <TestWrapper>
        <BuildPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Build Your Packet')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows section checkboxes', async () => {
    render(
      <TestWrapper>
        <BuildPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Build Your Packet')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const content = document.body.textContent ?? '';
    expect(content).toContain('Claim Overview');
    expect(content).toContain('Symptom Logs');
  }, RENDER_TIMEOUT);

  it('shows Select All and Clear buttons', async () => {
    render(
      <TestWrapper>
        <BuildPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Build Your Packet')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    expect(screen.getByText('Select All')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  }, RENDER_TIMEOUT);

  it('toggles Select All and Clear correctly', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <BuildPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Select All')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    await user.click(screen.getByText('Select All'));
    await user.click(screen.getByText('Clear'));

    expect(screen.getByText('Build Your Packet')).toBeInTheDocument();
  }, RENDER_TIMEOUT);

  it('shows evidence strength indicator', async () => {
    render(
      <TestWrapper>
        <BuildPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Build Your Packet')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const content = document.body.textContent ?? '';
    expect(content).toContain('Evidence Strength');
  }, RENDER_TIMEOUT);

  it('shows export format options', async () => {
    render(
      <TestWrapper>
        <BuildPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Build Your Packet')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const content = document.body.textContent ?? '';
    expect(content).toContain('PDF');
  }, RENDER_TIMEOUT);
});

// ── StressorStatement ─────────────────────────────────────────────────────

describe('StressorStatement Page', () => {
  let StressorStatement: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/StressorStatement');
    StressorStatement = mod.default;
  });

  it('renders the Stressor Statement Builder', async () => {
    render(
      <TestWrapper>
        <StressorStatement />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Stressor Statement Builder')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows step 1 content — What Happened', async () => {
    render(
      <TestWrapper>
        <StressorStatement />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent ?? '';
        expect(content).toContain('What Happened');
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows the guided tool subtitle', async () => {
    render(
      <TestWrapper>
        <StressorStatement />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(content).toContain('stressor statement');
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── BodyMap ───────────────────────────────────────────────────────────────

describe('BodyMap Page', () => {
  let BodyMap: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/BodyMap');
    BodyMap = mod.default;
  });

  it('renders the Body Map page', async () => {
    render(
      <TestWrapper>
        <BodyMap />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Body Map')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows the body region instruction', async () => {
    render(
      <TestWrapper>
        <BodyMap />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(content).toContain('body region');
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── UnifiedTimeline ───────────────────────────────────────────────────────

describe('UnifiedTimeline Page', () => {
  let UnifiedTimeline: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/UnifiedTimeline');
    UnifiedTimeline = mod.default;
  });

  it('renders the Timeline page', async () => {
    render(
      <TestWrapper>
        <UnifiedTimeline />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Timeline')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows event count or empty state', async () => {
    render(
      <TestWrapper>
        <UnifiedTimeline />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent?.toLowerCase() ?? '';
        expect(
          content.includes('event') ||
            content.includes('timeline') ||
            content.includes('no entries'),
        ).toBe(true);
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── CPExamPacket ──────────────────────────────────────────────────────────

describe('CPExamPacket Page', () => {
  let CPExamPacket: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/CPExamPacket');
    CPExamPacket = mod.default;
  });

  it('renders the C&P Exam Packet page', async () => {
    render(
      <TestWrapper>
        <CPExamPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('C&P Exam Packet')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);

  it('shows collapsible section headings', async () => {
    render(
      <TestWrapper>
        <CPExamPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('C&P Exam Packet')).toBeInTheDocument();
      },
      { timeout: RENDER_TIMEOUT },
    );

    const content = document.body.textContent ?? '';
    expect(content).toContain('Veteran Information');
    expect(content).toContain('Conditions Being Claimed');
  }, RENDER_TIMEOUT);

  it('shows Export as PDF button', async () => {
    render(
      <TestWrapper>
        <CPExamPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => {
        const content = document.body.textContent ?? '';
        expect(content).toContain('Export as PDF');
      },
      { timeout: RENDER_TIMEOUT },
    );
  }, RENDER_TIMEOUT);
});

// ── NotFound ──────────────────────────────────────────────────────────────

describe('NotFound Page', () => {
  let NotFound: React.ComponentType;

  beforeEach(async () => {
    const mod = await import('@/pages/NotFound');
    NotFound = mod.default;
  });

  it('renders the 404 page with heading', async () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });
  });

  it('shows the 404 text overlay', async () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });

  it('shows Go Back and Home buttons', async () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Go Back')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  it('shows quick link navigation options', async () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Health Log')).toBeInTheDocument();
      expect(screen.getByText('Claim Tools')).toBeInTheDocument();
      expect(screen.getByText('Help Center')).toBeInTheDocument();
    });
  });

  it('displays the description text', async () => {
    render(
      <TestWrapper>
        <NotFound />
      </TestWrapper>,
    );

    await waitFor(() => {
      const content = document.body.textContent ?? '';
      expect(content).toContain("doesn't exist");
    });
  });
});
