// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Submission Form Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/submit/');
    await page.waitForLoadState('networkidle');
    // Accept cookies if banner appears
    const banner = page.locator('#cookie-banner');
    if (await banner.isVisible()) {
      await page.locator('#cookie-accept').click();
      await page.waitForTimeout(400);
    }
  });

  test.describe('Form Page Access (AC1)', () => {
    test('form page loads at /submit/', async ({ page }) => {
      await expect(page).toHaveURL(/\/submit\//);
    });

    test('form page has title and description', async ({ page }) => {
      await expect(page.locator('h1')).toHaveText('Submit Your Demo');
      await expect(page.locator('p').first()).toContainText('Share your design style implementation');
    });

    test('submission form is visible', async ({ page }) => {
      const form = page.locator('#submission-form');
      await expect(form).toBeVisible();
    });
  });

  test.describe('Required Form Fields (AC2)', () => {
    test('name field is present and required', async ({ page }) => {
      const nameInput = page.locator('#name');
      await expect(nameInput).toBeVisible();
      await expect(nameInput).toHaveAttribute('required', '');
      await expect(nameInput).toHaveAttribute('type', 'text');
    });

    test('email field is present and required', async ({ page }) => {
      const emailInput = page.locator('#email');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('required', '');
      await expect(emailInput).toHaveAttribute('type', 'email');
    });

    test('design style dropdown is present and required', async ({ page }) => {
      const styleSelect = page.locator('#style');
      await expect(styleSelect).toBeVisible();
      await expect(styleSelect).toHaveAttribute('required', '');
    });

    test('demo URL field is present and required', async ({ page }) => {
      const demoUrlInput = page.locator('#demoUrl');
      await expect(demoUrlInput).toBeVisible();
      await expect(demoUrlInput).toHaveAttribute('required', '');
      await expect(demoUrlInput).toHaveAttribute('type', 'url');
    });

    test('screenshot upload is present and required', async ({ page }) => {
      const screenshotInput = page.locator('#screenshot');
      await expect(screenshotInput).toBeAttached();
      await expect(screenshotInput).toHaveAttribute('required', '');
      await expect(screenshotInput).toHaveAttribute('type', 'file');
    });

    test('authenticity explanation is present and required', async ({ page }) => {
      const authenticityTextarea = page.locator('#authenticity');
      await expect(authenticityTextarea).toBeVisible();
      await expect(authenticityTextarea).toHaveAttribute('required', '');
    });
  });

  test.describe('Field Labels and Helper Text (AC3)', () => {
    test('all fields have visible labels', async ({ page }) => {
      await expect(page.locator('label[for="name"]')).toBeVisible();
      await expect(page.locator('label[for="email"]')).toBeVisible();
      await expect(page.locator('label[for="style"]')).toBeVisible();
      await expect(page.locator('label[for="demoUrl"]')).toBeVisible();
      // Screenshot has two labels - the form-label and the upload area label
      await expect(page.locator('label[for="screenshot"].form-label')).toBeVisible();
      await expect(page.locator('label[for="authenticity"]')).toBeVisible();
    });

    test('required fields have required indicator', async ({ page }) => {
      // Check that required labels contain asterisk span
      const nameLabel = page.locator('label[for="name"]');
      await expect(nameLabel.locator('.text-swiss-red')).toHaveText('*');

      const emailLabel = page.locator('label[for="email"]');
      await expect(emailLabel.locator('.text-swiss-red')).toHaveText('*');
    });

    test('fields have placeholder text', async ({ page }) => {
      await expect(page.locator('#name')).toHaveAttribute('placeholder', 'Your name');
      await expect(page.locator('#email')).toHaveAttribute('placeholder', 'you@email.com');
      await expect(page.locator('#demoUrl')).toHaveAttribute('placeholder', /https:\/\//);
    });

    test('demo URL has helper text', async ({ page }) => {
      const helperText = page.locator('#demoUrl-helper');
      await expect(helperText).toContainText('publicly accessible URL');
    });
  });

  test.describe('Design Style Dropdown Population (AC4)', () => {
    test('dropdown has options from Sanity', async ({ page }) => {
      const styleSelect = page.locator('#style');
      const options = styleSelect.locator('option');

      // Should have at least the default option plus some styles
      const count = await options.count();
      expect(count).toBeGreaterThan(1);
    });

    test('dropdown options have value and label', async ({ page }) => {
      const styleSelect = page.locator('#style');
      const firstRealOption = styleSelect.locator('option').nth(1);

      // Should have a non-empty value
      const value = await firstRealOption.getAttribute('value');
      expect(value).toBeTruthy();
      expect(value?.length).toBeGreaterThan(0);

      // Should have visible text
      const text = await firstRealOption.textContent();
      expect(text?.length).toBeGreaterThan(0);
    });

    test('first option is placeholder', async ({ page }) => {
      const styleSelect = page.locator('#style');
      const firstOption = styleSelect.locator('option').first();

      await expect(firstOption).toHaveAttribute('value', '');
      await expect(firstOption).toContainText('Select');
    });
  });

  test.describe('Accessible Form Structure (AC9)', () => {
    test('inputs have associated labels via for/id', async ({ page }) => {
      const fields = ['name', 'email', 'style', 'demoUrl', 'authenticity'];

      for (const field of fields) {
        const label = page.locator(`label[for="${field}"]`);
        const input = page.locator(`#${field}`);
        await expect(label).toBeVisible();
        await expect(input).toBeAttached();
      }
    });

    test('required fields have aria-required attribute', async ({ page }) => {
      const requiredFields = ['name', 'email', 'style', 'demoUrl', 'authenticity'];

      for (const field of requiredFields) {
        const input = page.locator(`#${field}`);
        await expect(input).toHaveAttribute('aria-required', 'true');
      }
    });

    test('inputs have aria-describedby for error messages', async ({ page }) => {
      const fields = ['name', 'email', 'style', 'demoUrl', 'authenticity'];

      for (const field of fields) {
        const input = page.locator(`#${field}`);
        const describedBy = await input.getAttribute('aria-describedby');
        expect(describedBy).toContain(`${field}-error`);
      }
    });

    test('inputs have aria-invalid attribute', async ({ page }) => {
      const fields = ['name', 'email', 'style', 'demoUrl', 'authenticity'];

      for (const field of fields) {
        const input = page.locator(`#${field}`);
        await expect(input).toHaveAttribute('aria-invalid', 'false');
      }
    });

    test('error containers exist with role alert', async ({ page }) => {
      const fields = ['name', 'email', 'style', 'demoUrl', 'authenticity'];

      for (const field of fields) {
        const errorEl = page.locator(`#${field}-error`);
        await expect(errorEl).toBeAttached();
        await expect(errorEl).toHaveAttribute('role', 'alert');
      }
    });

    test('can tab through all fields in logical order', async ({ page }) => {
      // Focus the first input
      await page.locator('#name').focus();
      await expect(page.locator('#name')).toBeFocused();

      // Tab to email
      await page.keyboard.press('Tab');
      await expect(page.locator('#email')).toBeFocused();

      // Tab to style
      await page.keyboard.press('Tab');
      await expect(page.locator('#style')).toBeFocused();

      // Tab to demoUrl
      await page.keyboard.press('Tab');
      await expect(page.locator('#demoUrl')).toBeFocused();
    });
  });

  test.describe('Client-Side Validation - Required Fields (AC5)', () => {
    test('validation script loads', async ({ page }) => {
      // Wait for scripts to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });
      const hasValidation = await page.evaluate(() => typeof window.validateSubmissionForm === 'function');
      expect(hasValidation).toBe(true);
    });

    test('shows error when submitting empty form', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Click submit without filling anything
      await page.locator('button[type="submit"]').click();

      // Form should not navigate away (validation should prevent it)
      await expect(page).toHaveURL(/\/submit\//);
    });

    test('shows inline error for empty required field', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Fill all required fields except name
      await page.locator('#email').fill('test@example.com');
      await page.locator('#style').selectOption({ index: 1 });
      await page.locator('#demoUrl').fill('https://example.com');
      await page.locator('#authenticity').fill('This is my authentic design explanation that meets the minimum character requirement for the form submission.');

      // Fill screenshot with fake file
      const buffer = Buffer.from('fake-image');
      await page.locator('#screenshot').setInputFiles({
        name: 'test.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      // Check consent
      await page.locator('#consent').check();

      // Try to submit - only name should be invalid
      await page.locator('button[type="submit"]').click();

      // Name error should be visible
      const nameError = page.locator('#name-error');
      await expect(nameError).toBeVisible();
      await expect(nameError).toContainText('required');
    });

    test('aria-invalid is set to true on error', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      await page.locator('button[type="submit"]').click();

      // At least one field should have aria-invalid="true"
      const nameInput = page.locator('#name');
      await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    test('focus moves to first invalid field on submit', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      await page.locator('button[type="submit"]').click();

      // First invalid field (name) should be focused
      await expect(page.locator('#name')).toBeFocused();
    });
  });

  test.describe('Client-Side Validation - Email Format (AC6)', () => {
    test('shows error for invalid email format', async ({ page }) => {
      await page.locator('#email').fill('invalid-email');
      await page.locator('#email').blur();

      const emailError = page.locator('#email-error');
      await expect(emailError).toBeVisible();
      await expect(emailError).toContainText('valid email');
    });

    test('clears error when valid email entered', async ({ page }) => {
      await page.locator('#email').fill('invalid-email');
      await page.locator('#email').blur();

      // Error should appear
      await expect(page.locator('#email-error')).toBeVisible();

      // Fix the email
      await page.locator('#email').fill('valid@example.com');
      await page.locator('#email').blur();

      // Error should be hidden
      await expect(page.locator('#email-error')).toBeHidden();
    });

    test('applies valid styling after successful validation', async ({ page }) => {
      await page.locator('#email').fill('valid@example.com');
      await page.locator('#email').blur();

      // Should have valid class
      const emailInput = page.locator('#email');
      await expect(emailInput).toHaveClass(/valid/);
    });
  });

  test.describe('Client-Side Validation - URL Format (AC7)', () => {
    test('shows error for non-https URL', async ({ page }) => {
      await page.locator('#demoUrl').fill('http://example.com');
      await page.locator('#demoUrl').blur();

      const urlError = page.locator('#demoUrl-error');
      await expect(urlError).toBeVisible();
      await expect(urlError).toContainText('https://');
    });

    test('shows error for invalid URL', async ({ page }) => {
      await page.locator('#demoUrl').fill('not-a-url');
      await page.locator('#demoUrl').blur();

      const urlError = page.locator('#demoUrl-error');
      await expect(urlError).toBeVisible();
    });

    test('accepts valid https URL', async ({ page }) => {
      await page.locator('#demoUrl').fill('https://example.com/demo');
      await page.locator('#demoUrl').blur();

      await expect(page.locator('#demoUrl-error')).toBeHidden();
    });
  });

  test.describe('Client-Side Validation - Explanation Length (AC8)', () => {
    test('shows error for explanation under 50 characters', async ({ page }) => {
      await page.locator('#authenticity').fill('Too short');
      await page.locator('#authenticity').blur();

      const error = page.locator('#authenticity-error');
      await expect(error).toBeVisible();
      await expect(error).toContainText('50 characters');
    });

    test('accepts explanation with 50+ characters', async ({ page }) => {
      const longText = 'This is a detailed explanation of my design choices that exceeds the minimum character requirement.';
      await page.locator('#authenticity').fill(longText);
      await page.locator('#authenticity').blur();

      await expect(page.locator('#authenticity-error')).toBeHidden();
    });

    test('character counter shows remaining characters needed', async ({ page }) => {
      const helper = page.locator('#authenticity-helper');

      // Initially should show characters needed
      await expect(helper).toContainText('50 more characters needed');

      // Type some text
      await page.locator('#authenticity').fill('Short text here');

      // Should update to show remaining
      await expect(helper).toContainText('more characters needed');
    });

    test('character counter shows count when minimum met', async ({ page }) => {
      const helper = page.locator('#authenticity-helper');
      const longText = 'This is a detailed explanation of my design choices that exceeds fifty characters easily.';

      await page.locator('#authenticity').fill(longText);

      // Should show character count without "needed"
      await expect(helper).toContainText('characters)');
      await expect(helper).not.toContainText('needed');
    });
  });

  test.describe('Responsive Form Layout (AC10)', () => {
    test('form displays single column on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Form should be visible
      const form = page.locator('#submission-form');
      await expect(form).toBeVisible();

      // Check that the form has appropriate stacking
      const formBox = await form.boundingBox();
      expect(formBox?.width).toBeLessThanOrEqual(375);
    });

    test('submit button has minimum 44px touch target', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const submitButton = page.locator('button[type="submit"]');
      const box = await submitButton.boundingBox();

      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    });

    test('form inputs have minimum touch target height', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const nameInput = page.locator('#name');
      const box = await nameInput.boundingBox();

      expect(box?.height).toBeGreaterThanOrEqual(44);
    });

    test('checkbox has minimum 44px touch target', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Touch target is on the label wrapper, not the checkbox input itself
      const checkboxLabel = page.locator('label[for="consent"]');
      const box = await checkboxLabel.boundingBox();

      // Label wrapper should have at least 44px height for touch accessibility
      expect(box?.height).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('Screenshot Upload', () => {
    test('accepts png, jpeg, and webp files', async ({ page }) => {
      const screenshotInput = page.locator('#screenshot');
      const acceptAttr = await screenshotInput.getAttribute('accept');

      expect(acceptAttr).toContain('image/png');
      expect(acceptAttr).toContain('image/jpeg');
      expect(acceptAttr).toContain('image/webp');
    });

    test('shows file name after selection', async ({ page }) => {
      // Create a simple test image buffer
      const buffer = Buffer.from('fake-image-content');

      await page.locator('#screenshot').setInputFiles({
        name: 'test-screenshot.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      const fileName = page.locator('#file-name');
      await expect(fileName).toBeVisible();
      await expect(fileName).toContainText('test-screenshot.png');
    });

    test('shows error for file over 5MB', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Create a buffer larger than 5MB (5.1MB)
      const largeBuffer = Buffer.alloc(5.1 * 1024 * 1024, 'x');

      await page.locator('#screenshot').setInputFiles({
        name: 'large-screenshot.png',
        mimeType: 'image/png',
        buffer: largeBuffer,
      });

      // Trigger validation by submitting or blurring
      await page.locator('button[type="submit"]').click();

      const error = page.locator('#screenshot-error');
      await expect(error).toBeVisible();
      await expect(error).toContainText('5MB');
    });

    test('accepts file under 5MB', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Create a small valid buffer
      const smallBuffer = Buffer.from('small-image-content');

      await page.locator('#screenshot').setInputFiles({
        name: 'small-screenshot.png',
        mimeType: 'image/png',
        buffer: smallBuffer,
      });

      // Screenshot error should not be visible after selecting valid file
      await expect(page.locator('#screenshot-error')).toBeHidden();
    });
  });

  test.describe('Form Submission', () => {
    test('form has correct action URL for Netlify function', async ({ page }) => {
      const form = page.locator('#submission-form');
      await expect(form).toHaveAttribute('action', '/.netlify/functions/submit-form');
    });

    test('form has data-netlify attribute for backup', async ({ page }) => {
      const form = page.locator('#submission-form');
      const hasNetlify = await form.getAttribute('netlify');
      const hasDataNetlify = await form.getAttribute('data-netlify');

      // Should have either netlify or data-netlify attribute
      expect(hasNetlify !== null || hasDataNetlify !== null).toBe(true);
    });

    test('honeypot field exists for spam prevention', async ({ page }) => {
      const honeypot = page.locator('input[name="bot-field"]');
      await expect(honeypot).toBeAttached();
    });
  });

  test.describe('Consent Checkboxes (Story 4.2)', () => {
    test('public display consent checkbox is present and required', async ({ page }) => {
      const consentCheckbox = page.locator('#consent');
      await expect(consentCheckbox).toBeVisible();
      await expect(consentCheckbox).toHaveAttribute('required', '');
      await expect(consentCheckbox).toHaveAttribute('aria-required', 'true');
    });

    test('marketing checkbox is present and NOT checked by default', async ({ page }) => {
      const marketingCheckbox = page.locator('#marketing');
      await expect(marketingCheckbox).toBeVisible();
      await expect(marketingCheckbox).not.toBeChecked();
      await expect(marketingCheckbox).not.toHaveAttribute('required');
    });

    test('form submission fails without public display consent', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Fill all fields except consent
      await page.fill('#name', 'Test User');
      await page.fill('#email', 'test@example.com');
      await page.selectOption('#style', { index: 1 });
      await page.fill('#demoUrl', 'https://example.com');
      await page.fill('#authenticity', 'This is my authentic design explanation with more than fifty characters for the form.');

      // Set screenshot
      const buffer = Buffer.from('fake-image-content');
      await page.locator('#screenshot').setInputFiles({
        name: 'test.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      // Leave consent unchecked and submit
      await page.click('button[type="submit"]');

      await expect(page.locator('#consent-error')).toBeVisible();
      await expect(page.locator('#consent-error')).toContainText('consent to public display');
    });

    test('form submission succeeds with consent but without marketing', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Fill all required fields
      await page.fill('#name', 'Test User');
      await page.fill('#email', 'test@example.com');
      await page.selectOption('#style', { index: 1 });
      await page.fill('#demoUrl', 'https://example.com');
      await page.fill('#authenticity', 'This is my authentic design explanation with more than fifty characters for the form.');

      // Set screenshot
      const buffer = Buffer.from('fake-image-content');
      await page.locator('#screenshot').setInputFiles({
        name: 'test.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      // Check consent, leave marketing unchecked
      await page.check('#consent');

      // Verify marketing is unchecked
      await expect(page.locator('#marketing')).not.toBeChecked();

      // Submit should not show consent error
      await page.click('button[type="submit"]');
      await expect(page.locator('#consent-error')).toBeHidden();
    });

    test('both checkboxes have 44px minimum touch targets', async ({ page }) => {
      // Touch targets are on the label wrappers, not the checkbox inputs themselves
      const consentLabel = await page.locator('label[for="consent"]').boundingBox();
      const marketingLabel = await page.locator('label[for="marketing"]').boundingBox();

      // Label wrappers should have at least 44px height for touch accessibility
      expect(consentLabel?.height).toBeGreaterThanOrEqual(44);
      expect(marketingLabel?.height).toBeGreaterThanOrEqual(44);
    });

    test('consent checkbox has visual separation from marketing', async ({ page }) => {
      // Verify consent section exists with border-t
      const consentSection = page.locator('.border-t.border-neutral-200');
      await expect(consentSection).toBeVisible();
    });

    test('marketing checkbox shows (optional) indicator', async ({ page }) => {
      const marketingLabel = page.locator('label[for="marketing"]');
      await expect(marketingLabel).toContainText('optional');
    });

    test('focus moves to consent checkbox on validation error', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Fill all fields except consent
      await page.fill('#name', 'Test User');
      await page.fill('#email', 'test@example.com');
      await page.selectOption('#style', { index: 1 });
      await page.fill('#demoUrl', 'https://example.com');
      await page.fill('#authenticity', 'This is my authentic design explanation with more than fifty characters for the form.');

      // Set screenshot
      const buffer = Buffer.from('fake-image-content');
      await page.locator('#screenshot').setInputFiles({
        name: 'test.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      await page.click('button[type="submit"]');

      // Consent should be focused
      await expect(page.locator('#consent')).toBeFocused();
    });

    test('consent section has "Consent & Preferences" header', async ({ page }) => {
      const header = page.locator('.border-t.border-neutral-200 .text-sm.font-medium');
      await expect(header).toContainText('Consent & Preferences');
    });

    test('payload contains marketing: false when marketing unchecked (AC4)', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Intercept the form submission request
      let capturedPayload = null;
      await page.route('**/.netlify/functions/submit-form', async (route) => {
        const request = route.request();
        capturedPayload = JSON.parse(request.postData() || '{}');
        // Respond with success to complete the flow
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill all required fields
      await page.fill('#name', 'Test User');
      await page.fill('#email', 'test@example.com');
      await page.selectOption('#style', { index: 1 });
      await page.fill('#demoUrl', 'https://example.com');
      await page.fill('#authenticity', 'This is my authentic design explanation with more than fifty characters for the form.');

      // Set screenshot
      const buffer = Buffer.from('fake-image-content');
      await page.locator('#screenshot').setInputFiles({
        name: 'test.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      // Check consent, leave marketing unchecked
      await page.check('#consent');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for request to be intercepted
      await page.waitForTimeout(500);

      // Verify payload contains correct boolean values
      expect(capturedPayload).not.toBeNull();
      expect(capturedPayload.consent).toBe(true);
      expect(capturedPayload.marketing).toBe(false);
    });

    test('payload contains marketing: true when marketing checked (AC5)', async ({ page }) => {
      // Wait for validation script to load
      await page.waitForFunction(() => typeof window.validateSubmissionForm === 'function', { timeout: 5000 });

      // Intercept the form submission request
      let capturedPayload = null;
      await page.route('**/.netlify/functions/submit-form', async (route) => {
        const request = route.request();
        capturedPayload = JSON.parse(request.postData() || '{}');
        // Respond with success to complete the flow
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      });

      // Fill all required fields
      await page.fill('#name', 'Test User');
      await page.fill('#email', 'test@example.com');
      await page.selectOption('#style', { index: 1 });
      await page.fill('#demoUrl', 'https://example.com');
      await page.fill('#authenticity', 'This is my authentic design explanation with more than fifty characters for the form.');

      // Set screenshot
      const buffer = Buffer.from('fake-image-content');
      await page.locator('#screenshot').setInputFiles({
        name: 'test.png',
        mimeType: 'image/png',
        buffer: buffer,
      });

      // Check BOTH consent and marketing
      await page.check('#consent');
      await page.check('#marketing');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for request to be intercepted
      await page.waitForTimeout(500);

      // Verify payload contains correct boolean values
      expect(capturedPayload).not.toBeNull();
      expect(capturedPayload.consent).toBe(true);
      expect(capturedPayload.marketing).toBe(true);
    });
  });
});
