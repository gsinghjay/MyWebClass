# Story 4.5: Create Sanity Document from Form Submission

Status: done

## Story

As a **system**,
I want **form submissions to create Sanity documents**,
so that **submissions are stored in the CMS for instructor review**.

## Architecture Decision Notice

> **IMPORTANT:** The original epic specified "Make Scenario" for Sanity document creation. The Architecture document (Section: API & Communication Patterns) changed this to **Netlify Functions** for better integration:
>
> ```
> Form POST → Netlify Function (/.netlify/functions/submit-form)
>        ↓
> Netlify Function:
>   1. Create Sanity document (status: pending) [blocking]
>   2. Send Discord webhook [non-blocking]
>   3. Create Airtable record [non-blocking]
> ```
>
> [Source: docs/architecture.md#API-Communication-Patterns]

**This story validates and extends the Netlify function implementation from Story 4.4.**

## Acceptance Criteria

### AC1: Sanity Document Creation
- **Given** the Netlify function receives a valid form submission
- **When** processing completes successfully
- **Then** a new `gallerySubmission` document is created in Sanity with:
  - `submitterName`: from form `name`
  - `submitterEmail`: from form `email`
  - `styleRef`: reference to designStyle (looked up by slug)
  - `demoUrl`: from form `demoUrl`
  - `authenticityExplanation`: from form `authenticity`
  - `hasPublicDisplayConsent`: from form `consent` (boolean)
  - `hasMarketingConsent`: from form `marketing` (boolean)
  - `status`: `"pending"` (always)
  - `submittedAt`: current ISO 8601 timestamp
  - `isFeatured`: `false`
  - `screenshot`: Sanity image asset reference (if uploaded)

### AC2: Screenshot Asset Upload
- **Given** the form submission includes a base64-encoded screenshot
- **When** the Netlify function processes the submission
- **Then** the screenshot is uploaded to Sanity Assets API
- **And** the returned asset ID is used as a reference in the document
- **And** the image is accessible via Sanity CDN URLs

### AC3: Design Style Reference Lookup
- **Given** the form submission includes a style slug (e.g., "swiss-international")
- **When** the Netlify function processes the submission
- **Then** the function queries Sanity for the designStyle document with matching slug
- **And** the `styleRef` field is set to reference that document's `_id`
- **And** if no matching style is found, the reference is omitted (not an error)

### AC4: Error Handling - Sanity Mutation
- **Given** the Sanity API returns an error
- **When** document creation fails
- **Then** the Netlify function returns HTTP 500
- **And** the error is logged with details
- **And** the user sees a clear error message

### AC5: Screenshot Upload Failure Handling
- **Given** the screenshot upload to Sanity Assets fails
- **When** an error occurs during image upload
- **Then** the document is still created (without screenshot)
- **And** the response includes a warning about the screenshot failure
- **And** the error is logged for debugging

### AC6: Environment Variable Configuration
- **Given** the Netlify function requires Sanity credentials
- **When** the function executes
- **Then** it uses environment variables:
  - `SANITY_PROJECT_ID` (required)
  - `SANITY_DATASET` (defaults to "production")
  - `SANITY_API_TOKEN` (required, write access)

### AC7: Integration Test - End-to-End Verification
- **Given** all environment variables are configured
- **When** a test submission is processed
- **Then** the document appears in Sanity Studio
- **And** all fields are correctly mapped
- **And** the screenshot (if provided) is visible in the document

## Implementation Status

**This functionality is ALREADY IMPLEMENTED** in `netlify/functions/submit-form.js` as part of Story 4.4.

### Current Implementation Analysis

| AC | Requirement | Implementation Status | Location |
|----|-------------|----------------------|----------|
| AC1 | Sanity Document Creation | ✅ Implemented | `submit-form.js:60-131` |
| AC2 | Screenshot Asset Upload | ✅ Implemented | `submit-form.js:32-55` |
| AC3 | Style Reference Lookup | ✅ Implemented | `submit-form.js:91-112` |
| AC4 | Sanity Error Handling | ✅ Implemented | `submit-form.js:125-128, 324-333` |
| AC5 | Screenshot Failure Handling | ✅ Implemented | `submit-form.js:278-294, 318-320` |
| AC6 | Environment Variables | ✅ Implemented | `submit-form.js:21-27` |
| AC7 | E2E Verification | ⚠️ Requires Manual Test | N/A |

## Tasks / Subtasks

- [x] **Task 1: Verify Sanity Document Creation** (AC: 1, 7)
  - [x] Code review verified `createSanityDocument()` at lines 60-131
  - [x] All 11 fields correctly mapped:
    - `submitterName` ← `submission.name` ✓
    - `submitterEmail` ← `submission.email` ✓
    - `styleRef` ← GROQ lookup by slug (lines 91-112) ✓
    - `demoUrl` ← `submission.demoUrl` ✓
    - `authenticityExplanation` ← `submission.authenticity` ✓
    - `hasPublicDisplayConsent` ← boolean coercion (line 72) ✓
    - `hasMarketingConsent` ← boolean coercion (line 73) ✓
    - `status` ← `"pending"` (line 74) ✓
    - `submittedAt` ← `new Date().toISOString()` (line 75) ✓
    - `isFeatured` ← `false` (line 76) ✓
    - `screenshot` ← asset reference (lines 78-86) ✓

- [x] **Task 2: Verify Screenshot Upload** (AC: 2, 5)
  - [x] `uploadImageToSanity()` at lines 32-55 uploads to Sanity Assets API
  - [x] Returns `document._id` as asset reference
  - [x] Screenshot failure is non-blocking (lines 289-293)
  - [x] `screenshotUploadFailed` flag triggers warning in response (lines 318-320)
  - [x] Error logged for debugging (line 290)

- [x] **Task 3: Verify Style Reference Lookup** (AC: 3)
  - [x] GROQ query at lines 91-93 looks up by `slug.current`
  - [x] If found, sets `styleRef._ref` (line 103)
  - [x] If not found, deletes `styleRef` from document (line 106)
  - [x] Catch block also removes reference on error (lines 108-111)

- [x] **Task 4: Code Verification Complete** (AC: 1-6)
  - [x] All acceptance criteria verified in code
  - [x] Environment variables configured (lines 21-23, checked at 244)
  - [x] Error handling returns HTTP 500 with details (lines 324-332)
  - [x] Manual E2E testing deferred to deployment (AC7 note: requires live Sanity)

## Dev Notes

### Why No Code Changes Required

The original Story 4.5 was designed around a **Make.com scenario** architecture. However, the Architecture document made a key decision to use **Netlify Functions** instead:

> "Form Handling: Netlify Function endpoint"
> [Source: docs/architecture.md#Decision-Priority-Analysis]

Story 4.4 implemented the complete pipeline including:
1. `uploadImageToSanity()` - Uploads base64 image to Sanity Assets API
2. `createSanityDocument()` - Creates gallerySubmission with all required fields
3. Style lookup by slug (GROQ query)
4. Non-blocking screenshot failure handling
5. Comprehensive error logging

### Sanity Document Schema (for reference)

```javascript
// gallerySubmission schema fields
{
  _type: 'gallerySubmission',
  submitterName: String,        // Required
  submitterEmail: String,       // Required, email format
  styleRef: Reference,          // Reference to designStyle
  demoUrl: URL,                 // Required
  screenshot: Image,            // Sanity image asset
  authenticityExplanation: Text, // Required
  hasPublicDisplayConsent: Boolean, // Required
  hasMarketingConsent: Boolean,  // Optional
  status: String,               // 'pending' | 'approved' | 'rejected'
  submittedAt: DateTime,        // Auto-set
  reviewedAt: DateTime,         // Set on review
  isFeatured: Boolean,          // Default: false
  featuredBlurb: Text,          // Only if isFeatured
  feedbackNotes: Text           // For rejection feedback
}
```

[Source: docs/architecture.md#Form-Sanity-Field-Mapping]

### Form Field to Sanity Field Mapping

| Form Field | Netlify Function Key | Sanity Field |
|------------|---------------------|--------------|
| `name` | `submission.name` | `submitterName` |
| `email` | `submission.email` | `submitterEmail` |
| `style` | `submission.style` | `styleRef` (lookup by slug) |
| `demoUrl` | `submission.demoUrl` | `demoUrl` |
| `screenshot` | `submission.screenshot` (base64) | `screenshot` (asset ref) |
| `authenticity` | `submission.authenticity` | `authenticityExplanation` |
| `consent` | `submission.consent` | `hasPublicDisplayConsent` |
| `marketing` | `submission.marketing` | `hasMarketingConsent` |
| (auto) | N/A | `status` = "pending" |
| (auto) | N/A | `submittedAt` = now() |
| (auto) | N/A | `isFeatured` = false |

### Sanity Assets API Pattern

```javascript
// Image upload to Sanity Assets
POST https://{projectId}.api.sanity.io/v2021-10-21/assets/images/{dataset}
Content-Type: image/png
Authorization: Bearer {token}
Body: <binary image data>

// Response
{ "document": { "_id": "image-xxx-yyy-png" } }

// Reference in document
{
  "screenshot": {
    "_type": "image",
    "asset": {
      "_type": "reference",
      "_ref": "image-xxx-yyy-png"
    }
  }
}
```

### Previous Story Learnings (from 4.4)

1. **Screenshot failure is non-blocking**: The implementation correctly continues without screenshot if upload fails
2. **Style lookup is defensive**: If style slug not found, reference is omitted rather than causing error
3. **Boolean parsing**: Consent values come as strings ("true"/"false") and must be coerced
4. **Error response includes details**: Server errors include `error.message` for debugging

### Project Structure Notes

**Files implementing this functionality:**
- `netlify/functions/submit-form.js` - Complete implementation
- `studio/schemas/gallerySubmission.js` - Sanity schema definition

**No new files required** - this story validates existing implementation.

### Environment Variables Required

```bash
# Required for Sanity document creation
SANITY_PROJECT_ID=xxx          # Sanity project ID
SANITY_DATASET=production      # Dataset name
SANITY_API_TOKEN=sk-xxx        # Write-access token

# Already configured in Netlify dashboard
```

### Testing Guidance

**Manual Verification Steps:**
1. Open `/submit/` page on deployed site
2. Fill form with valid test data
3. Submit and wait for success message
4. Log into Sanity Studio
5. Navigate to Gallery Submissions → Filter by "pending"
6. Verify test submission appears with correct data
7. Click on submission to verify:
   - Screenshot displays correctly
   - Style reference links to correct design style
   - All text fields match form input

**E2E Test Note:**
Full end-to-end testing requires deployed Netlify function with valid Sanity credentials. The E2E tests in `tests/e2e/submission-form.spec.js` verify client-side behavior but cannot verify Sanity document creation without mocking.

### Dependencies

**Story 4.5 depends on:**
- Story 4.1: Submission Form Page (DONE)
- Story 4.2: Consent Checkboxes (DONE)
- Story 4.3: Screenshot Upload (DONE)
- Story 4.4: Form Submission Handler (DONE)
- Epic 1: Sanity Studio Setup (DONE) - schemas must exist

**Stories depending on 4.5:**
- Story 4.6: Discord Notification (partially implemented in 4.4)
- Story 4.7: Airtable CRM Sync (partially implemented in 4.4)
- Story 5.2: View Pending Submissions Queue (requires documents to exist)

### References

- [Source: docs/epics.md#Story-4.5] - Original story definition
- [Source: docs/architecture.md#API-Communication-Patterns] - Netlify Functions decision
- [Source: docs/architecture.md#Form-Sanity-Field-Mapping] - Field mapping spec
- [Source: docs/prd.md#FR16] - System stores submissions in Sanity CMS with pending status
- [Source: Sanity Assets API] - https://www.sanity.io/docs/http-api-assets
- [Source: Sanity Mutations API] - https://www.sanity.io/docs/http-mutations

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - Verification story, no new code implementation.

### Completion Notes List

- **AC1-AC6 Verified**: All code implementation requirements confirmed in `netlify/functions/submit-form.js`
- **Field Mapping**: All 11 Sanity document fields correctly mapped from form submission
- **Screenshot Upload**: `uploadImageToSanity()` correctly uploads base64 to Sanity Assets API and returns asset reference
- **Style Lookup**: GROQ query defensively handles missing styles by omitting reference
- **Error Handling**: HTTP 500 returned with error details on Sanity mutation failure
- **Screenshot Failure**: Non-blocking with warning in response (added in Story 4.4 code review)
- **AC7 Note**: Manual E2E verification requires deployed site with Sanity credentials - code verified

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-17 | Story created - documents existing implementation from 4.4 and defines verification tasks | SM Agent (Bob) |
| 2025-12-17 | **Verification complete**: All AC1-AC6 verified in code. Story marked done. AC7 (manual E2E) requires deployment. | Dev Agent (Amelia) |

### File List

**Existing files (no modifications):**
- `netlify/functions/submit-form.js` - Implements all AC1-AC6
- `studio/schemas/gallerySubmission.js` - Sanity schema definition

**Documentation only:**
- `docs/sprint-artifacts/4-5-make-scenario-create-sanity-document.md` - This story file
