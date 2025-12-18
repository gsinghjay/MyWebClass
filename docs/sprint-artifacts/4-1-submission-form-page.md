# Story 4.1: Submission Form Page

Status: done

## Story

As a **student**,
I want **a structured form to submit my design demo**,
so that **I can share my work for potential inclusion in the gallery**.

## Acceptance Criteria

### AC1: Form Page Access
- **Given** I navigate to `/submit/`
- **When** the page loads
- **Then** I see a submission form with clear instructions and purpose explanation

### AC2: Required Form Fields Present
- **Given** I view the submission form
- **When** I inspect available fields
- **Then** I see the following required fields:
  - Name (text input)
  - Email (email input)
  - Design Style (dropdown select populated from Sanity designStyles)
  - Demo URL (url input)
  - Screenshot (file upload)
  - Authenticity Explanation (textarea)

### AC3: Field Labels and Helper Text
- **Given** I view the form
- **When** I look at each field
- **Then** each field has:
  - Clear label text
  - Placeholder text or example value
  - Helper text explaining what's expected
  - Required indicator (asterisk or "Required" text)

### AC4: Design Style Dropdown Population
- **Given** the page loads
- **When** the design style dropdown renders
- **Then** it is populated with all `designStyle` documents from Sanity
- **And** each option shows the style title
- **And** the value is the style slug for form submission

### AC5: Client-Side Validation - Required Fields
- **Given** I have not filled all required fields
- **When** I try to submit the form
- **Then** validation errors appear inline next to each invalid field
- **And** focus moves to the first invalid field
- **And** the form does NOT submit

### AC6: Client-Side Validation - Email Format
- **Given** I enter an invalid email format
- **When** the field loses focus or I submit
- **Then** an error appears: "Please enter a valid email address"

### AC7: Client-Side Validation - URL Format
- **Given** I enter an invalid URL format
- **When** the field loses focus or I submit
- **Then** an error appears: "Please enter a valid URL starting with https://"

### AC8: Client-Side Validation - Explanation Length
- **Given** I enter fewer than 50 characters in the explanation field
- **When** I submit the form
- **Then** an error appears: "Please provide at least 50 characters explaining your design"

### AC9: Accessible Form Structure
- **Given** I use a screen reader or keyboard navigation
- **When** I interact with the form
- **Then** all inputs have associated `<label>` elements
- **And** error messages are announced via `aria-describedby`
- **And** required fields are indicated via `aria-required="true"`
- **And** I can tab through all fields in logical order

### AC10: Responsive Form Layout
- **Given** I view the form on mobile (<640px)
- **When** the page renders
- **Then** the form displays in a single column layout
- **And** all fields are full-width
- **And** touch targets are minimum 44x44px

## Existing Implementation (DO NOT RECREATE)

**Files that already exist and require MODIFICATION:**

| File | Current State | Required Changes |
|------|---------------|------------------|
| `src/pages/submit.njk` | Form UI with Netlify attributes | Remove Netlify attrs, add Sanity dropdown, add validation hooks |
| `src/_includes/macros/form-field.njk` | Basic input/select/textarea/checkbox macros | Add aria-required, aria-describedby, error containers |
| `src/_data/designStyles.mjs` | Fetches from Sanity, returns `{ styles: [], categories: [] }` | No changes needed - use as data source |

**Current submit.njk issues to fix:**
1. Uses `netlify` and `netlify-honeypot` attributes - KEEP `netlify` for Netlify Forms backup, but form will POST to function
2. Design styles dropdown is HARDCODED - REPLACE with Sanity data loop
3. Screenshot accepts only png/jpeg - ADD webp support
4. Inline `<script>` has only file preview - KEEP file preview, but validation moves to external JS
5. No client-side validation - ADD via new submission-form.js
6. Form action needs to POST to Netlify Function `/.netlify/functions/submit-form`

## Tasks / Subtasks

- [x] **Task 1: Update Form Field Macros for Accessibility** (AC: 3, 9)
  - [x] MODIFY `src/_includes/macros/form-field.njk`:
    - Add `aria-required="true"` when `required=true`
    - Add `id` for error message container: `{{ name }}-error`
    - Add `aria-describedby="{{ name }}-helper {{ name }}-error"` to inputs
    - Add hidden error `<p>` element with `role="alert"`
  - [x] Update checkbox macro: increase touch target to min 44x44px
  - [x] Add `aria-invalid="false"` attribute (JS will toggle to true on error)

- [x] **Task 2: Update Submit Page - Configure for Netlify Function** (AC: 1, 2, 4)
  - [x] MODIFY `src/pages/submit.njk`:
    - KEEP `netlify` attribute (backup form capture)
    - KEEP `netlify-honeypot="bot-field"` (spam protection)
    - KEEP `id="submission-form"` and `method="POST"`
    - ADD `action="/.netlify/functions/submit-form"` to form
    - ADD `data-netlify="true"` for Netlify Forms backup
    - ADD `novalidate` for JS-based validation
  - [x] REPLACE hardcoded style dropdown (lines 51-58) with Sanity data:
    ```nunjucks
    {{ field.select('style', 'Design Style',
       designStyles.styles | map(style => { value: style.slug.current or style.slug, label: style.title }),
       true, 'Select the design style your demo represents') }}
    ```
  - [x] UPDATE screenshot input: `accept="image/png,image/jpeg,image/webp"`

- [x] **Task 3: Implement Client-Side Validation** (AC: 5, 6, 7, 8)
  - [x] CREATE `src/scripts/submission-form.js` with:
    - Required field validation for: name, email, style, demoUrl, screenshot, authenticity
    - Email format validation (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
    - URL format validation (must start with `https://`)
    - Explanation minimum 50 characters with live counter
    - `showError(fieldName, message)` function that:
      - Sets `aria-invalid="true"` on input
      - Shows error message in `#{{ fieldName }}-error` element
      - Adds error styling class
    - `clearError(fieldName)` function to reset state
    - Focus management: move focus to first error field on submit
  - [x] Add blur event listeners for real-time validation feedback
  - [x] Prevent form submission if validation fails

- [x] **Task 4: Update Form JavaScript Integration** (AC: 5, 9)
  - [x] MODIFY inline `<script>` in submit.njk:
    - KEEP file upload preview logic (lines 99-108)
    - REPLACE form submit handler with fetch to Netlify Function:
      ```javascript
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
          const response = await fetch('/.netlify/functions/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          if (response.ok) {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
          } else {
            throw new Error('Submission failed');
          }
        } catch (error) {
          alert('Something went wrong. Please try again.');
        }
      });
      ```
  - [x] ADD script include at end of file:
    ```nunjucks
    <script src="{{ '/scripts/submission-form.js' | url }}" defer></script>
    ```

- [x] **Task 5: Style Error States** (AC: 3, 5, 10)
  - [x] ADD to `src/styles/main.css` or inline in macros:
    - `.form-input.error` or `[aria-invalid="true"]`: red border (`border-swiss-red`)
    - `.form-error`: red text, `text-sm`, initially hidden
    - Valid state: subtle green border on blur if valid
  - [x] Ensure error text has sufficient contrast (4.5:1 minimum)

- [x] **Task 6: Verify Responsive Layout & Touch Targets** (AC: 10)
  - [x] Verify form container max-width and padding
  - [x] Verify single-column stack on mobile (<640px)
  - [x] Verify all buttons/inputs have min 44x44px touch target
  - [x] Test checkbox label tap area covers full row

## Dev Notes

### Form Field → Sanity Mapping

| Form Field Name | HTML ID | Sanity Field | Type | Validation |
|-----------------|---------|--------------|------|------------|
| `name` | `name` | `submitterName` | string | Required, non-empty |
| `email` | `email` | `submitterEmail` | string | Required, email format |
| `style` | `style` | `styleRef` | reference (by slug) | Required, must select |
| `demoUrl` | `demoUrl` | `demoUrl` | url | Required, https:// prefix |
| `screenshot` | `screenshot` | `screenshot` | image | Required, png/jpg/webp, <5MB |
| `authenticity` | `authenticity` | `authenticityExplanation` | text | Required, min 50 chars |

### Data Access Pattern

```nunjucks
{# designStyles returns { styles: [], categories: [] } #}
{% for style in designStyles.styles %}
  <option value="{{ style.slug.current or style.slug }}">{{ style.title }}</option>
{% endfor %}
```

### Validation JavaScript Structure

```javascript
// src/scripts/submission-form.js
const form = document.getElementById('submission-form');
const validators = {
  name: (v) => v.trim().length > 0 || 'Name is required',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address',
  style: (v) => v !== '' || 'Please select a design style',
  demoUrl: (v) => v.startsWith('https://') || 'Please enter a valid URL starting with https://',
  screenshot: (v, input) => input.files.length > 0 || 'Screenshot is required',
  authenticity: (v) => v.trim().length >= 50 || 'Please provide at least 50 characters explaining your design'
};

function showError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}-error`);
  input.setAttribute('aria-invalid', 'true');
  input.classList.add('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }
}

function clearError(fieldName) {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}-error`);
  input.setAttribute('aria-invalid', 'false');
  input.classList.remove('error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }
}

form.addEventListener('submit', (e) => {
  let firstError = null;
  // Validate each field, collect errors
  // If errors exist: e.preventDefault(), focus first error
});
```

### Macro Updates Required

**Current input macro (missing accessibility):**
```nunjucks
<input type="{{ type }}" id="{{ name }}" name="{{ name }}" ... />
```

**Updated input macro:**
```nunjucks
<input
  type="{{ type }}"
  id="{{ name }}"
  name="{{ name }}"
  class="form-input"
  {% if required %}required aria-required="true"{% endif %}
  aria-describedby="{{ name }}-helper {{ name }}-error"
  aria-invalid="false"
  ...
/>
{% if helpText %}
<p id="{{ name }}-helper" class="form-helper">{{ helpText }}</p>
{% endif %}
<p id="{{ name }}-error" class="form-error hidden text-swiss-red text-sm mt-1" role="alert"></p>
```

### Technical Stack

- **Templating:** Nunjucks
- **Styling:** Tailwind CSS 3.4.18
- **JavaScript:** Vanilla JS (no framework)
- **Data Source:** `designStyles` from `src/_data/designStyles.mjs` (Sanity)

### File Locations

**Modify:**
- `src/pages/submit.njk` - Remove Netlify attrs, add Sanity dropdown, link validation script
- `src/_includes/macros/form-field.njk` - Add aria attributes and error containers

**Create:**
- `src/scripts/submission-form.js` - Client-side validation logic

### Dependencies

**Story 4.1 depends on:**
- Epic 1 complete: Sanity CMS with `designStyle` data available via `src/_data/designStyles.mjs`
- Netlify deployment configured (netlify.toml exists, site connected)

**Stories depending on 4.1:**
- Story 4.2: Consent Checkboxes (adds marketing consent field to this form)
- Story 4.3: Screenshot Upload (enhances file input with preview/validation)

**Note:** Form submission to Netlify Function is now included in this story. The `netlify/functions/submit-form.js` handles Sanity document creation, Discord notifications, and Airtable sync.

### Testing Guidance

**Manual Testing:**
1. Open `/submit/` page
2. Verify all fields render with labels and placeholders
3. Verify design style dropdown populated from Sanity (not hardcoded)
4. Try submitting empty form - should show all validation errors
5. Enter invalid email - should show email error
6. Enter invalid URL (no https) - should show URL error
7. Enter short explanation (<50 chars) - should show length error
8. Verify keyboard navigation (Tab through all fields)
9. Verify mobile layout (responsive at <640px)
10. Verify screen reader announces errors via aria-describedby

**E2E Test Candidates:**
- Form renders with all required fields
- Validation prevents empty submission
- Design style dropdown has options from Sanity (check for dynamic content)
- Error messages appear inline with correct text
- Focus moves to first error field

### References

- [Source: docs/architecture.md#Form-Sanity-Field-Mapping] - Field mapping table
- [Source: docs/architecture.md#API-Communication-Patterns] - Make webhook payload format
- [Source: docs/epics.md#Story-4.1] - Original story definition

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Identified HTML5 native validation blocking JS validation submit handler - resolved by adding `novalidate` attribute to form
- All 48 E2E tests pass after code review fixes (character counter, file size validation, valid state styling)

### Completion Notes List

- **Task 1:** Updated all form field macros (input, select, textarea, checkbox) with ARIA attributes: `aria-required`, `aria-describedby`, `aria-invalid`, and error containers with `role="alert"`
- **Task 2:** Configured form for Netlify Function submission with `action`, `data-netlify`, and `novalidate` attributes; replaced hardcoded styles with Sanity data (34 design styles); added WebP support
- **Task 3:** Created comprehensive client-side validation with validators for all required fields, email format, URL format, and minimum character count; includes real-time blur validation and character counter
- **Task 4:** Updated inline script with async submit handler that calls validation and posts to Netlify Function; includes loading state and error handling
- **Task 5:** Added CSS error states for invalid inputs (red border via `[aria-invalid="true"]`) and valid inputs (green border)
- **Task 6:** Verified responsive layout and touch targets (44px minimum) via E2E tests

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-17 | Story created with comprehensive context | SM Agent (Bob) |
| 2025-12-17 | Validated and improved with existing code context | SM Agent (Bob) |
| 2025-12-17 | Implemented all 6 tasks, 42 E2E tests added | Dev Agent (Amelia) |
| 2025-12-17 | Code review: Found 5 issues, fixed all, 48 E2E tests now | Dev Agent (Amelia) |

### Senior Developer Review (AI)

**Review Date:** 2025-12-17
**Outcome:** APPROVED (after fixes)

**Issues Found & Fixed:**

| # | Severity | Issue | Resolution |
|---|----------|-------|------------|
| 1 | HIGH | Character counter broken - helper element not rendered | Added helpText param to authenticity textarea |
| 2 | HIGH | No file size validation for screenshot | Added 5MB size check in validator |
| 3 | MEDIUM | Valid state CSS never applied by JS | Added `.valid` class in clearError function |
| 4 | MEDIUM | Checkbox touch target not verified | Added E2E test - confirmed 44px target works |
| 5 | MEDIUM | No E2E test for character counter | Added 2 tests for counter functionality |

**Tests Added:**
- `character counter shows remaining characters needed`
- `character counter shows count when minimum met`
- `checkbox has minimum 44px touch target`
- `shows error for file over 5MB`
- `accepts file under 5MB`
- `applies valid styling after successful validation`

### File List

**Modified:**
- `src/_includes/macros/form-field.njk` - Added ARIA attributes and error containers
- `src/pages/submit.njk` - Configured form for Netlify Function, Sanity dropdown, novalidate
- `src/styles/main.css` - Added error/valid state styling for form inputs

**Created:**
- `src/scripts/submission-form.js` - Client-side validation logic
- `tests/e2e/submission-form.spec.js` - 42 E2E tests covering all ACs
