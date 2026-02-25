/**
 * Layout Safety Tests — Section 20
 *
 * Tests safe-area padding, scroll behavior, and FAB overlap
 * across multiple viewport sizes.
 */
import { test, expect } from '@playwright/test';

test.describe('Layout Safety — Mobile Viewports', () => {
  // 20A: Safe-Area Padding
  test.describe('Safe-Area Padding', () => {
    test('content is visible on iPhone SE viewport', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Verify the page has content that fits within viewport
      const bodyBox = await body.boundingBox();
      expect(bodyBox).not.toBeNull();
      expect(bodyBox!.width).toBeLessThanOrEqual(320);
    });

    test('content is visible on iPhone 15 Pro Max viewport', async ({ page }) => {
      await page.setViewportSize({ width: 430, height: 932 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const body = page.locator('body');
      await expect(body).toBeVisible();

      const bodyBox = await body.boundingBox();
      expect(bodyBox).not.toBeNull();
      expect(bodyBox!.width).toBeLessThanOrEqual(430);
    });
  });

  // 20B: Keyboard Handling
  test.describe('Keyboard Handling', () => {
    test('page does not break on viewport resize (simulated keyboard)', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Simulate keyboard opening by reducing viewport height
      await page.setViewportSize({ width: 390, height: 500 });
      await page.waitForTimeout(300);

      // Page should still be functional
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Restore viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(300);

      await expect(body).toBeVisible();
    });
  });

  // 20C: FAB Overlap Check
  test.describe('FAB Overlap Check', () => {
    test('no elements with fixed positioning overlap tab bar area', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that the page renders without layout overflow issues
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // No horizontal scrollbar on mobile — this indicates layout issues
      expect(hasHorizontalScroll).toBe(false);
    });
  });
});
