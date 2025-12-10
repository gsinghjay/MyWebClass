// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for MyWebClass E2E tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Wait for network to be idle before considering navigation complete
    // This ensures CSS and JS are fully loaded before tests run
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run local dev server before starting tests */
  webServer: {
    command: process.env.CI 
      ? 'npx http-server public -p 8080 -c-1'  // Just serve static files in CI
      : 'npm run build && npx @11ty/eleventy --serve --port=8080',  // Build and watch locally
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
