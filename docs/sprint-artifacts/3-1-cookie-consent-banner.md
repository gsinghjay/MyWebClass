# Story 3.1: Cookie Consent Banner

Status: done

## Story

As a **visitor**,
I want **to accept or reject cookie consent for analytics tracking**,
So that **I have control over my privacy and data collection**.

## Acceptance Criteria

### AC1: Banner Display for First-Time Visitors
**Given** I visit the site for the first time
**When** the page loads
**Then** I see a cookie consent banner at the bottom of the screen
**And** the banner displays:
- Clear explanation of cookie usage
- "Accept All" button (accepts all cookies)
- "Reject All" button (rejects non-essential cookies)
- "Preferences" link/button (opens detailed settings)
- Link to Cookie Policy page

### AC2: Accept Functionality
**Given** I click "Accept All"
**When** consent is recorded
**Then** the banner disappears with smooth transition
**And** my preference is stored in localStorage as `cookie_consent: "accepted"`
**And** Google Analytics 4 consent mode is updated to `granted`
**And** GA4 script loads and tracks the pageview

### AC3: Reject Functionality
**Given** I click "Reject All"
**When** consent is recorded
**Then** the banner disappears with smooth transition
**And** my preference is stored in localStorage as `cookie_consent: "rejected"`
**And** NO analytics cookies are set
**And** NO tracking scripts load
**And** GA4 consent mode remains `denied`

### AC4: Returning Visitor Behavior
**Given** I have previously made a cookie choice
**When** I return to the site
**Then** the banner does NOT appear
**And** my previous preference is respected:
- If accepted: GA4 loads automatically
- If rejected: GA4 does not load

### AC5: Preferences Button (Deferred to 3.2)
**Given** I click "Preferences" on the banner
**When** the button is clicked
**Then** for MVP, treat as "Accept All" (per existing implementation)
**Note:** Full preferences modal is Story 3.2

### AC6: Banner Accessibility
**Given** the cookie banner is displayed
**When** I interact with it using keyboard/screen reader
**Then** the banner has `role="dialog"` and `aria-label`
**And** buttons are focusable and have visible focus indicators
**And** the banner traps focus until dismissed
**And** ESC key does NOT dismiss (user must make explicit choice)

### AC7: Cookie Policy Link
**Given** I see the cookie consent banner
**When** I want to learn more
**Then** I can click the Privacy Policy link
**And** it navigates to `/legal/privacy/` (existing page)
**And** the link opens in same tab (banner persists on return)

## Tasks / Subtasks

- [x] Task 1: Audit existing implementation (AC: #1, #2, #3, #4)
  - [x] 1.1 Verify cookie-banner.njk is included in base.njk layout
  - [x] 1.2 Verify cookie-consent.js is loaded on all pages
  - [x] 1.3 Test current accept/reject functionality
  - [x] 1.4 Identify gaps vs acceptance criteria

- [x] Task 2: Update cookie-consent.js for GA4 consent mode (AC: #2, #3, #4)
  - [x] 2.1 Add GA4 gtag consent initialization at page load
  - [x] 2.2 Set default consent to `denied` before user choice
  - [x] 2.3 Update `loadAnalytics()` to properly load GA4 with consent granted
  - [x] 2.4 Implement `gtag('consent', 'update', {...})` on accept
  - [x] 2.5 Ensure no gtag calls when rejected
  - [x] 2.6 Handle returning visitors with stored consent

- [x] Task 3: Add GA4 initialization script (AC: #2)
  - [x] 3.1 Add GA4 measurement ID to site config or env variable
  - [x] 3.2 Create conditional script loading in base.njk
  - [x] 3.3 Use Google's recommended consent mode v2 setup
  - [x] 3.4 Verify gtag('config', 'G-XXXXXX') only fires after consent

- [x] Task 4: Improve banner accessibility (AC: #6)
  - [x] 4.1 Verify `role="dialog"` and `aria-label` on banner (already present)
  - [x] 4.2 Add focus trap to banner when visible
  - [x] 4.3 Set initial focus to first button when banner appears
  - [x] 4.4 Ensure visible focus indicators (Tailwind focus-visible)
  - [x] 4.5 Test keyboard navigation (Tab cycles through buttons)

- [x] Task 5: Add Cookie Settings footer link (AC: deferred to 3.2, but link enables preference changes)
  - [x] 5.1 Add "Cookie Settings" link to footer component
  - [x] 5.2 Link triggers banner re-display for preference changes (allows users to change accept/reject choice)
  - [x] 5.3 Style consistently with other footer links
  - **Rationale:** Even though full preferences modal is Story 3.2, users need ability to re-open banner to change their accept/reject decision

- [x] Task 6: E2E tests for cookie consent (AC: #1-7)
  - [x] 6.1 Create `tests/e2e/cookie-consent.spec.js`
  - [x] 6.2 Test banner appears for first-time visitor
  - [x] 6.3 Test Accept stores consent and hides banner
  - [x] 6.4 Test Reject stores consent and hides banner
  - [x] 6.5 Test banner hidden for returning visitors
  - [x] 6.6 Test Privacy Policy link navigates correctly
  - [x] 6.7 Test Cookie Settings footer link re-opens banner
  - [x] 6.8 Test keyboard navigation through banner
  - [x] 6.9 Test focus management when banner appears

- [x] Task 7: Final validation (AC: #1-7)
  - [x] 7.1 `npm run build` succeeds
  - [x] 7.2 All existing E2E tests pass
  - [x] 7.3 New cookie consent tests pass
  - [x] 7.4 Manual verification in browser (incognito mode)
  - [x] 7.5 Verify localStorage correctly stores consent
  - [x] 7.6 Verify GA4 only loads when accepted (Network tab)
  - [x] 7.7 Update sprint-status.yaml to `done`

## Dev Notes

### Architecture Compliance

**Required Patterns (from docs/architecture.md):**

- **JavaScript:** Minimal, vanilla JS only (no frameworks)
- **File Naming:** kebab-case (`cookie-consent.js`)
- **Error Handling:** try/catch for localStorage operations
- **Accessibility:** WCAG 2.1 AA required - focus management, ARIA labels

### Existing Implementation Analysis

**Already Implemented:**
- `src/_includes/components/cookie-banner.njk` - Banner HTML with Accept/Reject/Preferences buttons
- `src/scripts/cookie-consent.js` - Basic consent logic with localStorage
- `src/pages/legal/cookies.njk` - Cookie policy page

**Gaps to Address:**
1. `loadAnalytics()` is a stub - needs actual GA4 implementation
2. Preferences button just accepts - deferred to Story 3.2
3. No GA4 consent mode integration
4. No focus trap when banner is displayed
5. No E2E tests for cookie functionality

### GA4 Consent Mode Implementation

**Google's Recommended Pattern:**

```javascript
// In base.njk head - BEFORE gtag.js loads
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Set default consent BEFORE any GA4 tracking
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});

// After user accepts:
gtag('consent', 'update', {
  'analytics_storage': 'granted'
});
```

**Conditional GA4 Loading (cookie-consent.js):**
```javascript
function loadAnalytics() {
  // Skip if already loaded
  if (window.ga4Loaded) return;

  // Update consent first
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  }

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX';
  document.head.appendChild(script);

  script.onload = function() {
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXX');
    window.ga4Loaded = true;
  };
}
```

### Focus Trap Implementation

```javascript
// Simple focus trap for cookie banner
function trapFocus(element) {
  const focusable = element.querySelectorAll('button, a[href]');
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });

  // Set initial focus
  firstFocusable.focus();
}
```

### Environment Configuration

**GA4 Measurement ID:**
- **Development:** Use test/dummy ID (e.g., `G-0000000000`) or skip loading entirely
- **Production:** Configure via environment variable in `.env`: `GA4_MEASUREMENT_ID=G-XXXXXXXX`
- **GitHub Pages:** May need to hardcode in site config if environment variables unavailable
- **Implementation note:** Code should check for valid GA4 ID before loading gtag.js to prevent errors with dummy IDs

### File Structure

```
src/
├── _includes/
│   ├── components/
│   │   ├── cookie-banner.njk    # EXISTS - May need accessibility updates
│   │   └── footer.njk           # MODIFY - Add Cookie Settings link
│   └── layouts/
│       └── base.njk             # MODIFY - Add GA4 consent mode init
├── scripts/
│   └── cookie-consent.js        # MODIFY - Complete GA4 integration
tests/
└── e2e/
    └── cookie-consent.spec.js   # NEW - E2E tests
```

### E2E Test Structure

**`tests/e2e/cookie-consent.spec.js`:**
```javascript
// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Cookie Consent Banner', () => {
  test.beforeEach(async ({ context }) => {
    // Clear localStorage before each test
    await context.clearCookies();
  });

  test.describe('First-Time Visitor', () => {
    test('banner appears on first visit', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#cookie-banner')).toBeVisible();
    });

    test('accept stores consent and hides banner', async ({ page }) => {
      await page.goto('/');
      await page.locator('#cookie-accept').click();
      await expect(page.locator('#cookie-banner')).toBeHidden();

      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('accepted');
    });

    test('reject stores consent and hides banner', async ({ page }) => {
      await page.goto('/');
      await page.locator('#cookie-reject').click();
      await expect(page.locator('#cookie-banner')).toBeHidden();

      const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consent).toBe('rejected');
    });
  });

  test.describe('Returning Visitor', () => {
    test('banner hidden when consent exists', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.setItem('cookie_consent', 'accepted'));
      await page.reload();
      await expect(page.locator('#cookie-banner')).toBeHidden();
    });
  });

  test.describe('Accessibility', () => {
    test('banner has proper ARIA attributes', async ({ page }) => {
      await page.goto('/');
      const banner = page.locator('#cookie-banner');
      await expect(banner).toHaveAttribute('role', 'dialog');
      await expect(banner).toHaveAttribute('aria-label', 'Cookie consent');
    });

    test('buttons are keyboard navigable', async ({ page }) => {
      await page.goto('/');
      // Tab through focusable elements
      await page.keyboard.press('Tab');
      await expect(page.locator('#cookie-preferences')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('#cookie-reject')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.locator('#cookie-accept')).toBeFocused();
    });
  });
});
```

### Project Structure Notes

**Alignment with unified project structure:**
- Cookie consent script: `src/scripts/cookie-consent.js` (existing)
- Banner component: `src/_includes/components/cookie-banner.njk` (existing)
- E2E tests: `tests/e2e/cookie-consent.spec.js` (new)

**No detected conflicts:**
- Banner already uses Tailwind utilities consistently
- JavaScript follows existing vanilla JS pattern
- ARIA attributes already partially implemented

### References

- [Source: docs/architecture.md#Frontend-Architecture] - JavaScript: Minimal, vanilla
- [Source: docs/architecture.md#Project-Structure] - File locations
- [Source: docs/epics.md#Story-3.1] - Full acceptance criteria
- [Source: docs/prd.md#FR29] - Accept or reject cookie consent
- [Source: docs/prd.md#FR31] - Delay analytics until consent
- [Source: src/scripts/cookie-consent.js] - Existing implementation
- [Source: src/_includes/components/cookie-banner.njk] - Banner component
- [Source: src/pages/legal/cookies.njk] - Cookie policy page
- [Google GA4 Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)

## Dev Agent Record

### Context Reference

- Epic 3: Privacy, Legal & Accessibility Compliance
- First story in Epic 3 - updates epic status to in-progress
- Dependencies: None (legal pages from brownfield already exist)
- Cookie banner and consent JS already partially implemented

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Previous Story Intelligence

**From Story 2.7 completion (2025-12-17):**
- Build succeeds with 46 files generated
- 104 E2E tests pass
- Sanity data fetching pattern well-established
- Navigation component has mobile and desktop variants
- Footer component exists at `src/_includes/components/footer.njk`

**From existing cookie implementation analysis:**
- `cookie-consent.js` has working accept/reject logic
- `loadAnalytics()` is a stub - needs GA4 implementation
- Banner has `role="dialog"` and `aria-label` already
- Banner uses `hidden` class for show/hide
- localStorage key: `cookie_consent` with values `accepted`/`rejected`

**From architecture.md:**
- GA4 with consent mode required per FR31, FR39
- Cookie consent JS module per Privacy section
- No external frameworks - vanilla JS only

### Debug Log References

### Completion Notes List

**Implementation Summary (2025-12-17):**
- Implemented GA4 Consent Mode v2 with default denied state
- Updated cookie-consent.js with proper GA4 integration, focus trap, and Cookie Settings link handler
- Added GA4 initialization script to base.njk with configurable measurement ID
- Enhanced banner accessibility: aria-modal, focus-visible styles, 44px touch targets
- Added Cookie Settings link to footer for preference changes
- Created 24 comprehensive E2E tests covering all acceptance criteria
- All 128 E2E tests pass (104 existing + 24 new)
- Build succeeds with 46 files

**Key Technical Decisions:**
- GA4 script loads dynamically only after user accepts (not pre-loaded)
- Consent mode default is 'denied' for all storage types (analytics, ad, user data, personalization)
- Focus trap implemented with Tab/Shift+Tab cycling, ESC does NOT dismiss
- Cookie Settings link re-opens banner for preference changes (full preferences modal deferred to Story 3.2)

### Senior Developer Review (AI)

**Review Date:** 2025-12-17
**Reviewer:** Amelia (Dev Agent)
**Outcome:** APPROVED after fixes

**Issues Found & Fixed:**
| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | HIGH | No smooth transition on banner hide (AC2/AC3 specify "smooth transition") | Added CSS transition classes (opacity, transform) with 300ms duration |
| 2 | HIGH | No test verifying GA4 consent update after accept | Added test checking dataLayer for consent update to 'granted' |
| 3 | HIGH | No test verifying NO scripts load after reject | Added test verifying no googletagmanager scripts in DOM |
| 4 | MEDIUM | Touch target test only checked height, not width | Updated test to verify both height >= 44 AND width >= 44 |
| 5 | MEDIUM | Missing aria-labelledby/aria-describedby | Changed from aria-label to aria-labelledby/aria-describedby for better screen reader support |
| 6 | MEDIUM | Misleading code comment ("smooth transition" but none) | Fixed implementation to actually use smooth transitions |
| 7 | LOW | Privacy Policy link lacked 44px touch target | Added min-h-[44px] and inline-flex to link |

**Tests Added:** 5 new tests (24 → 29 total)
- GA4 script loads after accepting consent (AC2)
- GA4 script does NOT load after rejecting consent (AC3)
- Privacy Policy link has minimum 44px touch target height
- Banner hides with smooth transition classes
- Banner shows with smooth transition classes

### File List

**Created:**
- `tests/e2e/cookie-consent.spec.js` - 29 E2E tests for cookie consent (AC #1-7)

**Modified:**
- `src/scripts/cookie-consent.js` - GA4 consent mode integration, focus trap, smooth transitions, showBanner/hideBanner
- `src/_includes/layouts/base.njk` - GA4 consent mode v2 initialization script
- `src/_includes/components/cookie-banner.njk` - Accessibility improvements (aria-labelledby/describedby, smooth transitions, 44px touch targets)
- `src/_includes/components/footer.njk` - Added Cookie Settings link
- `docs/sprint-artifacts/sprint-status.yaml` - Updated story status

---

## Validation Checklist

Before marking complete, verify these **8 essential checks**:

1. [x] **Banner display:** Cookie banner appears for first-time visitors
2. [x] **Accept functionality:** Clicking Accept stores `accepted` in localStorage
3. [x] **Reject functionality:** Clicking Reject stores `rejected` in localStorage
4. [x] **Banner hides:** Banner disappears after Accept or Reject
5. [x] **Returning visitors:** Banner does not appear when consent already stored
6. [x] **GA4 gating:** Analytics only loads when consent is `accepted`
7. [x] **Build succeeds:** `npm run build` completes without errors (46 files)
8. [x] **Tests pass:** All 133 E2E tests pass (104 existing + 29 cookie consent)
