// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Gallery Filtering E2E Tests
 * Story 2.3: Gallery Filtering by Design Style Category
 */

test.describe('Gallery Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('AC1: Filter Buttons Display', () => {
    test('should display filter buttons container', async ({ page }) => {
      const filterNav = page.locator('#filter-buttons');
      await expect(filterNav).toBeVisible();
      await expect(filterNav).toHaveAttribute('role', 'group');
      await expect(filterNav).toHaveAttribute('aria-label', 'Filter gallery by design style category');
    });

    test('should display "All Styles" button as first option', async ({ page }) => {
      const allButton = page.locator('.filter-btn[data-filter="all"]');
      await expect(allButton).toBeVisible();
      await expect(allButton).toHaveText('All Styles');
    });

    test('should have "All Styles" selected by default', async ({ page }) => {
      const allButton = page.locator('.filter-btn[data-filter="all"]');
      await expect(allButton).toHaveAttribute('aria-pressed', 'true');
      await expect(allButton).toHaveClass(/bg-black/);
      await expect(allButton).toHaveClass(/text-white/);
    });

    test('should display all 7 category filter buttons', async ({ page }) => {
      const categories = [
        'all',
        'art-movements',
        'digital',
        'expressive',
        'minimalist',
        'modernism',
        'postmodern',
        'retro'
      ];

      for (const category of categories) {
        const button = page.locator(`.filter-btn[data-filter="${category}"]`);
        await expect(button).toBeVisible();
      }
    });

    test('category buttons should have correct labels', async ({ page }) => {
      const expectedLabels = {
        'art-movements': 'Art Movements',
        'digital': 'Digital',
        'expressive': 'Expressive',
        'minimalist': 'Minimalist',
        'modernism': 'Modernism',
        'postmodern': 'Postmodern',
        'retro': 'Retro'
      };

      for (const [filter, label] of Object.entries(expectedLabels)) {
        const button = page.locator(`.filter-btn[data-filter="${filter}"]`);
        await expect(button).toHaveText(label);
      }
    });
  });

  test.describe('AC2: Filter Application', () => {
    test('should filter cards when clicking a category', async ({ page }) => {
      // Click on "Digital" filter
      await page.click('.filter-btn[data-filter="digital"]');

      // Get all visible gallery cards
      const visibleCards = page.locator('.gallery-card:visible');
      const allCards = page.locator('.gallery-card');

      // Should have fewer visible cards than total
      const visibleCount = await visibleCards.count();
      const totalCount = await allCards.count();

      expect(visibleCount).toBeLessThan(totalCount);
      expect(visibleCount).toBeGreaterThan(0);

      // All visible cards should have digital category
      const digitalCards = page.locator('.gallery-card[data-category="digital"]:visible');
      await expect(digitalCards).toHaveCount(visibleCount);
    });

    test('should highlight active filter button', async ({ page }) => {
      const digitalButton = page.locator('.filter-btn[data-filter="digital"]');
      const allButton = page.locator('.filter-btn[data-filter="all"]');

      // Click digital filter
      await digitalButton.click();

      // Digital should be active
      await expect(digitalButton).toHaveAttribute('aria-pressed', 'true');
      await expect(digitalButton).toHaveClass(/bg-black/);

      // All should be inactive
      await expect(allButton).toHaveAttribute('aria-pressed', 'false');
      await expect(allButton).toHaveClass(/bg-white/);
    });

    test('should update URL with category parameter', async ({ page }) => {
      await page.click('.filter-btn[data-filter="modernism"]');

      await expect(page).toHaveURL(/\?category=modernism/);
    });
  });

  test.describe('AC3: Clear Filter', () => {
    test('should show all cards when clicking "All"', async ({ page }) => {
      // First apply a filter
      await page.click('.filter-btn[data-filter="digital"]');

      // Then click All
      await page.click('.filter-btn[data-filter="all"]');

      // All cards should be visible
      const hiddenCards = page.locator('.gallery-card[style*="display: none"]');
      await expect(hiddenCards).toHaveCount(0);
    });

    test('should remove URL parameter when clicking "All"', async ({ page }) => {
      // Apply filter first
      await page.click('.filter-btn[data-filter="retro"]');
      await expect(page).toHaveURL(/\?category=retro/);

      // Click All
      await page.click('.filter-btn[data-filter="all"]');

      // URL should not have category parameter
      await expect(page).not.toHaveURL(/\?category=/);
    });
  });

  test.describe('AC4: URL-Based Filter State', () => {
    test('should pre-apply filter from URL parameter', async ({ page }) => {
      await page.goto('/?category=minimalist');

      // Minimalist button should be active
      const minimalistButton = page.locator('.filter-btn[data-filter="minimalist"]');
      await expect(minimalistButton).toHaveAttribute('aria-pressed', 'true');

      // Only minimalist cards should be visible
      const visibleCards = page.locator('.gallery-card:visible');
      const minimalistCards = page.locator('.gallery-card[data-category="minimalist"]:visible');

      const visibleCount = await visibleCards.count();
      const minimalistCount = await minimalistCards.count();

      expect(visibleCount).toBe(minimalistCount);
    });

    test('should handle browser back/forward navigation', async ({ page }) => {
      // Start at home
      await page.goto('/');

      // Apply first filter
      await page.click('.filter-btn[data-filter="digital"]');
      await expect(page).toHaveURL(/\?category=digital/);

      // Apply second filter
      await page.click('.filter-btn[data-filter="retro"]');
      await expect(page).toHaveURL(/\?category=retro/);

      // Go back
      await page.goBack();
      await expect(page).toHaveURL(/\?category=digital/);

      // Digital button should be active
      const digitalButton = page.locator('.filter-btn[data-filter="digital"]');
      await expect(digitalButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('AC5: Responsive Filter Layout', () => {
    test('filter container should be horizontally scrollable on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const filterNav = page.locator('#filter-buttons');
      await expect(filterNav).toHaveClass(/overflow-x-auto/);
    });

    test('filter buttons should not wrap on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const buttons = page.locator('.filter-btn');
      const firstButton = buttons.first();

      await expect(firstButton).toHaveClass(/whitespace-nowrap/);
    });
  });

  test.describe('AC6: Graceful Degradation', () => {
    test('should show all cards when page loads (before JS)', async ({ page }) => {
      // Disable JavaScript
      await page.route('**/*.js', route => route.abort());

      await page.goto('/');

      // All gallery cards should be visible (none hidden)
      const cards = page.locator('.gallery-card');
      const count = await cards.count();

      expect(count).toBeGreaterThan(0);

      // No cards should have display:none
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        await expect(card).toBeVisible();
      }
    });
  });

  test.describe('AC7: Accessibility', () => {
    test('filter buttons should be keyboard focusable', async ({ page }) => {
      const filterNav = page.locator('#filter-buttons');
      const firstButton = filterNav.locator('.filter-btn').first();

      // Tab to filter buttons
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Skip nav link

      // Should be able to focus on filter buttons
      await firstButton.focus();
      await expect(firstButton).toBeFocused();
    });

    test('filter buttons should be activatable via Enter', async ({ page }) => {
      const digitalButton = page.locator('.filter-btn[data-filter="digital"]');

      await digitalButton.focus();
      await page.keyboard.press('Enter');

      await expect(digitalButton).toHaveAttribute('aria-pressed', 'true');
      await expect(page).toHaveURL(/\?category=digital/);
    });

    test('filter buttons should be activatable via Space', async ({ page }) => {
      const retroButton = page.locator('.filter-btn[data-filter="retro"]');

      await retroButton.focus();
      await page.keyboard.press('Space');

      await expect(retroButton).toHaveAttribute('aria-pressed', 'true');
    });

    test('should have aria-pressed attribute on all filter buttons', async ({ page }) => {
      const buttons = page.locator('.filter-btn');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const button = buttons.nth(i);
        const ariaPressed = await button.getAttribute('aria-pressed');
        expect(['true', 'false']).toContain(ariaPressed);
      }
    });
  });

  test.describe('Category Counts', () => {
    test('should have correct number of styles per category', async ({ page }) => {
      const expectedCounts = {
        'digital': 8,
        'modernism': 6,
        'retro': 5,
        'minimalist': 5,
        'postmodern': 4,
        'art-movements': 3,
        'expressive': 3
      };

      for (const [category, expectedCount] of Object.entries(expectedCounts)) {
        const cards = page.locator(`.gallery-card[data-category="${category}"]`);
        await expect(cards).toHaveCount(expectedCount);
      }
    });

    test('should have 34 total design styles', async ({ page }) => {
      const allCards = page.locator('.gallery-card');
      await expect(allCards).toHaveCount(34);
    });
  });
});
