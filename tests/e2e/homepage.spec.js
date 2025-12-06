import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/MyWebClass/);

    await expect(page.locator('h1')).toContainText('digital museum of design styles');
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('nav a[href="/"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="/gallery/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/submit/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/about/"]')).toBeVisible();
  });

  test('should have call-to-action buttons', async ({ page }) => {
    await page.goto('/');

    const exploreButton = page.locator('a[href="/gallery/"]').first();
    await expect(exploreButton).toBeVisible();

    const submitButton = page.locator('a[href="/submit/"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});
