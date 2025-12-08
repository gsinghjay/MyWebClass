# Story 2.3: Gallery Filtering by Design Style Category

Status: Done

## Story

As a **visitor**,
I want **to filter gallery entries by design style category**,
So that **I can focus on styles that interest me most**.

## Acceptance Criteria

### AC1: Filter Buttons Display
**Given** I am on the gallery page
**When** the page loads
**Then** I see filter buttons/tabs for each design style category
**And** an "All" option is selected by default

### AC2: Filter Application
**Given** I click on a style filter (e.g., "Swiss", "Bauhaus", "Brutalist")
**When** the filter is applied
**Then** only cards matching that style are displayed
**And** the active filter is visually highlighted
**And** the URL updates to reflect the filter (e.g., `?category=swiss`)

### AC3: Clear Filter
**Given** I click "All"
**When** the filter clears
**Then** all design style cards are displayed again
**And** the URL query parameter is removed

### AC4: URL-Based Filter State
**Given** I share a filtered URL (e.g., `/?category=swiss`)
**When** someone opens that URL
**Then** the filter is pre-applied based on the query parameter
**And** the corresponding filter button is visually highlighted

### AC5: Responsive Filter Layout
**Given** I view the gallery on different devices
**When** the filter buttons render
**Then** they adapt responsively:
- Mobile: Horizontal scrollable row or wrapped grid
- Desktop: Horizontal row with adequate spacing

### AC6: Graceful Degradation
**Given** JavaScript is disabled
**When** the page loads
**Then** all design style cards are displayed (no filtering)
**And** the page remains fully functional

### AC7: Accessibility
**Given** I navigate using keyboard
**When** I interact with filter buttons
**Then** each button is focusable and activatable via Enter/Space
**And** the active filter state is announced to screen readers

## Tasks / Subtasks

- [x] Task 0: Pre-implementation verification (CRITICAL)
  - [x] 0.1 Verify `category` field exists in Sanity designStyle schema
  - [x] 0.2 If missing, add category field to `studio/schemas/designStyle.js`
  - [x] 0.3 Populate category values for existing styles in Sanity Studio
  - [x] 0.4 Deploy schema changes and verify in Sanity

- [x] Task 1: Update data file to extract categories (AC: #1)
  - [x] 1.1 Modify `src/_data/designStyles.mjs` to return `{ styles, categories }`
  - [x] 1.2 Extract unique categories from styles at build time
  - [x] 1.3 Update any other templates using `designStyles` to use `designStyles.styles`

- [x] Task 2: Create filter buttons UI (AC: #1, #5, #7)
  - [x] 2.1 Add filter nav element to index.njk (replace TODO comment)
  - [x] 2.2 Generate buttons from `designStyles.categories`
  - [x] 2.3 Add "All Styles" button as first option with default active state
  - [x] 2.4 Style filter buttons with Tailwind (active state with black bg)
  - [x] 2.5 Make filter container horizontally scrollable on mobile (`overflow-x-auto`)
  - [x] 2.6 Add ARIA roles and labels for accessibility

- [x] Task 3: Add data attributes for filtering (AC: #2, #6)
  - [x] 3.1 Add `data-category` attribute to each gallery card link
  - [x] 3.2 Add `data-filter` attribute to each filter button
  - [x] 3.3 Add `gallery-card` class to card links for JS selection

- [x] Task 4: Implement JavaScript filtering logic (AC: #2, #3, #4)
  - [x] 4.1 Create `src/scripts/gallery-filter.js` module
  - [x] 4.2 Implement click handler for filter buttons
  - [x] 4.3 Implement card show/hide based on category match
  - [x] 4.4 Update active button visual state on filter change
  - [x] 4.5 Parse URL query parameter on page load for initial filter
  - [x] 4.6 Update URL with `pushState` when filter changes
  - [x] 4.7 Add screen reader announcement for filter results

- [x] Task 5: Include script in index page (AC: #6)
  - [x] 5.1 Add script include to index.njk via `{% block scripts %}`
  - [x] 5.2 Ensure progressive enhancement (no-JS shows all cards)

- [x] Task 6: Testing and validation (AC: #1-7)
  - [x] 6.1 Test filtering with multiple categories
  - [x] 6.2 Test URL state persistence (refresh maintains filter)
  - [x] 6.3 Test keyboard navigation
  - [x] 6.4 Verify `npm run build` succeeds
  - [x] 6.5 Test on mobile viewport (horizontal scroll)
  - [x] 6.6 Test with screen reader

## Dev Notes

### Pre-Implementation Verification

**⚠️ CRITICAL: Verify before implementing:**
- [ ] Confirm `category` field exists in Sanity designStyle schema
- [ ] If missing, add `category` (string) field to `studio/schemas/designStyle.js` first
- [ ] Populate category values for existing design styles in Sanity Studio

### Architecture Compliance

**Required Patterns (from docs/architecture.md):**

- **JavaScript Pattern:** Vanilla JS, no framework, minimal bundle
- **File Location:** JavaScript modules in `src/scripts/`
- **Data Attributes:** Use `data-*` for JS hooks, keep HTML semantic
- **Naming:** kebab-case for files, camelCase for JS variables
- **Progressive Enhancement:** Site must work without JavaScript

**Categories in Current Data:**

The `designStyle` documents should have a `category` field to group styles. If implementing from scratch, add to schema:
```javascript
// studio/schemas/designStyle.js - add this field
{
  name: 'category',
  title: 'Category',
  type: 'string',
  options: {
    list: [
      { title: 'Swiss International Style', value: 'swiss-international-style' },
      { title: 'Bauhaus', value: 'bauhaus' },
      { title: 'Brutalism', value: 'brutalism' },
      { title: 'Art Deco', value: 'art-deco' },
      { title: 'Minimalism', value: 'minimalism' }
    ]
  }
}
```

The filter extracts unique categories from the `designStyles` data array.

### Data Structure Change Impact

**⚠️ IMPORTANT:** This implementation changes the `designStyles` data structure:

| Before | After |
|--------|-------|
| `designStyles` (array of styles) | `designStyles.styles` (array of styles) |
| N/A | `designStyles.categories` (array of category strings) |

**Files that need updating:**
- `src/pages/index.njk` - change `designStyles` to `designStyles.styles`
- `src/pages/styles/style-detail.njk` - update pagination source
- Any other templates iterating over `designStyles`

### Current Implementation State

**From index.njk (line 73):**
```nunjucks
{# TODO: Implement filtering in Story 2.3 (Gallery Filtering by Design Style Category) #}
```

This TODO placeholder marks exactly where filter UI should be added.

**ALREADY IMPLEMENTED:**
- Gallery grid with card rendering
- Responsive grid layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Card component with all style data available
- `designStyles` data from Sanity (needs `category` field added)

**NEEDS IMPLEMENTATION:**
- Schema update: Add `category` field to designStyle schema
- Data file update: Return `{ styles, categories }` structure
- Filter button row above gallery
- JavaScript filtering logic
- URL query parameter handling
- Active state styling

### Existing Files to Modify

| File | Change |
|------|--------|
| `src/pages/index.njk` | Add filter buttons UI, add `data-category` to cards, include filter script via `{% block scripts %}` |
| `src/_data/designStyles.mjs` | (Optional) Pre-process categories for simpler templates |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/scripts/gallery-filter.js` | Client-side filtering logic |

**Note:** Script is included via `{% block scripts %}` in index.njk (not base.njk) since filtering only needed on homepage.

### Project Structure Notes

```
src/
├── _data/
│   └── designStyles.mjs    # ✅ Already fetches all styles with category field
├── pages/
│   └── index.njk           # Modify: add filter UI, data-category attributes
├── scripts/
│   ├── cookie-consent.js   # ✅ Existing pattern to follow
│   ├── navigation.js       # ✅ Existing pattern to follow
│   └── gallery-filter.js   # NEW: filtering logic
└── _includes/
    └── layouts/
        └── base.njk        # Modify: add script include
```

### Filter Button Design (Swiss Style)

Following the Swiss International Style design language already in the codebase:

```
Active state:   bg-black text-white border-black
Inactive state: bg-white text-black border-black hover:bg-neutral-100
```

Button styling pattern:
```css
/* Swiss-style filter buttons */
.filter-btn {
  @apply px-4 py-2 border-2 border-black text-sm font-medium transition-colors;
}
.filter-btn[aria-pressed="true"] {
  @apply bg-black text-white;
}
.filter-btn[aria-pressed="false"] {
  @apply bg-white text-black hover:bg-neutral-100;
}
```

### JavaScript Implementation Approach

**Module Pattern:**
```javascript
// src/scripts/gallery-filter.js
(function() {
  'use strict';

  // DOM elements
  const filterContainer = document.getElementById('filter-buttons');
  const galleryCards = document.querySelectorAll('[data-category]');

  // Parse URL for initial filter
  function getInitialFilter() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') || 'all';
  }

  // Apply filter
  function applyFilter(category) {
    galleryCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.filter === category);
    });

    // Update URL
    const url = new URL(window.location);
    if (category === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
  }

  // Initialize
  function init() {
    if (!filterContainer) return; // Progressive enhancement

    filterContainer.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn')) {
        applyFilter(e.target.dataset.filter);
      }
    });

    // Apply initial filter from URL
    applyFilter(getInitialFilter());
  }

  // Run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

### Nunjucks Template Pattern

**Recommended Approach: Pre-process categories in data file**

Add to `src/_data/designStyles.mjs` for cleaner templates:
```javascript
// After fetching result, extract unique categories
const categories = [...new Set(
  result.map(s => s.category).filter(Boolean)
)].sort();

return {
  styles: result,
  categories: categories
};
```

Then template simplifies to:
```nunjucks
{# Filter buttons - using pre-processed categories #}
<nav
  id="filter-buttons"
  class="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible"
  role="group"
  aria-label="Filter by design style category"
>
  <button
    type="button"
    class="filter-btn px-4 py-2 border-2 border-black text-sm font-medium transition-colors bg-black text-white whitespace-nowrap"
    data-filter="all"
    aria-pressed="true"
  >All Styles</button>
  {% for category in designStyles.categories %}
  <button
    type="button"
    class="filter-btn px-4 py-2 border-2 border-black text-sm font-medium transition-colors bg-white text-black hover:bg-neutral-100 whitespace-nowrap"
    data-filter="{{ category | lower | replace(' ', '-') }}"
    aria-pressed="false"
  >{{ category }}</button>
  {% endfor %}
</nav>
```

**Card with data-category:**
```nunjucks
{% for style in designStyles.styles %}
<a
  href="{{ '/styles/' | url }}{{ style.slug.current or style.slug }}/"
  class="block gallery-card"
  data-category="{{ (style.category or 'uncategorized') | lower | replace(' ', '-') }}"
>
  {{ cards.galleryCard(style) }}
</a>
{% endfor %}
```

**Alternative: Pure Nunjucks (if not modifying data file)**
```nunjucks
{# Build category buttons directly from styles - avoids complex array ops #}
<nav id="filter-buttons" class="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible" role="group" aria-label="Filter by design style category">
  <button type="button" class="filter-btn px-4 py-2 border-2 border-black text-sm font-medium bg-black text-white whitespace-nowrap" data-filter="all" aria-pressed="true">All Styles</button>
  {# Use unique filter if available, or dedupe via set #}
  {% set seen = {} %}
  {% for style in designStyles %}
    {% if style.category and not seen[style.category] %}
      {% set _ = seen.__setitem__(style.category, true) if seen.__setitem__ else '' %}
      <button type="button" class="filter-btn px-4 py-2 border-2 border-black text-sm font-medium bg-white text-black hover:bg-neutral-100 whitespace-nowrap" data-filter="{{ style.category | lower | replace(' ', '-') }}" aria-pressed="false">{{ style.category }}</button>
    {% endif %}
  {% endfor %}
</nav>
```
**Note:** The pure Nunjucks approach is more complex. Pre-processing in data file is strongly recommended.

### Testing Checklist

- [ ] `npm run build` succeeds
- [ ] Filter buttons render for all unique categories
- [ ] "All" button selected by default on fresh load
- [ ] Clicking filter shows only matching cards
- [ ] URL updates with `?category=` parameter
- [ ] Refresh with `?category=swiss` pre-applies filter
- [ ] Keyboard navigation works (Tab + Enter)
- [ ] Screen reader announces active filter state
- [ ] Mobile: filter buttons horizontally scrollable
- [ ] No JS: all cards show (graceful degradation)

### References

- [Source: docs/architecture.md#Frontend-Architecture] - Minimal JavaScript, no framework
- [Source: docs/prd.md#FR2] - Filter gallery by design style category
- [Source: docs/epics.md#Story-2.3] - Full acceptance criteria
- [Source: src/scripts/cookie-consent.js] - Existing vanilla JS pattern
- [Source: src/scripts/navigation.js] - Existing vanilla JS pattern

## Dev Agent Record

### Context Reference

- Epic 2: Public Design Gallery Experience
- Dependencies: Story 2.1 complete (gallery listing with cards)
- Dependencies: Story 2.2 complete (detail pages)

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Previous Story Intelligence

**From Story 2.1 completion:**
- Gallery grid implemented with responsive breakpoints
- Card component renders all style data including `category` field (if present)
- `designStyles` data array from Sanity contains `category` field
- Empty state handling already in place

**From Story 2.2 completion:**
- Detail pages generate correctly from style slugs
- Sanity CDN image URL pattern established
- Consistent Tailwind styling patterns

**Key learnings:**
- Use `| slug` filter for URL-safe category values
- Follow existing button styling from CTA buttons
- Script includes go in base.njk before closing `</body>`

**Git commit pattern:**
- `feat:` for new features
- Conventional commits trigger semantic release

### Debug Log References

N/A

### Completion Notes List

- Added `category` field to Sanity designStyle schema with 7 categories: modernism, art-movements, postmodern, digital, retro, minimalist, expressive
- Updated `src/_data/designStyles.mjs` to return `{ styles, categories }` object structure
- Updated `src/pages/styles/style-detail.njk` pagination source to use `designStyles.styles`
- Updated `src/pages/admin.njk` to use `designStyles.styles` for stats
- Implemented filter buttons UI with ARIA roles, `aria-pressed` states, and responsive mobile scroll
- Created `gallery-filter.js` with URL state management, browser history support, and screen reader announcements
- Created migration script and populated all 34 design styles with categories in Sanity
- All 20 existing tests pass, build succeeds (42 files generated)
- 7 filter buttons render: All Styles, Art Movements, Digital, Expressive, Minimalist, Modernism, Postmodern, Retro

### File List

**Modified:**
- `studio/schemas/designStyle.js` - Added category field with 7 category options
- `src/_data/designStyles.mjs` - Changed to return `{ styles, categories }` structure
- `src/pages/index.njk` - Added filter UI, data-category attributes, scripts block
- `src/pages/styles/style-detail.njk` - Updated pagination data source
- `src/pages/admin.njk` - Updated to use `designStyles.styles`

**Created:**
- `src/scripts/gallery-filter.js` - Client-side filtering module
- `studio/migrations/assign-categories.js` - Migration script to assign categories to all styles

---

## Technical Implementation Guide

### Step 0: Pre-process Categories in Data File (Recommended)

**File:** `src/_data/designStyles.mjs`

Modify the data file to extract categories at build time:

```javascript
import EleventyFetch from "@11ty/eleventy-fetch";
import { buildQueryUrl } from "./sanity.mjs";

const isDev = process.env.NODE_ENV !== 'production';

export default async function() {
  const query = '*[_type == "designStyle"] | order(title asc)';
  const url = buildQueryUrl(query);

  try {
    const data = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    if (!data || typeof data !== 'object') {
      console.error("[Sanity] Invalid response structure");
      return { styles: [], categories: [] };
    }

    const result = data.result;
    if (!Array.isArray(result)) {
      console.error("[Sanity] Invalid response - 'result' is not an array");
      return { styles: [], categories: [] };
    }

    // Extract unique categories
    const categories = [...new Set(
      result.map(s => s.category).filter(Boolean)
    )].sort();

    if (isDev) {
      console.log(`[Sanity] Fetched ${result.length} design styles, ${categories.length} categories`);
    }

    return {
      styles: result,
      categories: categories
    };
  } catch (error) {
    console.error("[Sanity] Failed to fetch design styles:", error.message);
    return { styles: [], categories: [] };
  }
}
```

**Note:** This changes the data structure from `designStyles` (array) to `designStyles.styles` (array) and `designStyles.categories` (array). Update templates accordingly.

### Step 1: Add Filter Buttons UI and Data Attributes

**File:** `src/pages/index.njk`

Replace the TODO comment (line 73) with filter buttons, and update the card loop:

```nunjucks
{# Filter buttons - mobile scrollable, desktop wrapped #}
<nav
  id="filter-buttons"
  class="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0"
  role="group"
  aria-label="Filter gallery by design style"
>
  <button
    type="button"
    class="filter-btn px-4 py-2 border-2 border-black text-sm font-medium transition-colors bg-black text-white whitespace-nowrap"
    data-filter="all"
    aria-pressed="true"
  >All Styles</button>
  {% for category in designStyles.categories %}
  <button
    type="button"
    class="filter-btn px-4 py-2 border-2 border-black text-sm font-medium transition-colors bg-white text-black hover:bg-neutral-100 whitespace-nowrap"
    data-filter="{{ category | lower | replace(' ', '-') }}"
    aria-pressed="false"
  >{{ category }}</button>
  {% endfor %}
</nav>
```

Update the gallery grid loop to use new data structure and add `data-category`:

```nunjucks
{% if designStyles.styles.length %}
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {% for style in designStyles.styles %}
    <a
      href="{{ '/styles/' | url }}{{ style.slug.current or style.slug }}/"
      class="block gallery-card"
      data-category="{{ (style.category or 'uncategorized') | lower | replace(' ', '-') }}"
    >
      {{ cards.galleryCard(style) }}
    </a>
  {% endfor %}
</div>
{% else %}
<div class="text-center py-16 border-2 border-dashed border-neutral-300">
  <p class="text-xl text-neutral-500 mb-4">No design styles available yet.</p>
  <p class="text-neutral-400">Check back soon for our curated collection.</p>
</div>
{% endif %}
```

### Step 2: Create JavaScript Filter Module

**File:** `src/scripts/gallery-filter.js`

```javascript
/**
 * Gallery Filter Module
 * Implements client-side filtering of design style cards by category
 * Features: URL state sync, keyboard accessible, progressive enhancement
 */
(function() {
  'use strict';

  const QUERY_PARAM = 'category';

  // DOM references (captured once)
  let filterContainer;
  let galleryCards;
  let filterButtons;

  /**
   * Get initial filter from URL query parameter
   * @returns {string} Category slug or 'all'
   */
  function getInitialFilter() {
    const params = new URLSearchParams(window.location.search);
    return params.get(QUERY_PARAM) || 'all';
  }

  /**
   * Update URL with current filter state
   * @param {string} category - Category slug or 'all'
   */
  function updateUrl(category) {
    const url = new URL(window.location);
    if (category === 'all') {
      url.searchParams.delete(QUERY_PARAM);
    } else {
      url.searchParams.set(QUERY_PARAM, category);
    }
    window.history.pushState({ category }, '', url);
  }

  /**
   * Update filter button visual states
   * @param {string} activeCategory - Currently active category
   */
  function updateButtonStates(activeCategory) {
    filterButtons.forEach(btn => {
      const isActive = btn.dataset.filter === activeCategory;
      btn.setAttribute('aria-pressed', isActive);

      if (isActive) {
        btn.classList.remove('bg-white', 'text-black', 'hover:bg-neutral-100');
        btn.classList.add('bg-black', 'text-white');
      } else {
        btn.classList.remove('bg-black', 'text-white');
        btn.classList.add('bg-white', 'text-black', 'hover:bg-neutral-100');
      }
    });
  }

  /**
   * Apply filter to gallery cards
   * @param {string} category - Category slug or 'all'
   */
  function applyFilter(category) {
    let visibleCount = 0;

    galleryCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const shouldShow = category === 'all' || cardCategory === category;

      if (shouldShow) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update button states
    updateButtonStates(category);

    // Update URL (without triggering page reload)
    updateUrl(category);

    // Announce to screen readers
    announceFilterResult(category, visibleCount);
  }

  /**
   * Announce filter result to screen readers
   * @param {string} category - Active category
   * @param {number} count - Number of visible items
   */
  function announceFilterResult(category, count) {
    // Find or create live region
    let liveRegion = document.getElementById('filter-announcement');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'filter-announcement';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    const categoryLabel = category === 'all' ? 'all styles' : category.replace(/-/g, ' ');
    liveRegion.textContent = `Showing ${count} ${count === 1 ? 'design' : 'designs'} for ${categoryLabel}`;
  }

  /**
   * Handle filter button click
   * @param {Event} event - Click event
   */
  function handleFilterClick(event) {
    const button = event.target.closest('.filter-btn');
    if (!button) return;

    const category = button.dataset.filter;
    applyFilter(category);
  }

  /**
   * Handle browser back/forward navigation
   * @param {PopStateEvent} event - PopState event
   */
  function handlePopState(event) {
    const category = event.state?.category || getInitialFilter();
    applyFilter(category);
  }

  /**
   * Initialize the gallery filter
   */
  function init() {
    // Get DOM elements
    filterContainer = document.getElementById('filter-buttons');
    galleryCards = document.querySelectorAll('.gallery-card[data-category]');

    // Early exit if no filter container (progressive enhancement)
    if (!filterContainer || galleryCards.length === 0) {
      return;
    }

    filterButtons = filterContainer.querySelectorAll('.filter-btn');

    // Attach event listeners
    filterContainer.addEventListener('click', handleFilterClick);
    window.addEventListener('popstate', handlePopState);

    // Apply initial filter from URL
    const initialCategory = getInitialFilter();
    if (initialCategory !== 'all') {
      applyFilter(initialCategory);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

### Step 3: Include Script in Index Page

**File:** `src/pages/index.njk`

Add at the bottom of the file, using the scripts block (filter only needed on homepage):

```nunjucks
{% block scripts %}
<script src="{{ '/scripts/gallery-filter.js' | url }}" defer></script>
{% endblock %}
```

**Note:** Do NOT add to base.njk - the filter script is only needed on the homepage, not every page.

### Step 4: Add Screen Reader Only Utility (if not present)

**File:** `src/styles/main.css`

Ensure the `.sr-only` utility exists (Tailwind includes this by default):

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Validation Criteria

Before marking complete, verify these **7 essential checks**:

1. **Build succeeds:** `npm run build` completes without errors
2. **Filter buttons render:** All unique categories appear as buttons
3. **Filtering works:** Clicking a category shows only matching cards
4. **URL updates:** Filter state reflected in `?category=` parameter
5. **URL persistence:** Refresh with `?category=swiss` maintains filter
6. **Accessibility:** Keyboard Tab + Enter works, screen reader announces state
7. **No-JS fallback:** With JS disabled, all cards show

### Edge Cases to Handle

1. **No category field:** Cards without category show for "All", hidden otherwise
2. **Empty filter result:** If no cards match, grid shows empty (acceptable)
3. **Special characters:** Category names are slugified (spaces → dashes, lowercase)
4. **Invalid URL param:** Unknown category shows no cards (matches expected behavior)
