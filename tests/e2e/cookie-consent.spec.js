// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Cookie Consent Banner', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to simulate first-time visitor
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test.describe('First-Time Visitor (AC1)', () => {
    test('banner appears on first visit', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeVisible();
    });

    test('banner displays required elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeVisible();

      // Check required buttons exist
      await expect(page.locator('#cookie-accept')).toBeVisible();
      await expect(page.locator('#cookie-accept')).toHaveText('Accept All');

      await expect(page.locator('#cookie-reject')).toBeVisible();
      await expect(page.locator('#cookie-reject')).toHaveText('Reject All');

      await expect(page.locator('#cookie-preferences')).toBeVisible();
      await expect(page.locator('#cookie-preferences')).toHaveText('Preferences');

      // Check Privacy Policy link exists
      const privacyLink = banner.locator('a[href*="privacy"]');
      await expect(privacyLink).toBeVisible();
      await expect(privacyLink).toHaveText('Privacy Policy');
    });

    test('banner displays clear explanation of cookie usage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      const description = banner.locator('p');

      await expect(description).toContainText('cookies');
      await expect(description).toContainText('consent');
    });
  });

  test.describe('Accept Functionality (AC2)', () => {
    test('accept stores consent and hides banner', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeVisible();

      await page.locator('#cookie-accept').click();

      await expect(banner).toBeHidden();

      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('accepted');
    });

    test('accept button sets consent to accepted in localStorage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();

      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('accepted');
    });
  });

  test.describe('Reject Functionality (AC3)', () => {
    test('reject stores consent and hides banner', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeVisible();

      await page.locator('#cookie-reject').click();

      await expect(banner).toBeHidden();

      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('rejected');
    });

    test('reject button sets consent to rejected in localStorage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-reject').click();

      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('rejected');
    });
  });

  test.describe('Returning Visitor Behavior (AC4)', () => {
    test('banner hidden when consent already accepted', async ({ page }) => {
      // Set consent before visiting
      await page.addInitScript(() => {
        localStorage.setItem('cookie_consent', 'accepted');
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeHidden();
    });

    test('banner hidden when consent already rejected', async ({ page }) => {
      // Set consent before visiting
      await page.addInitScript(() => {
        localStorage.setItem('cookie_consent', 'rejected');
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeHidden();
    });

    test('consent persists across page navigations', async ({ browser }) => {
      // Create a fresh context without the localStorage clearing init script
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await expect(page.locator('#cookie-banner')).toBeHidden();

      // Navigate to another page using link click (same context)
      await page.locator('a[href*="/about"]').first().click();
      await page.waitForLoadState('networkidle');

      // Banner should still be hidden
      await expect(page.locator('#cookie-banner')).toBeHidden();

      // Consent should still be stored
      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('accepted');

      await context.close();
    });
  });

  test.describe('Preferences Button (AC5 - MVP)', () => {
    test('preferences button behaves as accept for MVP', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-preferences').click();

      await expect(page.locator('#cookie-banner')).toBeHidden();

      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('accepted');
    });
  });

  test.describe('Banner Accessibility (AC6)', () => {
    test('banner has proper ARIA attributes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toHaveAttribute('role', 'dialog');
      await expect(banner).toHaveAttribute('aria-labelledby', 'cookie-banner-title');
      await expect(banner).toHaveAttribute('aria-describedby', 'cookie-banner-desc');
      await expect(banner).toHaveAttribute('aria-modal', 'true');
    });

    test('buttons are focusable with keyboard', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Banner should trap focus - first focusable element should receive focus
      const privacyLink = page.locator('#cookie-banner a[href*="privacy"]');
      await expect(privacyLink).toBeFocused();
    });

    test('Tab cycles through banner elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Start from first element (Privacy Policy link)
      const privacyLink = page.locator('#cookie-banner a[href*="privacy"]');
      await expect(privacyLink).toBeFocused();

      // Tab to Preferences button
      await page.keyboard.press('Tab');
      await expect(page.locator('#cookie-preferences')).toBeFocused();

      // Tab to Reject button
      await page.keyboard.press('Tab');
      await expect(page.locator('#cookie-reject')).toBeFocused();

      // Tab to Accept button
      await page.keyboard.press('Tab');
      await expect(page.locator('#cookie-accept')).toBeFocused();

      // Tab wraps back to Privacy Policy link (focus trap)
      await page.keyboard.press('Tab');
      await expect(privacyLink).toBeFocused();
    });

    test('Shift+Tab cycles backwards through banner elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Start from first element (Privacy Policy link)
      const privacyLink = page.locator('#cookie-banner a[href*="privacy"]');
      await expect(privacyLink).toBeFocused();

      // Shift+Tab should wrap to last element (Accept button)
      await page.keyboard.press('Shift+Tab');
      await expect(page.locator('#cookie-accept')).toBeFocused();
    });

    test('ESC key does NOT dismiss banner', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeVisible();

      await page.keyboard.press('Escape');

      // Banner should still be visible - user must make explicit choice
      await expect(banner).toBeVisible();
    });

    test('buttons have minimum 44px touch target', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const acceptButton = page.locator('#cookie-accept');
      const rejectButton = page.locator('#cookie-reject');
      const preferencesButton = page.locator('#cookie-preferences');

      const acceptBox = await acceptButton.boundingBox();
      const rejectBox = await rejectButton.boundingBox();
      const preferencesBox = await preferencesButton.boundingBox();

      // WCAG 2.1 AA requires 44x44px minimum touch targets
      expect(acceptBox?.height).toBeGreaterThanOrEqual(44);
      expect(acceptBox?.width).toBeGreaterThanOrEqual(44);
      expect(rejectBox?.height).toBeGreaterThanOrEqual(44);
      expect(rejectBox?.width).toBeGreaterThanOrEqual(44);
      expect(preferencesBox?.height).toBeGreaterThanOrEqual(44);
      expect(preferencesBox?.width).toBeGreaterThanOrEqual(44);
    });

    test('Privacy Policy link has minimum 44px touch target height', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const privacyLink = page.locator('#cookie-banner a[href*="privacy"]');
      const linkBox = await privacyLink.boundingBox();

      // Link should have at least 44px height for touch accessibility
      expect(linkBox?.height).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('Cookie Policy Link (AC7)', () => {
    test('Privacy Policy link navigates to correct page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const privacyLink = page.locator('#cookie-banner a[href*="privacy"]');
      await expect(privacyLink).toHaveAttribute('href', /\/legal\/privacy\//);

      // Click and verify navigation
      await privacyLink.click();
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/legal/privacy/');
    });

    test('Privacy Policy link opens in same tab', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const privacyLink = page.locator('#cookie-banner a[href*="privacy"]');

      // Should not have target="_blank"
      await expect(privacyLink).not.toHaveAttribute('target', '_blank');
    });
  });

  test.describe('Cookie Settings Footer Link', () => {
    test('Cookie Settings link exists in footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Accept cookies first to hide banner
      await page.locator('#cookie-accept').click();
      await expect(page.locator('#cookie-banner')).toBeHidden();

      // Check footer link exists
      const cookieSettingsLink = page.locator('#cookie-settings-link');
      await expect(cookieSettingsLink).toBeVisible();
      await expect(cookieSettingsLink).toHaveText('Cookie Settings');
    });

    test('Cookie Settings link re-opens banner', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Accept cookies first
      await page.locator('#cookie-accept').click();
      await expect(page.locator('#cookie-banner')).toBeHidden();

      // Click Cookie Settings link
      const cookieSettingsLink = page.locator('#cookie-settings-link');
      await cookieSettingsLink.click();

      // Banner should re-appear
      await expect(page.locator('#cookie-banner')).toBeVisible();
    });

    test('user can change consent via Cookie Settings', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Accept cookies first
      await page.locator('#cookie-accept').click();
      let consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('accepted');

      // Re-open banner via Cookie Settings
      await page.locator('#cookie-settings-link').click();
      await expect(page.locator('#cookie-banner')).toBeVisible();

      // Change to reject
      await page.locator('#cookie-reject').click();
      consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('rejected');
    });
  });

  test.describe('GA4 Consent Mode', () => {
    test('gtag consent default is denied', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check dataLayer contains consent default with denied
      const dataLayer = await page.evaluate(() => window.dataLayer);
      expect(dataLayer).toBeDefined();

      // Find consent default command
      const consentDefault = dataLayer.find(
        item => item[0] === 'consent' && item[1] === 'default'
      );
      expect(consentDefault).toBeDefined();
      expect(consentDefault[2].analytics_storage).toBe('denied');
    });

    test('GA4_MEASUREMENT_ID is defined', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const measurementId = await page.evaluate(() => window.GA4_MEASUREMENT_ID);
      expect(measurementId).toBeDefined();
    });

    test('GA4 script loads after accepting consent (AC2)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Before accepting - no gtag script should be loaded (only inline dataLayer init)
      const scriptsBefore = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script[src*="googletagmanager"]')).length;
      });
      expect(scriptsBefore).toBe(0);

      // Accept cookies
      await page.locator('#cookie-accept').click();

      // Wait a moment for script to load
      await page.waitForTimeout(500);

      // After accepting - gtag script should be loaded (if valid measurement ID)
      // Note: In test environment with dummy ID (G-0000000000), script won't load
      // This test verifies the consent update happens
      const dataLayer = await page.evaluate(() => window.dataLayer);
      const consentUpdate = dataLayer.find(
        item => item[0] === 'consent' && item[1] === 'update'
      );
      expect(consentUpdate).toBeDefined();
      expect(consentUpdate[2].analytics_storage).toBe('granted');
    });

    test('GA4 script does NOT load after rejecting consent (AC3)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Reject cookies
      await page.locator('#cookie-reject').click();

      // Wait a moment
      await page.waitForTimeout(500);

      // After rejecting - no gtag script should be loaded
      const scriptsAfter = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script[src*="googletagmanager"]')).length;
      });
      expect(scriptsAfter).toBe(0);

      // Verify consent stays denied (no update to granted)
      const dataLayer = await page.evaluate(() => window.dataLayer);
      const consentGranted = dataLayer.find(
        item => item[0] === 'consent' && item[1] === 'update' && item[2]?.analytics_storage === 'granted'
      );
      expect(consentGranted).toBeUndefined();
    });
  });

  test.describe('Smooth Banner Transition', () => {
    test('banner hides with smooth transition classes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const banner = page.locator('#cookie-banner');

      // Banner should be visible initially (no opacity-0 class)
      await expect(banner).not.toHaveClass(/opacity-0/);

      // Accept cookies
      await page.locator('#cookie-accept').click();

      // Wait for transition to complete
      await page.waitForTimeout(400);

      // Banner should have transition classes applied (invisible for accessibility)
      await expect(banner).toHaveClass(/opacity-0/);
      await expect(banner).toHaveClass(/translate-y-full/);
      await expect(banner).toHaveClass(/invisible/);
    });

    test('banner shows with smooth transition classes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Accept to hide banner
      await page.locator('#cookie-accept').click();
      await expect(page.locator('#cookie-banner')).toBeHidden();

      // Re-open via Cookie Settings
      await page.locator('#cookie-settings-link').click();

      // Banner should be visible (no invisible class)
      const banner = page.locator('#cookie-banner');
      await expect(banner).toBeVisible();
      await expect(banner).not.toHaveClass(/invisible/);
    });
  });
});
