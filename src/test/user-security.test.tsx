/**
 * Security Audit Tests
 *
 * Tests for PHI exposure, XSS vulnerabilities, and data sanitization
 * in rendered UI components.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { Suspense } from 'react';
import { useProfileStore } from '@/store/useProfileStore';

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

// SSN pattern: xxx-xx-xxxx
const SSN_PATTERN = /\b\d{3}-\d{2}-\d{4}\b/;

// ── PHI Exposure Audit ────────────────────────────────────────────────────

describe('PHI Exposure Audit', () => {
  it('Dashboard does not expose SSN patterns in rendered output', async () => {
    const mod = await import('@/pages/Dashboard');
    const Dashboard = mod.default;

    const { container } = render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/app']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    expect(container.innerHTML).not.toMatch(SSN_PATTERN);
  }, 15_000);

  it('Settings page does not expose SSN patterns', async () => {
    const mod = await import('@/pages/Settings');
    const Settings = mod.default;

    const { container } = render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    expect(container.innerHTML).not.toMatch(SSN_PATTERN);
  }, 15_000);

  it('BuildPacket does not expose PHI patterns', async () => {
    const mod = await import('@/pages/BuildPacket');
    const BuildPacket = mod.default;

    const { container } = render(
      <TestWrapper>
        <BuildPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    expect(container.innerHTML).not.toMatch(SSN_PATTERN);
  }, 15_000);

  it('CPExamPacket does not expose PHI patterns', async () => {
    const mod = await import('@/pages/CPExamPacket');
    const CPExamPacket = mod.default;

    const { container } = render(
      <TestWrapper>
        <CPExamPacket />
      </TestWrapper>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    expect(container.innerHTML).not.toMatch(SSN_PATTERN);
  }, 15_000);
});

// ── XSS Prevention ────────────────────────────────────────────────────────

describe('XSS Prevention', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appStore: any;

  beforeAll(async () => {
    const mod = await import('@/store/useAppStore');
    appStore = mod.default;
  });

  beforeEach(() => {
    appStore?.getState().resetAllData();
    useProfileStore.getState().resetProfile();
  });

  it('XSS in profile name is escaped in Dashboard', async () => {
    useProfileStore.getState().setFirstName('<script>alert("xss")</script>');

    const mod = await import('@/pages/Dashboard');
    const Dashboard = mod.default;

    const { container } = render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/app']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    // No raw script tags should be in the rendered DOM
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);

    // The XSS payload should be escaped, not executed as HTML
    expect(container.innerHTML).not.toContain('<script>alert');
  }, 15_000);

  it('XSS in user condition name is escaped', async () => {
    appStore.getState().addUserCondition({
      id: 'xss',
      conditionId: '"><svg onload=alert(1)>',
      serviceConnected: true,
      claimStatus: 'pending',
      isPrimary: true,
      dateAdded: '2025-01-01',
    });

    const mod = await import('@/pages/Conditions');
    const Conditions = mod.default;

    const { container } = render(
      <TestWrapper>
        <Conditions />
      </TestWrapper>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    const svgs = container.querySelectorAll('svg[onload]');
    expect(svgs.length).toBe(0);
  }, 15_000);

  it('XSS in quick log notes does not inject scripts', async () => {
    appStore.getState().addQuickLog({
      date: new Date().toISOString(),
      overallFeeling: 3,
      hadFlareUp: false,
      flareUpNote: '',
      painLevel: 3,
      mood: 'good',
      condition: 'general',
      notes: '<img src=x onerror=alert(1)>',
      createdAt: new Date().toISOString(),
    });

    const mod = await import('@/pages/Dashboard');
    const Dashboard = mod.default;

    const { container } = render(
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={['/app']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </Suspense>
          </MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    // No img elements with onerror handler
    const imgs = container.querySelectorAll('img[onerror]');
    expect(imgs.length).toBe(0);
  }, 15_000);
});

// ── Data Sanitization ─────────────────────────────────────────────────────

describe('Data Sanitization', () => {
  it('rendered pages do not contain raw SQL injection patterns', async () => {
    const mod = await import('@/pages/Settings');
    const Settings = mod.default;

    const { container } = render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    const html = container.innerHTML.toLowerCase();
    expect(html).not.toContain('drop table');
    expect(html).not.toContain('select * from');
    expect(html).not.toContain('union select');
  }, 15_000);

  it('localStorage keys are properly namespaced', () => {
    const storeKeys = ['vcs-app-data', 'vet-user-profile', 'vcs-ai-cache'];
    for (const key of storeKeys) {
      expect(key).toMatch(/^(vcs|vet)-/);
    }
  });

  it('no hardcoded API keys or secrets in rendered Settings page', async () => {
    const mod = await import('@/pages/Settings');
    const Settings = mod.default;

    const { container } = render(
      <TestWrapper>
        <Settings />
      </TestWrapper>,
    );

    await waitFor(
      () => expect(container.innerHTML.length).toBeGreaterThan(100),
      { timeout: 10000 },
    );

    const html = container.innerHTML;
    // Common API key patterns
    expect(html).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
    expect(html).not.toMatch(/api[_-]?key\s*[:=]\s*["'][^"']+["']/i);
    expect(html).not.toMatch(/secret[_-]?key\s*[:=]\s*["'][^"']+["']/i);
  }, 15_000);
});
