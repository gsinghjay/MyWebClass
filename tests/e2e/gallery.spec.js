import { test, expect } from '@playwright/test';

test.describe('Gallery Page', () => {
  test('should load gallery page', async ({ page }) => {
    await page.goto('/gallery/');

    await expect(page).toHaveTitle(/Gallery.*MyWebClass/);

    await expect(page.locator('h1')).toContainText('Gallery');
  });

  test('should display gallery cards or empty state', async ({ page }) => {
    await page.goto('/gallery/');

    const hasCards = await page.locator('.gallery-card').count() > 0;
    const hasEmptyState = await page.locator('text=No design styles available').isVisible().catch(() => false);

    expect(hasCards || hasEmptyState).toBeTruthy();
  });

  test('should navigate to detail page when clicking card', async ({ page }) => {
    await page.goto('/gallery/');

    const cardCount = await page.locator('.gallery-card').count();

    if (cardCount > 0) {
      await page.locator('.gallery-card').first().click();
      await expect(page).toHaveURL(/\/gallery\/.+/);
      await expect(page.locator('a:has-text("Back to Gallery")')).toBeVisible();
    }
  });
});
