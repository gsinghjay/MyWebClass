# Story 4.3: Screenshot Upload with Preview

Status: done

## Story

As a **student**,
I want **to upload a screenshot of my design with preview**,
so that **I can verify the correct image before submitting**.

## Acceptance Criteria

### AC1: Image Preview on Selection
- **Given** I click the screenshot upload field
- **When** I select an image file
- **Then** I see a visual preview of the selected image
- **And** the preview shows a thumbnail of the actual image (not just an icon)
- **And** the preview is appropriately sized (max 300px width, maintaining aspect ratio)

### AC2: File Information Display
- **Given** I select an image file
- **When** the preview appears
- **Then** I see the file name displayed
- **And** I see the file size in human-readable format (e.g., "2.3 MB", "456 KB")
- **And** both are visible below the preview image

### AC3: File Size Validation
- **Given** I upload an image file
- **When** the file is larger than 5MB
- **Then** an error message appears: "Screenshot must be less than 5MB"
- **And** the file is rejected (not shown in preview)
- **And** the upload area returns to its default state
- **And** the error is announced to screen readers

### AC4: File Type Validation
- **Given** I attempt to upload a non-image file (PDF, DOC, etc.)
- **When** the file type doesn't match accepted types
- **Then** an error message appears: "Please upload a JPG, PNG, or WebP image"
- **And** the file is rejected
- **And** the upload area returns to its default state

### AC5: Remove/Replace Image
- **Given** I have already selected an image
- **When** I want to change my screenshot
- **Then** I see a "Remove" button/icon near the preview
- **And** clicking "Remove" clears the preview and resets the input
- **And** I can then select a new file
- **Or** I can simply select a new file to replace the current one

### AC6: Visual Feedback States
- **Given** I interact with the upload area
- **Then** I see distinct visual states:
  - Default: Dashed border with upload icon and instructions
  - Hover/Focus: Highlighted border (Swiss red accent)
  - Drag over: Strong highlight indicating drop target
  - Has image: Shows preview with file info and remove option
  - Error: Red border with error message

### AC7: Accessibility Requirements
- **Given** I use a screen reader
- **When** I interact with the screenshot upload
- **Then** the file input has a proper accessible name
- **And** file selection status is announced ("Image selected: filename.png, 2.3 MB")
- **And** errors are announced via aria-live region
- **And** the remove button has an accessible label ("Remove selected image")
- **And** all interactive elements meet 44x44px touch targets

### AC8: Drag and Drop Support
- **Given** I drag an image file over the upload area
- **When** I drop the file
- **Then** the file is processed the same as a click-to-upload selection
- **And** preview and validation occur identically

## Existing Implementation (MODIFY, DO NOT RECREATE)

**Files that already exist and require MODIFICATION:**

| File | Current State | Required Changes |
|------|---------------|------------------|
| `src/pages/submit.njk` | Basic file input with filename display (lines 63-88) | Add preview container, remove button, enhanced visual states |
| `src/scripts/submission-form.js` | 5MB size validation exists (lines 18-27) | Add file type validation messaging, remove handler logic |
| `src/_includes/macros/form-field.njk` | No file upload macro | NO CHANGES - screenshot is custom in submit.njk |

**Current screenshot upload implementation (lines 63-88 in submit.njk):**
```nunjucks
{# Screenshot Upload #}
<div class="form-group">
  <label for="screenshot" class="form-label">
    Screenshot <span class="text-swiss-red">*</span>
  </label>
  <div class="border-2 border-dashed border-black p-8 text-center cursor-pointer hover:bg-neutral-50 transition-colors">
    <input
      type="file"
      id="screenshot"
      name="screenshot"
      accept="image/png,image/jpeg,image/webp"
      required
      aria-required="true"
      aria-describedby="screenshot-helper screenshot-error"
      aria-invalid="false"
      class="hidden"
    />
    <label for="screenshot" class="cursor-pointer">
      <span class="text-4xl block mb-2">📷</span>
      <p id="screenshot-helper" class="text-sm text-neutral-500">Click to upload or drag and drop</p>
      <p class="text-caption text-neutral-400 mt-1">PNG, JPG, WebP up to 5MB</p>
    </label>
    <p id="file-name" class="text-sm text-neutral-600 mt-2 hidden"></p>
  </div>
  <p id="screenshot-error" class="form-error hidden" role="alert"></p>
</div>
```

**Current file preview script (lines 119-131 in submit.njk):**
```javascript
// File upload preview
const fileInput = document.getElementById('screenshot');
const fileName = document.getElementById('file-name');

if (fileInput && fileName) {
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      fileName.textContent = 'Selected: ' + this.files[0].name;
      fileName.classList.remove('hidden');
    }
  });
}
```

**Problem:** Only shows filename text, no actual image preview, no file size, no remove capability.

## Tasks / Subtasks

> **⚠️ VALIDATION ARCHITECTURE NOTE:**
> This story implements validation in TWO places - this is INTENTIONAL:
> 1. **Inline script (Task 2):** Provides IMMEDIATE feedback when file is selected - prevents invalid files from showing preview
> 2. **submission-form.js (Task 3):** Validates on FORM SUBMIT - final check before API call
>
> Both are needed for optimal UX. The inline script catches errors early; the form validator ensures nothing slips through.

- [x] **Task 1: Update Screenshot Upload HTML Structure** (AC: 1, 2, 5, 6, 7)
  - [x] MODIFY `src/pages/submit.njk`:
    - FIND the `{# Screenshot Upload #}` comment section
    - REPLACE the entire screenshot upload `<div class="form-group">` block with enhanced structure:
    ```nunjucks
    {# Screenshot Upload #}
    <div class="form-group">
      <label for="screenshot" class="form-label">
        Screenshot <span class="text-swiss-red">*</span>
      </label>

      {# Upload Container - toggles between upload state and preview state #}
      <div
        id="screenshot-upload-container"
        class="relative border-2 border-dashed border-black p-8 text-center transition-colors focus-within:border-swiss-red hover:border-swiss-red"
        role="group"
        aria-labelledby="screenshot-upload-label"
      >
        {# Upload State (shown when no file selected) #}
        <div id="screenshot-upload-state">
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            accept="image/png,image/jpeg,image/webp"
            required
            aria-required="true"
            aria-describedby="screenshot-helper screenshot-error"
            aria-invalid="false"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div id="screenshot-upload-label" class="pointer-events-none">
            <span class="text-4xl block mb-2" aria-hidden="true">📷</span>
            <p id="screenshot-helper" class="text-sm text-neutral-500">Click to upload or drag and drop</p>
            <p class="text-caption text-neutral-400 mt-1">PNG, JPG, WebP up to 5MB</p>
          </div>
        </div>

        {# Preview State (shown when file is selected) #}
        <div id="screenshot-preview-state" class="hidden">
          <img
            id="screenshot-preview-image"
            src=""
            alt="Preview of selected screenshot"
            class="max-w-[300px] max-h-[200px] mx-auto object-contain mb-3"
          />
          <div class="text-sm text-neutral-600">
            <p id="screenshot-file-name" class="font-medium"></p>
            <p id="screenshot-file-size" class="text-neutral-400"></p>
          </div>
          <button
            type="button"
            id="screenshot-remove-btn"
            class="mt-3 px-4 py-2 text-sm text-swiss-red border border-swiss-red rounded hover:bg-swiss-red hover:text-white transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Remove selected image"
          >
            Remove
          </button>
        </div>

        {# Screen reader status announcements #}
        <div id="screenshot-status" class="sr-only" aria-live="polite" aria-atomic="true"></div>
      </div>

      <p id="screenshot-error" class="form-error hidden mt-2" role="alert"></p>
    </div>
    ```

- [x] **Task 2: Implement Enhanced Preview JavaScript** (AC: 1, 2, 3, 4, 5, 8)
  > **TL;DR:** Replace inline script with enhanced version that:
  > - Shows image thumbnail preview using FileReader API
  > - Displays filename + human-readable file size (e.g., "2.3 MB")
  > - Validates type (PNG/JPG/WebP) and size (<5MB) BEFORE showing preview
  > - Adds remove button to reset upload state
  > - Supports drag & drop with visual feedback
  >
  > **Note:** This script creates its OWN `showError()`/`clearError()` functions - intentionally separate from `window.showFormError` in submission-form.js for encapsulation. The upload container is self-contained.

  - [x] FIND the `// File upload preview` comment in the inline `<script>` tag
  - [x] REPLACE that entire file upload preview section (the `if (fileInput && fileName)` block) with enhanced version:
    ```javascript
    // Enhanced screenshot upload with preview
    const screenshotInput = document.getElementById('screenshot');
    const uploadContainer = document.getElementById('screenshot-upload-container');
    const uploadState = document.getElementById('screenshot-upload-state');
    const previewState = document.getElementById('screenshot-preview-state');
    const previewImage = document.getElementById('screenshot-preview-image');
    const fileNameEl = document.getElementById('screenshot-file-name');
    const fileSizeEl = document.getElementById('screenshot-file-size');
    const removeBtn = document.getElementById('screenshot-remove-btn');
    const statusEl = document.getElementById('screenshot-status');
    const errorEl = document.getElementById('screenshot-error');

    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function showError(message) {
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
      }
      if (uploadContainer) {
        uploadContainer.classList.add('border-swiss-red');
      }
      if (screenshotInput) {
        screenshotInput.setAttribute('aria-invalid', 'true');
      }
      // Announce to screen readers
      if (statusEl) {
        statusEl.textContent = 'Error: ' + message;
      }
    }

    function clearError() {
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
      }
      if (uploadContainer) {
        uploadContainer.classList.remove('border-swiss-red');
      }
      if (screenshotInput) {
        screenshotInput.setAttribute('aria-invalid', 'false');
      }
    }

    function showPreview(file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        if (previewImage) {
          previewImage.src = e.target.result;
        }
        if (fileNameEl) {
          fileNameEl.textContent = file.name;
        }
        if (fileSizeEl) {
          fileSizeEl.textContent = formatFileSize(file.size);
        }
        if (uploadState) {
          uploadState.classList.add('hidden');
        }
        if (previewState) {
          previewState.classList.remove('hidden');
        }
        // Announce to screen readers
        if (statusEl) {
          statusEl.textContent = 'Image selected: ' + file.name + ', ' + formatFileSize(file.size);
        }
      };
      reader.readAsDataURL(file);
    }

    function resetUpload() {
      if (screenshotInput) {
        screenshotInput.value = '';
      }
      if (previewImage) {
        previewImage.src = '';
      }
      if (fileNameEl) {
        fileNameEl.textContent = '';
      }
      if (fileSizeEl) {
        fileSizeEl.textContent = '';
      }
      if (uploadState) {
        uploadState.classList.remove('hidden');
      }
      if (previewState) {
        previewState.classList.add('hidden');
      }
      clearError();
      // Announce to screen readers
      if (statusEl) {
        statusEl.textContent = 'Image removed. Ready to upload a new image.';
      }
    }

    function handleFile(file) {
      clearError();

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        showError('Please upload a JPG, PNG, or WebP image');
        resetUpload();
        return;
      }

      // Validate file size
      if (file.size > MAX_SIZE_BYTES) {
        showError('Screenshot must be less than 5MB');
        resetUpload();
        return;
      }

      // Show preview
      showPreview(file);
    }

    if (screenshotInput) {
      screenshotInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          handleFile(this.files[0]);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetUpload();
        // Focus back to upload area for keyboard users
        if (screenshotInput) {
          screenshotInput.focus();
        }
      });
    }

    // Drag and drop support
    if (uploadContainer) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, function() {
          uploadContainer.classList.add('border-swiss-red', 'bg-red-50');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        uploadContainer.addEventListener(eventName, function() {
          uploadContainer.classList.remove('border-swiss-red', 'bg-red-50');
        });
      });

      uploadContainer.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files[0]) {
          // Set the file to the input for form submission
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(dt.files[0]);
          if (screenshotInput) {
            screenshotInput.files = dataTransfer.files;
          }
          handleFile(dt.files[0]);
        }
      });
    }
    ```

- [x] **Task 3: Update Validation Script** (AC: 3, 4)
  > **Purpose:** This is the FORM SUBMIT validator - catches any validation that might slip through.
  > Complements the inline script (Task 2) which provides immediate feedback.

  - [x] MODIFY `src/scripts/submission-form.js`:
    - FIND the `screenshot:` validator in the `validators` object
    - UPDATE to include file type validation (currently only has size check):
    ```javascript
    screenshot: (value, input) => {
      if (!input || !input.files || input.files.length === 0) {
        return 'Screenshot is required';
      }
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return 'Please upload a JPG, PNG, or WebP image';
      }
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeBytes) {
        return 'Screenshot must be less than 5MB';
      }
      return true;
    },
    ```
    - **Note:** The inline script in submit.njk handles immediate validation feedback; the submission-form.js handles validation on form submit

- [x] **Task 4: Add CSS Enhancements** (AC: 6)
  > **Note:** Tailwind 3.x includes `sr-only` utility by default - NO custom CSS needed for screen reader text.

  - [x] ADD to `src/styles/main.css` in the `@layer components` section:
    ```css
    /* Screenshot upload error state - matches form-input pattern */
    #screenshot-upload-container[aria-invalid="true"],
    #screenshot-upload-container.error {
      @apply border-red-600;
    }
    ```
  - [x] **OPTIONAL** - drag-over state is handled inline via JavaScript classList toggle, but can add explicit class if preferred:
    ```css
    #screenshot-upload-container.drag-over {
      @apply border-swiss-red bg-red-50;
    }
    ```

- [x] **Task 5: Add E2E Tests** (AC: all)
  > **Test Buffer Note:** Tests use `Buffer.alloc()` which creates valid file data but NOT valid image pixels.
  > FileReader.readAsDataURL will produce a data URL, but browser won't render meaningful preview.
  > This is acceptable - tests verify functionality (file selection, validation, state changes), not visual rendering.

  - [x] ADD new test.describe block to `tests/e2e/submission-form.spec.js`:
    ```javascript
    test.describe('Screenshot Upload with Preview (Story 4.3)', () => {
      test('shows upload area with instructions by default', async ({ page }) => {
        const uploadState = page.locator('#screenshot-upload-state');
        await expect(uploadState).toBeVisible();
        await expect(page.locator('#screenshot-helper')).toContainText('Click to upload or drag and drop');
      });

      test('shows preview image after file selection', async ({ page }) => {
        // Create a test image
        const buffer = Buffer.alloc(100);
        await page.setInputFiles('#screenshot', {
          name: 'test-image.png',
          mimeType: 'image/png',
          buffer: buffer
        });

        await expect(page.locator('#screenshot-preview-state')).toBeVisible();
        await expect(page.locator('#screenshot-preview-image')).toBeVisible();
        await expect(page.locator('#screenshot-upload-state')).toBeHidden();
      });

      test('displays file name after selection', async ({ page }) => {
        await page.setInputFiles('#screenshot', {
          name: 'my-design-screenshot.png',
          mimeType: 'image/png',
          buffer: Buffer.alloc(100)
        });

        await expect(page.locator('#screenshot-file-name')).toContainText('my-design-screenshot.png');
      });

      test('displays file size in human-readable format', async ({ page }) => {
        // Create a ~1.5MB buffer
        const buffer = Buffer.alloc(1.5 * 1024 * 1024);
        await page.setInputFiles('#screenshot', {
          name: 'large-image.png',
          mimeType: 'image/png',
          buffer: buffer
        });

        await expect(page.locator('#screenshot-file-size')).toContainText('MB');
      });

      test('shows error for files over 5MB', async ({ page }) => {
        // Create a 6MB buffer
        const buffer = Buffer.alloc(6 * 1024 * 1024);
        await page.setInputFiles('#screenshot', {
          name: 'huge-image.png',
          mimeType: 'image/png',
          buffer: buffer
        });

        await expect(page.locator('#screenshot-error')).toBeVisible();
        await expect(page.locator('#screenshot-error')).toContainText('less than 5MB');
        // Preview should not be shown
        await expect(page.locator('#screenshot-preview-state')).toBeHidden();
      });

      test('shows error for non-image files', async ({ page }) => {
        await page.setInputFiles('#screenshot', {
          name: 'document.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.alloc(100)
        });

        await expect(page.locator('#screenshot-error')).toBeVisible();
        await expect(page.locator('#screenshot-error')).toContainText('JPG, PNG, or WebP');
      });

      test('remove button clears preview and resets input', async ({ page }) => {
        await page.setInputFiles('#screenshot', {
          name: 'test-image.png',
          mimeType: 'image/png',
          buffer: Buffer.alloc(100)
        });

        await expect(page.locator('#screenshot-preview-state')).toBeVisible();

        await page.click('#screenshot-remove-btn');

        await expect(page.locator('#screenshot-preview-state')).toBeHidden();
        await expect(page.locator('#screenshot-upload-state')).toBeVisible();
      });

      test('remove button has accessible label', async ({ page }) => {
        await page.setInputFiles('#screenshot', {
          name: 'test-image.png',
          mimeType: 'image/png',
          buffer: Buffer.alloc(100)
        });

        await expect(page.locator('#screenshot-remove-btn')).toHaveAttribute('aria-label', 'Remove selected image');
      });

      test('remove button meets 44px touch target', async ({ page }) => {
        await page.setInputFiles('#screenshot', {
          name: 'test-image.png',
          mimeType: 'image/png',
          buffer: Buffer.alloc(100)
        });

        const removeBtn = page.locator('#screenshot-remove-btn');
        const box = await removeBtn.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
      });

      test('can replace image by selecting a new file', async ({ page }) => {
        // Select first image
        await page.setInputFiles('#screenshot', {
          name: 'first-image.png',
          mimeType: 'image/png',
          buffer: Buffer.alloc(100)
        });

        await expect(page.locator('#screenshot-file-name')).toContainText('first-image.png');

        // Select second image (simulating new file selection via remove + re-select)
        await page.click('#screenshot-remove-btn');
        await page.setInputFiles('#screenshot', {
          name: 'second-image.png',
          mimeType: 'image/png',
          buffer: Buffer.alloc(200)
        });

        await expect(page.locator('#screenshot-file-name')).toContainText('second-image.png');
      });

      test('screen reader status element exists', async ({ page }) => {
        const statusEl = page.locator('#screenshot-status');
        await expect(statusEl).toBeAttached();
        await expect(statusEl).toHaveAttribute('aria-live', 'polite');
      });

      test('accepts valid JPG file', async ({ page }) => {
        await page.setInputFiles('#screenshot', {
          name: 'photo.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.alloc(100)
        });

        await expect(page.locator('#screenshot-preview-state')).toBeVisible();
        await expect(page.locator('#screenshot-error')).toBeHidden();
      });

      test('accepts valid WebP file', async ({ page }) => {
        await page.setInputFiles('#screenshot', {
          name: 'image.webp',
          mimeType: 'image/webp',
          buffer: Buffer.alloc(100)
        });

        await expect(page.locator('#screenshot-preview-state')).toBeVisible();
        await expect(page.locator('#screenshot-error')).toBeHidden();
      });
    });
    ```

## Dev Notes

### Existing Validation Infrastructure (REUSE)

Story 4.1 created comprehensive validation in `src/scripts/submission-form.js`. This story MODIFIES the screenshot validator to add file type validation messaging, but the validation structure remains the same.

| Function | Purpose | Lines |
|----------|---------|-------|
| `showError(fieldName, message)` | Display error with aria-invalid | 43-57 |
| `clearError(fieldName, markValid)` | Clear error state | 64-80 |
| `validateField(fieldName, applyValidStyle)` | Validate single field | 88-105 |

**The inline script in submit.njk handles IMMEDIATE preview/validation feedback. The external submission-form.js handles FORM SUBMIT validation.**

### FileReader API Pattern

```javascript
const reader = new FileReader();
reader.onload = function(e) {
  previewImage.src = e.target.result; // Data URL for preview
};
reader.readAsDataURL(file);
```

### File Size Formatting

```javascript
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
```

### DataTransfer API for Drag & Drop

```javascript
// When handling drop event, need to assign files to input
const dataTransfer = new DataTransfer();
dataTransfer.items.add(droppedFile);
fileInput.files = dataTransfer.files;
```

### Form Field → Sanity Mapping

See Story 4.1 for complete form field mapping. Screenshot-specific:
- Form field: `screenshot` → Sanity field: `screenshot` (image asset)
- Validation: Required, PNG/JPG/WebP only, max 5MB

### Technical Stack

Same tech stack as Stories 4.1/4.2 (Nunjucks, Tailwind 3.4.18, vanilla JS). Key additions:
- **FileReader API:** Native browser API for image preview (`readAsDataURL`)
- **DataTransfer API:** For drag & drop file assignment to input (supported in all modern browsers - Chrome, Firefox, Edge, Safari 14.1+)
- **No external libraries required**

### WCAG 2.1 AA Accessibility Requirements

1. **aria-live="polite"** - Announce file selection status to screen readers
2. **aria-label** - Descriptive labels for buttons
3. **Focus management** - Return focus to upload area after remove
4. **44px touch targets** - All interactive elements
5. **Error announcements** - Errors announced via aria-live region

### File Locations

**Modify:**
- `src/pages/submit.njk` - Enhanced screenshot upload HTML and JavaScript
- `src/scripts/submission-form.js` - Add file type validation to screenshot validator

**Create:**
- `tests/e2e/submission-form.spec.js` - Add ~14 new E2E tests (Story 4.3 test block)

### Dependencies

**Story 4.3 depends on:**
- Story 4.1: Submission Form Page (DONE) - form structure exists
- Story 4.2: Consent Checkboxes (DONE) - form validation infrastructure exists

**Stories depending on 4.3:**
- Story 4.4: Form Submission to Make Webhook (will send screenshot data)

### Testing Guidance

**Manual Testing:**
1. Open `/submit/` page
2. Click screenshot upload area - file picker should open
3. Select a valid PNG/JPG/WebP under 5MB - preview should appear
4. Verify file name and size are displayed
5. Click "Remove" button - preview should clear, upload state returns
6. Select a file over 5MB - error should appear, no preview
7. Select a PDF file - error should appear, no preview
8. Drag and drop an image - preview should appear
9. Test with screen reader - status should be announced
10. Test keyboard navigation - tab to upload, select, tab to remove

**E2E Test Coverage:**
- 15 tests covering all 8 acceptance criteria
- Total test count: 74 submission form tests, 236 total E2E tests

### Image Compression (Post-MVP Enhancement)

For better UX, consider client-side image compression before upload:
- Use canvas-based compression
- Target ~1MB for images over 2MB
- Maintain aspect ratio
- Only compress if necessary

**This is NOT in scope for Story 4.3 MVP.**

### Project Structure Notes

- All form-related code is in `src/pages/submit.njk`
- Shared validation in `src/scripts/submission-form.js`
- E2E tests in `tests/e2e/submission-form.spec.js`
- No changes needed to form-field macros (screenshot is custom)

### References

- [Source: docs/epics.md#Story-4.3] - Original story definition with BDD acceptance criteria
- [Source: docs/architecture.md#Form-Sanity-Field-Mapping] - `screenshot` field maps to Sanity `screenshot` image asset
- [Source: docs/prd.md#FR12] - Students can upload a screenshot of their design
- [Source: MDN FileReader API] - https://developer.mozilla.org/en-US/docs/Web/API/FileReader
- [Source: MDN Drag and Drop API] - https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed validation bug: `resetUpload()` was calling `clearError()` which hid error messages immediately after showing them. Created `resetUploadVisualState()` helper to separate visual reset from error clearing.

### Completion Notes List

- ✅ Implemented enhanced screenshot upload HTML structure with preview/upload state toggle
- ✅ Added FileReader-based image preview with thumbnail (max 300px width)
- ✅ Added human-readable file size display (B/KB/MB formatting)
- ✅ Implemented file type validation (PNG/JPG/WebP only) with immediate feedback
- ✅ Implemented file size validation (5MB max) with immediate feedback
- ✅ Added Remove button with 44px touch target and focus management
- ✅ Added drag & drop support with visual feedback (border + background highlight)
- ✅ Added screen reader announcements via aria-live region
- ✅ Updated submission-form.js validator with file type check
- ✅ Added CSS error state and drag-over styles
- ✅ Added 15 E2E tests covering all 8 acceptance criteria
- ✅ All 236 E2E tests pass (74 submission form tests including 15 Story 4.3 tests)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-17 | Story created with comprehensive context from Story 4.1, 4.2, architecture, and epics | SM Agent (Bob) |
| 2025-12-17 | **Validation review:** Applied 10 improvements (3 critical, 4 enhancements, 3 optimizations) - clarified validation architecture, fixed line number refs, added TL;DR, confirmed Tailwind sr-only, added CSS error state rule, streamlined tech stack | SM Agent (Bob) |
| 2025-12-17 | **Implementation complete:** All 5 tasks implemented - enhanced HTML, preview JavaScript, validation script, CSS, and E2E tests. Fixed validation bug where errors were hidden after showing. 234 tests pass. | Dev Agent (Amelia) |
| 2025-12-17 | **Code review fixes:** (1) Fixed JS to use `.error` CSS class instead of inline `border-swiss-red`; (2) Fixed JS to use `.drag-over` CSS class; (3) Added 2 missing tests for drag-over visual feedback and screen reader error announcements; (4) Updated test counts. 236 tests pass. | Dev Agent (Amelia) |

### File List

**Modified:**
- `src/pages/submit.njk` - Enhanced screenshot upload HTML + inline preview JavaScript
- `src/scripts/submission-form.js` - Added file type validation to screenshot validator
- `src/styles/main.css` - Added screenshot upload error state and drag-over CSS
- `tests/e2e/submission-form.spec.js` - Added 14 Story 4.3 E2E tests, updated 2 existing tests

