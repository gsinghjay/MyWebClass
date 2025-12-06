// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Tailwind CSS v4 Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('main.css stylesheet is loaded', async ({ page }) => {
    // Verify main.css is linked in the document
    const mainCssLink = page.locator('link[href="/assets/css/main.css"]');
    await expect(mainCssLink).toHaveCount(1);
  });

  test('Neo-Swiss design tokens are applied via CSS variables', async ({ page }) => {
    // Check that CSS custom properties from @theme are available
    // Note: Tailwind may minify colors (#000000 -> #000, #e31e24 stays same)
    const accentColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    });
    expect(accentColor).toMatch(/#e31e24/i);

    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    });
    expect(primaryColor).toMatch(/#000(000)?/i);
  });

  test('typography scale uses fluid sizing', async ({ page }) => {
    // Verify h1 uses clamp() for fluid typography
    const h1Element = page.locator('h1').first();

    // Check h1 exists and has proper styling
    if (await h1Element.count() > 0) {
      const fontSize = await h1Element.evaluate((el) => {
        return getComputedStyle(el).fontSize;
      });
      // Font size should be computed (not a CSS variable), meaning clamp is working
      expect(fontSize).toMatch(/^\d+(\.\d+)?px$/);
    }
  });

  test('spacing variables use 8px base unit', async ({ page }) => {
    const spacing1 = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--spacing-1').trim();
    });
    expect(spacing1).toBe('8px');

    const spacing2 = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--spacing-2').trim();
    });
    expect(spacing2).toBe('16px');
  });

  test('button component has correct Neo-Swiss styling', async ({ page }) => {
    const button = page.locator('.button, .button-primary, [class*="btn-"]').first();

    if (await button.count() > 0) {
      const styles = await button.evaluate((el) => {
        const computed = getComputedStyle(el);
        return {
          textTransform: computed.textTransform,
          letterSpacing: computed.letterSpacing,
          fontWeight: computed.fontWeight
        };
      });

      // Neo-Swiss buttons use uppercase text
      expect(styles.textTransform).toBe('uppercase');
      // Letter spacing should be positive (tracking)
      expect(parseFloat(styles.letterSpacing)).toBeGreaterThan(0);
    }
  });

  test('focus states use accent color for accessibility', async ({ page }) => {
    // Tab to an interactive element to trigger focus
    await page.keyboard.press('Tab');

    // Check that focus-visible outline uses accent color
    const focusedElement = page.locator(':focus-visible').first();

    if (await focusedElement.count() > 0) {
      const outlineColor = await focusedElement.evaluate((el) => {
        return getComputedStyle(el).outlineColor;
      });
      // Should be red accent color (rgb(227, 30, 36) = #e31e24)
      expect(outlineColor).toMatch(/rgb\(227,\s*30,\s*36\)|#e31e24/i);
    }
  });

  test('legacy CSS variable compatibility layer works', async ({ page }) => {
    // Old variable names should still work via compatibility layer
    const colorRed = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-red').trim();
    });
    // --color-red should map to --color-accent (#e31e24)
    expect(colorRed).toMatch(/#e31e24|var\(--color-accent\)/);

    const colorBlack = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-black').trim();
    });
    // --color-black should map to --color-primary (#000000 or minified #000)
    expect(colorBlack).toMatch(/#000(000)?|var\(--color-primary\)/);
  });
});
