// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Responsive Layout E2E Tests
 * Story 2.6: Responsive Mobile Experience
 */

test.describe('Responsive Layout', () => {
  test.describe('Mobile (375px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should show hamburger menu', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#mobile-menu-button')).toBeVisible();
      await expect(page.locator('.hidden.md\\:flex')).not.toBeVisible();
    });

    test('should open mobile menu on click', async ({ page }) => {
      await page.goto('/');
      await page.click('#mobile-menu-button');
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await expect(page.locator('#mobile-menu-button')).toHaveAttribute('aria-expanded', 'true');
    });

    test('should close mobile menu on second click', async ({ page }) => {
      await page.goto('/');
      await page.click('#mobile-menu-button');
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page.click('#mobile-menu-button');
      await expect(page.locator('#mobile-menu')).toBeHidden();
      await expect(page.locator('#mobile-menu-button')).toHaveAttribute('aria-expanded', 'false');
    });

    test('should close mobile menu on Escape key', async ({ page }) => {
      await page.goto('/');
      await page.click('#mobile-menu-button');
      await expect(page.locator('#mobile-menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#mobile-menu')).toBeHidden();
    });

    test('should show single column gallery', async ({ page }) => {
      await page.goto('/');
      const cards = await page.locator('#gallery .gallery-card').all();
      if (cards.length > 1) {
        const firstBox = await cards[0].boundingBox();
        const secondBox = await cards[1].boundingBox();
        // Cards should stack vertically (second card below first)
        expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10);
      }
    });

    test('should have scrollable filter buttons', async ({ page }) => {
      await page.goto('/');
      const filterNav = page.locator('#filter-buttons');
      await expect(filterNav).toHaveCSS('overflow-x', 'auto');
    });

    test('should show 2x2 stats grid', async ({ page }) => {
      await page.goto('/');
      const statsGrid = page.locator('section.border-b-2 .container-custom > .grid');
      await expect(statsGrid).toHaveClass(/grid-cols-2/);
    });

    test('hero CTA buttons should stack vertically', async ({ page }) => {
      await page.goto('/');
      const ctaContainer = page.locator('section.bg-black .flex.flex-col');
      await expect(ctaContainer).toBeVisible();

      const buttons = await ctaContainer.locator('a.btn').all();
      if (buttons.length >= 2) {
        const firstBox = await buttons[0].boundingBox();
        const secondBox = await buttons[1].boundingBox();
        // Second button should be below first (stacked vertically)
        expect(secondBox.y).toBeGreaterThan(firstBox.y);
      }
    });
  });

  test.describe('Tablet (768px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
    });

    test('should show desktop navigation', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#mobile-menu-button')).not.toBeVisible();
      await expect(page.locator('.hidden.md\\:flex')).toBeVisible();
    });

    test('should show 2-column gallery', async ({ page }) => {
      await page.goto('/');
      const cards = await page.locator('#gallery .gallery-card').all();
      if (cards.length >= 2) {
        const firstBox = await cards[0].boundingBox();
        const secondBox = await cards[1].boundingBox();
        // At 768px (>640px sm breakpoint), cards should be side by side
        expect(Math.abs(secondBox.y - firstBox.y)).toBeLessThan(10);
      }
    });
  });

  test.describe('Desktop (1280px)', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    test('should show 3-column gallery', async ({ page }) => {
      await page.goto('/');
      const cards = await page.locator('#gallery .gallery-card').all();
      if (cards.length >= 3) {
        const firstBox = await cards[0].boundingBox();
        const secondBox = await cards[1].boundingBox();
        const thirdBox = await cards[2].boundingBox();
        // At 1280px (>1024px lg breakpoint), first 3 cards should be on same row
        expect(Math.abs(secondBox.y - firstBox.y)).toBeLessThan(10);
        expect(Math.abs(thirdBox.y - firstBox.y)).toBeLessThan(10);
      }
    });

    test('should wrap filter buttons', async ({ page }) => {
      await page.goto('/');
      const filterNav = page.locator('#filter-buttons');
      await expect(filterNav).toHaveClass(/md:flex-wrap/);
    });

    test('should show 4-column stats grid', async ({ page }) => {
      await page.goto('/');
      // Stats bar is the section right after hero, with border-b-2 and grid-cols-2 lg:grid-cols-4
      const statsGrid = page.locator('section.border-b-2 > .container-custom.grid');
      await expect(statsGrid).toHaveClass(/lg:grid-cols-4/);
    });
  });
});

test.describe('Touch Targets', () => {
  test('should have minimum 44px touch target for mobile menu button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const menuButton = page.locator('#mobile-menu-button');
    const box = await menuButton.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  });

  test('should have minimum 44px touch targets for filter buttons', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const filterButtons = page.locator('.filter-btn');
    const count = await filterButtons.count();
    for (let i = 0; i < count; i++) {
      const box = await filterButtons.nth(i).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('should have minimum 44px touch targets for CTA buttons', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    // Hero CTA buttons - scroll to them if needed
    const ctaButton = page.locator('section.bg-black a.btn-primary').first();
    await ctaButton.scrollIntoViewIfNeeded();
    const box = await ctaButton.boundingBox();
    expect(box).not.toBeNull();
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test('should have minimum 44px touch targets for mobile menu links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('#mobile-menu-button');
    const menuLinks = page.locator('#mobile-menu a');
    const count = await menuLinks.count();
    for (let i = 0; i < count; i++) {
      const box = await menuLinks.nth(i).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Image Lazy Loading', () => {
  test('should have lazy loading on gallery card images', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('.gallery-card img, article.card img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const loading = await images.nth(i).getAttribute('loading');
      expect(loading).toBe('lazy');
    }
  });

  test('should use Sanity CDN with width parameter', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('.gallery-card img, article.card img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      if (src && src.includes('sanity.io')) {
        expect(src).toContain('?w=');
      }
    }
  });
});

test.describe('Accessibility', () => {
  test('should have working skip link', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const skipLink = page.locator('.skip-link');
    await skipLink.focus();
    await expect(skipLink).toBeVisible();
  });

  test('should trap focus within mobile menu when open (forward Tab)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('#mobile-menu-button');

    // First link should be focused after opening
    const firstLink = page.locator('#mobile-menu a').first();
    await expect(firstLink).toBeFocused();

    // Tab through all menu items
    const menuLinks = await page.locator('#mobile-menu a').all();
    for (let i = 0; i < menuLinks.length - 1; i++) {
      await page.keyboard.press('Tab');
    }

    // Last link should now be focused
    const lastLink = page.locator('#mobile-menu a').last();
    await expect(lastLink).toBeFocused();

    // Tab again should wrap to first link (focus trap)
    await page.keyboard.press('Tab');
    await expect(firstLink).toBeFocused();
  });

  test('should trap focus within mobile menu when open (Shift+Tab)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('#mobile-menu-button');

    // First link should be focused after opening
    const firstLink = page.locator('#mobile-menu a').first();
    await expect(firstLink).toBeFocused();

    // Shift+Tab from first link should wrap to last link
    const lastLink = page.locator('#mobile-menu a').last();
    await page.keyboard.press('Shift+Tab');
    await expect(lastLink).toBeFocused();

    // Shift+Tab again should go to second-to-last, etc.
    await page.keyboard.press('Shift+Tab');
    const secondToLastLink = page.locator('#mobile-menu a').nth(-2);
    await expect(secondToLastLink).toBeFocused();
  });

  test('should return focus to menu button when closing menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.click('#mobile-menu-button');
    await expect(page.locator('#mobile-menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page.locator('#mobile-menu-button')).toBeFocused();
  });

  test('should have correct aria-expanded state', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuButton = page.locator('#mobile-menu-button');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('No Horizontal Overflow', () => {
  test('should have no significant horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that html/body don't have horizontal scrollbar
    const htmlOverflow = await page.locator('html').evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        overflowX: style.overflowX
      };
    });

    // Allow small tolerance (up to 50px) for minor overflow from scrollable containers
    // The main concern is that the page isn't significantly wider than viewport
    const tolerance = 50;
    expect(htmlOverflow.scrollWidth).toBeLessThanOrEqual(htmlOverflow.clientWidth + tolerance);
  });
});
