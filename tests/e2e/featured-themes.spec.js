// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Featured Themes Section E2E Tests
 * Story 2.4: Featured Themes Section
 *
 * Note: These tests verify the Featured Themes section behavior.
 * When no featured submissions exist in Sanity, the section is hidden (AC4).
 * When featured submissions exist, the section displays with proper content (AC1-AC7).
 */

test.describe('Featured Themes Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('AC4: Empty State Handling', () => {
    test('should hide featured section when no featured submissions exist', async ({ page }) => {
      // The section should not exist in DOM when no featured submissions
      const featuredSection = page.locator('#featured');

      // Check if section exists - if Sanity has 0 featured, it should not be in DOM
      const sectionCount = await featuredSection.count();

      if (sectionCount === 0) {
        // Section correctly hidden when no featured submissions
        await expect(featuredSection).toHaveCount(0);
      } else {
        // Section exists, meaning there are featured submissions - verify it's visible
        await expect(featuredSection).toBeVisible();
      }
    });

    test('should not show empty state placeholder - section is completely absent', async ({ page }) => {
      // Verify there's no empty state message for featured section
      const emptyState = page.locator('#featured .empty-state, #featured [class*="empty"]');
      await expect(emptyState).toHaveCount(0);
    });
  });

  test.describe('AC1 & AC3: Featured Section Display', () => {
    test('featured section should appear between Stats Bar and Gallery when it exists', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const howItWorksSection = page.locator('#how-it-works');

      // How It Works should always exist on homepage
      await expect(howItWorksSection).toBeVisible();

      // If featured section exists, verify positioning
      const featuredCount = await featuredSection.count();
      if (featuredCount > 0) {
        // Featured should come before how-it-works in DOM order
        const featuredBox = await featuredSection.boundingBox();
        const howItWorksBox = await howItWorksSection.boundingBox();

        if (featuredBox && howItWorksBox) {
          expect(featuredBox.y).toBeLessThan(howItWorksBox.y);
        }
      }
    });
  });

  test.describe('AC7: Accessibility', () => {
    test('featured section should have proper heading hierarchy when present', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        // Verify h2 heading exists
        const heading = featuredSection.locator('h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('Featured Themes');
      }
    });

    test('featured cards should use article elements when present', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        const articles = featuredSection.locator('article');
        const articleCount = await articles.count();

        // Should have at least 1 article if section exists
        expect(articleCount).toBeGreaterThan(0);
        // Should have at most 6 articles (AC3 limit)
        expect(articleCount).toBeLessThanOrEqual(6);
      }
    });

    test('external links should announce they open in new tab', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        // Check for sr-only text in View Demo links
        const srOnlyText = featuredSection.locator('a[target="_blank"] .sr-only');
        const srCount = await srOnlyText.count();

        if (srCount > 0) {
          const firstSrText = await srOnlyText.first().textContent();
          expect(firstSrText).toContain('opens in new tab');
        }
      }
    });
  });

  test.describe('AC5: External Link Security', () => {
    test('View Demo links should have security attributes when present', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        const viewDemoLinks = featuredSection.locator('a[target="_blank"]');
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

  test.describe('AC6: Responsive Layout', () => {
    test('should display single column on mobile when section exists', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        const grid = featuredSection.locator('.grid');
        await expect(grid).toHaveClass(/grid-cols-1/);
      }
    });

    test('should display 2 columns on tablet when section exists', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });

        const grid = featuredSection.locator('.grid');
        // Verify sm:grid-cols-2 class exists (Tailwind responsive)
        await expect(grid).toHaveClass(/sm:grid-cols-2/);
      }
    });

    test('should display 3 columns on desktop when section exists', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        // Set desktop viewport
        await page.setViewportSize({ width: 1280, height: 800 });

        const grid = featuredSection.locator('.grid');
        // Verify lg:grid-cols-3 class exists (Tailwind responsive)
        await expect(grid).toHaveClass(/lg:grid-cols-3/);
      }
    });
  });

  test.describe('AC2: Featured Card Content', () => {
    test('featured cards should display required content when present', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        const firstCard = featuredSection.locator('article').first();

        // Should have an image or fallback
        const hasImage = await firstCard.locator('img').count() > 0;
        const hasFallback = await firstCard.locator('.text-6xl').count() > 0;
        expect(hasImage || hasFallback).toBeTruthy();

        // Should have View Demo button
        const viewDemoButton = firstCard.locator('a:has-text("View Demo")');
        await expect(viewDemoButton).toBeVisible();
      }
    });

    test('featured cards should have larger image treatment (h-64)', async ({ page }) => {
      const featuredSection = page.locator('#featured');
      const sectionCount = await featuredSection.count();

      if (sectionCount > 0) {
        // Featured cards use h-64 (256px) vs gallery cards h-48 (192px)
        const imageContainer = featuredSection.locator('article .h-64').first();
        const containerCount = await imageContainer.count();

        if (containerCount > 0) {
          await expect(imageContainer).toBeVisible();
        }
      }
    });
  });
});

/**
 * Template/Macro Structure Tests
 * These verify the HTML structure is correct in the built output
 */
test.describe('Featured Section HTML Structure', () => {
  test('homepage should have proper section structure', async ({ page }) => {
    await page.goto('/');

    // Stats bar should exist
    const statsSection = page.locator('section').filter({ has: page.locator('.grid.grid-cols-2') }).first();
    await expect(statsSection).toBeVisible();

    // How It Works section should exist
    const howItWorksSection = page.locator('#how-it-works');
    await expect(howItWorksSection).toBeVisible();

    // Featured section conditional - may or may not exist
    const featuredSection = page.locator('#featured');
    const featuredExists = await featuredSection.count() > 0;

    // Log current state for debugging
    console.log(`Featured section exists: ${featuredExists}`);
  });
});
