import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vet Claim Support/);
  });

  test('hero section visible with headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('CLAIM THE')).toBeVisible();
  });

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('all CTA buttons are clickable', async ({ page }) => {
    await page.goto('/');
    const ctaButtons = page.locator('a[href="/dashboard"]');
    const count = await ctaButtons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(ctaButtons.nth(i)).toBeVisible();
    }
  });

  test('footer has legal links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Terms of Service')).toBeVisible();
    await expect(page.getByText('Privacy Policy')).toBeVisible();
  });

  test('no console errors during load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/');
    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });
});
