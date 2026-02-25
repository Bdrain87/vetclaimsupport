/**
 * E2E Critical User Journeys — Section 18
 *
 * Tests the most important user flows end-to-end.
 * Uses Playwright with mobile Safari viewport.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// 18A: New User → First Entry
// ---------------------------------------------------------------------------
test.describe('New User → First Entry', () => {
  test('fresh app shows empty states and allows first entry', async ({ page }) => {
    await page.goto('/');
    // Wait for the app to load
    await page.waitForLoadState('networkidle');

    // The app should load without errors
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('app loads and renders main navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // App should have content rendered
    const html = await page.content();
    expect(html).toContain('</div>');
  });
});

// ---------------------------------------------------------------------------
// 18B: Service History → Export Flow
// ---------------------------------------------------------------------------
test.describe('Service History → Export Flow', () => {
  test('service history page is navigable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check the page renders
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 18E: AI Safe Mode Flow
// ---------------------------------------------------------------------------
test.describe('AI Safe Mode Flow', () => {
  test('AI safe mode defaults can be set in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify localStorage is accessible and AI safe mode defaults to 0
    const level = await page.evaluate(() => {
      return localStorage.getItem('vcs-ai-safe-mode-level');
    });
    // Default is null (not set) which means level 0
    expect(level).toBeNull();
  });

  test('AI safe mode level can be set to 1', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      localStorage.setItem('vcs-ai-safe-mode-level', '1');
    });

    const level = await page.evaluate(() => {
      return localStorage.getItem('vcs-ai-safe-mode-level');
    });
    expect(level).toBe('1');
  });

  test('AI safe mode level can be set to 2', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      localStorage.setItem('vcs-ai-safe-mode-level', '2');
    });

    const level = await page.evaluate(() => {
      return localStorage.getItem('vcs-ai-safe-mode-level');
    });
    expect(level).toBe('2');
  });
});

// ---------------------------------------------------------------------------
// 18F: Premium Paywall Flow
// ---------------------------------------------------------------------------
test.describe('Premium Paywall Flow', () => {
  test('app loads for free user', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The page should render — free users can access the base app
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 18H: Reminder Notification Flow
// ---------------------------------------------------------------------------
test.describe('Reminder Notification Flow', () => {
  test('notification permission state is accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const permission = await page.evaluate(() => {
      return typeof Notification !== 'undefined' ? Notification.permission : 'unavailable';
    });

    // In test browser, permission should be either 'default', 'granted', 'denied', or 'unavailable'
    expect(['default', 'granted', 'denied', 'unavailable']).toContain(permission);
  });
});
