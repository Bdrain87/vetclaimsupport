/**
 * Visual Regression Tests — Section 19
 *
 * Takes screenshots of key screens and compares against baselines.
 * On first run, these establish baselines.
 * On subsequent runs, they catch regressions.
 */
import { test, expect } from '@playwright/test';

test.describe('Visual Regression — Key Screens', () => {
  test('home page renders consistently', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for animations to complete
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('home-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('settings page renders consistently', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('settings-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('legal privacy page renders consistently', async ({ page }) => {
    await page.goto('/legal/privacy');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('privacy-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('legal terms page renders consistently', async ({ page }) => {
    await page.goto('/legal/terms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('terms-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('legal disclaimer page renders consistently', async ({ page }) => {
    await page.goto('/legal/disclaimer');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('disclaimer-page.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
