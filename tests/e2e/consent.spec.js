import { test, expect } from '@playwright/test';

test.describe('Cookie Consent', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.addInitScript(() => {
      localStorage.clear();
    });
  });

  /**
   * Helper to wait for consent banner to appear
   * The banner shows after a 1s delay when no consent exists
   */
  async function waitForConsentBanner(page) {
    const consentBanner = page.locator('#cookie-consent');
    await expect(consentBanner).toHaveClass(/visible/, { timeout: 3000 });
    return consentBanner;
  }

  test('should display cookie consent banner', async ({ page }) => {
    await page.goto('/');

    const consentBanner = await waitForConsentBanner(page);
    await expect(consentBanner).toBeVisible();
  });

  test('should hide banner after accepting cookies', async ({ page }) => {
    await page.goto('/');

    await waitForConsentBanner(page);

    const acceptButton = page.locator('#accept-cookies');
    await acceptButton.click();

    const consentBanner = page.locator('#cookie-consent');
    await expect(consentBanner).not.toHaveClass(/visible/);

    const consentValue = await page.evaluate(() => localStorage.getItem('cookie-consent'));
    expect(consentValue).toBe('accepted');
  });

  test('should hide banner after rejecting cookies', async ({ page }) => {
    await page.goto('/');

    await waitForConsentBanner(page);

    const rejectButton = page.locator('#reject-cookies');
    await rejectButton.click();

    const consentBanner = page.locator('#cookie-consent');
    await expect(consentBanner).not.toHaveClass(/visible/);

    const consentValue = await page.evaluate(() => localStorage.getItem('cookie-consent'));
    expect(consentValue).toBe('rejected');
  });

  test('should open preferences modal', async ({ page }) => {
    await page.goto('/');

    await waitForConsentBanner(page);

    const preferencesButton = page.locator('#cookie-preferences');
    await preferencesButton.click();

    const modal = page.locator('#cookie-preferences-modal');
    await expect(modal).toBeVisible();
  });
});
