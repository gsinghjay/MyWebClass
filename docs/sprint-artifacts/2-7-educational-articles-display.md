# Story 2.7: Educational Articles Display

Status: done

## Story

As a **visitor**,
I want **to read educational articles about design principles**,
So that **I can deepen my understanding beyond just viewing examples**.

## Acceptance Criteria

### AC1: Article Content Display
**Given** articles exist in Sanity CMS
**When** I navigate to an article
**Then** I see the full article content with:
- Title (h1)
- Author name and bio (if linked)
- Published date
- Rich text body content (Sanity block content rendered as HTML)
- Related design style link (if applicable)
- Images embedded in content (with alt text)

### AC2: Related Articles on Style Detail Pages
**Given** I am on a design style detail page
**When** related articles exist for that style
**Then** I see a "Related Reading" section with article links
**And** each article link shows title and author
**And** clicking navigates to the article page

### AC3: Author Display
**Given** an article has an author reference
**When** the article renders
**Then** author name displays with the article
**And** author bio displays inline (if bio exists)
**And** author image displays (if image exists)

### AC4: Article Listing (Optional)
**Given** I want to browse all articles
**When** I navigate to `/articles/`
**Then** I see a list of published articles
**And** articles are sorted by publishedAt (newest first)
**And** each article card shows title, author, date, excerpt

### AC5: Responsive Article Layout
**Given** I view an article on any device
**When** the page loads
**Then** the layout adapts to viewport width
**And** text is readable (max-width container)
**And** images scale appropriately
**And** touch targets meet 44px minimum

### AC6: Article SEO
**Given** an article is published
**When** search engines index the page
**Then** the page has proper title, description meta tags
**And** Open Graph tags are set for social sharing
**And** structured data (JSON-LD) is optional but recommended

## Tasks / Subtasks

- [x] Task 1: Create data fetching layer for articles (AC: #1, #2, #3)
  - [x] 1.1 Create `src/_data/articles.mjs` to fetch articles from Sanity
  - [x] 1.2 GROQ query: `*[_type == "article" && publishedAt != null]{..., author->, relatedStyle->}`
  - [x] 1.3 Sort by `publishedAt desc` in query
  - [x] 1.4 Resolve author and relatedStyle references
  - [x] 1.5 Add error handling with empty array fallback
  - [x] 1.6 Cache duration: 1 hour (per architecture)

- [x] Task 2: Create article detail page template (AC: #1, #3, #5)
  - [x] 2.1 Create `src/pages/articles/article.njk` with Eleventy pagination
  - [x] 2.2 Pagination data: `articles`, size: 1, alias: `article`
  - [x] 2.3 Permalink: `/articles/{{ article.slug.current or article.slug }}/`
  - [x] 2.4 Render article title as h1
  - [x] 2.5 Display author name, image, bio if author exists
  - [x] 2.6 Display formatted publishedAt date
  - [x] 2.7 Render Sanity block content body (portable text)
  - [x] 2.8 Link to related design style if relatedStyle exists
  - [x] 2.9 Responsive layout with max-w-3xl container

- [x] Task 3: Implement Sanity block content renderer (AC: #1)
  - [x] 3.1 Create block content rendering logic in template
  - [x] 3.2 Handle paragraph blocks (type: 'block')
  - [x] 3.3 Handle image blocks with Sanity CDN URLs
  - [x] 3.4 Handle headings (h2, h3, h4)
  - [x] 3.5 Handle lists (bullet, numbered)
  - [x] 3.6 Handle marks (bold, italic, links)
  - [x] 3.7 All images must have alt text (FR47)

- [x] Task 4: Add Related Articles to style-detail.njk (AC: #2)
  - [x] 4.1 Query articles with matching relatedStyle reference
  - [x] 4.2 Add "Related Reading" section to style-detail.njk
  - [x] 4.3 Display article title, author, link
  - [x] 4.4 Only show section if related articles exist
  - [x] 4.5 Position after educational content, before sidebar

- [x] Task 5: Create article listing page (AC: #4)
  - [x] 5.1 Create `src/pages/articles.njk`
  - [x] 5.2 Display grid of article cards
  - [x] 5.3 Each card: title, author, date, excerpt (truncated body)
  - [x] 5.4 Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
  - [x] 5.5 Add navigation link to main nav (desktop + mobile)

- [x] Task 6: Create article card macro (AC: #4, #5)
  - [x] 6.1 Add `articleCard` macro to `src/_includes/macros/card.njk`
  - [x] 6.2 Display article title, author name, publishedAt
  - [x] 6.3 Show excerpt (first 150 chars of body text)
  - [x] 6.4 Link entire card to article detail page
  - [x] 6.5 Consistent styling with existing cards

- [x] Task 7: E2E tests for articles (AC: #1-5)
  - [x] 7.1 Create `tests/e2e/articles.spec.js`
  - [x] 7.2 Test article listing page renders
  - [x] 7.3 Test article detail page renders with content
  - [x] 7.4 Test author info displays when present
  - [x] 7.5 Test related articles section on style detail pages
  - [x] 7.6 Test responsive layout at mobile/tablet/desktop
  - [x] 7.7 Test navigation between listing and detail

- [x] Task 8: Final validation (AC: #1-6)
  - [x] 8.1 `npm run build` succeeds (46 files - 43 base + 3 article pages)
  - [x] 8.2 All existing E2E tests pass (84 previous)
  - [x] 8.3 New article tests pass (20 tests)
  - [x] 8.4 Verify article pages in browser
  - [x] 8.5 Update sprint-status.yaml to `done`

- [x] Task 9: Populate Sanity with sample articles (AC: #1-4)
  - [x] 9.1 Create 2 author profiles (Sarah Chen, Marcus Williams)
  - [x] 9.2 Create 3 educational articles with rich content
  - [x] 9.3 Link articles to design styles (Swiss, Bauhaus, Brutalist)
  - [x] 9.4 Import data via `npx sanity dataset import`
  - [x] 9.5 Clear Eleventy cache and rebuild
  - [x] 9.6 Verify articles appear in listing and detail pages
  - [x] 9.7 Verify Related Reading sections on style pages

## Dev Notes

### Architecture Compliance

**Required Patterns (from docs/architecture.md):**

- **Data Fetching:** `@11ty/eleventy-fetch` with 1 hour cache
- **Error Handling:** try/catch with empty array fallback
- **File Naming:** kebab-case for files, camelCase for variables
- **Sanity Query Pattern:** GROQ with reference resolution using `->`
- **Template Pattern:** Nunjucks with macros for reusable components
- **Grid Pattern:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Sanity Schemas (Already Exist)

**Article Schema (`studio/schemas/article.js`):**
```javascript
{
  name: 'article',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', required: true },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'author', type: 'reference', to: [{type: 'author'}] },
    { name: 'body', type: 'array', of: [
      { type: 'block' },
      { type: 'image', fields: [{ name: 'alt', required: true }] }
    ]},
    { name: 'relatedStyle', type: 'reference', to: [{type: 'designStyle'}] }
  ]
}
```

**Author Schema (`studio/schemas/author.js`):**
```javascript
{
  name: 'author',
  fields: [
    { name: 'name', type: 'string', required: true },
    { name: 'slug', type: 'slug', required: true },
    { name: 'bio', type: 'text', max: 500 },
    { name: 'image', type: 'image', with alt required }
  ]
}
```

### Data Fetching Pattern

**`src/_data/articles.js`:**
```javascript
const Fetch = require("@11ty/eleventy-fetch");

const PROJECT_ID = process.env.SANITY_PROJECT_ID || "gc7vlywa";
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = "2021-10-21";

// Fetch published articles with resolved references
const QUERY = encodeURIComponent(`
  *[_type == "article" && publishedAt != null] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    body,
    author->{
      name,
      slug,
      bio,
      image
    },
    relatedStyle->{
      _id,
      title,
      slug
    }
  }
`);

const URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${QUERY}`;

module.exports = async function() {
  try {
    const data = await Fetch(URL, {
      duration: "1h",
      type: "json"
    });
    return data.result || [];
  } catch (e) {
    console.error("Failed to fetch articles:", e.message);
    return [];
  }
};
```

### Block Content Rendering

**Nunjucks approach (no external library needed):**
```nunjucks
{% for block in article.body %}
  {% if block._type == 'block' %}
    {% if block.style == 'h2' %}
      <h2 class="text-h2 mt-8 mb-4">{% for span in block.children %}{{ span.text }}{% endfor %}</h2>
    {% elif block.style == 'h3' %}
      <h3 class="text-h3 mt-6 mb-3">{% for span in block.children %}{{ span.text }}{% endfor %}</h3>
    {% elif block.style == 'blockquote' %}
      <blockquote class="border-l-4 border-black pl-4 italic my-4">{% for span in block.children %}{{ span.text }}{% endfor %}</blockquote>
    {% else %}
      <p class="mb-4">{% for span in block.children %}{{ span.text }}{% endfor %}</p>
    {% endif %}
  {% elif block._type == 'image' and block.asset and block.asset._ref %}
    {% set imgRef = block.asset._ref | replace('image-', '') | replace('-jpg', '.jpg') | replace('-jpeg', '.jpeg') | replace('-png', '.png') | replace('-webp', '.webp') %}
    <figure class="my-8">
      <img
        src="https://cdn.sanity.io/images/{{ sanityConfig.projectId }}/{{ sanityConfig.dataset }}/{{ imgRef }}?w=800&fit=max&auto=format"
        alt="{{ block.alt or 'Article image' }}"
        class="w-full border-2 border-black"
        loading="lazy"
      />
      {% if block.caption %}
      <figcaption class="text-sm text-neutral-500 mt-2">{{ block.caption }}</figcaption>
      {% endif %}
    </figure>
  {% endif %}
{% endfor %}
```

### File Structure

```
src/
├── _data/
│   ├── articles.js           # NEW: Fetch articles from Sanity
│   ├── designStyles.js       # Existing
│   ├── sanityConfig.js       # Existing (projectId, dataset)
│   └── site.js               # Existing
├── _includes/
│   ├── macros/
│   │   └── card.njk          # MODIFY: Add articleCard macro
│   └── layouts/
│       └── article.njk       # OPTIONAL: Article-specific layout
├── pages/
│   ├── articles/
│   │   └── article.njk       # NEW: Article detail (paginated)
│   ├── articles.njk          # NEW: Article listing page
│   └── styles/
│       └── style-detail.njk  # MODIFY: Add Related Articles section
tests/
└── e2e/
    └── articles.spec.js      # NEW: E2E tests for articles
```

### Related Articles Integration

**Add to `style-detail.njk` after main content, before sidebar:**
```nunjucks
{# Related Articles Section #}
{% set relatedArticles = articles | selectattr("relatedStyle._id", "equalto", style._id) %}
{% if relatedArticles | length %}
<section class="mt-12 pt-8 border-t-2 border-black">
  <h2 class="text-h3 mb-6">Related Reading</h2>
  <div class="space-y-4">
    {% for article in relatedArticles %}
    <a href="{{ '/articles/' | url }}{{ article.slug.current or article.slug }}/" class="block p-4 border-2 border-black hover:bg-neutral-100 transition-colors">
      <h3 class="font-bold mb-1">{{ article.title }}</h3>
      {% if article.author %}
      <span class="text-sm text-neutral-500">by {{ article.author.name }}</span>
      {% endif %}
    </a>
    {% endfor %}
  </div>
</section>
{% endif %}
```

### Sanity CDN Configuration

**Hardcoded in macros (existing pattern from `card.njk`):**
```nunjucks
{% set sanityProjectId = "gc7vlywa" %}
{% set sanityDataset = "production" %}
```

**Or use global data from `sanityConfig.js`:**
```javascript
module.exports = {
  projectId: process.env.SANITY_PROJECT_ID || "gc7vlywa",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2021-10-21"
};
```

### E2E Test Structure

**`tests/e2e/articles.spec.js`:**
```javascript
// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Educational Articles', () => {
  test.describe('Article Listing Page', () => {
    test('should render article listing page', async ({ page }) => {
      await page.goto('/articles/');
      await expect(page.locator('h1')).toContainText('Articles');
      // Verify grid of article cards
    });

    test('should display article cards with title and author', async ({ page }) => {
      await page.goto('/articles/');
      const cards = page.locator('.article-card');
      // Verify card content
    });
  });

  test.describe('Article Detail Page', () => {
    test('should render article content', async ({ page }) => {
      // Navigate to first article
      await page.goto('/articles/');
      const firstCard = page.locator('.article-card a').first();
      await firstCard.click();

      // Verify article elements
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('article')).toBeVisible();
    });

    test('should display author info when present', async ({ page }) => {
      // Test author display
    });
  });

  test.describe('Related Articles on Style Pages', () => {
    test('should show related articles section when articles exist', async ({ page }) => {
      // Navigate to a style that has related articles
      // Verify "Related Reading" section
    });
  });
});
```

### Project Structure Notes

**Alignment with unified project structure:**
- Articles data file: `src/_data/articles.js` (matches existing pattern)
- Article pages: `src/pages/articles/` directory for paginated detail
- Article listing: `src/pages/articles.njk` or `src/pages/articles/index.njk`
- Card macro: Add to existing `src/_includes/macros/card.njk`

**No detected conflicts:**
- Follows same patterns as designStyles.js and submissions.js
- Uses same Sanity CDN URL construction as existing templates
- Consistent with responsive grid patterns

### References

- [Source: docs/architecture.md#Data-Architecture] - Data fetching pattern
- [Source: docs/architecture.md#Structure-Patterns] - Data file pattern
- [Source: docs/epics.md#Story-2.7] - Full acceptance criteria
- [Source: docs/prd.md#FR42] - Create/edit educational articles
- [Source: docs/prd.md#FR43] - Manage author profiles
- [Source: studio/schemas/article.js] - Article schema definition
- [Source: studio/schemas/author.js] - Author schema definition
- [Source: src/_data/site.js] - Existing data file pattern
- [Source: src/pages/styles/style-detail.njk] - Existing block content rendering
- [Source: src/_includes/macros/card.njk] - Card macro patterns

## Dev Agent Record

### Context Reference

- Epic 2: Public Design Gallery Experience
- Dependencies: Story 2.2 complete (style detail pages exist)
- Sanity schemas for article and author already exist
- Block content rendering pattern established in style-detail.njk

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Previous Story Intelligence

**From Story 2.6 completion (2025-12-10):**
- Build succeeds with 42 files generated
- 84 E2E tests pass
- Responsive patterns verified working
- Touch targets meet 44px minimum
- Sanity CDN image pattern: hardcode projectId/dataset in macros

**From style-detail.njk analysis:**
- Block content (Portable Text) rendering pattern established
- Uses `{% for block in style.history %}{% for span in block.children %}{{ span.text }}{% endfor %}{% endfor %}`
- Image ref transformation: `| replace('image-', '') | replace('-jpg', '.jpg')` etc.
- Sanity CDN URL: `https://cdn.sanity.io/images/{{ projectId }}/{{ dataset }}/{{ ref }}?w=800`

### Completion Notes List

- Created `src/_data/articles.mjs` following existing pattern from `designStyles.mjs`
- GROQ query resolves author and relatedStyle references with arrow notation
- Article detail page uses Eleventy pagination for dynamic routes
- Block content renderer handles: paragraphs, h2/h3/h4, blockquote, bullet/numbered lists, images
- Inline macro `renderSpan` handles bold/italic marks within text
- Related Articles section added to style-detail.njk with conditional display
- Article listing page at /articles/ with responsive grid and empty state
- articleCard macro added to card.njk with consistent styling
- Navigation updated in both desktop and mobile menus
- Added `date` and `extractExcerpt` filters to eleventy config
- 20 new E2E tests covering all acceptance criteria
- All 104 E2E tests pass (84 existing + 20 new)
- Build generates 46 files (43 base + 3 article pages)ckquote, bullet/numbered lists, images
- Inline macro `renderSpan` handles bold/italic marks within text
- Related Articles section added to style-detail.njk with conditional display
- Article listing page at /articles/ with responsive grid and empty state
- articleCard macro added to card.njk with consistent styling
- Navigation updated in both desktop and mobile menus
- Added `date` and `extractExcerpt` filters to eleventy config
- 20 new E2E tests covering all acceptance criteria
- All 104 E2E tests pass (84 existing + 20 new)
- Build generates 43 files (was 42, added articles listing)

### Code Review Fixes (2025-12-10)

- **Fixed Broken Link Rendering:** Updated `renderSpan` macro in `src/pages/articles/article.njk` to correctly handle Portable Text links using `markDefs`.
- **Refactored Card Macro:** Updated `src/_includes/macros/card.njk` to use the `extractExcerpt` filter instead of duplicated logic, and removed hardcoded Sanity credentials in favor of `sanityConfig` global data.
- **Updated Imports:** Changed `card.njk` imports in `src/pages/articles.njk` and `src/pages/index.njk` to use `with context` to access global configuration.
- **Environment Setup:** Created `.env` file with Sanity credentials to ensure local development works correctly.

### Sample Content Population (2025-12-10)

**Created:**
- `src/_data/articles.mjs` - Sanity data fetching for articles
- `src/pages/articles/article.njk` - Article detail template (paginated)
- `src/pages/articles.njk` - Article listing page
- `tests/e2e/articles.spec.js` - E2E tests (20 tests)
- `.env` - Local environment configuration
- `studio/articles-import.ndjson` - Sample articles and authors for Sanity
- `studio/ARTICLES_IMPORT_SUMMARY.md` - Documentation for sample content

**Modified:**
- `.eleventy.js` - Added `date` and `extractExcerpt` filters
- `src/_includes/macros/card.njk` - Added `articleCard` macro, refactored for clean code
- `src/_includes/components/navigation.njk` - Added Articles nav link (desktop + mobile)
- `src/pages/styles/style-detail.njk` - Added Related Articles section
- `src/pages/index.njk` - Updated card macro import
- `docs/sprint-artifacts/sprint-status.yaml` - Status updated to `done`
- `docs/sprint-artifacts/2-7-educational-articles-display.md` - This story file
   - Topics: Color as material, primary colors, contrast/harmony, Josef Albers
   - Published: November 20, 2025

3. "Digital Brutalism: Rebellion Against Corporate Design" by Sarah Chen
1. [x] **Data fetching:** `src/_data/articles.mjs` fetches articles with resolved references
2. [x] **Article detail page:** Renders title, author, date, body content
3. [x] **Block content:** Sanity Portable Text renders as HTML (paragraphs, headings, images, links)
4. [x] **Author display:** Name, bio, image render when present
5. [x] **Related articles:** Section appears on style-detail pages with linked articles
6. [x] **Article listing:** Grid of article cards at `/articles/`
7. [x] **Build succeeds:** `npm run build` completes without errors (46 files)
8. [x] **Tests pass:** All E2E tests pass including new article tests (104 total)
9. [x] **Sample content:** 3 articles with 2 authors imported and visible on site
- Verification: All 3 articles visible at `/articles/`, individual pages render correctly, Related Reading sections appear on corresponding style detail pages

### File List

**Created:**
- `src/_data/articles.mjs` - Sanity data fetching for articles
- `src/pages/articles/article.njk` - Article detail template (paginated)
- `src/pages/articles.njk` - Article listing page
- `tests/e2e/articles.spec.js` - E2E tests (20 tests)
- `.env` - Local environment configuration

**Modified:**
- `.eleventy.js` - Added `date` and `extractExcerpt` filters
- `src/_includes/macros/card.njk` - Added `articleCard` macro, refactored for clean code
- `src/_includes/components/navigation.njk` - Added Articles nav link (desktop + mobile)
- `src/pages/styles/style-detail.njk` - Added Related Articles section
- `src/pages/index.njk` - Updated card macro import
- `docs/sprint-artifacts/sprint-status.yaml` - Status updated

---

## Validation Checklist

Before marking complete, verify these **8 essential checks**:

1. [x] **Data fetching:** `src/_data/articles.mjs` fetches articles with resolved references
2. [x] **Article detail page:** Renders title, author, date, body content
3. [x] **Block content:** Sanity Portable Text renders as HTML (paragraphs, headings, images)
4. [x] **Author display:** Name, bio, image render when present
5. [x] **Related articles:** Section appears on style-detail pages with linked articles
6. [x] **Article listing:** Grid of article cards at `/articles/`
7. [x] **Build succeeds:** `npm run build` completes without errors (43 files)
8. [x] **Tests pass:** All E2E tests pass including new article tests (104 total)
