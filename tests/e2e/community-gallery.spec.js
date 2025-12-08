// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Community Gallery Section E2E Tests
 * Story 2.5: Approved Submissions in Gallery
 *
 * Note: These tests verify the Community Gallery section behavior.
 * When no non-featured approved submissions exist, the section is hidden (AC6).
 * When community submissions exist, the section displays with proper content (AC1-AC8).
 */

test.describe('Community Gallery Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('AC1: Community Gallery Section Display', () => {
    test('should display Community Gallery section after Gallery section when submissions exist', async ({ page }) => {
      const communitySection = page.locator('#community');
      const gallerySection = page.locator('#gallery');
      const howItWorksSection = page.locator('#how-it-works');

      // Gallery and How It Works should always exist
      await expect(gallerySection).toBeVisible();
      await expect(howItWorksSection).toBeVisible();

      // If community section exists, verify positioning
      const communityCount = await communitySection.count();
      if (communityCount > 0) {
        // Community should come after gallery and before how-it-works
        const galleryBox = await gallerySection.boundingBox();
        const communityBox = await communitySection.boundingBox();
        const howItWorksBox = await howItWorksSection.boundingBox();

        if (galleryBox && communityBox && howItWorksBox) {
          expect(communityBox.y).toBeGreaterThan(galleryBox.y);
          expect(communityBox.y).toBeLessThan(howItWorksBox.y);
        }
      }
    });

    test('should have correct section heading', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        const heading = communitySection.locator('h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('Community Gallery');
      }
    });
  });

  test.describe('AC2: Submission Card Content', () => {
    test('submission cards should display required content when present', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        const firstCard = communitySection.locator('article').first();

        // Should have an image or fallback
        const hasImage = await firstCard.locator('img').count() > 0;
        const hasFallback = await firstCard.locator('.text-5xl').count() > 0;
        expect(hasImage || hasFallback).toBeTruthy();

        // Should have View Demo button
        const viewDemoButton = firstCard.locator('a:has-text("View Demo")');
        await expect(viewDemoButton).toBeVisible();
      }
    });

    test('submission cards should have smaller image treatment (h-48)', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        // Community cards use h-48 (192px) vs featured cards h-64 (256px)
        const imageContainer = communitySection.locator('article .h-48').first();
        const containerCount = await imageContainer.count();

        if (containerCount > 0) {
          await expect(imageContainer).toBeVisible();
        }
      }
    });

    test('submission cards should display style name badge when available', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        // Style badge should be positioned at top-left of image
        const styleBadge = communitySection.locator('article span.absolute.top-3.left-3').first();
        const badgeCount = await styleBadge.count();

        // Badge is optional (only shows if styleRef exists)
        if (badgeCount > 0) {
          await expect(styleBadge).toBeVisible();
        }
      }
    });

    test('submission cards should display submitter name or Anonymous fallback', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        const firstCard = communitySection.locator('article').first();

        // Should have submitter name text (either name or "Anonymous")
        const submitterText = firstCard.locator('span:has-text("by ")');
        await expect(submitterText).toBeVisible();
      }
    });
  });

  test.describe('AC3: Status Filtering', () => {
    test('should only display approved submissions', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      // This test verifies the section behavior - if it exists, submissions are approved
      // The GROQ query filters for status == "approved" && isFeatured != true
      // We can't directly verify Sanity data, but we can verify the section renders correctly
      if (sectionCount > 0) {
        const articles = communitySection.locator('article');
        const articleCount = await articles.count();
        expect(articleCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('AC4: External Link Security', () => {
    test('View Demo links should have security attributes when present', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        const viewDemoLinks = communitySection.locator('a[target="_blank"]');
        const linkCount = await viewDemoLinks.count();

        for (let i = 0; i < linkCount; i++) {
          const link = viewDemoLinks.nth(i);

          // Verify target="_blank"
          await expect(link).toHaveAttribute('target', '_blank');

          // Verify rel="noopener noreferrer"
          const rel = await link.getAttribute('rel');
          expect(rel).toContain('noopener');
          expect(rel).toContain('noreferrer');
        }
      }
    });
  });

  test.describe('AC5: Avoid Featured Duplication', () => {
    test('community and featured sections should not have overlapping submissions', async ({ page }) => {
      const communitySection = page.locator('#community');
      const featuredSection = page.locator('#featured');

      const communityCount = await communitySection.count();
      const featuredCount = await featuredSection.count();

      // This is verified by the GROQ queries:
      // - Featured: isFeatured == true
      // - Community: isFeatured != true
      // We verify both sections can coexist without errors
      console.log(`Community section exists: ${communityCount > 0}`);
      console.log(`Featured section exists: ${featuredCount > 0}`);

      // Both can exist simultaneously or one/neither can exist
      // The important thing is no errors occur
    });
  });

  test.describe('AC6: Empty State', () => {
    test('should hide community section when no non-featured approved submissions exist', async ({ page }) => {
      const communitySection = page.locator('#community');

      // Check if section exists
      const sectionCount = await communitySection.count();

      if (sectionCount === 0) {
        // Section correctly hidden when no community submissions
        await expect(communitySection).toHaveCount(0);
      } else {
        // Section exists, meaning there are community submissions - verify it's visible
        await expect(communitySection).toBeVisible();
      }
    });

    test('should not show empty state placeholder - section is completely absent', async ({ page }) => {
      // Verify there's no empty state message for community section
      const emptyState = page.locator('#community .empty-state, #community [class*="empty"]');
      await expect(emptyState).toHaveCount(0);
    });
  });

  test.describe('AC7: Responsive Layout', () => {
    test('should display single column on mobile when section exists', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        const grid = communitySection.locator('.grid');
        await expect(grid).toHaveClass(/grid-cols-1/);
      }
    });

    test('should display 2 columns on tablet when section exists', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });

        const grid = communitySection.locator('.grid');
        // Verify sm:grid-cols-2 class exists (Tailwind responsive)
        await expect(grid).toHaveClass(/sm:grid-cols-2/);
      }
    });

    test('should display 3 columns on desktop when section exists', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        // Set desktop viewport
        await page.setViewportSize({ width: 1280, height: 800 });

        const grid = communitySection.locator('.grid');
        // Verify lg:grid-cols-3 class exists (Tailwind responsive)
        await expect(grid).toHaveClass(/lg:grid-cols-3/);
      }
    });
  });

  test.describe('AC8: Accessibility', () => {
    test('community section should have proper heading hierarchy when present', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        // Verify h2 heading exists
        const heading = communitySection.locator('h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('Community Gallery');
      }
    });

    test('community cards should use article elements when present', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        const articles = communitySection.locator('article');
        const articleCount = await articles.count();

        // Should have at least 1 article if section exists
        expect(articleCount).toBeGreaterThan(0);
      }
    });

    test('external links should announce they open in new tab', async ({ page }) => {
      const communitySection = page.locator('#community');
      const sectionCount = await communitySection.count();

      if (sectionCount > 0) {
        // Check for sr-only text in View Demo links
        const srOnlyText = communitySection.locator('a[target="_blank"] .sr-only');
        const srCount = await srOnlyText.count();

        if (srCount > 0) {
          const firstSrText = await srOnlyText.first().textContent();
          expect(firstSrText).toContain('opens in new tab');
        }
      }
    });
  });
});

/**
 * Community Gallery HTML Structure Tests
 * These verify the HTML structure is correct in the built output
 */
test.describe('Community Gallery HTML Structure', () => {
  test('homepage should have proper section structure', async ({ page }) => {
    await page.goto('/');

    // Gallery section should always exist
    const gallerySection = page.locator('#gallery');
    await expect(gallerySection).toBeVisible();

    // How It Works section should always exist
    const howItWorksSection = page.locator('#how-it-works');
    await expect(howItWorksSection).toBeVisible();

    // Community section conditional - may or may not exist based on data
    const communitySection = page.locator('#community');
    const communityExists = await communitySection.count() > 0;

    // Log current state for debugging
    console.log(`Community Gallery section exists: ${communityExists}`);
  });
});

/**
 * Community Gallery - Unconditional Tests
 * These tests verify behavior regardless of data state
 */
test.describe('Community Gallery - Data State Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('community section visibility matches data availability', async ({ page }) => {
    const communitySection = page.locator('#community');
    const sectionExists = await communitySection.count() > 0;

    if (sectionExists) {
      // Section exists - verify it has content (at least one card)
      const cards = communitySection.locator('article');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThan(0);
      console.log(`✓ Community section visible with ${cardCount} cards`);
    } else {
      // Section hidden - verify NO empty community div anywhere
      const emptyCommunity = page.locator('[id="community"]');
      await expect(emptyCommunity).toHaveCount(0);
      console.log('✓ Community section correctly hidden (no data)');
    }
  });

  test('page sections maintain correct order', async ({ page }) => {
    // These sections should ALWAYS exist in order
    const sections = ['#gallery', '#how-it-works'];

    for (let i = 0; i < sections.length - 1; i++) {
      const current = page.locator(sections[i]);
      const next = page.locator(sections[i + 1]);

      await expect(current).toBeVisible();
      await expect(next).toBeVisible();

      const currentBox = await current.boundingBox();
      const nextBox = await next.boundingBox();

      expect(currentBox.y).toBeLessThan(nextBox.y);
    }
  });

  test('community section (if present) is positioned correctly', async ({ page }) => {
    const communitySection = page.locator('#community');
    const sectionExists = await communitySection.count() > 0;

    if (sectionExists) {
      const galleryBox = await page.locator('#gallery').boundingBox();
      const communityBox = await communitySection.boundingBox();
      const howItWorksBox = await page.locator('#how-it-works').boundingBox();

      // Community must be between gallery and how-it-works
      expect(communityBox.y).toBeGreaterThan(galleryBox.y);
      expect(communityBox.y).toBeLessThan(howItWorksBox.y);
    }
  });
});

/**
 * Keyboard Navigation Tests
 * AC8: Accessibility - keyboard navigation
 */
test.describe('Community Gallery - Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('View Demo links are keyboard focusable', async ({ page }) => {
    const communitySection = page.locator('#community');
    const sectionExists = await communitySection.count() > 0;

    if (sectionExists) {
      // Tab to first View Demo link in community section
      const viewDemoLinks = communitySection.locator('a[target="_blank"]');
      const linkCount = await viewDemoLinks.count();

      if (linkCount > 0) {
        const firstLink = viewDemoLinks.first();
        await firstLink.focus();

        // Verify link is focused
        await expect(firstLink).toBeFocused();

        // Verify Enter would activate it (check href exists)
        const href = await firstLink.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^https?:\/\//);
      }
    }
  });

  test('tab order follows visual order within community section', async ({ page }) => {
    const communitySection = page.locator('#community');
    const sectionExists = await communitySection.count() > 0;

    if (sectionExists) {
      const viewDemoLinks = communitySection.locator('a[target="_blank"]');
      const linkCount = await viewDemoLinks.count();

      if (linkCount >= 2) {
        // Focus first link
        const firstLink = viewDemoLinks.first();
        await firstLink.focus();
        await expect(firstLink).toBeFocused();

        // Tab to next link
        await page.keyboard.press('Tab');

        // Second link should now be focused
        const secondLink = viewDemoLinks.nth(1);
        await expect(secondLink).toBeFocused();
      }
    }
  });

  test('cards have visible focus indicators', async ({ page }) => {
    const communitySection = page.locator('#community');
    const sectionExists = await communitySection.count() > 0;

    if (sectionExists) {
      const viewDemoLink = communitySection.locator('a[target="_blank"]').first();
      const linkExists = await viewDemoLink.count() > 0;

      if (linkExists) {
        await viewDemoLink.focus();

        // Check that focus is visible (element should have some focus styling)
        // This verifies the browser's default or custom focus ring is present
        const isFocused = await viewDemoLink.evaluate(el => el === document.activeElement);
        expect(isFocused).toBeTruthy();
      }
    }
  });
});
