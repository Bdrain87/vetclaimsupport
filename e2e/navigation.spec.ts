import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navbar links navigate correctly', async ({ page }) => {
    await page.goto('/');
    // Click Dashboard link
    await page.click('a[href="/dashboard"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('mobile hamburger menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    // Open mobile menu
    await page.click('[aria-label="Open menu"]');
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('direct URL access works', async ({ page }) => {
    await page.goto('/conditions');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('404 page for invalid routes', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.getByText(/not found|404/i)).toBeVisible();
  });

  test('browser back button works', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/dashboard"]');
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});
