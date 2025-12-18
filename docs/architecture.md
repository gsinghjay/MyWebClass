---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - docs/prd.md
  - docs/index.md
  - docs/project-overview.md
  - docs/swiss-lineage.md
workflowType: 'architecture'
lastStep: 8
status: 'complete'
project_name: 'is373-final'
user_name: 'Jay'
date: '2025-12-06'
completedAt: '2025-12-06'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
50 functional requirements across 7 domains:
- Design Gallery (7 FRs): Public browsing, filtering, detail pages, featured themes, mobile-responsive
- Submission Management (9 FRs): Form submission, CMS storage, consent, status workflow
- Instructor Dashboard (8 FRs): Handled via Sanity Studio for MVP (custom UI post-MVP)
- Content Curation (4 FRs): Featured theme selection via Sanity fields
- User Consent & Privacy (7 FRs): Cookie consent, analytics gating, legal pages, data deletion
- Integrations (5 FRs): Discord webhooks, CRM sync, GA4 analytics, Sanity rebuild triggers
- CMS & Accessibility (10 FRs): Sanity content management, semantic HTML, ARIA, focus management

**Non-Functional Requirements:**
38 NFRs defining quality attributes:
- Performance (8 NFRs): Lighthouse >90, FCP <1.5s, LCP <2.5s, CLS <0.1, CSS <50KB
- Security (7 NFRs): HTTPS, CSRF, XSS, Sanity-managed auth for MVP, secrets management
- Accessibility (8 NFRs): WCAG 2.1 AA, contrast ratios, keyboard navigation, screen reader support
- Reliability (5 NFRs): 99.9% uptime, graceful degradation, failure isolation
- Integration (5 NFRs): Webhook timing, GDPR compliance, batch sync support
- Maintainability (5 NFRs): Code style, documentation, CI clarity

**Scale & Complexity:**

- Primary domain: Static Web Application with Headless CMS
- Complexity level: Medium (reduced by leveraging Sanity Studio)
- Estimated architectural components: 12-15

### Technical Constraints & Dependencies

**Existing Technology Stack (Brownfield):**
- Eleventy 3.1.2 static site generator
- Tailwind CSS 3.4.18 with Swiss design tokens
- Nunjucks templating
- PostCSS processing pipeline

**Target Integrations:**
- Sanity CMS for content management AND instructor workflow (MVP)
- Netlify for static hosting + serverless functions (form processing)
- Discord for community notifications
- Airtable for CRM
- Google Analytics 4 with consent mode

**Compliance Requirements:**
- GDPR cookie consent with opt-in analytics
- WCAG 2.1 Level AA accessibility
- Data retention and deletion capabilities

### Cross-Cutting Concerns Identified

1. **Consent Management**: Cookie consent state must gate analytics loading; form consent separate from marketing
2. **Error Handling**: Integration failures (Discord, CRM) must not block core user flows
3. **Performance Budget**: Static-first architecture with aggressive optimization targets
4. **Accessibility**: Built into every component from the start
5. **Build Pipeline**: Sanity webhook → Netlify Build Hook → Eleventy → Netlify CDN

### MVP Scope Decisions

| Concern | MVP Approach | Post-MVP |
|---------|--------------|----------|
| Instructor Auth | Sanity Studio native auth | Custom dashboard with role-based access |
| Submission Review | Sanity Studio interface | Custom admin UI |
| Featured Selection | Sanity `featured` boolean field | Curator dashboard |

## Starter Template Evaluation

### Primary Technology Domain

Static Web Application with Headless CMS — Brownfield project extending existing Eleventy codebase.

### Starter Selection: Existing Brownfield Codebase

**Rationale:** Working Eleventy 3.1.2 + Tailwind 3.4.18 stack already established. Swiss design system implemented. Only missing piece is Sanity CMS integration.

### Architectural Decisions Pre-Established

| Decision | Implementation |
|----------|----------------|
| Static Site Generator | Eleventy 3.1.2 |
| Templating | Nunjucks |
| Styling | Tailwind CSS 3.4.18 + PostCSS |
| Build Output | `public/` directory |
| Data Pattern | JavaScript data files in `src/_data/` |

### Integration Architecture: Sanity CMS

**Data Flow:**
```
Sanity CMS → @11ty/eleventy-fetch (cached) → _data/*.js → Templates → Static HTML
```

**Studio Configuration:**
- Standalone Sanity Studio in `/studio` directory
- Schemas: `designStyle`, `gallerySubmission`, `article`, `author`
- Instructor workflow via Sanity Studio native interface (MVP)

**Build Trigger:**
- Sanity webhook → Netlify Build Hook → Eleventy rebuild → Netlify deploy

**Form Submissions:**
- Netlify Function (`/.netlify/functions/submit-form`) receives form POST
- Uploads screenshot to Sanity CDN (if provided)
- Creates gallerySubmission document in Sanity with `pending` status
- Sends Discord webhook notification (non-blocking)
- Syncs to Airtable CRM (non-blocking)

**Why Netlify (not GitHub Pages):**
GitHub Pages is static-only and cannot execute server-side code. The submission flow requires:
- Processing form data with validation
- Uploading images to Sanity CDN
- Creating documents in Sanity CMS via mutations API
- Sending notifications to Discord

Netlify provides serverless functions that run on form submission, eliminating the need for a separate backend service.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- CMS Integration: Sanity with @11ty/eleventy-fetch
- Form Handling: Netlify Function with Sanity mutations
- Build Pipeline: Netlify with Sanity webhook trigger

**Important Decisions (Shape Architecture):**
- Image Optimization: Sanity Image URL (CDN)
- CRM: Airtable (via Netlify Function)
- Notifications: Discord webhook (via Netlify Function)

**Deferred Decisions (Post-MVP):**
- Custom instructor dashboard (using Sanity Studio for MVP)
- Advanced analytics dashboards
- User accounts for submitters

### Data Architecture

| Decision | Choice | Version/Details | Rationale |
|----------|--------|-----------------|-----------|
| Data Fetching | @11ty/eleventy-fetch | Latest | Built-in caching, simple API, webhooks ensure freshness |
| Cache Duration | 1 hour | — | Safety net; webhook rebuilds handle real-time updates |
| Image Optimization | Sanity Image URL | — | CDN-hosted, hotspot/crop support, no build overhead |
| Schema Design | 4 document types | designStyle, gallerySubmission, article, author | Matches PRD requirements |

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Instructor Auth (MVP) | Sanity Studio native | No custom auth needed; instructors use Studio directly |
| API Security | Environment variables | Sanity tokens, Make webhooks stored in env vars |
| Form Security | Honeypot + validation | Client-side validation, hidden field for bot detection |
| HTTPS | Netlify default | Automatic SSL via Netlify |

### API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Form Submission | Netlify Function | Serverless, same platform as hosting, no external dependencies |
| Sanity Mutations | Via Netlify Function | Function receives form POST, creates Sanity document |
| Discord Notifications | Via Netlify Function | Same function triggers Discord webhook (non-blocking) |
| CRM Sync | Airtable via Netlify Function | Function copies submission data to Airtable (non-blocking) |

**Integration Flow:**
```
User submits form
       ↓
Form POST → Netlify Function (/.netlify/functions/submit-form)
       ↓
Netlify Function:
  1. Create Sanity document (status: pending) [blocking]
  2. Send Discord webhook (#gallery-submissions) [non-blocking]
  3. Create Airtable record [non-blocking]
       ↓
Return success to user
       ↓
Sanity webhook → Netlify Build Hook
       ↓
Eleventy rebuild → Netlify deploy
```

### Frontend Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | None (static) | No client-side state needed for static site |
| JavaScript | Minimal, vanilla | Cookie consent + mobile nav only |
| Bundle Strategy | No bundler | Direct script includes, <50KB total |
| CSS | Tailwind (build-time) | Already configured, tree-shaking via PostCSS |

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | Netlify (Free Tier) | Built-in forms, functions, auto-deploy from Git |
| CI/CD | Netlify Git Integration | Auto-deploy on push to main, preview deploys for PRs |
| Build Triggers | Git push + Sanity webhook | Flexibility + automatic content updates |
| Sanity Studio | Standalone /studio directory | Separate deploy or embedded in repo |
| Environment Secrets | Netlify Environment Variables | Sanity tokens, webhook URLs, API keys |
| Form Processing | Netlify Functions | Serverless function creates Sanity documents |

**Netlify Site:** mywebclass-is373
**Team:** New Jersey Institute of Technology

### Decision Impact Analysis

**Implementation Sequence:**
1. Sanity Studio setup with schemas
2. Data fetching layer (eleventy-fetch + Sanity client)
3. Template updates to use Sanity data
4. Netlify Function for form submission (→ Sanity → Discord → Airtable)
5. Sanity webhook → Netlify Build Hook trigger
6. Data migration from mock data to Sanity

**Cross-Component Dependencies:**
- Sanity API token (write access) needed for form submissions
- Sanity project ID/dataset needed for all data fetching
- Netlify Build Hook URL needed for Sanity webhook

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Established Patterns (from existing codebase):** 6 areas already consistent
**New Patterns Defined:** 5 areas for Sanity/Make integration

### Naming Patterns

**File & Component Naming (Established):**
- Files: kebab-case (`cookie-consent.js`, `navigation.njk`)
- CSS classes: Tailwind utilities + custom components (`.btn-primary`, `.card`)
- Data files: camelCase exports (`designStyles.js` → `designStyles` variable)
- Template variables: camelCase (`designStyles`, `site.title`, `submission.demoUrl`)

**Sanity Schema Naming (New):**

| Element | Convention | Example |
|---------|------------|---------|
| Document types | camelCase | `designStyle`, `gallerySubmission` |
| Field names | camelCase | `accentColor`, `submittedDate` |
| Slug fields | Always named `slug` | `slug: { type: 'slug' }` |
| Reference fields | Descriptive or suffix `Ref` | `styleRef`, `author` |
| Boolean fields | Prefix `is` or `has` | `isFeatured`, `hasConsent` |
| Status fields | Lowercase string enum | `pending`, `approved`, `rejected` |

### Structure Patterns

**Directory Structure (Established):**
```
src/
├── _data/           # Data files (Sanity fetchers)
├── _includes/       # Layouts, components, macros
│   ├── layouts/
│   ├── components/
│   └── macros/
├── pages/           # Page templates
├── scripts/         # Client-side JavaScript
└── styles/          # CSS (Tailwind entry)
studio/              # Sanity Studio (separate)
```

**Data File Pattern:**
```javascript
// src/_data/{documentType}s.js
import Fetch from "@11ty/eleventy-fetch";

const QUERY = encodeURIComponent('*[_type == "designStyle"]');
const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

export default async function() {
  try {
    const data = await Fetch(URL, { duration: "1h", type: "json" });
    return data.result;
  } catch (e) {
    console.error("Failed to fetch:", e.message);
    return [];
  }
}
```

### Format Patterns

**Form → Sanity Field Mapping:**

| Form Field | Sanity Field | Type |
|------------|--------------|------|
| `name` | `submitterName` | string |
| `email` | `submitterEmail` | string |
| `style` | `styleRef` | reference |
| `demoUrl` | `demoUrl` | url |
| `screenshot` | `screenshot` | image |
| `explanation` | `authenticityExplanation` | text |
| `consent` | `hasPublicDisplayConsent` | boolean |
| `marketing` | `hasMarketingConsent` | boolean |
| (auto) | `status` | string: `pending` |
| (auto) | `submittedAt` | datetime |

**Sanity Document Status Values:**
- `pending` — Initial state, awaiting review
- `approved` — Visible in public gallery
- `rejected` — Not displayed, feedback provided
- `featured` — Approved + highlighted (via `isFeatured` boolean)

### Communication Patterns

**Form Submission Payload (Form → Netlify Function):**
```json
{
  "name": "Alex Chen",
  "email": "alex@njit.edu",
  "style": "swiss-international-style",
  "demoUrl": "https://example.com/demo",
  "authenticity": "Grid-based layout with Helvetica...",
  "consent": true,
  "marketing": false,
  "screenshot": "data:image/png;base64,...",
  "screenshotFilename": "screenshot.png",
  "screenshotMimeType": "image/png",
  "timestamp": "2025-01-15T14:30:00Z"
}
```

**Discord Notification Format:**
```
🎨 New Submission: "{style}" by {name}
Demo: {demoUrl}
```

### Process Patterns

**Error Handling:**

| Situation | Pattern |
|-----------|---------|
| Sanity fetch fails | Log error, return `[]`, build continues |
| Form submission fails | Show error message, retain form data |
| Missing image | Display style emoji/color block as fallback |
| Empty gallery state | Show "No submissions yet" with CTA |
| Discord/Airtable fails | Non-blocking; logged but form shows success |

**Template Consistency:**

| Pattern | Convention |
|---------|------------|
| Empty checks | `{% if items.length %}` (explicit length check) |
| Loop variables | Descriptive names (`style`, `submission`) |
| Macro params | Object for 3+ parameters |
| Includes | `{% include "components/card.njk" %}` |

### Enforcement Guidelines

**All AI Agents MUST:**
1. Use camelCase for all Sanity schema fields
2. Use kebab-case for all file names
3. Wrap Sanity fetches in try/catch with empty array fallback
4. Map form fields to Sanity fields using the documented mapping
5. Use `pending`/`approved`/`rejected` status values exactly

**Pattern Verification:**
- ESLint enforces JavaScript naming conventions
- Sanity schema validation enforces field types
- Build failure on Sanity fetch = check credentials, not code

### Pattern Examples

**Good:**
```javascript
// ✓ Correct data file pattern
export default async function() {
  try {
    const data = await Fetch(URL, { duration: "1h", type: "json" });
    return data.result;
  } catch (e) {
    return [];
  }
}
```

```nunjucks
{# ✓ Correct template pattern #}
{% if designStyles.length %}
  {% for style in designStyles %}
    {% include "components/card.njk" %}
  {% endfor %}
{% else %}
  <p>No styles available.</p>
{% endif %}
```

**Anti-Patterns:**
```javascript
// ✗ No error handling
export default async function() {
  const data = await Fetch(URL, { type: "json" });
  return data.result; // Build fails if Sanity unreachable
}
```

```nunjucks
{# ✗ Truthy check on array (always true) #}
{% if designStyles %}
  ...
{% endif %}
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
MyWebClass/
├── .eleventy.js                    # Eleventy configuration
├── .env                            # Environment variables (gitignored)
├── .env.example                    # Environment template
├── .gitignore
├── package.json
├── package-lock.json
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── netlify.toml                    # Netlify build & function configuration
├── README.md
│
├── netlify/
│   └── functions/
│       └── submit-form.js          # Form submission handler (Sanity + Discord + Airtable)
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI/CD Pipeline (lint, build, test, Lighthouse)
│       └── semantic-release.yml    # Automated versioning and releases
│
├── docs/                           # Project documentation
│   ├── index.md                    # Documentation index
│   ├── architecture.md             # This document
│   ├── prd.md                      # Product requirements
│   └── swiss-lineage.md            # UI specifications
│
├── src/                            # Eleventy source
│   ├── _data/                      # Global data files
│   │   ├── site.js                 # Site configuration
│   │   ├── designStyles.js         # → Sanity: designStyle documents
│   │   ├── submissions.js          # → Sanity: gallerySubmission documents
│   │   └── sanity.js               # Sanity client configuration
│   │
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk            # HTML document shell
│   │   │   └── page.njk            # Standard content page
│   │   ├── components/
│   │   │   ├── navigation.njk      # Header navigation
│   │   │   ├── footer.njk          # Site footer
│   │   │   └── cookie-banner.njk   # GDPR consent
│   │   └── macros/
│   │       ├── button.njk          # Button variants
│   │       ├── card.njk            # Gallery card
│   │       ├── form-field.njk      # Form inputs
│   │       └── badge.njk           # Status badges
│   │
│   ├── pages/
│   │   ├── index.njk               # Homepage (featured + community galleries)
│   │   ├── about.njk               # About page
│   │   ├── submit.njk              # Submission form → Netlify Function
│   │   ├── 404.njk                 # Not found
│   │   ├── legal/
│   │   │   ├── privacy.njk
│   │   │   ├── terms.njk
│   │   │   └── cookies.njk
│   │   ├── styles-index.njk        # Design Style Gallery listing (/styles/)
│   │   └── styles/
│   │       └── style-detail.njk    # Individual design style pages
│   │
│   ├── scripts/
│   │   ├── cookie-consent.js       # Cookie banner logic
│   │   └── navigation.js           # Mobile menu toggle
│   │
│   └── styles/
│       └── main.css                # Tailwind CSS entry
│
├── studio/                         # Sanity Studio (NEW)
│   ├── package.json
│   ├── sanity.config.js            # Studio configuration
│   ├── sanity.cli.js               # CLI configuration
│   └── schemas/
│       ├── index.js                # Schema exports
│       ├── designStyle.js          # Design style document
│       ├── gallerySubmission.js    # Submission document
│       ├── article.js              # Educational content
│       └── author.js               # Author profiles
│
├── public/                         # Build output (gitignored)
│
└── tests/                          # Test files
    └── e2e/
        └── gallery.spec.js
```

### Architectural Boundaries

**Data Flow Boundary:**
```
Sanity CMS (Cloud)
       ↓ GROQ Query
src/_data/*.js (Build-time fetch)
       ↓ Eleventy Data Cascade
src/pages/*.njk (Templates)
       ↓ Build
public/ (Static HTML)
       ↓ Deploy
Netlify CDN
```

**Form Submission Boundary:**
```
src/pages/submit.njk (Form)
       ↓ POST (JSON payload with base64 screenshot)
/.netlify/functions/submit-form (Serverless Function)
       ↓
├── Sanity API (Upload image + Create document) [blocking]
├── Discord Webhook (Notification) [non-blocking]
└── Airtable API (CRM record) [non-blocking]
       ↓
Return success/error to client
```

**Admin Boundary:**
```
Instructors → studio.sanity.io/{project}
                     ↓
              Sanity Studio UI
                     ↓
              Direct document editing
                     ↓
              Webhook → Netlify Build Hook → Rebuild & Deploy
```

### Requirements to Structure Mapping

| PRD Requirement | Location |
|-----------------|----------|
| FR1-7: Design Gallery | `src/pages/index.njk`, `src/pages/styles/`, `src/_data/designStyles.js` |
| FR8-16: Submission | `src/pages/submit.njk` → `netlify/functions/submit-form.js` |
| FR17-24: Instructor Dashboard | Sanity Studio (`studio/`) |
| FR25-28: Content Curation | Sanity Studio + `isFeatured` field |
| FR29-35: Privacy/Consent | `src/scripts/cookie-consent.js`, `src/pages/legal/` |
| FR36-40: Integrations | `netlify/functions/submit-form.js` (Discord, Airtable) |
| FR41-45: CMS | `studio/schemas/`, `src/_data/` |
| FR46-50: Accessibility | All templates, `src/styles/main.css` |

### Integration Points

| Integration | Trigger | Endpoint | Notes |
|-------------|---------|----------|-------|
| Sanity → Eleventy | Build time | `https://{project}.api.sanity.io/...` | GROQ queries via @11ty/eleventy-fetch |
| Form → Netlify Function | User submit | `/.netlify/functions/submit-form` | JSON POST with base64 screenshot |
| Netlify Function → Sanity | Form received | Sanity Assets + Mutations API | Blocking - must succeed |
| Netlify Function → Discord | Form received | Discord Webhook URL | Non-blocking - failure logged only |
| Netlify Function → Airtable | Form received | Airtable API | Non-blocking - failure logged only |
| Sanity → Netlify | Content change | Netlify Build Hook URL | Triggers rebuild on content publish |

**Note:** We use Netlify Functions (serverless), NOT Netlify Forms. The `data-netlify="true"` attribute on the form is a fallback only.

### Environment Variables

```bash
# .env.example (also set in Netlify Dashboard → Site settings → Environment variables)

# Sanity CMS (Required)
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=sk-...              # Write token for form submissions

# Discord Notifications (Optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Airtable CRM (Optional)
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
AIRTABLE_TABLE_NAME=Submissions
```

**Note:** Sanity credentials are already configured. Discord and Airtable are optional - add when ready.

### File Organization Patterns

**Configuration Files:** Root directory for build tools, `studio/` for Sanity config
**Source Organization:** Feature-based within `src/pages/`, shared components in `_includes/`
**Test Organization:** `tests/e2e/` for Playwright tests
**Asset Organization:** `src/styles/` for CSS, `src/scripts/` for JS, `public/` for build output

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices (Eleventy, Sanity, Tailwind, Make) work together without conflicts. Versions are current and mutually compatible.

**Pattern Consistency:** Implementation patterns support architectural decisions. Naming conventions are consistent (camelCase for JS/Sanity, kebab-case for files).

**Structure Alignment:** Project structure supports all architectural decisions with clear boundaries between Eleventy source, Sanity Studio, and build output.

### Requirements Coverage ✅

**Functional Requirements:** All 50 FRs mapped to specific architectural components and file locations.

**Non-Functional Requirements:** All 38 NFRs addressed through technology choices (static hosting for performance, Sanity auth for security, Swiss design system for accessibility).

### Implementation Readiness ✅

**Decision Completeness:** All critical decisions documented with rationale.

**Pattern Completeness:** Naming, structure, format, communication, and process patterns fully specified with examples.

**Structure Completeness:** Complete directory tree with every file and its purpose defined.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium)
- [x] Technical constraints identified (brownfield, Eleventy)
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented (Sanity, Make, Airtable)
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Leverages existing brownfield codebase
- Single platform (Netlify) for hosting + functions
- Sanity Studio eliminates custom auth for MVP
- Clear separation of concerns

**Areas for Future Enhancement:**
- Custom instructor dashboard (post-MVP)
- GA4 analytics configuration details
- Email notification system
- User accounts for submitters

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2025-12-06
**Document Location:** docs/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**
- 15+ architectural decisions made
- 5 implementation pattern categories defined
- 12-15 architectural components specified
- 88 requirements (50 FR + 38 NFR) fully supported

**📚 AI Agent Implementation Guide**
- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing is373-final. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
1. Initialize Sanity Studio in `/studio` directory
2. Create Sanity schemas (designStyle, gallerySubmission, article, author)
3. Set up data fetching layer (`src/_data/sanity.js`, `designStyles.js`)
4. Create Netlify Function for form submission
5. Configure Sanity webhook to trigger Netlify Build Hook

**Development Sequence:**
1. Initialize Sanity project and deploy schemas
2. Set up environment variables (Sanity credentials) in Netlify Dashboard
3. Create data fetching layer with eleventy-fetch
4. Update templates to use Sanity data
5. Connect GitHub repo to Netlify (auto-deploy enabled)
6. Create Netlify Function (`netlify/functions/submit-form.js`)
7. Configure Sanity webhook to trigger Netlify Build Hook
8. Migrate mock data to Sanity
9. Test form submission end-to-end

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

