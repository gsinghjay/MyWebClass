# Story 4.6: Discord Webhook - New Submission Notification

Status: review

## Story

As a **community member**,
I want **to see notifications in Discord when new submissions arrive**,
so that **I can follow along with what's being submitted**.

## Acceptance Criteria

### AC1: Discord Notification on New Submission
- **Given** a new submission is created in Sanity
- **When** the Netlify function processes the submission
- **Then** a Discord webhook message is sent to #gallery-submissions

### AC2: Discord Message Format
- **Given** the notification is sent
- **When** the message appears in Discord
- **Then** it follows the format:
  ```
  🎨 **New Submission:** "{style}" by {name}
  Demo: {demoUrl}
  ```
- **And** includes:
  - Emoji indicator (🎨)
  - Design style name (human-readable, not slug)
  - Submitter name
  - Clickable demo URL

### AC3: Non-Blocking Behavior
- **Given** Discord webhook succeeds or fails
- **When** the submission is processed
- **Then** the overall submission still succeeds regardless of Discord status
- **And** Discord errors are logged but do not return error to user

### AC4: Webhook Failure Handling
- **Given** the Discord webhook fails (network error, invalid URL, rate limit)
- **When** an error occurs
- **Then** the failure is logged with error details
- **And** the form submission still returns success to the user
- **And** the Sanity document is already created (blocking step completed first)

### AC5: Webhook Not Configured
- **Given** the `DISCORD_WEBHOOK_URL` environment variable is not set
- **When** a submission is processed
- **Then** Discord notification is skipped gracefully
- **And** a log message indicates "Discord webhook not configured, skipping notification"
- **And** the submission succeeds without error

### AC6: Style Name Resolution
- **Given** the form submission includes a style slug (e.g., "swiss-international")
- **When** the Discord notification is prepared
- **Then** the style name should be human-readable (e.g., "Swiss International Style")
- **Or** fall back to the slug if name lookup fails

## Implementation Status

**Partially Implemented** in `netlify/functions/submit-form.js` from Story 4.4.

### Current Implementation Analysis

| AC | Requirement | Implementation Status | Location |
|----|-------------|----------------------|----------|
| AC1 | Discord Notification | ✅ Implemented | `submit-form.js:136-161, 300-303` |
| AC2 | Message Format | ⚠️ Partial | `submit-form.js:142-144` - uses slug, not name |
| AC3 | Non-Blocking | ✅ Implemented | `submit-form.js:300-303` |
| AC4 | Failure Handling | ✅ Implemented | `submit-form.js:146-160` |
| AC5 | Not Configured | ✅ Implemented | `submit-form.js:137-140` |
| AC6 | Style Name Resolution | ❌ Not Implemented | Missing - currently uses slug |

### Gap Analysis

**Issue Found:** The `sendDiscordNotification()` function accepts a `styleName` parameter (line 136), but it's called without passing the resolved style name (line 301):

```javascript
// Current call (line 301):
sendDiscordNotification(submission).catch(err => ...)

// Should be:
sendDiscordNotification(submission, styleName).catch(err => ...)
```

**Result:** The Discord message currently shows the slug (e.g., "swiss-international") instead of the human-readable name (e.g., "Swiss International Style").

## Tasks / Subtasks

- [x] **Task 1: Modify createSanityDocument to Return Style Name** (AC: 2, 6)
  - [x] **Step 1.1:** Add `styleName` variable at function scope (line 61)
    ```javascript
    // Add after line 60 (inside createSanityDocument function):
    let styleName = null;
    ```
  - [x] **Step 1.2:** Modify GROQ query to fetch title (line 92)
    ```diff
    - const styleQuery = encodeURIComponent(`*[_type == "designStyle" && slug.current == "${submission.style}"][0]._id`);
    + const styleQuery = encodeURIComponent(`*[_type == "designStyle" && slug.current == "${submission.style}"][0]{_id, title}`);
    ```
  - [x] **Step 1.3:** Update result handling to extract both values (lines 102-103)
    ```diff
    - if (styleData.result) {
    -   mutations[0].create.styleRef._ref = styleData.result;
    + if (styleData.result) {
    +   styleName = styleData.result.title;
    +   mutations[0].create.styleRef._ref = styleData.result._id;
    ```
  - [x] **Step 1.4:** Modify return statement to include styleName (line 130-131)
    ```diff
    - return response.json();
    + const result = await response.json();
    + return { result, styleName };
    ```

- [x] **Task 2: Update Handler to Use Returned Style Name** (AC: 2, 6)
  - [x] **Step 2.1:** Destructure return value (line 297)
    ```diff
    - const sanityResult = await createSanityDocument(submission, screenshotAssetId);
    + const { result: sanityResult, styleName } = await createSanityDocument(submission, screenshotAssetId);
    ```
  - [x] **Step 2.2:** Pass styleName to Discord notification (line 301)
    ```diff
    - sendDiscordNotification(submission).catch(err =>
    + sendDiscordNotification(submission, styleName).catch(err =>
    ```

- [x] **Task 3: Verify Discord Message Format** (AC: 2)
  - [x] Confirm message includes 🎨 emoji
  - [x] Confirm message shows human-readable style name (not slug)
  - [x] Confirm message shows submitter name
  - [x] Confirm demo URL is clickable in Discord

- [x] **Task 4: Test Non-Blocking Behavior** (AC: 3, 4)
  - [x] Verify submission succeeds even if Discord fails
  - [x] Verify error is logged on Discord failure
  - [x] Verify no error returned to user on Discord failure

- [x] **Task 5: Test Missing Configuration** (AC: 5)
  - [x] Verify graceful skip when DISCORD_WEBHOOK_URL not set
  - [x] Verify log message appears
  - [x] Verify no errors thrown

## Dev Notes

### Architecture Context

The Architecture document specifies Discord notifications as part of the form submission flow:

> **Form Submission Boundary:**
> ```
> src/pages/submit.njk (Form)
>        ↓ POST
> Netlify Function (/.netlify/functions/submit-form)
>        ↓ Scenario
> ├── Sanity API (Create document) [blocking]
> ├── Airtable API (Create record) [non-blocking]
> └── Discord API (Send notification) [non-blocking]
> ```
>
> [Source: docs/architecture.md#Form-Submission-Boundary]

### Expected Discord Message Format

Per the epics specification:

```
🎨 New Submission: "{style}" by {name}
Demo: {demoUrl}
```

Example output:
```
🎨 **New Submission:** "Swiss International Style" by Alex Chen
Demo: https://example.com/demo
```

[Source: docs/epics.md#Story-4.6]

### Current Function Implementation

```javascript
// netlify/functions/submit-form.js (lines 136-161)
async function sendDiscordNotification(submission, styleName) {
  if (!DISCORD_WEBHOOK_URL) {
    console.log('Discord webhook not configured, skipping notification');
    return null;
  }

  const message = {
    content: `🎨 **New Submission:** "${styleName || submission.style}" by ${submission.name}\nDemo: ${submission.demoUrl}`
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      console.error('Discord notification failed:', response.status);
    }
    return response;
  } catch (error) {
    console.error('Discord notification error:', error);
    return null;
  }
}
```

### Critical Architecture Note: Variable Scope

**Problem:** Style lookup happens INSIDE `createSanityDocument()` (lines 91-112), but `sendDiscordNotification()` is called OUTSIDE in the main handler (line 301). A variable declared inside `createSanityDocument()` won't be accessible at line 301.

**Solution:** Modify `createSanityDocument()` to RETURN the styleName along with the result:

```javascript
// Current return (line 130):
return response.json();

// Required return:
return { result: await response.json(), styleName };
```

Then destructure in the handler:
```javascript
// Line 297:
const { result: sanityResult, styleName } = await createSanityDocument(submission, screenshotAssetId);
```

This keeps style lookup logic contained in `createSanityDocument()` while exposing the name to the caller.

### GROQ Query Return Format Change

**Current query returns a STRING:**
```javascript
`*[_type == "designStyle" && slug.current == "${submission.style}"][0]._id`
// styleData.result = "abc123"
```

**New query returns an OBJECT:**
```javascript
`*[_type == "designStyle" && slug.current == "${submission.style}"][0]{_id, title}`
// styleData.result = { _id: "abc123", title: "Swiss International Style" }
```

**Must update access pattern:**
- `styleData.result` → `styleData.result._id` (for reference)
- `styleData.result.title` (for Discord message)

### Project Structure Notes

**Files to modify:**
- `netlify/functions/submit-form.js` - Add style name resolution for Discord

**No new files required.**

### Environment Variables

```bash
# Discord notifications (optional - submission succeeds without it)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
```

**Setup:** Discord Server Settings → Integrations → Webhooks → New Webhook → Copy URL → Add to Netlify env vars.

### Testing Guidance

**Manual Testing Steps:**
1. Ensure `DISCORD_WEBHOOK_URL` is set in Netlify environment
2. Submit a test form on the deployed site
3. Verify Discord message appears in #gallery-submissions
4. Check that style name is human-readable (not slug)
5. Click demo URL to verify it's correct

**Testing Without Discord:**
1. Remove or unset `DISCORD_WEBHOOK_URL`
2. Submit a test form
3. Verify submission succeeds
4. Check Netlify function logs for "Discord webhook not configured"

**Testing Discord Failure:**
1. Set `DISCORD_WEBHOOK_URL` to an invalid URL
2. Submit a test form
3. Verify submission still succeeds
4. Check Netlify function logs for error message

### Previous Story Learnings (from 4.4 and 4.5) - DO NOT CHANGE

These patterns are ALREADY WORKING. Do not modify them:

1. **Non-blocking pattern (line 300-303)**: Discord/Airtable use `.catch()` - keeps working even if integrations fail
2. **Style lookup exists (lines 91-112)**: GROQ query works - just extend it to also return `title`
3. **Graceful skip pattern (lines 137-140)**: `if (!DISCORD_WEBHOOK_URL)` check and log message - leave as-is
4. **Error isolation**: Integration failures don't affect Sanity document creation - verified working
5. **Fallback in message (line 142-143)**: `styleName || submission.style` - already handles null styleName

### Dependencies

**Story 4.6 depends on:**
- Story 4.4: Form Submission Handler (DONE) - provides the Netlify function
- Story 4.5: Sanity Document Creation (DONE) - document must exist before notification
- Discord server with webhook configured (external setup)

**Stories depending on 4.6:**
- None directly (Discord notification is a terminal feature)
- Story 5.9 uses similar Discord pattern for approval notifications

### References

- [Source: docs/epics.md#Story-4.6] - Original story definition
- [Source: docs/architecture.md#Form-Submission-Boundary] - Integration flow
- [Source: docs/architecture.md#Communication-Patterns] - Discord message format
- [Source: docs/prd.md#FR36] - System sends Discord webhook notification when new submission is created
- [Discord Webhooks API](https://discord.com/developers/docs/resources/webhook#execute-webhook)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build: `npm run build` - 46 files written, no errors
- Unit tests: `node --test tests/submit-form.test.mjs` - 10 tests passed
- E2E tests: `npm run test:e2e` - 249 tests passed

### Completion Notes List

1. **Task 1 Complete**: Modified `createSanityDocument` to return style name
   - Added `let styleName = null` at function scope (line 61)
   - Updated GROQ query to fetch `{_id, title}` instead of just `._id` (line 94)
   - Extracted `title` from result and assigned to `styleName` (line 105)
   - Changed return to `{ result, styleName }` (lines 133-134)

2. **Task 2 Complete**: Updated handler to use returned style name
   - Destructured return value: `const { result: sanityResult, styleName } = await createSanityDocument(...)` (line 301)
   - Passed `styleName` to Discord notification call (line 305)

3. **Tasks 3-5 Complete**: Created unit test file `tests/submit-form.test.mjs` with 10 tests covering:
   - AC2: Discord message format verification (emoji, style name, submitter, URL)
   - AC3/AC4: Non-blocking behavior (error handling, null returns)
   - AC5: Webhook not configured (graceful skip)
   - AC6: Style name resolution (GROQ result handling, fallback to slug)

4. **All Tests Pass**:
   - 20 unit tests (existing sanity.test.mjs + new submit-form.test.mjs)
   - 249 E2E tests (no regressions)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-17 | Story created with gap analysis - style name resolution needed | SM Agent (Bob) |
| 2025-12-17 | Validated: Added explicit tasks, variable scope note, GROQ format note | SM Agent (Bob) |
| 2025-12-17 | Implemented style name resolution: GROQ returns {_id, title}, styleName passed to Discord | Dev Agent (Amelia) |

### File List

**Files modified:**
- `netlify/functions/submit-form.js` - Style name resolution and Discord notification call

**Files created:**
- `tests/submit-form.test.mjs` - Unit tests for Discord notification (10 tests)

**Documentation:**
- `docs/sprint-artifacts/4-6-discord-webhook-new-submission-notification.md` - This story file
