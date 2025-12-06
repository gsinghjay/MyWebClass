import { test, expect } from '@playwright/test';

test.describe('Submit Form', () => {
  test('should load submit page', async ({ page }) => {
    await page.goto('/submit/');

    await expect(page).toHaveTitle(/Submit.*MyWebClass/);

    await expect(page.locator('h1')).toContainText('Submit');
  });

  test('should display form fields', async ({ page }) => {
    await page.goto('/submit/');

    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#style-name')).toBeVisible();
    await expect(page.locator('#demo-url')).toBeVisible();
    await expect(page.locator('#explanation')).toBeVisible();
    await expect(page.locator('#privacy-consent')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/submit/');

    await page.locator('#submit-button').click();

    const nameError = page.locator('#name-error');
    await expect(nameError).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/submit/');

    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('invalid-email');
    await page.locator('#style-name').fill('Swiss Style');
    await page.locator('#demo-url').fill('https://example.com');
    await page.locator('#explanation').fill('This is a test explanation that is long enough to pass validation requirements. It needs to be at least 100 characters.');
    await page.locator('#privacy-consent').check();

    await page.locator('#submit-button').click();

    const emailError = page.locator('#email-error');
    await expect(emailError).toHaveText(/valid email/);
  });

  test('should validate URL format', async ({ page }) => {
    await page.goto('/submit/');

    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#style-name').fill('Swiss Style');
    await page.locator('#demo-url').fill('not-a-url');
    await page.locator('#explanation').fill('This is a test explanation that is long enough to pass validation requirements. It needs to be at least 100 characters.');
    await page.locator('#privacy-consent').check();

    await page.locator('#submit-button').click();

    const urlError = page.locator('#demo-url-error');
    await expect(urlError).toHaveText(/valid URL/);
  });
});
