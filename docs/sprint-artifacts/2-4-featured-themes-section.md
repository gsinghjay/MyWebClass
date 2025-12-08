# Story 2.4: Featured Themes Section

Status: Done

## Story

As a **visitor**,
I want **to see featured/highlighted design submissions prominently displayed**,
So that **I can quickly discover the best examples of each style**.

## Acceptance Criteria

### AC1: Featured Section Display
**Given** I visit the homepage
**When** the page loads
**Then** I see a "Featured Themes" section above or prominently within the gallery

### AC2: Featured Item Content
**And** featured items display:
- Larger card treatment than regular gallery items
- Screenshot image (from approved submission)
- Style name (from `styleRef`)
- Submitter name
- Featured blurb (curator's highlight text)
- "View Demo" button linking to external URL

### AC3: Featured Ordering
**Given** there are multiple featured submissions
**When** the section renders
**Then** featured items are displayed in order set by curator (`featuredOrder` field, ascending)
**And** maximum of 6 featured items shown (hardcoded in query for MVP simplicity)

### AC4: Empty State Handling
**Given** no submissions are marked as featured
**When** the page loads
**Then** the featured section is hidden (not empty state, just absent)

### AC5: External Link Security
**Given** I click "View Demo" on a featured item
**When** the link opens
**Then** the demo opens in a new tab
**And** the link has `rel="noopener noreferrer"` for security

### AC6: Responsive Layout
**Given** I view the featured section on different devices
**When** the page renders
**Then** the layout adapts:
- Mobile (<640px): Single column, stacked cards
- Tablet (640-1024px): 2 columns
- Desktop (>1024px): 3 columns with larger visual treatment

### AC7: Accessibility
**Given** I navigate using a screen reader
**When** I reach the featured section
**Then** the section has proper heading hierarchy (`<h2>`)
**And** each card is an accessible article with descriptive content
**And** external link announces it opens in new tab

## Tasks / Subtasks

- [x] Task 1: Create featured submissions data file (AC: #3, #4)
  - [x] 1.1 Create `src/_data/featuredSubmissions.mjs` to fetch `isFeatured == true` submissions
  - [x] 1.2 Include `styleRef->` expansion for style name
  - [x] 1.3 Order by `featuredOrder asc` in GROQ query
  - [x] 1.4 Limit to 6 items in query (hardcoded `[0...6]` for MVP)
  - [x] 1.5 Return empty array on error (graceful degradation)

- [x] Task 2: Create featured card macro (AC: #2, #5, #7)
  - [x] 2.1 Add `featuredCard` macro to `src/_includes/macros/card.njk`
  - [x] 2.2 Render screenshot image from Sanity CDN
  - [x] 2.3 Display style name from resolved `styleRef.title`
  - [x] 2.4 Display submitter name
  - [x] 2.5 Display featured blurb
  - [x] 2.6 Add "View Demo" button with `target="_blank" rel="noopener noreferrer"`
  - [x] 2.7 Larger card treatment with prominent visual styling

- [x] Task 3: Add featured section to homepage (AC: #1, #4, #6)
  - [x] 3.1 Add "Featured Themes" section between Stats Bar and Gallery sections in `index.njk`
  - [x] 3.2 Wrap in conditional `{% if featuredSubmissions.length %}`
  - [x] 3.3 Use responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
  - [x] 3.4 Add section heading with proper hierarchy
  - [x] 3.5 Loop through `featuredSubmissions` and render `featuredCard` macro

- [x] Task 4: Testing and validation (AC: #1-7)
  - [x] 4.1 Test with no featured submissions (section should be hidden)
  - [x] 4.2 Test with 1-6 featured submissions
  - [x] 4.3 Verify ordering matches `featuredOrder` values
  - [x] 4.4 Test external links open in new tab
  - [x] 4.5 Test responsive layout at all breakpoints
  - [x] 4.6 Verify `npm run build` succeeds
  - [x] 4.7 Test keyboard navigation and screen reader

## Dev Notes

### Architecture Compliance

**Required Patterns (from docs/architecture.md):**

- **Data File Pattern:** JavaScript ESM modules in `src/_data/` using `@11ty/eleventy-fetch`
- **Error Handling:** try/catch with empty array fallback
- **Image URLs:** Sanity CDN with `?w=` optimization parameter
- **External Links:** `target="_blank" rel="noopener noreferrer"` for security
- **Naming:** kebab-case for files, camelCase for JS/Sanity fields

**Sanity Schema (already exists in `studio/schemas/gallerySubmission.js`):**

```javascript
// Relevant fields for featured functionality:
{
  name: 'isFeatured',
  title: 'Is Featured',
  type: 'boolean',
  initialValue: false
},
{
  name: 'featuredBlurb',
  title: 'Featured Blurb',
  type: 'text',
  hidden: ({document}) => !document?.isFeatured,
  validation: Rule => Rule.max(300)
},
{
  name: 'featuredOrder',
  title: 'Featured Order',
  type: 'number',
  hidden: ({document}) => !document?.isFeatured,
  validation: Rule => Rule.min(1).integer()
}
```

**No schema changes needed** - the `gallerySubmission` schema already has all required fields.

### Implementation Notes

**Environment Variables:**
- `process.env.NODE_ENV` is automatically available in Eleventy data files via Node.js runtime
- Used for conditional dev logging (not critical for functionality)

**Image URL Pattern Choice:**
- This story uses manual string replacement for Sanity image URLs (matching existing `card.njk` pattern)
- Note: `src/_data/sanity.mjs` exports a `getSanityImageUrl(imageRef, width)` helper function
- We use manual replacement for consistency with existing galleryCard macro
- Future refactor could convert both macros to use the helper

**Image Width Difference:**
- Featured cards use `?w=600` (larger display area with `h-64`)
- Regular gallery cards use `?w=400` (smaller display area with `h-48`)
- This is intentional for visual hierarchy

### Data Structure

**GROQ Query for Featured Submissions:**
```groq
*[_type == "gallerySubmission" && status == "approved" && isFeatured == true]{
  ...,
  styleRef->
} | order(featuredOrder asc)[0...6]
```

**Expected Response Structure:**
```json
[
  {
    "_id": "submission-1",
    "submitterName": "Alex Chen",
    "demoUrl": "https://example.com/demo",
    "screenshot": {
      "asset": { "_ref": "image-abc123..." },
      "alt": "Swiss style demo screenshot"
    },
    "featuredBlurb": "A masterful interpretation of Swiss grid principles.",
    "featuredOrder": 1,
    "styleRef": {
      "_id": "style-1",
      "title": "Swiss International Style",
      "slug": { "current": "swiss-international-style" }
    }
  }
]
```

### Existing Implementation to Reference

**From Story 2.3 (gallery-filter):**
- Data structure change pattern: returning object vs array
- Card macro pattern with Sanity CDN image URL
- Responsive grid pattern with Tailwind

**From `src/_data/submissions.mjs`:**
- Use same fetch pattern with `@11ty/eleventy-fetch`
- Use `buildQueryUrl` helper from `sanity.mjs`

**From `src/_includes/macros/card.njk`:**
- Sanity CDN image URL pattern: `https://cdn.sanity.io/images/{{ sanityConfig.projectId }}/{{ sanityConfig.dataset }}/{{ ref }}?w=600&fit=crop&auto=format`
- Image reference parsing: `| replace('image-', '') | replace('-jpg', '.jpg')` etc.

### Current Homepage Structure (index.njk)

```
1. Hero Section (bg-black)
2. Stats Bar (</section> closes with border-b-2 border-black)
3. Gallery Section (<section id="gallery">) <-- Featured section goes BEFORE this
4. How It Works Section
5. CTA Section
```

**Insertion Point:** Add Featured Section BETWEEN:
- **AFTER:** Stats Bar section (look for closing `</section>` after the stats grid)
- **BEFORE:** Gallery Section (look for `<section id="gallery" class="section-padding">`)

Do NOT rely on line numbers as they shift with code changes. Search for these contextual markers instead.

### Project Structure Notes

```
src/
├── _data/
│   ├── submissions.mjs           # ✅ Existing - approved submissions
│   ├── featuredSubmissions.mjs   # NEW - featured submissions only
│   ├── designStyles.mjs          # ✅ Existing
│   └── sanity.mjs                # ✅ Existing - has buildQueryUrl helper
├── _includes/
│   └── macros/
│       └── card.njk              # MODIFY - add featuredCard macro
└── pages/
    └── index.njk                 # MODIFY - add featured section
```

### Featured Card Design (Swiss Style)

The featured card should have larger visual treatment than gallery cards:

**Visual Treatment:**
- Larger image area (`h-64` vs `h-48` for regular cards)
- Prominent screenshot with hover effect
- Featured blurb displayed below image (in quotes for editorial feel)
- Clear CTA button for "View Demo" with external link icon
- Style badge overlay showing design style name

See **Technical Implementation Guide > Step 2** for complete Nunjucks macro implementation.

### References

- [Source: docs/architecture.md#Data-Architecture] - Data fetching patterns
- [Source: docs/architecture.md#Implementation-Patterns] - Error handling, naming
- [Source: docs/prd.md#FR5] - Featured/highlighted submissions requirement
- [Source: docs/epics.md#Story-2.4] - Full acceptance criteria
- [Source: studio/schemas/gallerySubmission.js] - Schema with isFeatured, featuredBlurb, featuredOrder
- [Source: src/_data/submissions.mjs] - Existing submission fetch pattern
- [Source: src/_includes/macros/card.njk] - Existing card macro with Sanity image

## Dev Agent Record

### Context Reference

- Epic 2: Public Design Gallery Experience
- Dependencies: Story 2.1 complete (gallery listing with cards)
- Dependencies: Story 2.2 complete (detail pages)
- Dependencies: Story 2.3 complete (gallery filtering)
- Dependencies: Epic 1 complete (Sanity CMS with gallerySubmission schema)

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Previous Story Intelligence

**From Story 2.3 completion:**
- Data file pattern: return objects with structured data (`{ styles, categories }`)
- Card macro pattern with Sanity CDN image transformation
- Responsive grid with Tailwind: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- JavaScript follows vanilla IIFE pattern when needed
- Build generates 42 files successfully

**From Story 2.2 completion:**
- Detail pages generate from Sanity data
- Sanity CDN image URL pattern established: `https://cdn.sanity.io/images/{projectId}/{dataset}/{ref}?w=400&fit=crop&auto=format`
- Image ref parsing: `| replace('image-', '') | replace('-jpg', '.jpg')`

**Git commit patterns:**
- `feat:` for new features
- `docs:` for documentation updates
- Conventional commits trigger semantic release

**Current sprint status:**
- Stories 2.1, 2.2, 2.3 complete and done
- Story 2.4 is next backlog item
- Epic 2 is in-progress

### Debug Log References

N/A

### Completion Notes List

**Implementation Summary (2025-12-08):**

1. **Task 1 - Data File:** Created `featuredSubmissions.mjs` following exact pattern from `submissions.mjs`. GROQ query filters for `status == "approved" && isFeatured == true`, expands `styleRef->`, orders by `featuredOrder asc`, and limits to 6 items.

2. **Task 2 - Card Macro:** Added `featuredCard` macro to `card.njk` with:
   - Larger image area (h-64 vs h-48)
   - Style name badge overlay
   - Featured blurb in quotes
   - "View Demo" button with external link icon
   - Screen reader text "(opens in new tab)"
   - `target="_blank" rel="noopener noreferrer"` for security

3. **Task 3 - Homepage Section:** Inserted Featured Themes section between Stats Bar and Gallery using conditional `{% if featuredSubmissions.length %}`. Uses responsive 1/2/3 column grid.

4. **Task 4 - Validation:** All tests pass:
   - `npm run build` - 42 files generated successfully
   - Empty state verified - section hidden when no featured submissions
   - 20 unit tests pass
   - 34 E2E tests pass (21 gallery filter + 13 featured themes)

**Code Review Fixes (2025-12-08):**
- Added E2E test suite `tests/e2e/featured-themes.spec.js` with 13 tests covering AC1-7
- Added demoUrl null check - View Demo button only renders if demoUrl exists
- Added submitterName null check - displays "Anonymous" if submitterName is missing
- Updated File List with all created files including validation report

**AC Verification:**
- AC1: Featured section positioned above gallery
- AC2: All card content renders (screenshot, style name, submitter, blurb, View Demo button)
- AC3: GROQ query orders by `featuredOrder asc`, limits to 6
- AC4: Section hidden when `featuredSubmissions.length` is 0 (verified in build output)
- AC5: External links have `target="_blank" rel="noopener noreferrer"`
- AC6: Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- AC7: h2 heading, article elements, sr-only text for external links

### File List

**Created:**
- `src/_data/featuredSubmissions.mjs` - Data file for featured submissions
- `tests/e2e/featured-themes.spec.js` - E2E tests for featured themes section (AC1-7)
- `docs/sprint-artifacts/validation-report-2-4-20251208.md` - Pre-implementation validation report

**Modified:**
- `src/_includes/macros/card.njk` - Added `featuredCard` macro with null checks for demoUrl and submitterName
- `src/pages/index.njk` - Added Featured Themes section (lines 65-86)
- `docs/sprint-artifacts/sprint-status.yaml` - Updated story status to in-progress

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-08 | Implemented Featured Themes section with data file, card macro, and homepage integration | Claude Opus 4.5 |
| 2025-12-08 | Code Review: Added E2E tests, demoUrl/submitterName null checks, updated File List | Claude Opus 4.5 (Review) |

---

## Technical Implementation Guide

### Step 1: Create Featured Submissions Data File

**File:** `src/_data/featuredSubmissions.mjs`

```javascript
import EleventyFetch from "@11ty/eleventy-fetch";
import { buildQueryUrl } from "./sanity.mjs";

const isDev = process.env.NODE_ENV !== 'production';

export default async function() {
  // Fetch approved + featured submissions, ordered by featuredOrder, limited to 6
  const query = '*[_type == "gallerySubmission" && status == "approved" && isFeatured == true]{..., styleRef->} | order(featuredOrder asc)[0...6]';
  const url = buildQueryUrl(query);

  try {
    const data = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    // Validate response structure
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

### Step 2: Add Featured Card Macro

**File:** `src/_includes/macros/card.njk` (add after existing `galleryCard` macro)

```nunjucks
{% macro featuredCard(submission) %}
<article class="card card-hover group bg-white">
  {% if submission.screenshot and submission.screenshot.asset and submission.screenshot.asset._ref %}
    <div class="h-64 overflow-hidden relative">
      <img
        src="https://cdn.sanity.io/images/{{ sanityConfig.projectId }}/{{ sanityConfig.dataset }}/{{ submission.screenshot.asset._ref | replace('image-', '') | replace('-jpg', '.jpg') | replace('-jpeg', '.jpeg') | replace('-png', '.png') | replace('-webp', '.webp') | replace('-gif', '.gif') }}?w=600&fit=crop&auto=format"
        alt="{{ submission.screenshot.alt or (submission.styleRef.title + ' demo by ' + submission.submitterName) }}"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      {% if submission.styleRef and submission.styleRef.title %}
      <span class="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium">
        {{ submission.styleRef.title }}
      </span>
      {% endif %}
    </div>
  {% else %}
    <div class="h-64 bg-neutral-100 flex items-center justify-center">
      <span class="text-6xl">🎨</span>
    </div>
  {% endif %}

  <div class="p-6 border-t-2 border-black">
    {% if submission.featuredBlurb %}
    <p class="text-body text-neutral-700 mb-4 line-clamp-3">
      "{{ submission.featuredBlurb }}"
    </p>
    {% endif %}
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <span class="text-sm text-neutral-500">by {{ submission.submitterName }}</span>
      <a
        href="{{ submission.demoUrl }}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        View Demo
        <span class="sr-only">(opens in new tab)</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
        </svg>
      </a>
    </div>
  </div>
</article>
{% endmacro %}
```

### Step 3: Add Featured Section to Homepage

**File:** `src/pages/index.njk`

**Insertion Point:** Search for `<section id="gallery"` and insert BEFORE it (after the Stats Bar `</section>`):

```nunjucks
{# Featured Themes Section - Only render if featured submissions exist #}
{% if featuredSubmissions.length %}
<section id="featured" class="section-padding border-b-2 border-black">
  <div class="container-custom">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <span class="text-overline text-neutral-400">Curated</span>
        <h2 class="text-h2 mt-2">Featured Themes</h2>
      </div>
      <p class="text-neutral-500 max-w-md text-right">
        Exceptional implementations selected by our curators
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {% for submission in featuredSubmissions %}
        {{ cards.featuredCard(submission) }}
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}
```

**Note:** This section will automatically hide when there are no featured submissions, meeting AC4.

### Step 4: Verify Build

```bash
npm run build
```

Expected output: Build succeeds with additional files generated.

### Validation Criteria

Before marking complete, verify these **7 essential checks**:

1. **Build succeeds:** `npm run build` completes without errors
2. **Featured section conditional:** Section hidden when no featured submissions
3. **Featured cards render:** All featured submission data displays correctly
4. **External links secure:** "View Demo" has `target="_blank" rel="noopener noreferrer"`
5. **Ordering correct:** Cards ordered by `featuredOrder` ascending
6. **Responsive layout:** Grid adapts at sm/lg breakpoints
7. **Accessibility:** h2 heading, screen reader text for external links

### Edge Cases to Handle

1. **No featured submissions:** Section completely hidden (not empty div)
2. **Missing screenshot:** Show fallback emoji placeholder
3. **Missing styleRef:** Handle gracefully (card still renders)
4. **Missing featuredBlurb:** Blurb paragraph not rendered
5. **More than 6 featured:** GROQ query limits to 6 items
