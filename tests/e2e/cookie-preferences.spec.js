// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Cookie Preferences Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test.describe('Opening Modal (AC1, AC6)', () => {
    test('Cookie Settings link opens modal', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // First accept to dismiss banner
      await page.locator('#cookie-accept').click();
      await expect(page.locator('#cookie-banner')).toBeHidden();

      // Click footer link
      await page.locator('#cookie-settings-link').click();

      // Modal should be visible
      await expect(page.locator('#cookie-modal')).toBeVisible();
    });

    test('Preferences button opens modal instead of auto-accepting', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-preferences').click();

      // Modal should be visible, banner hidden
      await expect(page.locator('#cookie-modal')).toBeVisible();
      await expect(page.locator('#cookie-banner')).toBeHidden();
    });

    test('modal toggles default to OFF for first-time visitors (AC6)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Open modal via Preferences button (first-time visitor)
      await page.locator('#cookie-preferences').click();

      // Analytics toggle should be OFF (unchecked)
      await expect(page.locator('#analytics-toggle')).toHaveAttribute('aria-checked', 'false');

      // Status should show "Disabled"
      await expect(page.locator('#analytics-status')).toHaveText('Disabled');
    });
  });

  test.describe('Modal Display (AC2)', () => {
    test('modal displays all required elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      // Modal title
      await expect(page.locator('#cookie-modal-title')).toHaveText('Cookie Preferences');

      // Current status indicator
      await expect(page.locator('#cookie-status-text')).toBeVisible();

      // Analytics toggle with description
      await expect(page.locator('#analytics-toggle')).toBeVisible();
      await expect(page.locator('#cookie-modal').locator('text=Help us understand how visitors use our site')).toBeVisible();

      // Marketing toggle (disabled)
      await expect(page.locator('#marketing-toggle')).toBeVisible();
      await expect(page.locator('#marketing-toggle')).toBeDisabled();
      await expect(page.locator('#cookie-modal').locator('text=Currently not used')).toBeVisible();

      // Save and Cancel buttons
      await expect(page.locator('#cookie-modal-save')).toBeVisible();
      await expect(page.locator('#cookie-modal-save')).toHaveText('Save Preferences');
      await expect(page.locator('#cookie-modal-cancel')).toBeVisible();
      await expect(page.locator('#cookie-modal-cancel')).toHaveText('Cancel');

      // Cookie Policy link
      await expect(page.locator('#cookie-policy-link')).toBeVisible();
    });

    test('current status shows "Accepted" when analytics enabled', async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('cookie_consent', JSON.stringify({ analytics: true, marketing: false }));
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-settings-link').click();

      await expect(page.locator('#cookie-status-text')).toHaveText('Accepted');
    });

    test('current status shows "Rejected" when analytics disabled', async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('cookie_consent', JSON.stringify({ analytics: false, marketing: false }));
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-settings-link').click();

      await expect(page.locator('#cookie-status-text')).toHaveText('Rejected');
    });
  });

  test.describe('Toggle State Reflects Current Preferences (AC3)', () => {
    test('analytics toggle reflects accepted preference', async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('cookie_consent', JSON.stringify({ analytics: true, marketing: false }));
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-settings-link').click();

      await expect(page.locator('#analytics-toggle')).toHaveAttribute('aria-checked', 'true');
      await expect(page.locator('#analytics-status')).toHaveText('Enabled');
    });

    test('analytics toggle reflects rejected preference', async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('cookie_consent', JSON.stringify({ analytics: false, marketing: false }));
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-settings-link').click();

      await expect(page.locator('#analytics-toggle')).toHaveAttribute('aria-checked', 'false');
      await expect(page.locator('#analytics-status')).toHaveText('Disabled');
    });

    test('toggle click updates visual state and label', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      // Initially should be ON (accepted)
      await expect(page.locator('#analytics-toggle')).toHaveAttribute('aria-checked', 'true');
      await expect(page.locator('#analytics-status')).toHaveText('Enabled');

      // Click to toggle OFF
      await page.locator('#analytics-toggle').click();

      await expect(page.locator('#analytics-toggle')).toHaveAttribute('aria-checked', 'false');
      await expect(page.locator('#analytics-status')).toHaveText('Disabled');

      // Click to toggle back ON
      await page.locator('#analytics-toggle').click();

      await expect(page.locator('#analytics-toggle')).toHaveAttribute('aria-checked', 'true');
      await expect(page.locator('#analytics-status')).toHaveText('Enabled');
    });
  });

  test.describe('Save Updated Preferences (AC4)', () => {
    test('saving preferences updates localStorage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Accept first
      await page.locator('#cookie-accept').click();

      // Open modal and toggle analytics OFF
      await page.locator('#cookie-settings-link').click();
      await page.locator('#analytics-toggle').click();
      await page.locator('#cookie-modal-save').click();

      const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('cookie_consent')));
      expect(prefs.analytics).toBe(false);
    });

    test('modal closes with smooth transition after save', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();
      await page.locator('#cookie-modal-save').click();

      await expect(page.locator('#cookie-modal')).toBeHidden();
    });

    test('toast notification appears on save', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();
      await page.locator('#cookie-modal-save').click();

      const toast = page.locator('#cookie-toast');
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute('role', 'status');
      await expect(toast).toContainText('preferences saved');
    });

    test('toast disappears after ~3 seconds', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();
      await page.locator('#cookie-modal-save').click();

      // Toast should be visible
      await expect(page.locator('#cookie-toast')).toBeVisible();

      // Wait for toast to disappear (3s + 300ms transition)
      await page.waitForTimeout(3500);

      await expect(page.locator('#cookie-toast')).toBeHidden();
    });

    test('enabling analytics via modal loads GA4', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Reject first
      await page.locator('#cookie-reject').click();

      // Open modal and enable analytics
      await page.locator('#cookie-settings-link').click();
      await page.locator('#analytics-toggle').click();
      await page.locator('#cookie-modal-save').click();

      // Wait for consent update
      await page.waitForTimeout(500);

      // Verify consent was updated to granted
      const dataLayer = await page.evaluate(() => window.dataLayer);
      const consentUpdate = dataLayer.find(
        item => item[0] === 'consent' && item[1] === 'update' && item[2]?.analytics_storage === 'granted'
      );
      expect(consentUpdate).toBeDefined();
    });

    test('disabling analytics via modal updates consent mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Accept first
      await page.locator('#cookie-accept').click();

      // Open modal and disable analytics
      await page.locator('#cookie-settings-link').click();
      await page.locator('#analytics-toggle').click();
      await page.locator('#cookie-modal-save').click();

      // Wait for consent update
      await page.waitForTimeout(500);

      // Verify consent was updated to denied
      const dataLayer = await page.evaluate(() => window.dataLayer);
      const consentUpdates = dataLayer.filter(
        item => item[0] === 'consent' && item[1] === 'update'
      );

      // Last consent update should be denied
      const lastUpdate = consentUpdates[consentUpdates.length - 1];
      expect(lastUpdate[2].analytics_storage).toBe('denied');
    });
  });

  test.describe('Cancel Without Saving (AC5)', () => {
    test('cancel closes modal without saving', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();

      // Get initial preference
      let prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('cookie_consent')));
      expect(prefs.analytics).toBe(true);

      // Open modal and toggle (but don't save)
      await page.locator('#cookie-settings-link').click();
      await page.locator('#analytics-toggle').click();
      await page.locator('#cookie-modal-cancel').click();

      // Modal should close
      await expect(page.locator('#cookie-modal')).toBeHidden();

      // Preference should be unchanged
      prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('cookie_consent')));
      expect(prefs.analytics).toBe(true);
    });

    test('ESC key closes modal without saving', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      // Toggle analytics (but press ESC instead of saving)
      await page.locator('#analytics-toggle').click();
      await page.keyboard.press('Escape');

      // Modal should close
      await expect(page.locator('#cookie-modal')).toBeHidden();

      // Preference should be unchanged (still true)
      const prefs = await page.evaluate(() => JSON.parse(localStorage.getItem('cookie_consent')));
      expect(prefs.analytics).toBe(true);
    });

    test('backdrop click closes modal without saving', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      // Wait for modal to be visible
      await expect(page.locator('#cookie-modal')).toBeVisible();

      // Click at specific position on backdrop (top-left corner, outside modal content)
      // Get viewport size and click near edge
      const viewport = page.viewportSize();
      await page.mouse.click(20, 20);

      // Modal should close
      await expect(page.locator('#cookie-modal')).toBeHidden();
    });
  });

  test.describe('Modal Accessibility (AC7)', () => {
    test('modal has proper ARIA attributes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      await expect(page.locator('#cookie-modal')).toHaveAttribute('role', 'dialog');
      await expect(page.locator('#cookie-modal')).toHaveAttribute('aria-modal', 'true');
      await expect(page.locator('#cookie-modal')).toHaveAttribute('aria-labelledby', 'cookie-modal-title');
    });

    test('focus is trapped within modal', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      // Get focusable elements (analytics toggle, cancel, save, policy link)
      const analyticsToggle = page.locator('#analytics-toggle');
      const cancelButton = page.locator('#cookie-modal-cancel');
      const saveButton = page.locator('#cookie-modal-save');
      const policyLink = page.locator('#cookie-policy-link');

      // First focusable should be focused on open
      await expect(analyticsToggle).toBeFocused();

      // Tab through elements
      await page.keyboard.press('Tab');
      await expect(cancelButton).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(saveButton).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(policyLink).toBeFocused();

      // Tab from last should wrap to first
      await page.keyboard.press('Tab');
      await expect(analyticsToggle).toBeFocused();

      // Shift+Tab from first should wrap to last
      await page.keyboard.press('Shift+Tab');
      await expect(policyLink).toBeFocused();
    });

    test('focus returns to trigger element on close (Cookie Settings link)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();
      await page.locator('#cookie-modal-cancel').click();

      await expect(page.locator('#cookie-settings-link')).toBeFocused();
    });

    test('focus returns to trigger element on close (Preferences button)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-preferences').click();
      await page.locator('#cookie-modal-cancel').click();

      // Focus should return to preferences button (though banner is hidden)
      await expect(page.locator('#cookie-preferences')).toBeFocused();
    });

    test('toggle is keyboard accessible with Space', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      // Focus toggle and press Space
      await page.locator('#analytics-toggle').focus();
      const initialState = await page.locator('#analytics-toggle').getAttribute('aria-checked');

      await page.keyboard.press('Space');

      const newState = await page.locator('#analytics-toggle').getAttribute('aria-checked');
      expect(newState).not.toBe(initialState);
    });

    test('toggle is keyboard accessible with Enter', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      await page.locator('#analytics-toggle').focus();
      const initialState = await page.locator('#analytics-toggle').getAttribute('aria-checked');

      await page.keyboard.press('Enter');

      const newState = await page.locator('#analytics-toggle').getAttribute('aria-checked');
      expect(newState).not.toBe(initialState);
    });

    test('all interactive elements have 44px minimum touch targets', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      const elements = [
        '#analytics-toggle',
        '#cookie-modal-cancel',
        '#cookie-modal-save',
        '#cookie-policy-link'
      ];

      for (const selector of elements) {
        const box = await page.locator(selector).boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        expect(box?.width).toBeGreaterThanOrEqual(44);
      }
    });

    test('body scroll is prevented when modal is open', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();

      // Open modal
      await page.locator('#cookie-settings-link').click();

      // Body should have overflow: hidden
      const overflow = await page.evaluate(() => document.body.style.overflow);
      expect(overflow).toBe('hidden');

      // Close modal
      await page.locator('#cookie-modal-cancel').click();

      // Body scroll should be restored
      const overflowAfter = await page.evaluate(() => document.body.style.overflow);
      expect(overflowAfter).toBe('');
    });
  });

  test.describe('Cookie Policy Link (AC8)', () => {
    test('Cookie Policy link opens in new tab', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      const policyLink = page.locator('#cookie-policy-link');
      await expect(policyLink).toHaveAttribute('target', '_blank');
      await expect(policyLink).toHaveAttribute('rel', 'noopener');
      await expect(policyLink).toHaveAttribute('href', /\/legal\/cookies\//);
    });

    test('Cookie Policy link has proper aria-label', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.locator('#cookie-accept').click();
      await page.locator('#cookie-settings-link').click();

      await expect(page.locator('#cookie-policy-link')).toHaveAttribute(
        'aria-label',
        'View full Cookie Policy (opens in new tab)'
      );
    });
  });
});
