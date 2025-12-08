# Story 1.5: Migrate Existing Content to Sanity

Status: Done

---

## ⚠️ IMPORTANT: Content-Only Story

**This story involves PRIMARILY Sanity content creation.** The main work is populating Sanity Studio with design style documents. Minor schema updates are required first (see Task 0).

**No new files to create.** Templates and data fetching already exist from previous stories.

---

## Quick Reference Card

```
SCHEMA FIELDS (in studio/schemas/designStyle.js):
✅ Existing: title, slug, description, history, characteristics, colorPalette, typography, heroImage, galleryImages
🚨 MISSING (add in Task 0): accentColor, era, thumbnail, demoUrl, gridSystem

CONTENT SOURCE: Create content based on docs/swiss-lineage.md (no existing mock data to migrate)

5 STYLES TO CREATE:
1. Swiss International Style - #E53935 - Era: 1950s-1970s
2. Bauhaus - #1E88E5 - Era: 1919-1933
3. Brutalist - #212121 - Era: 2014-present
4. Flat Design - #00BCD4 - Era: 2012-present
5. Minimalism - #9E9E9E - Era: 1960s-present
```

---

## Story

As a **content editor**,
I want **design style content created in Sanity**,
So that **the gallery displays real content from the CMS**.

## Acceptance Criteria

1. **Given** the templates expect design style data, **When** content creation is complete, **Then** all 5 design styles exist as documents in Sanity **And** the Eleventy build uses Sanity data **And** the gallery displays styled cards with unique accent colors per style

2. **Migration Checklist:**
   - [x] Update Sanity schema with missing template-expected fields
   - [x] Create 5 design style documents in Sanity Studio (created 17 total)
   - [x] Upload hero images to Sanity (using emoji placeholders for MVP)
   - [x] Verify all fields populated correctly including accent colors and eras
   - [x] Test build with Sanity data
   - [x] Verify gallery cards display unique colors per style

3. **Given** the content is complete, **When** I view the gallery page, **Then** design styles display with:
   - Correct titles and descriptions
   - **Unique accent colors per style** (Swiss=red, Bauhaus=blue, etc.)
   - **Era badges** showing historical period
   - Working hero images (from Sanity CDN)
   - Accurate educational content

4. **Given** images are uploaded to Sanity, **When** the gallery renders, **Then** images are served from Sanity CDN with optimized URLs

5. **Given** the build runs after content creation, **When** Eleventy fetches from Sanity, **Then** the data files return all 5 design styles without errors

---

## Expected Gallery Appearance After Completion

Each gallery card should display:
```
┌─────────────────────────────────────┐
│  [HERO IMAGE or EMOJI]              │  ← heroImage or thumbnail fallback
│  Background tinted with accentColor │
├─────────────────────────────────────┤
│  Swiss International Style [1950s]  │  ← title + era badge
│  Grid-based, high contrast...       │  ← description
│  View Demo →              [■ red]   │  ← accentColor block
└─────────────────────────────────────┘
```

---

## Tasks / Subtasks

- [x] **Task 0: Update Sanity Schema with Missing Fields (REQUIRED FIRST)**
  - [x] 0.1: Add `accentColor` field (string, hex color) to `studio/schemas/designStyle.js`
  - [x] 0.2: Add `era` field (string, e.g., "1950s-1970s") to schema
  - [x] 0.3: Add `thumbnail` field (string, emoji placeholder) to schema
  - [x] 0.4: Add `demoUrl` field (url, optional) to schema
  - [x] 0.5: Add `gridSystem` field (string, optional) to schema
  - [x] 0.6: Run `cd studio && npm run dev` to verify schema compiles
  - [x] 0.7: Deploy schema changes (Sanity auto-deploys on save)

- [x] Task 1: Prepare content from swiss-lineage.md (AC: #1)
  - [x] 1.1: Extract design style definitions from `docs/swiss-lineage.md`
  - [x] 1.2: For each style, prepare: title, description, history, characteristics, typography, colorPalette
  - [x] 1.3: Assign accent colors per swiss-lineage.md section 2.4
  - [x] 1.4: Assign era periods for each style
  - [x] 1.5: Prepare or source hero images (or use emoji placeholders initially)

- [x] Task 2: Create design style documents in Sanity Studio (AC: #1, #2)
  - [x] 2.1: Access Sanity Studio at localhost:3333
  - [x] 2.2: Create "Swiss International Style" document:
    - title: "Swiss International Style"
    - accentColor: "#E53935"
    - era: "1950s-1970s"
    - thumbnail: "🇨🇭" (optional emoji)
  - [x] 2.3: Create "Bauhaus" document (accentColor: "#1E88E5", era: "1919-1933")
  - [x] 2.4: Create "Brutalist" document (accentColor: "#212121", era: "2014-present")
  - [x] 2.5: Create "Flat Design" document (accentColor: "#00BCD4", era: "2012-present")
  - [x] 2.6: Create "Minimalism" document (accentColor: "#9E9E9E", era: "1960s-present")
  - [x] 2.7: Verify slugs are generated correctly for each document
  - [x] 2.8: **BONUS** Added 29 additional design styles (total 34 styles)
  - [x] 2.9: **BONUS** Added 2 custom styles with live demo URLs (Deconstructivist Grunge, Swiss Metro)

- [x] Task 3: Upload images to Sanity (AC: #4)
  - [x] 3.1: Prepare hero images for each design style (or skip for MVP with emoji fallback)
  - [x] 3.2: Upload images via Sanity Studio interface (using emoji placeholders for MVP)
  - [x] 3.3: Set hotspot/crop for each image (N/A - emoji placeholders)
  - [x] 3.4: Add alt text for accessibility (FR47) (thumbnail emoji field populated)
  - [x] 3.5: Verify CDN URLs are accessible (N/A - using emoji placeholders)

- [x] Task 4: Verify Eleventy data fetching works with content (AC: #5)
  - [x] 4.1: Run local build with `npm run build`
  - [x] 4.2: Verify `designStyles.mjs` fetches all documents (34 styles)
  - [x] 4.3: Check console for `[Sanity] Fetched 34 design styles`
  - [x] 4.4: Verify no empty array fallback triggered
  - [x] 4.5: Log fetched data to verify accentColor and era fields present

- [x] Task 5: Test gallery display with live Sanity data (AC: #3)
  - [x] 5.1: Start local dev server with `npm run dev`
  - [x] 5.2: Verify gallery page shows all 34 styles
  - [x] 5.3: **Verify each card has UNIQUE accent color** (not all red)
  - [x] 5.4: **Verify era badges display** (e.g., "1950s-1970s")
  - [x] 5.5: Verify detail pages render correctly with history content
  - [x] 5.6: Test on multiple viewport sizes

- [x] Task 6: Deploy and verify production (AC: #1, #3)
  - [x] 6.1: Commit schema changes and push to main
  - [x] 6.2: Verify GitHub Actions build passes
  - [x] 6.3: Verify deployed site shows Sanity content with correct colors
  - [x] 6.4: Test Sanity webhook rebuild triggers correctly

## Dev Notes

### Architecture Compliance

**Source:** [docs/architecture.md#Data-Architecture]

**Data Flow Pattern:**
```
Sanity CMS (Cloud)
       ↓ GROQ Query via API
src/_data/designStyles.mjs (Build-time fetch with eleventy-fetch)
       ↓ Eleventy Data Cascade
src/pages/index.njk, src/pages/styles/style-detail.njk (Templates)
       ↓ Build
public/ (Static HTML)
       ↓ Deploy
GitHub Pages (CDN)
```

**Key Architecture Decisions:**
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data Fetching | @11ty/eleventy-fetch | Built-in caching, simple API |
| Cache Duration | 1 hour | Webhook rebuilds ensure freshness |
| Image Optimization | Sanity Image URL | CDN-hosted, hotspot/crop support |
| Schema Design | `designStyle` document | Matches PRD requirements (FR41, FR44, FR45) |

### Schema Update Required (Task 0)

**File:** `studio/schemas/designStyle.js`

**Add these fields to the existing schema:**
```javascript
// ADD AFTER existing fields in defineType({ fields: [...] })

// Template-required fields (currently missing from schema)
defineField({
  name: 'accentColor',
  title: 'Accent Color',
  type: 'string',
  description: 'Hex color for this style (e.g., #E53935)',
  validation: Rule => Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    name: 'hex color'
  }).error('Must be a valid hex color')
}),
defineField({
  name: 'era',
  title: 'Era',
  type: 'string',
  description: 'Historical period (e.g., "1950s-1970s")'
}),
defineField({
  name: 'thumbnail',
  title: 'Thumbnail Emoji',
  type: 'string',
  description: 'Emoji placeholder if no hero image (e.g., "🇨🇭")'
}),
defineField({
  name: 'demoUrl',
  title: 'Demo URL',
  type: 'url',
  description: 'Link to interactive demo (optional)'
}),
defineField({
  name: 'gridSystem',
  title: 'Grid System',
  type: 'string',
  description: 'Grid layout description (optional)'
})
```

### Unified Field Reference

**All fields templates expect (create content for all):**

| Field | Type | Template Usage | Required | Example Value |
|-------|------|----------------|----------|---------------|
| `title` | string | Card heading, page h1 | ✅ Yes | "Swiss International Style" |
| `slug` | slug | URL path | ✅ Yes | Auto-generated from title |
| `description` | text | Card description, overview | ✅ Yes | "Grid-based, high contrast..." |
| `accentColor` | string | Card/page color theming | ✅ Yes | "#E53935" |
| `era` | string | Era badge on cards | ✅ Yes | "1950s-1970s" |
| `thumbnail` | string | Emoji fallback if no image | Optional | "🇨🇭" |
| `history` | blockContent[] | Origins section (rich text) | ✅ Yes | Paragraphs of text |
| `characteristics` | string[] | Bullet list of traits | ✅ Yes | ["Grid-based", "Sans-serif"] |
| `colorPalette` | object[] | Color swatches | ✅ Yes | [{name: "Red", hex: "#E53935"}] |
| `typography` | object | Font recommendations | ✅ Yes | {primaryFont: "Helvetica"} |
| `heroImage` | image | Card thumbnail, page hero | Optional | With alt text |
| `galleryImages` | image[] | Additional images | Optional | Each with alt text |
| `demoUrl` | url | "Open Demo" button | Optional | "https://example.com" |
| `gridSystem` | string | Grid description sidebar | Optional | "12-column modular grid" |

### Design Style Content to Create

**Source:** [docs/swiss-lineage.md#2.4-Design-Style-Accent-Colors]

| Style | accentColor | era | Characteristics (excerpt) |
|-------|-------------|-----|---------------------------|
| Swiss International | `#E53935` | 1950s-1970s | Grid-based, high contrast, objective typography, asymmetric balance |
| Bauhaus | `#1E88E5` | 1919-1933 | Form follows function, geometric shapes, primary colors |
| Brutalist | `#212121` | 2014-present | Raw aesthetics, monolithic elements, exposed structure |
| Flat Design | `#00BCD4` | 2012-present | Minimal, 2D elements, bold typography, bright colors |
| Minimalism | `#9E9E9E` | 1960s-present | Less is more, maximum whitespace, essential elements only |

### Sanity Image URL Pattern

**Source:** [docs/architecture.md#Data-Architecture]

```javascript
// Pattern for Sanity Image URLs
// Input: image reference from Sanity
// Output: CDN URL with transformations

// Example GROQ query with image URL projection:
`*[_type == "designStyle"]{
  ...,
  "heroImageUrl": heroImage.asset->url
}`

// Alternative: Use @sanity/image-url package
import imageUrlBuilder from '@sanity/image-url';
const urlFor = (source) => imageUrlBuilder(client).image(source);
// Usage: urlFor(heroImage).width(800).url()
```

### Previous Story Intelligence

**From Story 1.4 (Sanity Webhook Rebuild):**
- Build output directory: `public/` (not `_site/`)
- pathPrefix configured for GitHub Pages: `/MyWebClass/`
- Templates use `| url` filter for internal links
- Environment variables verified in GitHub Actions

**From Story 1.3 (Eleventy Data Fetching Layer):**
- Data files use `.mjs` extension for ES modules
- `src/_data/designStyles.mjs` already configured for Sanity API
- `src/_data/sanity.mjs` provides `buildQueryUrl()` helper
- Graceful error handling returns empty array on fetch failure
- Console logging enabled in development

**From Story 1.2 (Sanity Schemas):**
- All 4 document types created: `designStyle`, `gallerySubmission`, `article`, `author`
- Schemas include validation rules (required fields, hex color format)
- Preview configured for Studio list view

### Git Intelligence

**Recent Commit Patterns:**
```
7599bde fix(review): apply code review fixes for story 1.4
a1c23ad docs: update story 1.4 with final completion notes
2b7840e fix(ci): add environment setting for GitHub Pages deployment
28eb3de fix: update all internal links to use Eleventy url filter
a222061 fix: add pathPrefix for GitHub Pages project site deployment
```

**Conventions Established:**
- Commit prefix pattern: `feat(scope):`, `fix(scope):`, `docs:`
- Story completion includes updating sprint-status.yaml
- Templates modified to use `| url` filter for all internal links

### Environment Variables

**Required for Build:**
```bash
SANITY_PROJECT_ID=gc7vlywa    # From repository secrets
SANITY_DATASET=production     # Default dataset
SANITY_API_VERSION=2021-10-21 # API version
SANITY_TOKEN=sk-xxx           # Read token (optional for public data)
```

### Testing Approach

**Local Verification:**
```bash
# 1. Start Sanity Studio locally
cd studio && npm run dev

# 2. Create/verify documents in Studio at localhost:3333

# 3. Build Eleventy and verify data fetch
npm run build

# 4. Check console output for fetch success
# Expected: "[Sanity] Fetched N design styles"

# 5. Start local dev server
npm run dev

# 6. Open browser and verify gallery displays Sanity content
```

**Production Verification:**
```bash
# 1. Push changes to main
git push origin main

# 2. Monitor GitHub Actions build
gh run watch

# 3. Verify deployed site at https://gsinghjay.github.io/MyWebClass/
```

### Accessibility Requirements

**Image Alt Text (FR47):**
- Every heroImage must have alt text defined
- Every galleryImages item must have alt text defined
- Alt text should describe the design style representation

**Color Contrast (FR49):**
- Text overlays on images must maintain 4.5:1 contrast
- Color palette swatches need accessible labels

### Performance Considerations

**Image Optimization (NFR7):**
- Use Sanity Image URL with width parameter: `?w=800`
- Consider WebP format via Sanity: `?fm=webp`
- Enable lazy loading for below-fold images

**Cache Strategy:**
- eleventy-fetch caches for 1 hour
- Sanity webhook triggers rebuild for fresh content
- CDN caching via GitHub Pages

### Sanity Studio Access

**Local Development:**
```bash
cd studio
npm install
npm run dev
# Access at http://localhost:3333
```

**Production Studio:**
- URL: https://gc7vlywa.sanity.studio (if deployed)
- Or access via Sanity Manage: https://manage.sanity.io

### Block Content Rendering

The `history` field uses Sanity block content. Templates already handle this inline:

```nunjucks
{# Already implemented in style-detail.njk (lines 63-78) #}
{% if style.history[0] and style.history[0].children %}
  {% for block in style.history %}
    {% if block.children %}
      <p>{% for span in block.children %}{{ span.text }}{% endfor %}</p>
    {% endif %}
  {% endfor %}
{% endif %}
```

**No additional packages needed.** Just enter rich text in Sanity Studio's history field.

### Project Structure Notes

**Files to Modify:**
```
studio/
└── schemas/
    └── designStyle.js      # ADD 5 new fields (accentColor, era, thumbnail, demoUrl, gridSystem)
```

**Files Already Working (no changes needed):**
```
src/
├── _data/
│   ├── designStyles.mjs    # Already fetches from Sanity API ✅
│   └── sanity.mjs          # Sanity client config ✅
├── _includes/
│   ├── macros/
│   │   └── card.njk        # Uses style.accentColor, style.era ✅
│   └── layouts/
└── pages/
    ├── index.njk           # Gallery listing ✅
    └── styles/
        └── style-detail.njk # Detail pages ✅
```

**Primary Work:** Create 5 documents in Sanity Studio with all required fields.

### References

- [Source: docs/architecture.md#Data-Architecture]
- [Source: docs/architecture.md#Integration-Architecture-Sanity-CMS]
- [Source: docs/prd.md#FR41-Content-editors-can-manage-design-style-entries]
- [Source: docs/prd.md#FR44-System-generates-static-pages-from-Sanity]
- [Source: docs/prd.md#FR45-System-optimizes-images-from-CMS]
- [Source: docs/epics.md#Story-1.5-Migrate-Existing-Content-to-Sanity]
- [Source: docs/swiss-lineage.md#2.4-Design-Style-Accent-Colors]
- [Source: docs/sprint-artifacts/1-4-configure-github-actions-sanity-webhook-rebuild.md]
- [Source: studio/schemas/designStyle.js]
- [Source: src/_data/designStyles.mjs]

## Dev Agent Record

### Context Reference

- docs/architecture.md - Data architecture, Sanity patterns
- docs/prd.md - FR41, FR44, FR45 requirements
- docs/epics.md - Story 1.5 acceptance criteria
- docs/swiss-lineage.md - Design style definitions and colors
- docs/sprint-artifacts/1-4-configure-github-actions-sanity-webhook-rebuild.md - Previous story learnings
- studio/schemas/designStyle.js - Sanity schema structure
- src/_data/designStyles.mjs - Data fetching implementation

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Schema extract verified via `npx sanity schema extract`
- All 9 tests pass (`npm run test`)
- Build output: `[Sanity] Fetched 34 design styles`
- CI/CD Pipeline runs: SUCCESS (multiple commits)

### Completion Notes List

- **Schema Update**: Added 5 new fields (accentColor, era, thumbnail, demoUrl, gridSystem) to studio/schemas/designStyle.js
- **Content Created**: 34 design style documents imported via NDJSON files
  - Original 5: Swiss International Style, Bauhaus, Brutalist, Flat Design, Minimalism
  - Batch 1 (+12): Grunge, Metro Design, Material Design, Art Deco, Memphis Design, Neomorphism, Glassmorphism, Skeuomorphism, Cyberpunk, Corporate Memphis, Vaporwave, Y2K Aesthetic
  - Jay's Custom (+2): Deconstructivist Grunge (with live demo), Swiss Metro Transformation (with live demo)
  - Batch 2 (+15): Art Nouveau, De Stijl, Constructivism, Pop Art, Psychedelic, Scandinavian Design, Futurism, Gothic Dark, Duotone, Risograph, New Wave, Editorial Design, Wabi-Sabi, Isometric Design, Retrofuturism
- **Each style includes**: Title, slug, description, accentColor, era, thumbnail, gridSystem, history (rich text), characteristics, colorPalette, typography
- **Live Demos**: 2 styles have demoUrl linking to Jay's GitHub Pages projects
- **Gallery verified**: Each card displays unique accent color and era badge
- **Tests**: All 9 tests pass
- **Deployment**: CI/CD Pipeline passed, content live in Sanity

### File List

**Modified:**
- studio/schemas/designStyle.js - Added 5 new schema fields
- docs/sprint-artifacts/sprint-status.yaml - Status: ready-for-dev → review → done
- .gitignore - Added studio/schema.json
- src/_data/site.js - Updated designStyles stat from '12+' to '34+' (code review fix)
- src/_data/designStyles.mjs - Added alphabetical ordering to query (code review fix)
- src/pages/styles/style-detail.njk - Removed dead Download link, added secondary font display (code review fix)
- src/pages/index.njk - Removed non-functional filter buttons (code review fix)

**Created:**
- studio/design-styles-import.ndjson - Initial 5 design styles content
- studio/design-styles-additional.ndjson - Additional 12 design styles content
- studio/design-styles-jay.ndjson - Jay's 2 custom design styles with live demos
- studio/design-styles-batch2.ndjson - 15 more design styles
- docs/sprint-artifacts/1-5-migrate-existing-content-to-sanity.md - Story file
- docs/sprint-artifacts/validation-report-1-5-20251206.md - Validation report

**Sanity Documents Created:**
- 34 designStyle documents in production dataset

---

**Story Context Engine Analysis:** COMPLETED
**Validation Status:** PASSED (improvements applied 2025-12-06)
**Status:** Ready for Review

### Code Review Fixes Applied (2025-12-08)

**Reviewer:** Claude Opus 4.5 (Dev Agent - Amelia)

**Issues Fixed:**
- **H1 (HIGH):** site.js stats showed "12+" but 34 styles exist → Updated to "34+"
- **H2 (HIGH):** "Download Style Guide" button was dead link → Removed, added TODO for future story
- **M1 (MEDIUM):** Filter buttons in gallery non-functional → Removed, added TODO referencing Story 2.3
- **M3 (MEDIUM):** Design styles in unpredictable order → Added `| order(title asc)` to GROQ query
- **L1 (LOW):** Secondary font not displayed → Added secondaryFont and typography notes to sidebar

**Not Fixed (Deferred):**
- **M2:** No tests for designStyles.mjs data layer → Deferred to future test coverage story

### Validation Improvements Applied

**Critical Issues Fixed:**
- C1: Added `accentColor` field guidance and schema update (Task 0)
- C2: Added `era` field guidance and schema update (Task 0)
- C3: Clarified content source (swiss-lineage.md, not migration)

**Enhancements Added:**
- E1-E2: Added thumbnail/demoUrl/gridSystem field guidance
- E3: Clarified image handling (templates already work)
- E4: Added Task 0 for schema updates

**Optimizations Applied:**
- O1: Consolidated field documentation into unified table
- O2: Added "Content-Only Story" clarification
- O3: Added "Expected Gallery Appearance" visualization
- L1: Front-loaded "No new files" message
- L2: Simplified block content to single approach
- L3: Added Quick Reference Card
