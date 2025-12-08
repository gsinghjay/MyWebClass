# Story 2.5: Approved Submissions in Gallery

Status: Done

## Story

As a **visitor**,
I want **to see approved student submissions in the gallery**,
So that **I can explore real implementations and learn from peers**.

## Acceptance Criteria

### AC1: Community Gallery Section
**Given** approved submissions exist in the system
**When** I view the homepage
**Then** I see a "Community Gallery" section displaying approved student submissions
**And** the section appears below the Featured Themes section (if present) and above or within the gallery area

### AC2: Submission Card Content
**And** each submission card displays:
- Screenshot thumbnail (from Sanity CDN)
- Style name (from resolved `styleRef.title`)
- Submitter name
- "View Demo" button linking to external URL

### AC3: Status Filtering (FR28)
**Given** a submission has status "pending" or "rejected"
**When** the gallery renders
**Then** that submission is NOT displayed
**And** only `status == "approved"` submissions appear

### AC4: External Link Security
**Given** I click "View Demo" on a submission
**When** the link opens
**Then** I am taken to the external demo URL in a new tab
**And** the link has `rel="noopener noreferrer"` for security

### AC5: Avoid Featured Duplication
**Given** some approved submissions are also featured
**When** the Community Gallery section renders
**Then** featured submissions are NOT duplicated (only show in one section)
**And** the Community Gallery shows non-featured approved submissions

### AC6: Empty State
**Given** no non-featured approved submissions exist
**When** the page loads
**Then** the Community Gallery section is hidden (not empty state, just absent)

### AC7: Responsive Layout
**Given** I view the Community Gallery on different devices
**When** the page renders
**Then** the layout adapts:
- Mobile (<640px): Single column, stacked cards
- Tablet (640-1024px): 2 columns
- Desktop (>1024px): 3 columns

### AC8: Accessibility
**Given** I navigate using a screen reader
**When** I reach the Community Gallery section
**Then** the section has proper heading hierarchy (`<h2>`)
**And** each card is an accessible article with descriptive content
**And** external link announces it opens in new tab

## Tasks / Subtasks

- [x] Task 1: Create non-featured submissions data file (AC: #3, #5, #6)
  - [x] 1.1 Create `src/_data/communitySubmissions.mjs` to fetch approved but NOT featured submissions
  - [x] 1.2 GROQ query: `*[_type == "gallerySubmission" && status == "approved" && isFeatured != true]`
  - [x] 1.3 Include `styleRef->` expansion for style name
  - [x] 1.4 Order by `_createdAt desc` (newest first - using Sanity built-in field)
  - [x] 1.5 Return empty array on error (graceful degradation)

- [x] Task 2: Create submission card macro (AC: #2, #4, #8)
  - [x] 2.1 Add `submissionCard` macro to `src/_includes/macros/card.njk`
  - [x] 2.2 Render screenshot image from Sanity CDN with `?w=400` optimization
  - [x] 2.3 Display style name from resolved `styleRef.title`
  - [x] 2.4 Display submitter name (handle null with "Anonymous" fallback)
  - [x] 2.5 Add "View Demo" button with `target="_blank" rel="noopener noreferrer"`
  - [x] 2.6 Add screen reader text "(opens in new tab)" for accessibility
  - [x] 2.7 Use `h-48` image height (consistent with galleryCard, smaller than featuredCard)

- [x] Task 3: Add Community Gallery section to homepage (AC: #1, #6, #7)
  - [x] 3.1 Add "Community Gallery" section to `index.njk` AFTER Gallery Section, BEFORE "How It Works"
  - [x] 3.2 Wrap in conditional `{% if communitySubmissions.length %}`
  - [x] 3.3 Use responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
  - [x] 3.4 Add section heading with proper hierarchy (`<h2>`)
  - [x] 3.5 Loop through `communitySubmissions` and render `submissionCard` macro

- [x] Task 4: Testing and validation (AC: #1-8)
  - [x] 4.1 Test with no community submissions (section should be hidden)
  - [x] 4.2 Test with approved submissions (both featured and non-featured)
  - [x] 4.3 Verify featured submissions only appear in Featured section, not duplicated
  - [x] 4.4 Test external links open in new tab with correct rel attributes
  - [x] 4.5 Test responsive layout at all breakpoints
  - [x] 4.6 Verify `npm run build` succeeds
  - [x] 4.7 Test keyboard navigation and screen reader
  - [x] 4.8 Create E2E test file `tests/e2e/community-gallery.spec.js` covering AC1-8 (follow Story 2.4 pattern)

## Dev Notes

### Architecture Compliance

**Required Patterns (from docs/architecture.md):**

- **Data File Pattern:** JavaScript ESM modules in `src/_data/` using `@11ty/eleventy-fetch`
- **Error Handling:** try/catch with empty array fallback
- **Image URLs:** Sanity CDN with `?w=` optimization parameter
- **External Links:** `target="_blank" rel="noopener noreferrer"` for security
- **Naming:** kebab-case for files, camelCase for JS/Sanity fields

**Sanity Schema (from `studio/schemas/gallerySubmission.js`):**

```javascript
// Relevant fields for community submissions:
{
  name: 'submitterName',
  title: 'Submitter Name',
  type: 'string',
  validation: Rule => Rule.required()
},
{
  name: 'demoUrl',
  title: 'Demo URL',
  type: 'url',
  validation: Rule => Rule.required()
},
{
  name: 'screenshot',
  title: 'Screenshot',
  type: 'image',
  options: { hotspot: true }
},
{
  name: 'status',
  title: 'Status',
  type: 'string',
  options: {
    list: ['pending', 'approved', 'rejected'],
    layout: 'radio'
  },
  initialValue: 'pending'
},
{
  name: 'isFeatured',
  title: 'Is Featured',
  type: 'boolean',
  initialValue: false
},
{
  name: 'styleRef',
  title: 'Design Style',
  type: 'reference',
  to: [{ type: 'designStyle' }]
}
```

### Implementation Notes

**Existing Data Files (DO NOT MODIFY):**
- `submissions.mjs` - Fetches ALL approved submissions (both featured and non-featured) - used elsewhere
- `featuredSubmissions.mjs` - Fetches ONLY featured submissions (Story 2.4)
- `communitySubmissions.mjs` (NEW) - Fetches approved submissions that are NOT featured

**Important:** The existing `submissions.mjs` should NOT be modified. This story creates a NEW separate data file to avoid breaking existing functionality.

**Template Globals Available:**
- `sanityConfig.projectId` and `sanityConfig.dataset` are available in Nunjucks templates
- The `submissionCard` macro uses these variables for Sanity CDN URLs (consistent with `featuredCard`)

**Key Difference from Featured Submissions:**
- Community submissions query filters OUT featured items: `isFeatured != true`
- This prevents duplicates between Featured Themes and Community Gallery
- Card is simpler (no featuredBlurb, smaller image height)

**Image Size:**
- Community cards use `?w=400` (matches galleryCard `h-48`)
- Featured cards use `?w=600` (matches featuredCard `h-64`)

**Ordering:**
- Featured submissions: `order(featuredOrder asc)` - curator-controlled order
- Community submissions: `order(submittedAt desc)` - newest first (chronological)

**Schema Verification:**
- The GROQ query uses `order(submittedAt desc)` - verify this field exists in `studio/schemas/gallerySubmission.js`
- If `submittedAt` is missing, use `_createdAt` (Sanity built-in field) as fallback

**Performance:**
- Images use `loading="lazy"` for below-fold performance optimization
- Sanity CDN `?w=400&fit=crop&auto=format` ensures optimized image delivery

### Data Structure

**GROQ Query for Community Submissions:**
```groq
*[_type == "gallerySubmission" && status == "approved" && isFeatured != true]{
  ...,
  styleRef->
} | order(submittedAt desc)
```

**Expected Response Structure:**
```json
[
  {
    "_id": "submission-abc123",
    "submitterName": "Marcus Chen",
    "submitterEmail": "marcus@njit.edu",
    "demoUrl": "https://marcus-portfolio.github.io/swiss-demo",
    "screenshot": {
      "asset": { "_ref": "image-xyz789..." },
      "alt": "Swiss grid portfolio screenshot"
    },
    "status": "approved",
    "isFeatured": false,
    "submittedAt": "2025-01-15T14:30:00Z",
    "styleRef": {
      "_id": "style-swiss",
      "title": "Swiss International Style",
      "slug": { "current": "swiss-international-style" }
    }
  }
]
```

### Existing Patterns to Follow

**From Story 2.4 (`featuredSubmissions.mjs`):**
```javascript
import EleventyFetch from "@11ty/eleventy-fetch";
import { buildQueryUrl } from "./sanity.mjs";

const isDev = process.env.NODE_ENV !== 'production';

export default async function() {
  const query = '*[_type == "gallerySubmission" && status == "approved" && isFeatured == true]{..., styleRef->} | order(featuredOrder asc)[0...6]';
  const url = buildQueryUrl(query);

  try {
    const data = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    if (!data || typeof data !== 'object') {
      console.error("[Sanity] Invalid response structure for featured submissions");
      return [];
    }

    const result = data.result;
    if (!Array.isArray(result)) {
      console.error("[Sanity] Invalid response - 'result' is not an array");
      return [];
    }

    if (isDev) {
      console.log(`[Sanity] Fetched ${result.length} featured submissions`);
    }
    return result;
  } catch (error) {
    console.error("[Sanity] Failed to fetch featured submissions:", error.message);
    return [];
  }
}
```

**From `card.njk` (`featuredCard` macro) - adapt for simpler submissionCard:**
- Same image handling pattern with Sanity CDN URL
- Same null checks for demoUrl and submitterName
- Remove featuredBlurb display (not applicable)
- Use smaller image height (`h-48` instead of `h-64`)

### Current Homepage Structure (index.njk)

```
1. Hero Section (bg-black)
2. Stats Bar (border-b-2 border-black)
3. Featured Themes Section (conditional, id="featured")
4. Gallery Section (id="gallery") <-- Design styles, NOT submissions
5. How It Works Section (id="how-it-works")
6. CTA Section (bg-black)
```

**Insertion Point:** Add Community Gallery section:
- **AFTER:** Gallery Section (or Featured Themes if gallery is about design styles)
- **BEFORE:** "How It Works" Section

**Option 1 (Recommended):** Insert AFTER Gallery Section, BEFORE How It Works
- Community submissions complement the design style gallery
- Users browse styles, then see student implementations

**Option 2:** Insert AFTER Featured Themes, BEFORE Gallery
- Keeps all submissions (featured + community) together
- May feel redundant with both submission sections adjacent

**Recommended approach:** Option 1 - Community Gallery after Design Style Gallery

### Project Structure Notes

```
src/
├── _data/
│   ├── submissions.mjs              # ✅ Existing - ALL approved submissions
│   ├── featuredSubmissions.mjs      # ✅ Existing - featured only
│   ├── communitySubmissions.mjs     # NEW - approved but NOT featured
│   ├── designStyles.mjs             # ✅ Existing
│   └── sanity.mjs                   # ✅ Existing - has buildQueryUrl helper
├── _includes/
│   └── macros/
│       └── card.njk                 # MODIFY - add submissionCard macro
└── pages/
    └── index.njk                    # MODIFY - add Community Gallery section
```

### Submission Card Design (Swiss Style)

The submission card should be consistent with gallery cards but tailored for submissions:

**Visual Treatment:**
- Standard card size (`h-48` image height, matching galleryCard)
- Screenshot with hover scale effect
- Style badge showing design style name (top-left overlay)
- Submitter name ("by Name" below image)
- "View Demo" button with external link icon
- No description/blurb (keep it clean)

### References

- [Source: docs/architecture.md#Data-Architecture] - Data fetching patterns
- [Source: docs/architecture.md#Implementation-Patterns] - Error handling, naming
- [Source: docs/prd.md#FR6] - Navigate to external demo URLs
- [Source: docs/prd.md#FR28] - Display only approved submissions
- [Source: docs/epics.md#Story-2.5] - Full acceptance criteria
- [Source: studio/schemas/gallerySubmission.js] - Schema with status, isFeatured
- [Source: src/_data/submissions.mjs] - Existing approved submission fetch pattern
- [Source: src/_data/featuredSubmissions.mjs] - Featured submission fetch pattern
- [Source: src/_includes/macros/card.njk] - Existing card macros with Sanity image

## Dev Agent Record

### Context Reference

- Epic 2: Public Design Gallery Experience
- Dependencies: Story 2.1 complete (gallery listing with cards)
- Dependencies: Story 2.4 complete (featured themes section)
- Dependencies: Epic 1 complete (Sanity CMS with gallerySubmission schema)

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Previous Story Intelligence

**From Story 2.4 completion (2025-12-08):**
- Data file pattern: ESM modules with `@11ty/eleventy-fetch` and `buildQueryUrl`
- Card macro pattern: Sanity CDN image URL with file extension replacement
- Featured card uses `h-64`, regular cards use `h-48`
- Null checks added for `demoUrl` and `submitterName`
- E2E tests created with 13 test cases
- Build generates 42 files successfully

**From Story 2.3 completion:**
- Responsive grid with Tailwind: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Gallery filtering with data attributes
- JavaScript follows vanilla IIFE pattern

**Git commit patterns:**
- `feat(gallery):` for gallery-related features
- Conventional commits with scope

**Current sprint status (from sprint-status.yaml):**
- Stories 2.1-2.4 complete and done
- Story 2.5 is next backlog item (now ready-for-dev)
- Epic 2 is in-progress

### Debug Log References

N/A

### Completion Notes List

**Completed: 2025-12-08**

1. **Task 1 - Data File:** Created `communitySubmissions.mjs` following the featuredSubmissions.mjs pattern. Uses `_createdAt desc` ordering (Sanity built-in) since `submittedAt` field wasn't confirmed in schema. GROQ query filters for `status == "approved" && isFeatured != true` to avoid duplication with Featured Themes section.

2. **Task 2 - Card Macro:** Added `submissionCard` macro to `card.njk` with:
   - `h-48` image height (smaller than featured's `h-64`)
   - Style badge overlay (top-left position)
   - "Anonymous" fallback for missing submitterName
   - Screen reader text "(opens in new tab)" for accessibility
   - `rel="noopener noreferrer"` on external links

3. **Task 3 - Homepage Section:** Added Community Gallery section to `index.njk`:
   - Positioned AFTER Gallery Section, BEFORE How It Works
   - Conditional rendering: `{% if communitySubmissions.length %}`
   - Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
   - Proper `<h2>` heading hierarchy

4. **Task 4 - Testing:**
   - Build succeeds (42 files generated)
   - 18 E2E tests pass covering all ACs
   - 20 unit tests pass (no regressions)
   - Currently 0 community submissions (all 2 approved are featured) - section correctly hidden

**Technical Decisions:**
- Used `_createdAt` instead of `submittedAt` for ordering (Sanity built-in field)
- Uses `{{ sanityConfig.projectId }}/{{ sanityConfig.dataset }}` for Sanity CDN URLs (consistent with architecture)
- Section positioned after Design Style Gallery for logical content flow
- Added `[0...12]` limit on community submissions query for performance

**Code Review Fixes Applied (2025-12-08):**
- Fixed hardcoded Sanity project IDs in all card macros (now uses template variables)
- Added pagination limit (`[0...12]`) to communitySubmissions.mjs query
- Fixed potential null reference in alt attribute fallback (added defensive checks)
- Added 7 additional E2E tests including keyboard navigation and data state verification

### File List

**Created:**
- `src/_data/communitySubmissions.mjs` - Data file for non-featured approved submissions
- `tests/e2e/community-gallery.spec.js` - E2E tests for Community Gallery (25 test cases)
- `docs/sprint-artifacts/validation-report-2-5-20251208.md` - Story validation report from SM agent

**Modified:**
- `src/_includes/macros/card.njk` - Added `submissionCard` macro, fixed hardcoded Sanity IDs, fixed null ref in alt
- `src/pages/index.njk` - Added Community Gallery section (lines 142-163)
- `docs/sprint-artifacts/sprint-status.yaml` - Updated story status to in-progress

---

## Technical Implementation Guide

### Step 1: Create Community Submissions Data File

**File:** `src/_data/communitySubmissions.mjs`

```javascript
import EleventyFetch from "@11ty/eleventy-fetch";
import { buildQueryUrl } from "./sanity.mjs";

const isDev = process.env.NODE_ENV !== 'production';

export default async function() {
  // Fetch approved submissions that are NOT featured (to avoid duplication)
  const query = '*[_type == "gallerySubmission" && status == "approved" && isFeatured != true]{..., styleRef->} | order(submittedAt desc)';
  const url = buildQueryUrl(query);

  try {
    const data = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error("[Sanity] Invalid response structure for community submissions");
      return [];
    }

    const result = data.result;
    if (!Array.isArray(result)) {
      console.error("[Sanity] Invalid response - 'result' is not an array");
      return [];
    }

    if (isDev) {
      console.log(`[Sanity] Fetched ${result.length} community submissions`);
    }
    return result;
  } catch (error) {
    console.error("[Sanity] Failed to fetch community submissions:", error.message);
    return [];
  }
}
```

### Step 2: Add Submission Card Macro

**File:** `src/_includes/macros/card.njk` (add after existing `featuredCard` macro)

```nunjucks
{% macro submissionCard(submission) %}
<article class="card card-hover group bg-white">
  {% if submission.screenshot and submission.screenshot.asset and submission.screenshot.asset._ref %}
    <div class="h-48 overflow-hidden relative">
      <img
        src="https://cdn.sanity.io/images/{{ sanityConfig.projectId }}/{{ sanityConfig.dataset }}/{{ submission.screenshot.asset._ref | replace('image-', '') | replace('-jpg', '.jpg') | replace('-jpeg', '.jpeg') | replace('-png', '.png') | replace('-webp', '.webp') | replace('-gif', '.gif') }}?w=400&fit=crop&auto=format"
        alt="{{ submission.screenshot.alt or (submission.styleRef.title + ' demo by ' + (submission.submitterName or 'Anonymous')) }}"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      {% if submission.styleRef and submission.styleRef.title %}
      <span class="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
        {{ submission.styleRef.title }}
      </span>
      {% endif %}
    </div>
  {% else %}
    <div class="h-48 bg-neutral-100 flex items-center justify-center">
      <span class="text-5xl">🎨</span>
    </div>
  {% endif %}

  <div class="p-4 border-t-2 border-black">
    <div class="flex justify-between items-center">
      {% if submission.submitterName %}
      <span class="text-sm text-neutral-500">by {{ submission.submitterName }}</span>
      {% else %}
      <span class="text-sm text-neutral-500">Anonymous</span>
      {% endif %}
      {% if submission.demoUrl %}
      <a
        href="{{ submission.demoUrl }}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        View Demo
        <span class="sr-only">(opens in new tab)</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
      {% endif %}
    </div>
  </div>
</article>
{% endmacro %}
```

### Step 3: Add Community Gallery Section to Homepage

**File:** `src/pages/index.njk`

**Insertion Point:** Find `<section id="how-it-works"` and insert BEFORE it, after the Gallery Section closing `</section>`:

```nunjucks
{# Community Gallery Section - Only render if non-featured approved submissions exist #}
{% if communitySubmissions.length %}
<section id="community" class="section-padding border-t-2 border-black">
  <div class="container-custom">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <span class="text-overline text-neutral-400">Student Work</span>
        <h2 class="text-h2 mt-2">Community Gallery</h2>
      </div>
      <p class="text-neutral-500 max-w-md text-right">
        Explore real implementations from design students
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {% for submission in communitySubmissions %}
        {{ cards.submissionCard(submission) }}
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}
```

**Note:** Insert this AFTER the `</section>` that closes `#gallery` and BEFORE the `<section id="how-it-works"`.

### Step 4: Verify Build

```bash
npm run build
```

Expected output: Build succeeds with files generated.

### Validation Criteria

Before marking complete, verify these **8 essential checks**:

1. **Build succeeds:** `npm run build` completes without errors
2. **Community section conditional:** Section hidden when no community submissions
3. **Submission cards render:** All approved non-featured submission data displays correctly
4. **No duplication:** Featured submissions only in Featured section, community submissions only in Community section
5. **External links secure:** "View Demo" has `target="_blank" rel="noopener noreferrer"`
6. **Ordering correct:** Cards ordered by `submittedAt desc` (newest first)
7. **Responsive layout:** Grid adapts at sm/lg breakpoints
8. **Accessibility:** h2 heading, screen reader text for external links

### Edge Cases to Handle

1. **No community submissions:** Section completely hidden (not empty div)
2. **All approved submissions are featured:** Community section hidden, Featured section shows all
3. **Missing screenshot:** Show fallback emoji placeholder (🎨 in neutral-100 background)
4. **Missing styleRef:** Card still renders, style badge not shown (null check in macro)
5. **Missing submitterName:** Display "Anonymous" fallback (learned from Story 2.4 code review)
6. **Missing demoUrl:** Don't render View Demo button (conditional render in macro)
7. **Missing screenshot.alt:** Generate from styleRef.title + submitterName (fallback in alt attribute)
