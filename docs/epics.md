# MyWebClass - Epic Breakdown

**Author:** Jay
**Date:** 2025-12-05
**Project Level:** MVP
**Target Scale:** Competition-ready production deployment

---

## Overview

This document provides the complete epic and story breakdown for MyWebClass, decomposing the requirements from the [PRD](./prd.md) into implementable stories, informed by the technical decisions in [Architecture](./architecture.md).

**Context Loaded:**
- ✅ PRD: 41 functional requirements across 7 categories
- ✅ Architecture: Eleventy v3.1.2 + Sanity CMS + Tailwind CSS v4 + GitHub Pages
- ✅ UX Design: Neo-Swiss Style Guide (responsive grid-based design system)

---

## Functional Requirements Inventory

### Gallery & Content Discovery (FR1-FR8)
| FR | Description | Coverage |
|----|-------------|----------|
| FR1 | Visitors can browse all published design styles in a gallery view | Epic 2: 2.1, 2.2 |
| FR2 | Visitors can view a detail page for each design style with educational content | Epic 2: 2.3 |
| FR3 | Visitors can access the live demo for any design style via external link | Epic 2: 2.8 |
| FR4 | Visitors can read historical background for each design style | Epic 2: 2.4 |
| FR5 | Visitors can view key characteristics and design principles for each style | Epic 2: 2.5 |
| FR6 | Visitors can see typography and color guidance for each design style | Epic 2: 2.6 |
| FR7 | Visitors can view featured design styles on the homepage | Epic 2: 2.7 |
| FR8 | Visitors can navigate to the gallery from any page | Epic 1: 1.6, Epic 2: 2.1 |

### Submission Workflow (FR9-FR16)
| FR | Description | Coverage |
|----|-------------|----------|
| FR9 | Students can submit a design demo via a submission form | Epic 3: 3.1-3.6 |
| FR10 | Students can provide their name and email with a submission | Epic 3: 3.2 |
| FR11 | Students can specify the design style their demo represents | Epic 3: 3.2 |
| FR12 | Students can provide a URL to their live demo | Epic 3: 3.2 |
| FR13 | Students can provide a screenshot URL of their demo | Epic 3: 3.2 |
| FR14 | Students can write an explanation of their demo's authenticity | Epic 3: 3.2 |
| FR15 | Students can agree to privacy policy before submitting | Epic 3: 3.3 |
| FR16 | Students receive confirmation when submission is successful | Epic 3: 3.6 |

### Content Review & Moderation (FR17-FR21)
| FR | Description | Coverage |
|----|-------------|----------|
| FR17 | Instructors can view all submissions in Sanity Studio | Epic 4: 4.1 |
| FR18 | Instructors can see submission details (name, email, demo URL, screenshot, explanation) | Epic 4: 4.2 |
| FR19 | Instructors can change submission status (submitted → approved/rejected) | Epic 4: 4.3 |
| FR20 | Only approved submissions appear in the public gallery | Epic 4: 4.4, 4.5 |
| FR21 | System prevents unapproved submissions from being publicly visible | Epic 4: 4.4 |

### Content Management (FR22-FR28)
| FR | Description | Coverage |
|----|-------------|----------|
| FR22 | Admins can create new design style entries in Sanity Studio | Epic 4: 4.7 |
| FR23 | Admins can edit existing design style content | Epic 4: 4.7 |
| FR24 | Admins can add educational content (historical background, characteristics, principles) | Epic 4: 4.7 |
| FR25 | Admins can configure color palette and typography guidance per style | Epic 4: 4.7 |
| FR26 | Admins can upload sample images for each design style | Epic 4: 4.7 |
| FR27 | Admins can set the external demo URL for each style | Epic 4: 4.7 |
| FR28 | Admins can mark design styles as featured for homepage display | Epic 4: 4.7 |

### Integrations (FR29-FR32)
| FR | Description | Coverage |
|----|-------------|----------|
| FR29 | System sends Discord notification when new submission is created | Epic 5: 5.1 |
| FR30 | System syncs submission data to CRM (via Zapier/Make) | Epic 5: 5.2 |
| FR31 | System tracks page views and events via Google Analytics 4 | Epic 5: 5.3, 5.5 |
| FR32 | Analytics only load after user consents to tracking | Epic 5: 5.4 |

### Compliance & Privacy (FR33-FR37)
| FR | Description | Coverage |
|----|-------------|----------|
| FR33 | Visitors can view and interact with cookie consent banner | Epic 6: 6.1 |
| FR34 | Visitors can accept or reject analytics cookies | Epic 6: 6.1 |
| FR35 | Visitors can access the privacy policy page | Epic 6: 6.2 |
| FR36 | Visitors can access the cookie policy page | Epic 6: 6.3 |
| FR37 | System respects user consent preferences for analytics | Epic 5: 5.4 |

### Site Information & Navigation (FR38-FR41)
| FR | Description | Coverage |
|----|-------------|----------|
| FR38 | Visitors can access the About page explaining MyWebClass mission | Epic 6: 6.4 |
| FR39 | Visitors can navigate between all main pages via consistent navigation | Epic 1: 1.6 |
| FR40 | Visitors can access the site from search engines (SEO-friendly URLs) | Epic 6: 6.5, 6.6 |
| FR41 | Visitors can share design style pages via social media (Open Graph support) | Epic 6: 6.5 |

---

## FR Coverage Map

| FR Range | Category | Epic Coverage |
|----------|----------|---------------|
| FR1-FR8 | Gallery & Content Discovery | Epic 2 |
| FR9-FR16 | Submission Workflow | Epic 3 |
| FR17-FR21 | Content Review & Moderation | Epic 4 |
| FR22-FR28 | Content Management | Epic 4 |
| FR29-FR32 | Integrations | Epic 5 |
| FR33-FR37 | Compliance & Privacy | Epic 6 |
| FR38-FR41 | Site Information & Navigation | Epic 6 |

---

## Epic Structure Overview

| Epic | Title | User Value | FRs |
|------|-------|------------|-----|
| 1 | Foundation & Core Infrastructure | Technical foundation enabling all features | Enables all |
| 2 | Design Gallery Experience | Browse and learn about design styles | FR1-FR8 |
| 3 | Student Submission Workflow | Submit demos for instructor review | FR9-FR16 |
| 4 | Instructor Review & Content Management | Curate and manage gallery content | FR17-FR28 |
| 5 | Integrations & Analytics | Notifications, CRM sync, usage tracking | FR29-FR32 |
| 6 | Compliance, SEO & Launch | Production-ready, GDPR-compliant site | FR33-FR41 |

---

## Epic Technical Context

### Epic 1: Foundation & Core Infrastructure
**Goal:** Establish the technical foundation that enables all user-facing features.

**Architecture Integration:**
- Eleventy v3.1.2 static site generator with Nunjucks templating
- Tailwind CSS v4 with Neo-Swiss configuration (12-column grid, 8px spacing scale)
- Sanity CMS client (`@sanity/client`) with shared instance in `src/lib/sanity-client.js`
- GitHub Actions CI/CD pipeline: lint → build → test → lighthouse → deploy
- GitHub Pages deployment from `_site/` output

**Neo-Swiss UX Foundation:**
- Base layout with 12→6→4 responsive grid
- Typography scale: `clamp(36px, 5vw, 64px)` for h1, `clamp(16px, 2vw, 18px)` for body
- Color palette: `#000000` text, `#FFFFFF` background, grays for secondary
- Spacing: 8px modular scale (8, 16, 24, 32, 48px)
- Max-width container: 1200px centered

**Dependencies:** None (first epic)

---

### Epic 2: Design Gallery Experience
**Goal:** Visitors can browse and learn about iconic design styles through educational content.

**Architecture Integration:**
- `designStyle` Sanity schema with Portable Text for educational content
- GROQ queries in `src/_data/designStyles.js` with explicit field projection
- Pagination template at `src/styles/styles.njk` for detail pages
- `style-card.njk` component for gallery grid display

**Neo-Swiss UX Patterns:**
- Gallery grid: 3 columns desktop, 2 tablet, 1 mobile (using 12→6→4 grid)
- Card components with generous padding (24px), subtle hover states
- Detail pages with clear typography hierarchy, 60-75 char line length
- "View Demo" buttons with focus states per accessibility requirements

**Dependencies:** Epic 1 complete

---

### Epic 3: Student Submission Workflow
**Goal:** Students can submit design demos for instructor review.

**Architecture Integration:**
- `gallerySubmission` Sanity schema with status field (submitted/approved/rejected)
- `src/assets/js/submit-form.js` with object literal module pattern
- Sanity mutations API for runtime form submission
- Form validation following Architecture patterns (aria-* for errors, role="alert")

**Neo-Swiss UX Patterns:**
- Form layout on Neo-Swiss grid with clear labels
- Real-time validation with accessible error messages
- Submit button with loading state ("Submitting...")
- Success/error feedback with role="alert"

**Dependencies:** Epic 1 + Epic 2 (design styles exist to select from)

---

### Epic 4: Instructor Review & Content Management
**Goal:** Instructors curate submissions; admins manage all content.

**Architecture Integration:**
- Sanity Studio at `/studio` with custom desk structure for submissions
- Status workflow in `gallerySubmission` schema
- `src/_data/approvedSubmissions.js` with GROQ filter: `status == "approved"`
- Content management for `designStyle`, `article`, `author` schemas

**Neo-Swiss UX Patterns:**
- Approved submissions display in gallery alongside curated styles
- Submission cards show submitter name, screenshot, style reference

**Dependencies:** Epic 3 complete (submissions exist to review)

---

### Epic 5: Integrations & Analytics
**Goal:** Stakeholders receive notifications and site usage is tracked.

**Architecture Integration:**
- Discord webhook configured in Sanity dashboard (no code)
- CRM sync via Zapier/Make (external automation)
- `src/assets/js/analytics.js` for GA4 initialization
- `src/assets/js/consent.js` gates analytics loading

**Neo-Swiss UX Patterns:**
- Analytics events for: demo link clicks, form submissions, gallery navigation

**Dependencies:** Epic 3 (submissions trigger Discord), Epic 6 (consent gates analytics)

---

### Epic 6: Compliance, SEO & Production Launch
**Goal:** Site is GDPR-compliant, accessible, and production-ready.

**Architecture Integration:**
- `consent-banner.njk` component with localStorage preference storage
- Privacy and cookie policy pages at `src/pages/privacy.njk`, `src/pages/cookies.njk`
- Open Graph meta tags in `base.njk` layout
- XML sitemap generation via Eleventy plugin
- Lighthouse CI thresholds: Performance ≥90, Accessibility ≥90

**Neo-Swiss UX Patterns:**
- Consent banner styled with Neo-Swiss patterns, clear CTA buttons
- Focus states on all interactive elements (WCAG AA)
- About page with clean typography and generous whitespace

**Dependencies:** All prior epics for final integration and polish

---

## Epic 1: Foundation & Core Infrastructure

**Epic Goal:** Establish the complete technical foundation enabling all user-facing features to be built, tested, and deployed.

**User Value:** While not directly user-facing, this epic enables rapid, quality development of all subsequent features with consistent patterns and automated quality gates.

---

### Story 1.1: Project Initialization & Dependencies

As a **developer**,
I want **the project initialized with all required dependencies and correct folder structure**,
So that **I can begin building features with the correct tooling**.

**Acceptance Criteria:**

**Given** I am setting up the MyWebClass project
**When** I run the initialization commands
**Then** the following dependencies are installed:
- `@11ty/eleventy@^3.1.2` (static site generator)
- `@sanity/client@^6.10.0` (CMS client)
- `nunjucks` (templating)

**And** the following dev dependencies are installed:
- `tailwindcss@^4.0.0`
- `eslint@^8.56.0`
- `prettier@^3.1.1`
- `stylelint@^16.1.0`
- `@playwright/test@^1.40.1`
- `npm-run-all` (script orchestration)

**And** the project structure matches Architecture specification:
```
mywebclass/
├── src/
│   ├── _data/
│   ├── _includes/
│   │   ├── layouts/
│   │   └── components/
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── studio/
├── tests/
│   ├── e2e/
│   └── fixtures/
├── .github/workflows/
└── docs/
```

**And** `eleventy.config.js` is created with:
- Input directory: `src`
- Output directory: `_site`
- Nunjucks as template engine
- Passthrough copy for assets

**And** `.env.example` contains all required environment variables:
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_TOKEN`
- `GA4_MEASUREMENT_ID`
- `DISCORD_WEBHOOK_URL`

**Technical Notes:**
- Follow kebab-case naming convention for all files (Architecture section: File & Directory Naming)
- Use `type: "module"` in package.json for ES modules
- Configure `.gitignore` for `_site/`, `node_modules/`, `.env`

**Prerequisites:** None (first story)

---

### Story 1.2: Tailwind CSS v4 Neo-Swiss Configuration

As a **developer**,
I want **Tailwind CSS configured with Neo-Swiss design tokens**,
So that **all components use consistent typography, colors, and spacing**.

**Acceptance Criteria:**

**Given** Tailwind CSS v4 is installed
**When** I configure the design system
**Then** `tailwind.config.js` includes:

**Typography Scale (fluid):**
```javascript
fontSize: {
  'display': 'clamp(36px, 5vw, 64px)',
  'h1': 'clamp(28px, 4vw, 48px)',
  'h2': 'clamp(24px, 3vw, 36px)',
  'h3': 'clamp(20px, 2.5vw, 28px)',
  'body': 'clamp(16px, 2vw, 18px)',
  'small': '14px',
}
```

**Color Palette (monochrome + accent):**
```javascript
colors: {
  primary: '#000000',
  background: '#FFFFFF',
  gray: {
    50: '#F5F5F5',
    100: '#E0E0E0',
    200: '#BDBDBD',
    300: '#9E9E9E',
    400: '#757575',
    500: '#616161',
    600: '#424242',
  },
  accent: '#2962FF',
}
```

**Spacing Scale (8px base):**
```javascript
spacing: {
  '1': '8px',
  '2': '16px',
  '3': '24px',
  '4': '32px',
  '6': '48px',
  '8': '64px',
}
```

**And** `src/assets/css/main.css` contains:
- Tailwind directives (`@tailwind base/components/utilities`)
- `@layer components` with `.btn-primary`, `.btn-secondary` classes
- Focus state utilities for accessibility

**And** npm scripts are configured:
```json
"dev:css": "tailwindcss -i src/assets/css/main.css -o _site/assets/css/main.css --watch",
"build:css": "tailwindcss -i src/assets/css/main.css -o _site/assets/css/main.css --minify"
```

**And** the built CSS is under 50KB (per NFR performance budget)

**Technical Notes:**
- Use CSS Grid for 12-column layout (Neo-Swiss guide)
- Breakpoints: 480px (mobile), 768px (tablet), 1200px (desktop)
- Line height: 1.2-1.3 headings, 1.6 body

**Prerequisites:** Story 1.1

---

### Story 1.3: Sanity CMS Schema Deployment

As an **admin**,
I want **all Sanity schemas deployed and Sanity Studio accessible**,
So that **content can be created and managed**.

**Acceptance Criteria:**

**Given** Sanity project is created
**When** I deploy the schemas
**Then** the following schemas exist in `studio/schemas/`:

**`designStyle.js`:**
- `_type`: "designStyle"
- `title`: string (required)
- `slug`: slug from title
- `description`: text
- `historicalBackground`: Portable Text (block content)
- `keyCharacteristics`: array of strings
- `designPrinciples`: Portable Text
- `colorPalette`: array of {name, hex}
- `typographyGuidance`: Portable Text
- `demoUrl`: URL (required)
- `image`: image with alt text
- `featured`: boolean (default: false)

**`gallerySubmission.js`:**
- `_type`: "gallerySubmission"
- `submitterName`: string (required)
- `submitterEmail`: string (required)
- `designStyle`: reference to designStyle
- `demoUrl`: URL (required)
- `screenshotUrl`: URL (required)
- `authenticityExplanation`: text (required)
- `status`: string enum ["submitted", "approved", "rejected"] (default: "submitted")
- `submittedAt`: datetime (auto)
- `privacyPolicyAgreed`: boolean (required, must be true)

**`article.js`:**
- `_type`: "article"
- `title`: string
- `slug`: slug
- `content`: Portable Text
- `author`: reference to author
- `publishedAt`: datetime

**`author.js`:**
- `_type`: "author"
- `name`: string
- `bio`: text
- `image`: image

**And** `studio/schemas/index.js` exports all schemas
**And** `studio/sanity.config.js` is configured with project ID and dataset
**And** Sanity Studio is deployable via `npx sanity deploy`

**Technical Notes:**
- Schema field names use camelCase (Sanity convention per Architecture)
- Use `@sanity/image-url` for image transformations
- Configure preview for each schema type

**Prerequisites:** Story 1.1

---

### Story 1.4: Shared Sanity Client & Data Fetching

As a **developer**,
I want **a shared Sanity client configured for data fetching**,
So that **all data files use consistent GROQ patterns**.

**Acceptance Criteria:**

**Given** Sanity schemas are deployed
**When** I create the data fetching infrastructure
**Then** `src/lib/sanity-client.js` exports a configured client:
```javascript
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

module.exports = client;
```

**And** `src/_data/site.js` contains site metadata:
```javascript
module.exports = {
  title: 'MyWebClass',
  description: 'Learn design history through authentic website demonstrations',
  url: 'https://mywebclass.org',
};
```

**And** `src/_data/designStyles.js` fetches design styles:
```javascript
const client = require('../lib/sanity-client.js');

module.exports = async function() {
  return await client.fetch(`
    *[_type == "designStyle"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      "imageUrl": image.asset->url,
      demoUrl,
      featured
    }
  `);
};
```

**And** `src/_data/approvedSubmissions.js` fetches only approved submissions:
```javascript
const client = require('../lib/sanity-client.js');

module.exports = async function() {
  return await client.fetch(`
    *[_type == "gallerySubmission" && status == "approved"] | order(submittedAt desc) {
      _id,
      submitterName,
      demoUrl,
      screenshotUrl,
      "styleName": designStyle->title,
      "styleSlug": designStyle->slug.current,
      submittedAt
    }
  `);
};
```

**Technical Notes:**
- ALWAYS project specific fields (never use wildcards without projection)
- Use GROQ dereferencing for assets: `"imageUrl": image.asset->url`
- Data file names match content type (plural)
- NEVER instantiate new Sanity clients (use shared instance)

**Prerequisites:** Story 1.3

---

### Story 1.5: Base Layout with Neo-Swiss Grid

As a **visitor**,
I want **pages to display with consistent Neo-Swiss styling and responsive grid**,
So that **the site feels professional and works on all devices**.

**Acceptance Criteria:**

**Given** I visit any page on MyWebClass
**When** the page loads
**Then** I see the base layout with:

**HTML Structure (`src/_includes/layouts/base.njk`):**
- `<!DOCTYPE html>` with `lang="en"`
- `<head>` with charset, viewport, title, description meta
- Link to compiled CSS (`/assets/css/main.css`)
- `{% block head %}` for page-specific meta
- `<body>` with skip-to-content link
- `{% include "components/nav.njk" %}`
- `<main id="main-content">{% block content %}{% endblock %}</main>`
- `{% include "components/footer.njk" %}`
- Script tags for JS (deferred)

**Neo-Swiss Grid Container:**
```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .container {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
}
```

**And** typography uses fluid scaling per Neo-Swiss guide
**And** skip-to-content link is visible on focus (accessibility)
**And** the layout is tested at 320px, 768px, and 1200px widths

**Technical Notes:**
- Use `{% extends "layouts/base.njk" %}` for inheritance
- Include `{% block content %}` for page content
- Focus states: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent`

**Prerequisites:** Story 1.2

---

### Story 1.6: Navigation Component

As a **visitor**,
I want **consistent navigation across all pages**,
So that **I can easily find gallery, submit, and about pages**.

**Acceptance Criteria:**

**Given** I am on any page
**When** I look at the navigation
**Then** I see `src/_includes/components/nav.njk` with:

**Navigation Links:**
- Logo/site name linking to homepage (`/`)
- "Gallery" linking to `/gallery/`
- "Submit" linking to `/submit/`
- "About" linking to `/about/`

**Responsive Behavior:**
- Desktop (>768px): Horizontal navigation, logo left, links right
- Mobile (≤768px): Hamburger menu icon, expandable menu

**Accessibility:**
- `<nav aria-label="Main navigation">`
- Current page indicated with `aria-current="page"`
- Keyboard navigable (Tab through all links)
- Focus indicators visible (Neo-Swiss accent color ring)
- Mobile menu toggle has `aria-expanded` state

**Styling (Neo-Swiss):**
- Background: white or transparent
- Text: primary black, hover gray-600
- Padding: 16px vertical
- Max-width container (1200px)

**And** navigation works without JavaScript (progressive enhancement)
**And** mobile menu is functional via CSS-only toggle (optional JS enhancement)

**Technical Notes:**
- Use `data-nav="toggle"` for JavaScript hooks (not class/ID)
- Include focus trap for mobile menu when open
- Test keyboard navigation order

**Prerequisites:** Story 1.5

---

### Story 1.7: Footer Component

As a **visitor**,
I want **a consistent footer with links to policies and site info**,
So that **I can access privacy policy and other legal pages**.

**Acceptance Criteria:**

**Given** I am on any page
**When** I scroll to the bottom
**Then** I see `src/_includes/components/footer.njk` with:

**Footer Content:**
- Copyright notice: "© 2025 MyWebClass. All rights reserved."
- Links: Privacy Policy (`/privacy/`), Cookie Policy (`/cookies/`)
- Site description or tagline

**Accessibility:**
- `<footer role="contentinfo">`
- All links have visible focus states
- Sufficient color contrast (4.5:1 minimum)

**Styling (Neo-Swiss):**
- Background: gray-50 or subtle contrast from content
- Padding: 48px vertical (generous whitespace)
- Max-width container matching navigation
- Typography: small size (14px), gray-600 text

**Technical Notes:**
- Footer should not contain duplicate navigation links
- Include structured data for organization (optional)

**Prerequisites:** Story 1.5

---

### Story 1.8: GitHub Actions CI/CD Pipeline

As a **developer**,
I want **automated quality checks and deployment on every push**,
So that **only passing code reaches production**.

**Acceptance Criteria:**

**Given** code is pushed to the repository
**When** GitHub Actions workflow runs
**Then** `.github/workflows/ci.yml` executes:

**On Pull Request:**
```yaml
jobs:
  quality:
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies (npm ci)
      - Run lint (npm run lint)
      - Run build (npm run build)
      - Run tests (npm run test)
      - Run Lighthouse CI (npm run lighthouse)
```

**On Push to Main:**
```yaml
jobs:
  deploy:
    needs: quality
    steps:
      - Build site
      - Deploy to GitHub Pages (peaceiris/actions-gh-pages)
```

**Quality Gates (all must pass):**
- ESLint: No errors
- Stylelint: No errors
- Markdownlint: No errors in docs/
- Playwright: All tests pass
- Lighthouse: Performance ≥90, Accessibility ≥90

**Environment Secrets Required:**
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_TOKEN`

**And** pipeline completes in under 10 minutes (NFR-BUILD1)
**And** Lighthouse reports are uploaded as artifacts

**Technical Notes:**
- Use `npm ci` for faster, reproducible installs
- Cache node_modules between runs
- Run lint checks in parallel for speed

**Prerequisites:** Story 1.1

---

### Story 1.9: Index Page Placeholder

As a **developer**,
I want **a working homepage that proves the build pipeline works**,
So that **I can verify end-to-end deployment**.

**Acceptance Criteria:**

**Given** the build runs successfully
**When** I visit the deployed site root (`/`)
**Then** I see `src/index.njk` with:

**Content:**
- Extends `layouts/base.njk`
- Page title: "MyWebClass - Design History Through Code"
- Hero section with:
  - H1: "Learn Design History Through Code"
  - Tagline: "Explore iconic design movements through authentic, fully-implemented website demonstrations"
  - CTA button: "Browse Gallery" (links to `/gallery/`, disabled/placeholder for now)

**Styling:**
- Hero uses full-width container
- Typography follows Neo-Swiss fluid scale
- CTA button uses `.btn-primary` class

**And** page passes Lighthouse accessibility audit
**And** page renders correctly at all breakpoints

**Technical Notes:**
- This is a placeholder; full homepage built in Epic 2
- Ensures full pipeline works before building features

**Prerequisites:** Story 1.5, Story 1.6, Story 1.7, Story 1.8

---

### Epic 1 Summary

| Story | Title | FRs Enabled | Status |
|-------|-------|-------------|--------|
| 1.1 | Project Initialization & Dependencies | All | Pending |
| 1.2 | Tailwind CSS v4 Neo-Swiss Configuration | All (styling) | Pending |
| 1.3 | Sanity CMS Schema Deployment | FR17-FR28 | Pending |
| 1.4 | Shared Sanity Client & Data Fetching | FR1-FR8 | Pending |
| 1.5 | Base Layout with Neo-Swiss Grid | All (layout) | Pending |
| 1.6 | Navigation Component | FR8, FR39 | Pending |
| 1.7 | Footer Component | FR35, FR36 | Pending |
| 1.8 | GitHub Actions CI/CD Pipeline | NFR-BUILD1-6 | Pending |
| 1.9 | Index Page Placeholder | FR7 (partial) | Pending |

**Epic 1 Complete Criteria:**
- All 9 stories implemented and passing CI
- Site deploys to GitHub Pages successfully
- Sanity Studio accessible with schemas deployed
- Base Neo-Swiss styling applied consistently
- Ready for Epic 2: Design Gallery Experience

---

## Epic 2: Design Gallery Experience

**Epic Goal:** Visitors can browse, discover, and learn about iconic design styles through the curated gallery with rich educational content.

**User Value:** Design students, instructors, and enthusiasts can explore authentic design style implementations and understand the history, principles, and characteristics behind each movement.

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8

---

### Story 2.1: Gallery Listing Page

As a **visitor**,
I want **to browse all published design styles in a gallery view**,
So that **I can discover the range of design movements available to explore**.

**Acceptance Criteria:**

**Given** I navigate to `/gallery/`
**When** the page loads
**Then** I see `src/gallery.njk` displaying:

**Page Structure:**
- H1: "Design Style Gallery"
- Introductory text explaining the gallery purpose
- Grid of style cards (all published design styles from Sanity)

**Gallery Grid (Neo-Swiss):**
- Desktop (>768px): 3 columns (each card spans 4 of 12 grid columns)
- Tablet (768px): 2 columns (each card spans 6 columns)
- Mobile (<480px): 1 column (full width)
- Gap: 24px between cards

**Card Display:**
- Each style rendered using `style-card.njk` component
- Cards show: image, title, brief description
- Cards link to detail page (`/styles/{slug}/`)

**Data Source:**
```nunjucks
{% for style in designStyles %}
  {% include "components/style-card.njk" %}
{% endfor %}
```

**Empty State:**
- If no styles published: "No design styles available yet. Check back soon!"

**And** the page has proper meta tags:
- Title: "Design Style Gallery | MyWebClass"
- Description: "Explore iconic design movements through authentic website demonstrations"

**And** the page passes Lighthouse accessibility audit (≥90)

**Technical Notes:**
- Data from `src/_data/designStyles.js` (GROQ query)
- Use CSS Grid for responsive layout
- Lazy load images below the fold

**Prerequisites:** Epic 1 complete

**FR Coverage:** FR1, FR8

---

### Story 2.2: Style Card Component

As a **visitor**,
I want **each design style displayed as an attractive, informative card**,
So that **I can quickly understand what each style offers before clicking**.

**Acceptance Criteria:**

**Given** I am viewing the gallery or homepage
**When** I see a style card
**Then** `src/_includes/components/style-card.njk` displays:

**Card Content:**
- Style image (from Sanity, with alt text)
- Style title (H3)
- Brief description (truncated to 120 characters with ellipsis)
- "Learn More" link to detail page

**Card Styling (Neo-Swiss):**
```css
.style-card {
  background: white;
  border: 1px solid var(--gray-100);
  padding: 0;
  overflow: hidden;
}

.style-card img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.style-card-content {
  padding: 24px;
}
```

**Hover State:**
- Subtle shadow increase on hover
- Smooth transition (0.2s ease)

**Accessibility:**
- Card is a clickable link (entire card, not just text)
- Image has descriptive alt text from Sanity
- Focus state with visible ring
- Title is semantic H3

**Component Interface:**
```nunjucks
{% macro styleCard(style) %}
  <article class="style-card">
    <a href="/styles/{{ style.slug.current }}/" class="style-card-link">
      <img src="{{ style.imageUrl }}" alt="{{ style.title }} design example">
      <div class="style-card-content">
        <h3>{{ style.title }}</h3>
        <p>{{ style.description | truncate(120) }}</p>
        <span class="learn-more">Learn More →</span>
      </div>
    </a>
  </article>
{% endmacro %}
```

**Technical Notes:**
- Use Sanity image URL with transformations for optimal size
- Ensure 16:9 aspect ratio maintained
- Use `data-testid="style-card"` for testing

**Prerequisites:** Story 2.1

**FR Coverage:** FR1 (partial)

---

### Story 2.3: Design Style Detail Page Template

As a **visitor**,
I want **to view a dedicated page for each design style**,
So that **I can learn about its history, characteristics, and see a live demo**.

**Acceptance Criteria:**

**Given** I click on a design style from the gallery
**When** the detail page loads at `/styles/{slug}/`
**Then** I see `src/styles/styles.njk` (pagination template) displaying:

**Page Header:**
- H1: Style title (e.g., "Swiss International Style")
- Hero image (full-width or contained, from Sanity)
- Brief description/tagline

**Page Sections (in order):**
1. **Overview** - Brief introduction
2. **Historical Background** - Rich text from Sanity (FR4)
3. **Key Characteristics** - List of defining traits (FR5)
4. **Design Principles** - Rich text explaining core principles (FR5)
5. **Typography Guidance** - Font recommendations and usage (FR6)
6. **Color Palette** - Visual color swatches with hex codes (FR6)
7. **View Demo CTA** - Prominent button linking to external demo (FR3)

**Layout (Neo-Swiss):**
- Content width: 8 columns on desktop (readable line length)
- Generous vertical spacing (48px between sections)
- Section headings: H2 with clear hierarchy
- Body text: 18px, 1.6 line-height, max 75 characters per line

**Pagination Configuration:**
```javascript
// src/styles/styles.json
{
  "pagination": {
    "data": "designStyles",
    "size": 1,
    "alias": "style"
  },
  "permalink": "/styles/{{ style.slug.current }}/",
  "layout": "layouts/style-detail.njk"
}
```

**And** proper meta tags per style:
- Title: "{Style Name} | MyWebClass"
- Description: First 160 chars of description
- Open Graph image: Style hero image

**Technical Notes:**
- Create `src/_includes/layouts/style-detail.njk` extending base
- Use Portable Text renderer for rich content
- Ensure proper heading hierarchy (H1 → H2 → H3)

**Prerequisites:** Story 2.1, Story 1.4

**FR Coverage:** FR2, FR3, FR4, FR5, FR6

---

### Story 2.4: Historical Background Section

As a **visitor**,
I want **to read the historical context of each design style**,
So that **I understand where the movement came from and why it matters**.

**Acceptance Criteria:**

**Given** I am on a design style detail page
**When** I scroll to the Historical Background section
**Then** I see:

**Section Content:**
- H2: "Historical Background"
- Rich text content from Sanity `historicalBackground` field (Portable Text)
- Properly rendered paragraphs, lists, links, emphasis

**Portable Text Rendering:**
```nunjucks
{% from "components/portable-text.njk" import renderPortableText %}
<section class="historical-background">
  <h2>Historical Background</h2>
  {{ renderPortableText(style.historicalBackground) }}
</section>
```

**Styling (Neo-Swiss):**
- Typography: body size, 1.6 line-height
- Paragraphs: margin-bottom 24px
- Lists: proper indentation, bullet styling
- Links: underlined, accent color on hover
- Block quotes: left border, italic styling (if used)

**Accessibility:**
- Proper heading hierarchy (H2 for section)
- Links have descriptive text (not "click here")
- Content readable by screen readers

**Technical Notes:**
- Create `src/_includes/components/portable-text.njk` for rendering
- Handle all Portable Text block types (paragraph, heading, list, link)
- Support inline marks (strong, emphasis, link)

**Prerequisites:** Story 2.3

**FR Coverage:** FR4

---

### Story 2.5: Key Characteristics & Design Principles

As a **visitor**,
I want **to see the defining traits and principles of each design style**,
So that **I can understand what makes this style unique and how to apply it**.

**Acceptance Criteria:**

**Given** I am on a design style detail page
**When** I scroll to the characteristics and principles sections
**Then** I see:

**Key Characteristics Section:**
- H2: "Key Characteristics"
- Unordered list of defining traits from `keyCharacteristics` array
- Each item concise (1-2 sentences)

**Example Output:**
```html
<section class="key-characteristics">
  <h2>Key Characteristics</h2>
  <ul>
    <li>Grid-based layouts with mathematical precision</li>
    <li>Sans-serif typography, primarily Helvetica</li>
    <li>Asymmetric balance with generous white space</li>
    <li>Objective, rational approach to visual communication</li>
  </ul>
</section>
```

**Design Principles Section:**
- H2: "Design Principles"
- Rich text from `designPrinciples` Portable Text field
- May include explanatory paragraphs, sub-lists, examples

**Styling (Neo-Swiss):**
- Lists: Clean bullet points, 16px left padding
- List items: margin-bottom 12px for readability
- Two-column layout on desktop (characteristics left, principles right) - optional
- Or stacked layout with clear visual separation

**Technical Notes:**
- Use simple `{% for %}` loop for characteristics array
- Use Portable Text renderer for principles

**Prerequisites:** Story 2.4

**FR Coverage:** FR5

---

### Story 2.6: Typography & Color Guidance Display

As a **visitor**,
I want **to see typography and color recommendations for each design style**,
So that **I can implement the style authentically in my own projects**.

**Acceptance Criteria:**

**Given** I am on a design style detail page
**When** I scroll to the typography and color sections
**Then** I see:

**Typography Guidance Section:**
- H2: "Typography"
- Rich text from `typographyGuidance` Portable Text field
- May include: recommended typefaces, sizing guidance, pairing suggestions

**Color Palette Section:**
- H2: "Color Palette"
- Visual swatches for each color in `colorPalette` array
- Each swatch displays:
  - Color sample (square or circle, min 48x48px)
  - Color name (e.g., "Swiss Red")
  - Hex code (e.g., "#FF0000")

**Color Palette Component:**
```nunjucks
<section class="color-palette">
  <h2>Color Palette</h2>
  <div class="color-swatches">
    {% for color in style.colorPalette %}
    <div class="color-swatch">
      <div class="swatch" style="background-color: {{ color.hex }};"></div>
      <span class="color-name">{{ color.name }}</span>
      <code class="color-hex">{{ color.hex }}</code>
    </div>
    {% endfor %}
  </div>
</section>
```

**Swatch Styling (Neo-Swiss):**
- Swatches in horizontal row (flex, wrap on mobile)
- Swatch size: 64x64px desktop, 48x48px mobile
- Border on light colors for visibility
- Spacing: 16px gap between swatches

**Accessibility:**
- Color names provide text alternative to visual swatches
- Hex codes allow exact reproduction
- Swatches have `role="img"` and `aria-label`

**Technical Notes:**
- Ensure dark text on light swatches, light text on dark swatches
- Consider copy-to-clipboard functionality for hex codes (optional, JS enhancement)

**Prerequisites:** Story 2.5

**FR Coverage:** FR6

---

### Story 2.7: Homepage with Featured Styles

As a **visitor**,
I want **to see featured design styles on the homepage**,
So that **I'm immediately drawn into the gallery's best content**.

**Acceptance Criteria:**

**Given** I visit the homepage (`/`)
**When** the page loads
**Then** I see an enhanced `src/index.njk` with:

**Hero Section (from Story 1.9, enhanced):**
- H1: "Learn Design History Through Code"
- Tagline: "Explore iconic design movements through authentic, fully-implemented website demonstrations"
- Primary CTA: "Browse Gallery" → `/gallery/`
- Secondary CTA: "Submit Your Demo" → `/submit/`

**Featured Styles Section:**
- H2: "Featured Styles"
- Grid of 3 featured design styles (filtered by `featured: true`)
- Uses `style-card.njk` component
- "View All Styles" link to `/gallery/`

**Featured Query:**
```javascript
// In template or separate data file
{% set featuredStyles = designStyles | selectattr("featured", "equalto", true) | list %}
```

**Layout (Neo-Swiss):**
- Hero: Full viewport height or large padding (48-64px)
- Featured grid: 3 columns desktop, 1 column mobile
- Generous spacing between sections (64px)

**Empty State:**
- If no featured styles: Show first 3 styles from gallery instead
- Fallback message if no styles at all

**And** homepage remains performant (Lighthouse 90+)

**Technical Notes:**
- Hero should have strong visual impact without heavy images
- Consider subtle background pattern or gradient (optional)
- Ensure CTAs have proper focus states

**Prerequisites:** Story 1.9, Story 2.2

**FR Coverage:** FR7

---

### Story 2.8: View Demo External Link

As a **visitor**,
I want **to click a prominent button to view the live demo of a design style**,
So that **I can experience the style as an actual working website**.

**Acceptance Criteria:**

**Given** I am on a design style detail page
**When** I look for the demo link
**Then** I see a prominent "View Demo" button:

**Button Placement:**
- Primary CTA at top of page (in hero area)
- Secondary CTA at bottom of content (after all sections)

**Button Styling:**
```html
<a href="{{ style.demoUrl }}"
   target="_blank"
   rel="noopener noreferrer"
   class="btn-primary view-demo-btn"
   data-testid="view-demo-btn">
  View Live Demo
  <span class="external-icon" aria-hidden="true">↗</span>
</a>
```

**Button Behavior:**
- Opens in new tab (`target="_blank"`)
- Security: `rel="noopener noreferrer"`
- Visual indicator for external link (icon)

**Accessibility:**
- Screen reader text: "View Live Demo (opens in new tab)"
- Focus state with visible ring
- Touch target minimum 44x44px

**Styling (Neo-Swiss):**
- Primary button style (accent color background)
- Padding: 16px 32px
- Font: body size, medium weight
- Hover: Slightly darker background
- Icon: small arrow indicating external

**Analytics (prepared for Epic 5):**
- `data-analytics-event="demo-click"`
- `data-analytics-style="{{ style.slug.current }}"`

**Technical Notes:**
- Ensure `demoUrl` is a valid external URL
- Handle case where demoUrl might be missing (hide button, show message)

**Prerequisites:** Story 2.3

**FR Coverage:** FR3

---

### Story 2.9: Initial Design Style Content

As an **admin**,
I want **3 design styles created in Sanity with full educational content**,
So that **the gallery has real content for launch**.

**Acceptance Criteria:**

**Given** Sanity Studio is deployed
**When** I create the initial design style entries
**Then** 3 complete design styles exist:

**Design Style 1: Neo-Swiss (or Swiss International Style)**
- Title: "Neo-Swiss Design"
- Historical Background: 500+ words on origins, Müller-Brockmann, evolution to digital
- Key Characteristics: 5-7 defining traits
- Design Principles: Grid systems, typography hierarchy, whitespace
- Typography Guidance: Inter, Helvetica, system fonts, fluid scaling
- Color Palette: Monochrome + accent (matches Neo-Swiss guide)
- Demo URL: Link to a Neo-Swiss demo on GitHub Pages
- Featured: true

**Design Style 2: Bauhaus**
- Title: "Bauhaus"
- Historical Background: 500+ words on the school, key figures, influence
- Key Characteristics: 5-7 defining traits
- Design Principles: Form follows function, geometric shapes, primary colors
- Typography Guidance: Geometric sans-serifs, bold weights
- Color Palette: Primary colors + black/white
- Demo URL: External demo link
- Featured: true

**Design Style 3: Brutalism**
- Title: "Web Brutalism"
- Historical Background: 500+ words on architectural origins, web adaptation
- Key Characteristics: 5-7 defining traits
- Design Principles: Raw aesthetics, exposed structure, honesty
- Typography Guidance: Monospace, system fonts, large sizes
- Color Palette: High contrast, harsh colors
- Demo URL: External demo link
- Featured: true

**Content Quality:**
- All Portable Text fields properly formatted
- Images uploaded with alt text
- All required fields completed
- Content reviewed for accuracy

**And** all 3 styles appear in gallery
**And** all 3 styles are marked as featured (appear on homepage)

**Technical Notes:**
- Reference Neo-Swiss guide for first style content
- Content should be educational, not marketing
- Consider including source references for historical accuracy

**Prerequisites:** Story 1.3 (Sanity schemas deployed)

**FR Coverage:** FR1-FR8 (enables all gallery features)

---

### Epic 2 Summary

| Story | Title | FRs Covered | Status |
|-------|-------|-------------|--------|
| 2.1 | Gallery Listing Page | FR1, FR8 | Pending |
| 2.2 | Style Card Component | FR1 | Pending |
| 2.3 | Design Style Detail Page Template | FR2, FR3, FR4, FR5, FR6 | Pending |
| 2.4 | Historical Background Section | FR4 | Pending |
| 2.5 | Key Characteristics & Design Principles | FR5 | Pending |
| 2.6 | Typography & Color Guidance Display | FR6 | Pending |
| 2.7 | Homepage with Featured Styles | FR7 | Pending |
| 2.8 | View Demo External Link | FR3 | Pending |
| 2.9 | Initial Design Style Content | FR1-FR8 | Pending |

**Epic 2 Complete Criteria:**
- All 9 stories implemented and passing CI
- 3 design styles with full content visible in gallery
- Detail pages display all educational sections
- Featured styles appear on homepage
- "View Demo" links work and open in new tab
- Gallery responsive at all breakpoints
- Ready for Epic 3: Student Submission Workflow

---

## Epic 3: Student Submission Workflow

**Epic Goal:** Students can submit their own design demo implementations for instructor review and potential inclusion in the public gallery.

**User Value:** Design students can showcase their work, receive feedback through the approval process, and have their approved demos featured alongside curated examples.

**FRs Covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16

---

### Story 3.1: Submission Form Page

As a **student**,
I want **a dedicated page where I can submit my design demo**,
So that **I can share my work with instructors for review**.

**Acceptance Criteria:**

**Given** I navigate to `/submit/`
**When** the page loads
**Then** I see `src/pages/submit.njk` displaying:

**Page Structure:**
- H1: "Submit Your Design Demo"
- Introductory text explaining the submission process
- Clear expectations (what makes a good submission)
- The submission form

**Introductory Content:**
```markdown
Share your authentic design style implementation with the MyWebClass community.

**Before you submit:**
- Your demo should be a live website (hosted on GitHub Pages or similar)
- Your implementation should faithfully recreate a recognized design style
- Be prepared to explain *why* your demo is authentic to the style
```

**Form Container:**
- Centered layout (max-width 640px for readability)
- Neo-Swiss styling with generous padding
- Clear visual hierarchy

**And** the page has proper meta tags:
- Title: "Submit Your Demo | MyWebClass"
- Description: "Submit your design style implementation for instructor review"

**Technical Notes:**
- Form action handled by JavaScript (Story 3.5)
- Progressive enhancement: form works with JS disabled (shows message)

**Prerequisites:** Epic 1 complete

**FR Coverage:** FR9

---

### Story 3.2: Submission Form Fields

As a **student**,
I want **to provide all required information about my submission**,
So that **instructors have everything they need to review my work**.

**Acceptance Criteria:**

**Given** I am on the submission page
**When** I view the form
**Then** I see the following fields:

**Name Field (FR10):**
```html
<label for="submitter-name">Your Name *</label>
<input type="text"
       id="submitter-name"
       name="submitterName"
       required
       autocomplete="name"
       data-validate="required"
       aria-describedby="name-hint">
<span id="name-hint" class="field-hint">As you'd like it displayed in the gallery</span>
```

**Email Field (FR10):**
```html
<label for="submitter-email">Email Address *</label>
<input type="email"
       id="submitter-email"
       name="submitterEmail"
       required
       autocomplete="email"
       data-validate="required,email"
       aria-describedby="email-hint">
<span id="email-hint" class="field-hint">We'll notify you when your submission is reviewed</span>
```

**Design Style Selector (FR11):**
```html
<label for="design-style">Design Style *</label>
<select id="design-style"
        name="designStyle"
        required
        data-validate="required">
  <option value="">Select a style...</option>
  {% for style in designStyles %}
  <option value="{{ style._id }}">{{ style.title }}</option>
  {% endfor %}
</select>
```

**Demo URL Field (FR12):**
```html
<label for="demo-url">Live Demo URL *</label>
<input type="url"
       id="demo-url"
       name="demoUrl"
       required
       placeholder="https://username.github.io/my-demo"
       data-validate="required,url"
       aria-describedby="demo-hint">
<span id="demo-hint" class="field-hint">Must be a publicly accessible URL</span>
```

**Screenshot URL Field (FR13):**
```html
<label for="screenshot-url">Screenshot URL *</label>
<input type="url"
       id="screenshot-url"
       name="screenshotUrl"
       required
       placeholder="https://example.com/screenshot.png"
       data-validate="required,url"
       aria-describedby="screenshot-hint">
<span id="screenshot-hint" class="field-hint">Direct link to an image (PNG, JPG, or WebP)</span>
```

**Authenticity Explanation (FR14):**
```html
<label for="authenticity">Authenticity Explanation *</label>
<textarea id="authenticity"
          name="authenticityExplanation"
          required
          rows="6"
          minlength="100"
          maxlength="2000"
          data-validate="required,minlength:100"
          aria-describedby="authenticity-hint"></textarea>
<span id="authenticity-hint" class="field-hint">
  Explain how your demo faithfully recreates the design style (min 100 characters)
</span>
<span class="char-count" data-for="authenticity">0 / 2000</span>
```

**Form Styling (Neo-Swiss):**
- Labels: 14px, medium weight, margin-bottom 8px
- Inputs: Full width, 16px padding, 1px gray-200 border
- Focus: accent color ring, 2px offset
- Hints: 14px, gray-400, margin-top 4px
- Spacing: 24px between field groups

**Technical Notes:**
- All fields use `data-validate` for client-side validation
- Design styles populated from `designStyles` data
- Use `autocomplete` attributes for better UX

**Prerequisites:** Story 3.1

**FR Coverage:** FR10, FR11, FR12, FR13, FR14

---

### Story 3.3: Privacy Policy Consent

As a **student**,
I want **to agree to the privacy policy before submitting**,
So that **I understand how my information will be used**.

**Acceptance Criteria:**

**Given** I am filling out the submission form
**When** I reach the privacy consent section
**Then** I see:

**Privacy Checkbox (FR15):**
```html
<div class="consent-field">
  <input type="checkbox"
         id="privacy-consent"
         name="privacyPolicyAgreed"
         required
         data-validate="required"
         aria-describedby="privacy-hint">
  <label for="privacy-consent">
    I agree to the <a href="/privacy/" target="_blank">Privacy Policy</a> *
  </label>
  <span id="privacy-hint" class="field-hint sr-only">
    You must agree to the privacy policy to submit
  </span>
</div>
```

**Privacy Link:**
- Opens in new tab (`target="_blank"`)
- Has `rel="noopener noreferrer"` for security
- Underlined and uses accent color

**Validation:**
- Checkbox must be checked to submit
- Error message if unchecked: "You must agree to the privacy policy"

**Styling:**
- Checkbox aligned with label text
- Checkbox size: minimum 20x20px for accessibility
- Custom checkbox styling matching Neo-Swiss aesthetic

**And** the privacy policy page exists at `/privacy/` (from Epic 6, placeholder for now)

**Technical Notes:**
- Use custom checkbox styling with `:checked` pseudo-class
- Ensure keyboard accessibility (Space to toggle)
- Link should not submit form when clicked

**Prerequisites:** Story 3.2

**FR Coverage:** FR15

---

### Story 3.4: Client-Side Form Validation

As a **student**,
I want **real-time feedback on form errors**,
So that **I can correct mistakes before submitting**.

**Acceptance Criteria:**

**Given** I am filling out the submission form
**When** I enter invalid data or leave required fields empty
**Then** `src/assets/js/submit-form.js` validates and shows errors:

**Validation Rules:**
```javascript
const validators = {
  required: (value) => value.trim() !== '' || 'This field is required',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email address',
  url: (value) => /^https?:\/\/.+/.test(value) || 'Please enter a valid URL starting with http:// or https://',
  minlength: (value, min) => value.length >= min || `Please enter at least ${min} characters`,
};
```

**Error Display (per Architecture patterns):**
```html
<!-- Error state -->
<input aria-invalid="true" aria-describedby="field-error" class="input-error">
<p id="field-error" class="error-message" role="alert">Error message here</p>
```

**Error Styling:**
- Border: red-500 (or error color)
- Error text: 14px, red-600, margin-top 4px
- Icon: Optional error icon before message

**Validation Timing:**
- Validate on blur (when leaving field)
- Re-validate on input after first error shown
- Validate all fields on submit attempt

**Submit Button State:**
- Enabled by default
- Shows validation errors inline, doesn't disable button
- Scroll to first error on submit if validation fails

**Module Structure (per Architecture):**
```javascript
const SubmissionForm = {
  form: null,

  init() {
    this.form = document.querySelector('[data-form="submission"]');
    if (!this.form) return;
    this.bindEvents();
  },

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.form.querySelectorAll('[data-validate]').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
    });
  },

  validateField(field) { /* ... */ },
  validateForm() { /* ... */ },
  showError(field, message) { /* ... */ },
  clearError(field) { /* ... */ },
};

document.addEventListener('DOMContentLoaded', () => SubmissionForm.init());
```

**Accessibility:**
- Errors announced by screen readers (`role="alert"`)
- Focus moved to first error field on submit failure
- Error messages associated with fields via `aria-describedby`

**Technical Notes:**
- Use `data-validate` attribute to specify validation rules
- Never clear user input on error
- Character counter for textarea updates in real-time

**Prerequisites:** Story 3.3

**FR Coverage:** FR9 (validation aspect)

---

### Story 3.5: Sanity Mutation Integration

As a **student**,
I want **my submission saved to the database when I submit**,
So that **instructors can review it**.

**Acceptance Criteria:**

**Given** I have filled out the form correctly
**When** I click "Submit"
**Then** the form data is sent to Sanity:

**Submission Payload:**
```javascript
const submission = {
  _type: 'gallerySubmission',
  submitterName: formData.submitterName,
  submitterEmail: formData.submitterEmail,
  designStyle: {
    _type: 'reference',
    _ref: formData.designStyle, // Sanity document ID
  },
  demoUrl: formData.demoUrl,
  screenshotUrl: formData.screenshotUrl,
  authenticityExplanation: formData.authenticityExplanation,
  status: 'submitted',
  submittedAt: new Date().toISOString(),
  privacyPolicyAgreed: true,
};
```

**API Integration:**
```javascript
async submitToSanity(data) {
  const response = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [{ create: data }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Submission failed: ${response.status}`);
  }

  return await response.json();
}
```

**Button State During Submission:**
- Text changes to "Submitting..."
- Button disabled to prevent double submission
- Optional: Loading spinner

**Error Handling:**
- Network errors: "Unable to submit. Please check your connection and try again."
- Server errors: "Something went wrong. Please try again later."
- Preserve form data on error (user doesn't lose input)

**Security Considerations:**
- Sanity token must have minimal permissions (create only)
- Token injected via environment variable at build time
- Rate limiting handled by Sanity (no client-side implementation needed)

**Technical Notes:**
- Use environment variable for Sanity mutation endpoint
- Consider serverless function for token protection (optional, can use Sanity's client-side mutations with restricted token)
- Log submission attempts for debugging (no PII in logs)

**Prerequisites:** Story 3.4, Story 1.3

**FR Coverage:** FR9

---

### Story 3.6: Success & Error Feedback

As a **student**,
I want **clear confirmation when my submission succeeds or fails**,
So that **I know the status of my submission**.

**Acceptance Criteria:**

**Given** I submit the form
**When** the submission completes
**Then** I see appropriate feedback:

**Success State (FR16):**
```html
<div class="submission-success" role="alert" data-testid="success-message">
  <h2>Submission Received!</h2>
  <p>Thank you for your submission. We've received your demo and will review it soon.</p>
  <p>You'll receive an email at <strong>{{ email }}</strong> when your submission is reviewed.</p>
  <div class="success-actions">
    <a href="/gallery/" class="btn-primary">Browse Gallery</a>
    <button type="button" class="btn-secondary" data-action="submit-another">Submit Another</button>
  </div>
</div>
```

**Success Behavior:**
- Form is hidden
- Success message appears in its place
- Page scrolls to success message
- "Submit Another" resets and shows form

**Error State:**
```html
<div class="submission-error" role="alert" data-testid="error-message">
  <h2>Submission Failed</h2>
  <p>{{ errorMessage }}</p>
  <p>Please try again. If the problem persists, contact us.</p>
  <button type="button" class="btn-primary" data-action="retry">Try Again</button>
</div>
```

**Error Behavior:**
- Form remains visible with user data preserved
- Error message appears above or below form
- "Try Again" re-enables submit button

**Styling (Neo-Swiss):**
- Success: Green accent or checkmark icon
- Error: Red accent or warning icon
- Messages: Generous padding, clear typography
- Icons: Simple line icons, 24px size

**Accessibility:**
- Messages have `role="alert"` for screen reader announcement
- Focus moved to message container
- Success/error indicated by more than just color (icons, text)

**Technical Notes:**
- Clear form data on success
- Preserve form data on error
- Store submission ID for potential follow-up

**Prerequisites:** Story 3.5

**FR Coverage:** FR16

---

### Story 3.7: Submission Flow E2E Test

As a **developer**,
I want **automated tests for the submission workflow**,
So that **I can catch regressions before deployment**.

**Acceptance Criteria:**

**Given** the submission feature is complete
**When** I run Playwright tests
**Then** `tests/e2e/submission.spec.js` validates:

**Test: Form Renders Correctly**
```javascript
test('submission form displays all required fields', async ({ page }) => {
  await page.goto('/submit/');

  await expect(page.locator('h1')).toContainText('Submit Your Design Demo');
  await expect(page.locator('[name="submitterName"]')).toBeVisible();
  await expect(page.locator('[name="submitterEmail"]')).toBeVisible();
  await expect(page.locator('[name="designStyle"]')).toBeVisible();
  await expect(page.locator('[name="demoUrl"]')).toBeVisible();
  await expect(page.locator('[name="screenshotUrl"]')).toBeVisible();
  await expect(page.locator('[name="authenticityExplanation"]')).toBeVisible();
  await expect(page.locator('[name="privacyPolicyAgreed"]')).toBeVisible();
});
```

**Test: Validation Errors Display**
```javascript
test('shows validation errors for empty required fields', async ({ page }) => {
  await page.goto('/submit/');
  await page.click('[data-testid="submit-button"]');

  await expect(page.locator('.error-message')).toHaveCount(7); // All required fields
  await expect(page.locator('[name="submitterName"]')).toHaveAttribute('aria-invalid', 'true');
});
```

**Test: Email Validation**
```javascript
test('validates email format', async ({ page }) => {
  await page.goto('/submit/');
  await page.fill('[name="submitterEmail"]', 'invalid-email');
  await page.locator('[name="submitterEmail"]').blur();

  await expect(page.locator('#submitter-email-error')).toContainText('valid email');
});
```

**Test: Successful Submission (Mocked)**
```javascript
test('shows success message on valid submission', async ({ page }) => {
  // Mock Sanity API
  await page.route('**/api.sanity.io/**', route => {
    route.fulfill({ status: 200, body: JSON.stringify({ results: [{ id: 'test-id' }] }) });
  });

  await page.goto('/submit/');
  await page.fill('[name="submitterName"]', 'Test User');
  await page.fill('[name="submitterEmail"]', 'test@example.com');
  await page.selectOption('[name="designStyle"]', { index: 1 });
  await page.fill('[name="demoUrl"]', 'https://example.com/demo');
  await page.fill('[name="screenshotUrl"]', 'https://example.com/screenshot.png');
  await page.fill('[name="authenticityExplanation"]', 'This is my detailed explanation of how I implemented the design style authentically. It includes specific references to the original design principles.');
  await page.check('[name="privacyPolicyAgreed"]');
  await page.click('[data-testid="submit-button"]');

  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

**Test: Accessibility**
```javascript
test('form is accessible', async ({ page }) => {
  await page.goto('/submit/');

  // Check for axe violations
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**Technical Notes:**
- Mock external API calls to avoid real submissions
- Use `data-testid` attributes for test selectors
- Include accessibility checks in all tests

**Prerequisites:** Story 3.6

**FR Coverage:** FR9-FR16 (all submission FRs verified)

---

### Epic 3 Summary

| Story | Title | FRs Covered | Status |
|-------|-------|-------------|--------|
| 3.1 | Submission Form Page | FR9 | Pending |
| 3.2 | Submission Form Fields | FR10, FR11, FR12, FR13, FR14 | Pending |
| 3.3 | Privacy Policy Consent | FR15 | Pending |
| 3.4 | Client-Side Form Validation | FR9 | Pending |
| 3.5 | Sanity Mutation Integration | FR9 | Pending |
| 3.6 | Success & Error Feedback | FR16 | Pending |
| 3.7 | Submission Flow E2E Test | FR9-FR16 | Pending |

**Epic 3 Complete Criteria:**
- All 7 stories implemented and passing CI
- Submission form fully functional at `/submit/`
- All validations working (client-side)
- Submissions successfully saved to Sanity with "submitted" status
- Success/error feedback displays correctly
- E2E tests passing
- Ready for Epic 4: Instructor Review & Content Management

---

## Epic 4: Instructor Review & Content Management

**Epic Goal:** Instructors can review student submissions and approve quality work for the public gallery; admins can create and manage all design style content.

**User Value:** Instructors have a streamlined workflow for curating gallery content. Approved student work appears alongside curated examples, creating a dynamic, community-driven gallery.

**FRs Covered:** FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28

---

### Story 4.1: Sanity Studio Submission List View

As an **instructor**,
I want **to view all submissions in Sanity Studio**,
So that **I can see what's pending review and manage the submission queue**.

**Acceptance Criteria:**

**Given** I am logged into Sanity Studio
**When** I navigate to the Submissions section
**Then** I see a list view with:

**List Columns:**
- Submitter name
- Design style (referenced)
- Status (submitted/approved/rejected)
- Submitted date
- Preview thumbnail (screenshot)

**Filtering & Sorting:**
- Filter by status (All, Submitted, Approved, Rejected)
- Sort by date (newest first by default)
- Search by submitter name

**Studio Configuration (`studio/sanity.config.js`):**
```javascript
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

export default defineConfig({
  // ...
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Submissions')
              .child(
                S.list()
                  .title('Submissions')
                  .items([
                    S.listItem()
                      .title('Pending Review')
                      .child(
                        S.documentList()
                          .title('Pending Review')
                          .filter('_type == "gallerySubmission" && status == "submitted"')
                      ),
                    S.listItem()
                      .title('Approved')
                      .child(
                        S.documentList()
                          .title('Approved')
                          .filter('_type == "gallerySubmission" && status == "approved"')
                      ),
                    S.listItem()
                      .title('Rejected')
                      .child(
                        S.documentList()
                          .title('Rejected')
                          .filter('_type == "gallerySubmission" && status == "rejected"')
                      ),
                    S.listItem()
                      .title('All Submissions')
                      .child(
                        S.documentList()
                          .title('All Submissions')
                          .filter('_type == "gallerySubmission"')
                      ),
                  ])
              ),
            // ... other content types
          ]),
    }),
  ],
})
```

**Preview Configuration (`studio/schemas/gallerySubmission.js`):**
```javascript
preview: {
  select: {
    title: 'submitterName',
    subtitle: 'designStyle.title',
    media: 'screenshotUrl',
    status: 'status',
  },
  prepare({ title, subtitle, status }) {
    const statusEmoji = {
      submitted: '🟡',
      approved: '✅',
      rejected: '❌',
    }
    return {
      title: `${statusEmoji[status] || '⚪'} ${title}`,
      subtitle: subtitle || 'No style selected',
    }
  },
},
```

**Technical Notes:**
- Use Sanity's Structure Builder for custom navigation
- Status indicated visually with emoji in list
- Submissions grouped by status for easy triage

**Prerequisites:** Story 1.3 (Sanity schemas)

**FR Coverage:** FR17

---

### Story 4.2: Submission Detail View

As an **instructor**,
I want **to see all details of a submission in one view**,
So that **I can make an informed approval decision**.

**Acceptance Criteria:**

**Given** I click on a submission in the list
**When** the detail view opens
**Then** I see all submission fields:

**Visible Fields (FR18):**
- **Submitter Name** - Text display
- **Submitter Email** - Text display (with mailto link)
- **Design Style** - Reference link to style document
- **Demo URL** - Clickable link (opens in new tab)
- **Screenshot URL** - Displayed as image preview
- **Authenticity Explanation** - Full text display
- **Status** - Dropdown selector (submitted/approved/rejected)
- **Submitted At** - Formatted date/time
- **Privacy Policy Agreed** - Boolean indicator

**Schema Field Order:**
```javascript
// studio/schemas/gallerySubmission.js
fields: [
  // Grouping for better UX
  {
    name: 'status',
    title: 'Review Status',
    type: 'string',
    options: {
      list: [
        { title: '🟡 Submitted (Pending)', value: 'submitted' },
        { title: '✅ Approved', value: 'approved' },
        { title: '❌ Rejected', value: 'rejected' },
      ],
      layout: 'radio',
    },
  },
  // Submitter info
  { name: 'submitterName', title: 'Submitter Name', type: 'string' },
  { name: 'submitterEmail', title: 'Email', type: 'string' },
  // Submission content
  { name: 'designStyle', title: 'Design Style', type: 'reference', to: [{ type: 'designStyle' }] },
  { name: 'demoUrl', title: 'Live Demo URL', type: 'url' },
  { name: 'screenshotUrl', title: 'Screenshot URL', type: 'url' },
  { name: 'authenticityExplanation', title: 'Authenticity Explanation', type: 'text', rows: 6 },
  // Metadata
  { name: 'submittedAt', title: 'Submitted At', type: 'datetime', readOnly: true },
  { name: 'privacyPolicyAgreed', title: 'Privacy Policy Agreed', type: 'boolean', readOnly: true },
]
```

**Image Preview for Screenshot:**
```javascript
{
  name: 'screenshotUrl',
  title: 'Screenshot',
  type: 'url',
  description: 'Preview will appear below',
  components: {
    input: ScreenshotPreviewInput, // Custom component to show image
  },
}
```

**Quick Actions:**
- "Open Demo" button - Opens demoUrl in new tab
- "Email Submitter" link - Opens mailto with submitter email

**Technical Notes:**
- Status field at top for easy access
- Screenshot displayed inline as preview
- All URLs clickable

**Prerequisites:** Story 4.1

**FR Coverage:** FR18

---

### Story 4.3: Status Workflow Actions

As an **instructor**,
I want **to change submission status with a single action**,
So that **I can efficiently approve or reject submissions**.

**Acceptance Criteria:**

**Given** I am viewing a submission
**When** I change the status field
**Then** the status updates immediately:

**Status Options (FR19):**
- **Submitted** (default) - Pending review, not visible in gallery
- **Approved** - Visible in public gallery
- **Rejected** - Not visible, kept for records

**Radio Button Layout:**
```javascript
{
  name: 'status',
  title: 'Review Status',
  type: 'string',
  initialValue: 'submitted',
  options: {
    list: [
      { title: '🟡 Submitted (Pending Review)', value: 'submitted' },
      { title: '✅ Approved (Visible in Gallery)', value: 'approved' },
      { title: '❌ Rejected', value: 'rejected' },
    ],
    layout: 'radio',
  },
  validation: Rule => Rule.required(),
}
```

**Workflow Behavior:**
- Status change saves immediately (Sanity auto-save)
- No confirmation dialog needed (can be undone easily)
- Status change triggers site rebuild (via webhook, if configured)

**Visual Feedback:**
- Radio buttons clearly show current status
- Status descriptions explain visibility implications
- Change reflected in list view immediately

**Audit Trail (optional enhancement):**
- `reviewedAt` field auto-populated on status change
- `reviewedBy` field could store reviewer info (requires auth integration)

**Technical Notes:**
- Use Sanity's built-in radio layout for clear status selection
- Consider document action for "Approve" / "Reject" buttons (optional)

**Prerequisites:** Story 4.2

**FR Coverage:** FR19

---

### Story 4.4: Approved Submissions Query

As a **system**,
I want **to only fetch approved submissions for the public gallery**,
So that **unapproved content is never displayed**.

**Acceptance Criteria:**

**Given** the site builds
**When** approved submissions are queried
**Then** only submissions with `status == "approved"` are returned:

**GROQ Query (`src/_data/approvedSubmissions.js`):**
```javascript
const client = require('../lib/sanity-client.js');

module.exports = async function() {
  return await client.fetch(`
    *[_type == "gallerySubmission" && status == "approved"] | order(submittedAt desc) {
      _id,
      submitterName,
      demoUrl,
      screenshotUrl,
      authenticityExplanation,
      submittedAt,
      "styleName": designStyle->title,
      "styleSlug": designStyle->slug.current,
      "styleId": designStyle->_id
    }
  `);
};
```

**Query Guarantees (FR20, FR21):**
- Filter `status == "approved"` is mandatory
- Never query without status filter for public display
- Pending and rejected submissions excluded

**Data Available to Templates:**
- `approvedSubmissions` array in Nunjucks context
- Each item includes dereferenced style info
- Ordered by submission date (newest first)

**Empty State:**
- If no approved submissions: `approvedSubmissions` is empty array
- Templates handle empty state gracefully

**Technical Notes:**
- Query runs at build time only
- New approvals require site rebuild to appear
- Consider webhook to trigger rebuild on approval

**Prerequisites:** Story 1.4

**FR Coverage:** FR20, FR21

---

### Story 4.5: Display Approved Submissions in Gallery

As a **visitor**,
I want **to see approved student submissions in the gallery**,
So that **I can explore community-created design demos**.

**Acceptance Criteria:**

**Given** submissions have been approved
**When** I visit the gallery page
**Then** I see approved submissions displayed:

**Gallery Page Update (`src/gallery.njk`):**
```nunjucks
{# Curated Design Styles #}
<section class="curated-styles">
  <h2>Design Styles</h2>
  <div class="gallery-grid">
    {% for style in designStyles %}
      {% include "components/style-card.njk" %}
    {% endfor %}
  </div>
</section>

{# Community Submissions #}
{% if approvedSubmissions.length > 0 %}
<section class="community-submissions">
  <h2>Community Demos</h2>
  <p class="section-intro">Authentic implementations by our community members.</p>
  <div class="gallery-grid">
    {% for submission in approvedSubmissions %}
      {% include "components/submission-card.njk" %}
    {% endfor %}
  </div>
</section>
{% endif %}
```

**Display Options:**
- **Option A:** Separate section for community submissions (shown above)
- **Option B:** Mixed with curated styles, distinguished by badge

**Section Styling:**
- Clear separation between curated and community content
- Community section has introductory text explaining submissions
- Same grid layout as curated styles

**Technical Notes:**
- Approved submissions have their own section
- Curated styles remain prominent (shown first)
- Empty state: Section hidden if no approved submissions

**Prerequisites:** Story 4.4, Story 2.1

**FR Coverage:** FR20

---

### Story 4.6: Submission Card Component

As a **visitor**,
I want **approved submissions displayed as attractive cards**,
So that **I can explore community demos easily**.

**Acceptance Criteria:**

**Given** approved submissions exist
**When** I view the community section
**Then** `src/_includes/components/submission-card.njk` displays:

**Card Content:**
- Screenshot image (from screenshotUrl)
- Design style name (linked to style detail page)
- "View Demo" button (links to submitter's demo)
- Submitter name credit

**Card Template:**
```nunjucks
{% macro submissionCard(submission) %}
<article class="submission-card" data-testid="submission-card">
  <a href="{{ submission.demoUrl }}"
     target="_blank"
     rel="noopener noreferrer"
     class="submission-card-link">
    <img src="{{ submission.screenshotUrl }}"
         alt="{{ submission.styleName }} demo by {{ submission.submitterName }}"
         loading="lazy">
  </a>
  <div class="submission-card-content">
    <span class="style-badge">
      <a href="/styles/{{ submission.styleSlug }}/">{{ submission.styleName }}</a>
    </span>
    <p class="submitter-credit">by {{ submission.submitterName }}</p>
    <a href="{{ submission.demoUrl }}"
       target="_blank"
       rel="noopener noreferrer"
       class="btn-secondary btn-small">
      View Demo ↗
    </a>
  </div>
</article>
{% endmacro %}
```

**Card Styling (Neo-Swiss):**
- Same card pattern as style cards
- Screenshot: 16:9 aspect ratio, object-fit cover
- Style badge: Small, subtle, links to style page
- Submitter credit: Small text, gray-500
- Hover: Subtle shadow increase

**Accessibility:**
- Alt text includes style and submitter name
- External link indicated with icon
- Focus states on all interactive elements

**Technical Notes:**
- Card links to external demo (submitter's site)
- Style name links to internal style page
- Lazy loading for performance

**Prerequisites:** Story 4.5, Story 2.2

**FR Coverage:** FR20 (display aspect)

---

### Story 4.7: Design Style Content Management

As an **admin**,
I want **to create and edit design style content in Sanity Studio**,
So that **I can add new styles and update existing content**.

**Acceptance Criteria:**

**Given** I am logged into Sanity Studio as an admin
**When** I navigate to Design Styles
**Then** I can perform full CRUD operations:

**Create New Style (FR22):**
- Click "Create new designStyle"
- Fill in all required fields
- Save and publish

**Edit Existing Style (FR23):**
- Select style from list
- Modify any field
- Save changes (auto-publish)

**Educational Content (FR24):**
- **Historical Background** - Portable Text editor with formatting
- **Key Characteristics** - Array of strings, add/remove items
- **Design Principles** - Portable Text editor

**Typography & Color (FR25):**
- **Typography Guidance** - Portable Text for font recommendations
- **Color Palette** - Array of objects with name and hex fields

**Images (FR26):**
- **Image** - Upload with alt text field
- Sanity CDN for optimized delivery

**Demo URL (FR27):**
- **Demo URL** - URL field with validation

**Featured Flag (FR28):**
- **Featured** - Boolean toggle
- Featured styles appear on homepage

**Schema Validation:**
```javascript
// studio/schemas/designStyle.js
{
  name: 'title',
  title: 'Title',
  type: 'string',
  validation: Rule => Rule.required().min(3).max(100),
},
{
  name: 'demoUrl',
  title: 'Demo URL',
  type: 'url',
  validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
},
{
  name: 'colorPalette',
  title: 'Color Palette',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'name', type: 'string', title: 'Color Name' },
      { name: 'hex', type: 'string', title: 'Hex Code', validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/) },
    ],
  }],
},
```

**Technical Notes:**
- All content management via Sanity Studio (no custom admin UI needed)
- Portable Text for rich content editing
- Validations enforce data quality

**Prerequisites:** Story 1.3

**FR Coverage:** FR22, FR23, FR24, FR25, FR26, FR27, FR28

---

### Epic 4 Summary

| Story | Title | FRs Covered | Status |
|-------|-------|-------------|--------|
| 4.1 | Sanity Studio Submission List View | FR17 | Pending |
| 4.2 | Submission Detail View | FR18 | Pending |
| 4.3 | Status Workflow Actions | FR19 | Pending |
| 4.4 | Approved Submissions Query | FR20, FR21 | Pending |
| 4.5 | Display Approved Submissions in Gallery | FR20 | Pending |
| 4.6 | Submission Card Component | FR20 | Pending |
| 4.7 | Design Style Content Management | FR22-FR28 | Pending |

**Epic 4 Complete Criteria:**
- All 7 stories implemented and passing CI
- Instructors can view and manage submissions in Sanity Studio
- Status workflow enables approval/rejection
- Only approved submissions visible in gallery
- Admins can fully manage design style content
- Submission cards display community demos
- Ready for Epic 5: Integrations & Analytics

---

## Epic 5: Integrations & Analytics

**Epic Goal:** Connect external services for notifications, CRM data flow, and usage analytics with proper consent management.

**User Value:** Stakeholders receive instant notifications on submissions, contributor data flows to CRM for relationship management, and site usage is tracked (with user consent) for insights.

**FRs Covered:** FR29, FR30, FR31, FR32

---

### Story 5.1: Discord Webhook for New Submissions

As an **instructor/admin**,
I want **to receive a Discord notification when a new submission arrives**,
So that **I can review submissions promptly without constantly checking Sanity Studio**.

**Acceptance Criteria:**

**Given** a student submits a design demo
**When** the submission is saved to Sanity
**Then** a Discord message is sent to the configured channel:

**Discord Message Format:**
```
🎨 **New Submission Received!**

**Submitter:** Alex Chen
**Style:** Neo-Swiss Design
**Demo:** https://alexchen.github.io/swiss-demo

[View in Sanity Studio](https://mywebclass.sanity.studio/desk/gallerySubmission;abc123)

_Submitted at 2025-12-05 14:30 UTC_
```

**Implementation Options:**

**Option A: Sanity Webhook (Recommended - No Code)**
1. Configure webhook in Sanity Dashboard → API → Webhooks
2. Trigger: Document created, filter `_type == "gallerySubmission"`
3. Destination: Discord webhook URL
4. Transform payload to Discord message format

**Option B: Client-Side After Submission**
```javascript
// In submit-form.js after successful Sanity mutation
async notifyDiscord(submission) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return; // Graceful skip if not configured

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '🎨 New Submission Received!',
          fields: [
            { name: 'Submitter', value: submission.submitterName, inline: true },
            { name: 'Style', value: submission.styleName, inline: true },
            { name: 'Demo', value: submission.demoUrl },
          ],
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch (error) {
    console.error('Discord notification failed:', error);
    // Don't block submission on notification failure
  }
}
```

**Graceful Degradation (per NFR-INT2):**
- Discord webhook failure does NOT block form submission
- Errors logged but not shown to user
- Submission succeeds even if notification fails

**Configuration:**
- Webhook URL stored in environment variable: `DISCORD_WEBHOOK_URL`
- Channel: `#gallery-submissions` (or configured channel)

**Technical Notes:**
- Sanity webhook approach requires no code changes
- Client-side approach gives more control over message format
- Either approach must fail gracefully

**Prerequisites:** Story 3.5 (submissions working)

**FR Coverage:** FR29

---

### Story 5.2: CRM Integration via Zapier/Make

As an **admin**,
I want **submission data synced to the CRM**,
So that **we can track contributors and manage outreach**.

**Acceptance Criteria:**

**Given** a new submission is created in Sanity
**When** the CRM sync runs
**Then** contributor data is stored in the CRM:

**Data Synced to CRM:**
- Submitter name
- Submitter email
- Design style submitted
- Demo URL
- Submission date
- Submission status

**Integration Architecture:**
```
[Sanity] → [Zapier/Make Webhook] → [CRM (Airtable/HubSpot/Notion)]
```

**Zapier/Make Configuration (External - No Code):**
1. **Trigger:** Sanity webhook on `gallerySubmission` create/update
2. **Action:** Create/Update record in CRM

**Sanity Webhook Setup:**
- Dashboard → API → Webhooks → Create Webhook
- Name: "CRM Sync"
- URL: Zapier/Make webhook URL
- Trigger: Create, Update
- Filter: `_type == "gallerySubmission"`

**CRM Schema (Example for Airtable):**

| Field | Type | Source |
|-------|------|--------|
| Name | Text | `submitterName` |
| Email | Email | `submitterEmail` |
| Style | Link/Text | `designStyle->title` |
| Demo URL | URL | `demoUrl` |
| Status | Select | `status` |
| Submitted | Date | `submittedAt` |
| Sanity ID | Text | `_id` |

**Graceful Degradation (per NFR-INT3):**
- CRM sync failures are logged in Zapier/Make
- Do NOT affect user experience
- Manual export from Sanity available as fallback

**Technical Notes:**
- This is an external integration (no code in codebase)
- Document setup in README for future maintainers
- Test webhook with sample data before going live

**Prerequisites:** Story 1.3 (Sanity deployed)

**FR Coverage:** FR30

---

### Story 5.3: Google Analytics 4 Setup

As an **admin**,
I want **to track site usage with Google Analytics 4**,
So that **we can understand user behavior and measure success**.

**Acceptance Criteria:**

**Given** GA4 is configured
**When** a user consents to analytics
**Then** page views and events are tracked:

**GA4 Integration (`src/assets/js/analytics.js`):**
```javascript
const Analytics = {
  GA_ID: null,
  initialized: false,

  init(measurementId) {
    if (this.initialized || !measurementId) return;

    this.GA_ID = measurementId;

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', measurementId, {
      anonymize_ip: true, // GDPR compliance
      cookie_flags: 'SameSite=None;Secure',
    });

    this.initialized = true;
    console.log('Analytics initialized');
  },

  trackEvent(eventName, parameters = {}) {
    if (!this.initialized) return;
    gtag('event', eventName, parameters);
  },

  trackPageView(path) {
    if (!this.initialized) return;
    gtag('config', this.GA_ID, { page_path: path });
  },
};

// Export for use by consent.js
window.Analytics = Analytics;
```

**Configuration:**
- Measurement ID stored in environment variable: `GA4_MEASUREMENT_ID`
- Injected at build time into template or JS

**Base Template Integration (`src/_includes/layouts/base.njk`):**
```html
<script>
  window.GA4_MEASUREMENT_ID = '{{ env.GA4_MEASUREMENT_ID }}';
</script>
<script src="/assets/js/analytics.js" defer></script>
<script src="/assets/js/consent.js" defer></script>
```

**GDPR Compliance:**
- `anonymize_ip: true` for IP anonymization
- Analytics ONLY loaded after explicit consent (Story 5.4)
- No tracking cookies set without consent

**Technical Notes:**
- Analytics module exposes global `window.Analytics` for consent script
- GA4 not loaded until `Analytics.init()` is called
- All events use standard GA4 event names where applicable

**Prerequisites:** Story 1.8 (CI/CD for env vars)

**FR Coverage:** FR31

---

### Story 5.4: Consent-Gated Analytics Loading

As a **visitor**,
I want **analytics to only load after I give consent**,
So that **my privacy preferences are respected**.

**Acceptance Criteria:**

**Given** I visit the site for the first time
**When** I see the cookie consent banner
**Then** analytics do NOT load until I accept:

**Consent Module (`src/assets/js/consent.js`):**
```javascript
const CookieConsent = {
  STORAGE_KEY: 'cookie-consent',
  banner: null,

  init() {
    this.banner = document.querySelector('[data-consent="banner"]');
    if (!this.banner) return;

    const consent = this.getConsent();

    if (consent === null) {
      // No decision yet - show banner
      this.showBanner();
    } else if (consent === true) {
      // Previously accepted - init analytics
      this.initAnalytics();
    }
    // If consent === false, do nothing (rejected)

    this.bindEvents();
  },

  bindEvents() {
    const acceptBtn = document.querySelector('[data-consent="accept"]');
    const rejectBtn = document.querySelector('[data-consent="reject"]');

    acceptBtn?.addEventListener('click', () => this.handleAccept());
    rejectBtn?.addEventListener('click', () => this.handleReject());
  },

  showBanner() {
    this.banner.hidden = false;
    this.banner.setAttribute('aria-hidden', 'false');
  },

  hideBanner() {
    this.banner.hidden = true;
    this.banner.setAttribute('aria-hidden', 'true');
  },

  handleAccept() {
    this.setConsent(true);
    this.hideBanner();
    this.initAnalytics();
  },

  handleReject() {
    this.setConsent(false);
    this.hideBanner();
    // Analytics NOT initialized
  },

  initAnalytics() {
    if (window.Analytics && window.GA4_MEASUREMENT_ID) {
      window.Analytics.init(window.GA4_MEASUREMENT_ID);
    }
  },

  getConsent() {
    const value = localStorage.getItem(this.STORAGE_KEY);
    if (value === 'true') return true;
    if (value === 'false') return false;
    return null;
  },

  setConsent(value) {
    localStorage.setItem(this.STORAGE_KEY, value.toString());
  },
};

document.addEventListener('DOMContentLoaded', () => CookieConsent.init());
```

**Consent Flow (FR32, FR37):**
1. First visit: Banner shown, no analytics loaded
2. Accept: Consent stored in localStorage, analytics initialized
3. Reject: Consent stored as false, analytics never loaded
4. Return visit: Consent checked, analytics loaded only if accepted

**Banner Hidden by Default:**
```html
<div data-consent="banner" hidden aria-hidden="true" class="consent-banner">
  <!-- Content in Story 6.1 -->
</div>
```

**Technical Notes:**
- Uses localStorage (not cookies) for consent preference
- Analytics.init() only called after explicit acceptance
- Consent preference persists across sessions
- No third-party scripts loaded before consent

**Prerequisites:** Story 5.3, Story 1.7 (footer/banner area)

**FR Coverage:** FR32, FR37

---

### Story 5.5: Event Tracking Implementation

As an **admin**,
I want **key user actions tracked as events**,
So that **we can measure engagement and optimize the experience**.

**Acceptance Criteria:**

**Given** a user has consented to analytics
**When** they perform key actions
**Then** events are sent to GA4:

**Events to Track:**

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `view_demo` | Click "View Demo" button | `style_name`, `style_slug` |
| `form_start` | Focus first submission field | `form_name: "submission"` |
| `form_submit` | Successful submission | `style_name` |
| `gallery_view` | View gallery page | `style_count` |
| `style_view` | View style detail page | `style_name`, `style_slug` |

**View Demo Event (on style detail page):**
```javascript
// In style-detail template or via delegation
document.querySelectorAll('[data-analytics-event="view-demo"]').forEach(btn => {
  btn.addEventListener('click', () => {
    Analytics.trackEvent('view_demo', {
      style_name: btn.dataset.analyticsStyle,
      style_slug: btn.dataset.analyticsSlug,
    });
  });
});
```

**Button Markup:**
```html
<a href="{{ style.demoUrl }}"
   target="_blank"
   rel="noopener noreferrer"
   class="btn-primary"
   data-analytics-event="view-demo"
   data-analytics-style="{{ style.title }}"
   data-analytics-slug="{{ style.slug.current }}">
  View Demo ↗
</a>
```

**Form Tracking (in submit-form.js):**
```javascript
// On first field focus
const firstField = this.form.querySelector('input, select, textarea');
firstField?.addEventListener('focus', () => {
  Analytics.trackEvent('form_start', { form_name: 'submission' });
}, { once: true });

// On successful submission
Analytics.trackEvent('form_submit', {
  style_name: selectedStyleName,
});
```

**Page View Tracking (automatic):**
- GA4 automatically tracks page views
- Additional manual tracking not required

**Graceful Degradation:**
- All `Analytics.trackEvent()` calls check if initialized
- Events silently dropped if user declined consent
- No errors if analytics not loaded

**Technical Notes:**
- Use `data-analytics-*` attributes for declarative tracking
- Event names follow GA4 recommended conventions
- Keep parameters minimal for clarity

**Prerequisites:** Story 5.4

**FR Coverage:** FR31 (event tracking aspect)

---

### Epic 5 Summary

| Story | Title | FRs Covered | Status |
|-------|-------|-------------|--------|
| 5.1 | Discord Webhook for New Submissions | FR29 | Pending |
| 5.2 | CRM Integration via Zapier/Make | FR30 | Pending |
| 5.3 | Google Analytics 4 Setup | FR31 | Pending |
| 5.4 | Consent-Gated Analytics Loading | FR32, FR37 | Pending |
| 5.5 | Event Tracking Implementation | FR31 | Pending |

**Epic 5 Complete Criteria:**
- All 5 stories implemented and passing CI
- Discord notifications firing on new submissions
- CRM integration documented and configured
- GA4 loading only after user consent
- Key events tracked (demo clicks, form submissions)
- All integrations fail gracefully per NFRs
- Ready for Epic 6: Compliance, SEO & Production Launch

---

## Epic 6: Compliance, SEO & Production Launch

**Epic Goal:** Ensure the site is GDPR-compliant, accessible, SEO-optimized, and ready for public launch with all quality gates passing.

**User Value:** Visitors have a compliant, accessible, and discoverable experience. The site is production-ready and can go live immediately after this epic.

**FRs Covered:** FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR41

---

### Story 6.1: Cookie Consent Banner

As a **visitor**,
I want **to see a clear cookie consent banner on my first visit**,
So that **I can choose whether to allow analytics tracking**.

**Acceptance Criteria:**

**Given** I visit the site for the first time
**When** the page loads
**Then** I see a cookie consent banner:

**Banner Component (`src/_includes/components/consent-banner.njk`):**
```html
<div data-consent="banner"
     hidden
     aria-hidden="true"
     role="dialog"
     aria-label="Cookie consent"
     class="consent-banner">
  <div class="consent-content">
    <h2 class="consent-title">We value your privacy</h2>
    <p class="consent-text">
      We use cookies to analyze site usage and improve your experience.
      You can accept or reject analytics cookies.
      <a href="/cookies/">Learn more</a>
    </p>
    <div class="consent-actions">
      <button type="button"
              data-consent="accept"
              class="btn-primary">
        Accept
      </button>
      <button type="button"
              data-consent="reject"
              class="btn-secondary">
        Reject
      </button>
    </div>
  </div>
</div>
```

**Banner Behavior (FR33, FR34):**
- Hidden by default (`hidden` attribute)
- Shown via JavaScript if no consent decision stored
- Accept: Stores `true`, hides banner, initializes analytics
- Reject: Stores `false`, hides banner, no analytics

**Styling (Neo-Swiss):**
```css
.consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--gray-200);
  padding: 24px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.consent-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.consent-actions {
  display: flex;
  gap: 12px;
}
```

**Responsive:**
- Desktop: Horizontal layout with text and buttons side by side
- Mobile: Stacked layout, buttons full width

**Accessibility:**
- `role="dialog"` for screen readers
- Focus trapped within banner while open
- Buttons have clear labels
- Color contrast meets WCAG AA

**Technical Notes:**
- Banner controlled by `consent.js` (Story 5.4)
- No cookies set by the banner itself (uses localStorage)
- Include in `base.njk` layout

**Prerequisites:** Story 5.4

**FR Coverage:** FR33, FR34

---

### Story 6.2: Privacy Policy Page

As a **visitor**,
I want **to read the privacy policy**,
So that **I understand how my data is collected and used**.

**Acceptance Criteria:**

**Given** I navigate to `/privacy/`
**When** the page loads
**Then** I see `src/pages/privacy.njk` with:

**Page Structure:**
- H1: "Privacy Policy"
- Last updated date
- Comprehensive policy content

**Required Sections:**
1. **Introduction** - Who we are, what this policy covers
2. **Data We Collect** - Personal data types (name, email from submissions)
3. **How We Use Your Data** - Purpose of collection
4. **Cookies & Analytics** - GA4 usage, consent mechanism
5. **Data Storage** - Sanity CMS, data location
6. **Your Rights** - Access, deletion, correction rights
7. **Third Parties** - GA4, Discord, CRM integrations
8. **Contact** - How to reach us with questions
9. **Updates** - How policy changes are communicated

**Policy Content (Example Structure):**
```markdown
## Introduction
MyWebClass ("we", "us", "our") operates mywebclass.org. This policy explains how we collect, use, and protect your personal information.

## Data We Collect
When you submit a design demo, we collect:
- Your name
- Your email address
- Your demo URL and screenshot
- Your authenticity explanation

## Cookies & Analytics
We use Google Analytics 4 to understand site usage. Analytics cookies are only set if you accept them via our consent banner. You can reject analytics at any time.

[Continue with remaining sections...]
```

**Styling:**
- Standard page layout (extends `page.njk`)
- Neo-Swiss typography with good readability
- Max-width for comfortable reading (65-75ch)
- Section headings as H2

**Technical Notes:**
- Content can be hardcoded in template (not from CMS)
- Link from footer, submission form, and consent banner
- Include last updated date that's easy to maintain

**Prerequisites:** Story 1.5 (base layout)

**FR Coverage:** FR35

---

### Story 6.3: Cookie Policy Page

As a **visitor**,
I want **to read the cookie policy**,
So that **I understand what cookies are used and why**.

**Acceptance Criteria:**

**Given** I navigate to `/cookies/`
**When** the page loads
**Then** I see `src/pages/cookies.njk` with:

**Page Structure:**
- H1: "Cookie Policy"
- Last updated date
- Detailed cookie information

**Required Sections:**
1. **What Are Cookies** - Brief explanation
2. **How We Use Cookies** - Our specific usage
3. **Cookies We Use** - Table of specific cookies
4. **Managing Cookies** - How to control preferences
5. **Third-Party Cookies** - GA4 cookies
6. **Contact** - Questions about cookies

**Cookie Table:**

| Cookie Name | Provider | Purpose | Duration | Type |
|-------------|----------|---------|----------|------|
| `cookie-consent` | MyWebClass | Stores your consent preference | 1 year | Functional |
| `_ga` | Google Analytics | Distinguishes users | 2 years | Analytics |
| `_ga_*` | Google Analytics | Session state | 2 years | Analytics |

**Managing Preferences:**
```markdown
## Managing Your Cookie Preferences

You can change your cookie preferences at any time:

1. **On this site:** Clear your browser's localStorage for mywebclass.org, then refresh the page. The consent banner will appear again.

2. **In your browser:** You can block cookies in your browser settings. Note that this may affect site functionality.
```

**Styling:**
- Same layout as privacy policy
- Table styled with Neo-Swiss patterns (clean borders, good spacing)

**Technical Notes:**
- Complements privacy policy (more detailed on cookies)
- Link from footer and consent banner

**Prerequisites:** Story 1.5

**FR Coverage:** FR36

---

### Story 6.4: About Page

As a **visitor**,
I want **to learn about the MyWebClass mission**,
So that **I understand what this platform is about**.

**Acceptance Criteria:**

**Given** I navigate to `/about/`
**When** the page loads
**Then** I see `src/pages/about.njk` with:

**Page Structure:**
- H1: "About MyWebClass"
- Mission statement
- What makes us different
- How to get involved

**Content Sections:**

**Mission Statement:**
```markdown
## Our Mission

MyWebClass teaches visual design history through authentic, fully-implemented website demonstrations. Unlike traditional design education that relies on static images and theory, we provide living examples—real websites that faithfully recreate iconic design movements.
```

**What Makes Us Different:**
```markdown
## What Makes Us Different

Each design style in our gallery isn't just *styled* to look like a historical movement—it's a **researched implementation** built with authentic typography, layout principles, color usage, and interaction patterns.

Every demo includes educational context explaining:
- The style's historical origins
- Key visual characteristics
- Why our implementation is faithful to the original principles
```

**Get Involved:**
```markdown
## Get Involved

**Students:** Submit your own design style implementations for review.

**Instructors:** Use MyWebClass as a teaching resource and submit curated examples.

**Enthusiasts:** Explore the gallery and learn about design history.
```

**Styling (Neo-Swiss):**
- Hero section with compelling headline
- Generous whitespace between sections
- May include a relevant image or illustration
- Clear CTAs to gallery and submission

**Technical Notes:**
- Important for SEO and user trust
- Link prominently in navigation
- Content establishes credibility

**Prerequisites:** Story 1.5, Story 1.6

**FR Coverage:** FR38

---

### Story 6.5: SEO Meta Tags & Open Graph

As a **visitor sharing the site**,
I want **rich previews when I share links on social media**,
So that **my shares look professional and informative**.

**Acceptance Criteria:**

**Given** any page on the site
**When** the page is shared on social media or indexed by search engines
**Then** proper meta tags are present:

**Base Layout Meta Tags (`src/_includes/layouts/base.njk`):**
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Primary Meta Tags -->
  <title>{% block title %}{{ title }} | {{ site.title }}{% endblock %}</title>
  <meta name="description" content="{% block description %}{{ site.description }}{% endblock %}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <meta property="og:title" content="{% block og_title %}{{ title }} | {{ site.title }}{% endblock %}">
  <meta property="og:description" content="{% block og_description %}{{ site.description }}{% endblock %}">
  <meta property="og:image" content="{% block og_image %}{{ site.url }}/assets/images/og-default.png{% endblock %}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="{{ site.url }}{{ page.url }}">
  <meta property="twitter:title" content="{% block twitter_title %}{{ title }}{% endblock %}">
  <meta property="twitter:description" content="{% block twitter_description %}{{ site.description }}{% endblock %}">
  <meta property="twitter:image" content="{% block twitter_image %}{{ site.url }}/assets/images/og-default.png{% endblock %}">

  <!-- Canonical URL -->
  <link rel="canonical" href="{{ site.url }}{{ page.url }}">
</head>
```

**Style Detail Page Overrides (`src/styles/styles.njk`):**
```nunjucks
{% block title %}{{ style.title }} | Design Style Gallery{% endblock %}
{% block description %}{{ style.description | truncate(160) }}{% endblock %}
{% block og_image %}{{ style.imageUrl }}{% endblock %}
```

**Default OG Image:**
- Create `src/assets/images/og-default.png` (1200x630px)
- MyWebClass branding, tagline
- Used when no page-specific image available

**SEO Requirements (FR40):**
- Unique title per page
- Unique meta description per page (max 160 chars)
- Semantic URLs (e.g., `/styles/neo-swiss/` not `/styles?id=123`)
- Canonical URLs on all pages

**Social Sharing (FR41):**
- Open Graph tags for Facebook, LinkedIn
- Twitter card tags for Twitter/X
- Image dimensions: 1200x630px recommended

**Technical Notes:**
- Use Nunjucks blocks for page-specific overrides
- Ensure images are absolute URLs
- Test with Facebook Sharing Debugger and Twitter Card Validator

**Prerequisites:** Story 1.5

**FR Coverage:** FR40, FR41

---

### Story 6.6: XML Sitemap & Robots.txt

As a **search engine**,
I want **a sitemap and robots.txt**,
So that **I can efficiently crawl and index the site**.

**Acceptance Criteria:**

**Given** the site is deployed
**When** search engines access `/sitemap.xml` and `/robots.txt`
**Then** they receive valid files:

**Sitemap Generation (Eleventy Plugin):**
```javascript
// eleventy.config.js
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://mywebclass.org",
    },
  });
};
```

**Sitemap Output (`/sitemap.xml`):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mywebclass.org/</loc>
    <lastmod>2025-12-05</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mywebclass.org/gallery/</loc>
    <lastmod>2025-12-05</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://mywebclass.org/styles/neo-swiss/</loc>
    <lastmod>2025-12-05</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- Additional URLs -->
</urlset>
```

**Robots.txt (`src/robots.txt`):**
```
User-agent: *
Allow: /

Sitemap: https://mywebclass.org/sitemap.xml
```

**Eleventy Passthrough:**
```javascript
eleventyConfig.addPassthroughCopy("src/robots.txt");
```

**Pages to Include:**
- Homepage (`/`)
- Gallery (`/gallery/`)
- All style detail pages (`/styles/*/`)
- About (`/about/`)
- Submit (`/submit/`)
- Privacy (`/privacy/`)
- Cookies (`/cookies/`)

**Pages to Exclude (if any):**
- None for this site (all public)

**Technical Notes:**
- Install `@quasibit/eleventy-plugin-sitemap` or similar
- Sitemap auto-generated at build time
- Submit sitemap to Google Search Console

**Prerequisites:** Story 1.1 (dependencies)

**FR Coverage:** FR40 (discoverability)

---

### Story 6.7: WCAG AA Accessibility Audit

As a **developer**,
I want **to verify the site meets WCAG AA accessibility standards**,
So that **all users can access our content**.

**Acceptance Criteria:**

**Given** the site is feature-complete
**When** I run accessibility audits
**Then** all WCAG AA criteria are met:

**Automated Testing (Playwright + Axe):**
```javascript
// tests/e2e/accessibility.spec.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/gallery/', '/submit/', '/about/', '/privacy/'];

for (const path of pages) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('style detail page is accessible', async ({ page }) => {
  await page.goto('/styles/neo-swiss/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

**Manual Audit Checklist:**

**Perceivable:**
- [ ] All images have alt text
- [ ] Color contrast ≥4.5:1 for normal text
- [ ] Color contrast ≥3:1 for large text
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without loss

**Operable:**
- [ ] All functionality accessible via keyboard
- [ ] Skip-to-content link works
- [ ] Focus indicators visible on all interactive elements
- [ ] No keyboard traps
- [ ] Touch targets ≥44x44px

**Understandable:**
- [ ] Language attribute set (`<html lang="en">`)
- [ ] Consistent navigation across pages
- [ ] Form labels associated with inputs
- [ ] Error messages clear and helpful

**Robust:**
- [ ] Valid HTML5 (no parsing errors)
- [ ] ARIA used correctly where needed
- [ ] Works with screen readers (VoiceOver, NVDA)

**Lighthouse Accessibility Score:**
- Target: ≥90

**Technical Notes:**
- Install `@axe-core/playwright` for automated testing
- Run audits on all page types
- Fix any violations before launch

**Prerequisites:** All previous stories complete

**FR Coverage:** NFR (Accessibility), supports all FRs

---

### Story 6.8: Lighthouse CI Validation

As a **developer**,
I want **automated Lighthouse checks in CI**,
So that **performance and quality regressions are caught before deployment**.

**Acceptance Criteria:**

**Given** code is pushed to the repository
**When** the CI pipeline runs Lighthouse
**Then** all thresholds are met:

**Lighthouse CI Configuration (`.lighthouserc.js`):**
```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:8080/',
        'http://localhost:8080/gallery/',
        'http://localhost:8080/submit/',
        'http://localhost:8080/about/',
      ],
      startServerCommand: 'npm run serve',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**CI Integration (`.github/workflows/ci.yml`):**
```yaml
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Thresholds:**
| Category | Minimum Score |
|----------|---------------|
| Performance | 90 |
| Accessibility | 90 |
| Best Practices | 90 |
| SEO | 90 |

**Report Artifacts:**
- Lighthouse reports uploaded as CI artifacts
- Link to report in PR comments (optional)

**Failure Behavior:**
- Pipeline fails if any threshold not met
- Developer must fix issues before merge

**Technical Notes:**
- Use `@lhci/cli` for CI integration
- Run against built site served locally
- Multiple runs (3) for stable scores

**Prerequisites:** Story 1.8 (CI pipeline)

**FR Coverage:** NFR-BUILD4, NFR-BUILD6

---

### Story 6.9: Production Launch Checklist

As an **admin**,
I want **a verified launch checklist**,
So that **nothing is missed before going live**.

**Acceptance Criteria:**

**Given** all previous stories are complete
**When** preparing for launch
**Then** all checklist items are verified:

**Pre-Launch Checklist:**

**Content:**
- [ ] 3 design styles with full educational content
- [ ] All Portable Text content renders correctly
- [ ] Images have alt text and load properly
- [ ] No placeholder or Lorem Ipsum content

**Functionality:**
- [ ] Gallery displays all styles
- [ ] Style detail pages load correctly
- [ ] Submission form validates and submits
- [ ] Consent banner appears on first visit
- [ ] Accept/reject cookies works correctly
- [ ] Navigation works on all pages
- [ ] All internal links work (no 404s)
- [ ] External demo links open in new tab

**Integrations:**
- [ ] Discord webhook fires on submission
- [ ] Sanity Studio accessible and functional
- [ ] GA4 loads only after consent
- [ ] Environment variables configured in production

**Compliance:**
- [ ] Privacy policy page accessible
- [ ] Cookie policy page accessible
- [ ] Consent banner GDPR-compliant
- [ ] WCAG AA audit passing

**Performance:**
- [ ] Lighthouse Performance ≥90
- [ ] Lighthouse Accessibility ≥90
- [ ] CSS bundle <50KB
- [ ] Images optimized

**SEO:**
- [ ] All pages have unique titles and descriptions
- [ ] Open Graph images configured
- [ ] Sitemap generated and valid
- [ ] Robots.txt in place
- [ ] Site submitted to Google Search Console

**Deployment:**
- [ ] CI pipeline green on main branch
- [ ] GitHub Pages deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS working
- [ ] DNS propagated

**Final Verification:**
- [ ] Test on real mobile device
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test with screen reader
- [ ] Have someone unfamiliar test key flows

**Launch Documentation:**
- [ ] README updated with setup instructions
- [ ] docs/ai-usage.md complete
- [ ] docs/qa-report.md complete
- [ ] docs/analytics-evaluation.md complete

**Technical Notes:**
- This is a verification story, not implementation
- Create actual checklist document in repo
- Sign off by team before launch

**Prerequisites:** All Epic 1-6 stories complete

**FR Coverage:** All FRs (final verification)

---

### Epic 6 Summary

| Story | Title | FRs Covered | Status |
|-------|-------|-------------|--------|
| 6.1 | Cookie Consent Banner | FR33, FR34 | Pending |
| 6.2 | Privacy Policy Page | FR35 | Pending |
| 6.3 | Cookie Policy Page | FR36 | Pending |
| 6.4 | About Page | FR38 | Pending |
| 6.5 | SEO Meta Tags & Open Graph | FR40, FR41 | Pending |
| 6.6 | XML Sitemap & Robots.txt | FR40 | Pending |
| 6.7 | WCAG AA Accessibility Audit | NFR | Pending |
| 6.8 | Lighthouse CI Validation | NFR-BUILD4, NFR-BUILD6 | Pending |
| 6.9 | Production Launch Checklist | All | Pending |

**Epic 6 Complete Criteria:**
- All 9 stories implemented and verified
- Cookie consent banner functional
- Privacy and cookie policy pages live
- About page published
- SEO meta tags on all pages
- Sitemap generated and submitted
- Accessibility audit passing
- Lighthouse CI thresholds met
- Launch checklist verified
- **SITE READY FOR PRODUCTION LAUNCH** 🚀

---

## Final Validation & FR Coverage Matrix

### Complete FR Coverage Matrix

| FR | Description | Epic | Story | Status |
|----|-------------|------|-------|--------|
| FR1 | Browse design styles in gallery | 2 | 2.1, 2.2 | Pending |
| FR2 | View detail page with educational content | 2 | 2.3 | Pending |
| FR3 | Access live demo via external link | 2 | 2.8 | Pending |
| FR4 | Read historical background | 2 | 2.4 | Pending |
| FR5 | View characteristics and principles | 2 | 2.5 | Pending |
| FR6 | See typography and color guidance | 2 | 2.6 | Pending |
| FR7 | View featured styles on homepage | 2 | 2.7 | Pending |
| FR8 | Navigate to gallery from any page | 1, 2 | 1.6, 2.1 | Pending |
| FR9 | Submit design demo via form | 3 | 3.1-3.6 | Pending |
| FR10 | Provide name and email | 3 | 3.2 | Pending |
| FR11 | Specify design style | 3 | 3.2 | Pending |
| FR12 | Provide demo URL | 3 | 3.2 | Pending |
| FR13 | Provide screenshot URL | 3 | 3.2 | Pending |
| FR14 | Write authenticity explanation | 3 | 3.2 | Pending |
| FR15 | Agree to privacy policy | 3 | 3.3 | Pending |
| FR16 | Receive submission confirmation | 3 | 3.6 | Pending |
| FR17 | View submissions in Sanity Studio | 4 | 4.1 | Pending |
| FR18 | See submission details | 4 | 4.2 | Pending |
| FR19 | Change submission status | 4 | 4.3 | Pending |
| FR20 | Only approved visible in gallery | 4 | 4.4, 4.5 | Pending |
| FR21 | Prevent unapproved from display | 4 | 4.4 | Pending |
| FR22 | Create design style entries | 4 | 4.7 | Pending |
| FR23 | Edit existing content | 4 | 4.7 | Pending |
| FR24 | Add educational content | 4 | 4.7 | Pending |
| FR25 | Configure color/typography | 4 | 4.7 | Pending |
| FR26 | Upload sample images | 4 | 4.7 | Pending |
| FR27 | Set external demo URL | 4 | 4.7 | Pending |
| FR28 | Mark styles as featured | 4 | 4.7 | Pending |
| FR29 | Discord notification on submission | 5 | 5.1 | Pending |
| FR30 | CRM sync via Zapier/Make | 5 | 5.2 | Pending |
| FR31 | Track via Google Analytics 4 | 5 | 5.3, 5.5 | Pending |
| FR32 | Analytics only after consent | 5 | 5.4 | Pending |
| FR33 | Cookie consent banner | 6 | 6.1 | Pending |
| FR34 | Accept or reject cookies | 6 | 6.1 | Pending |
| FR35 | Access privacy policy | 6 | 6.2 | Pending |
| FR36 | Access cookie policy | 6 | 6.3 | Pending |
| FR37 | Respect consent preferences | 5 | 5.4 | Pending |
| FR38 | Access About page | 6 | 6.4 | Pending |
| FR39 | Consistent navigation | 1 | 1.6 | Pending |
| FR40 | SEO-friendly URLs | 6 | 6.5, 6.6 | Pending |
| FR41 | Social media sharing (OG) | 6 | 6.5 | Pending |

**Coverage:** 41/41 FRs mapped to stories (100%)

---

### Epic & Story Summary

| Epic | Title | Stories | FRs Covered |
|------|-------|---------|-------------|
| 1 | Foundation & Core Infrastructure | 9 | Enables all |
| 2 | Design Gallery Experience | 9 | FR1-FR8 |
| 3 | Student Submission Workflow | 7 | FR9-FR16 |
| 4 | Instructor Review & Content Management | 7 | FR17-FR28 |
| 5 | Integrations & Analytics | 5 | FR29-FR32, FR37 |
| 6 | Compliance, SEO & Production Launch | 9 | FR33-FR36, FR38-FR41 |
| **Total** | | **46 stories** | **41 FRs** |

---

### Architecture Integration Summary

All stories incorporate decisions from `docs/architecture.md`:

| Architecture Decision | Stories Using It |
|----------------------|------------------|
| Eleventy v3.1.2 + Nunjucks | 1.1, 1.5, 2.1-2.9, 3.1, 6.2-6.4 |
| Tailwind CSS v4 | 1.2, all UI stories |
| Sanity CMS schemas | 1.3, 1.4, 2.9, 3.5, 4.1-4.7 |
| Vanilla ES modules | 3.4, 5.3, 5.4, 5.5 |
| GitHub Actions CI/CD | 1.8, 6.8 |
| Neo-Swiss design patterns | All UI stories |

---

### Implementation Sequence

**Recommended order for maximum efficiency:**

1. **Epic 1** - Foundation (enables all others)
2. **Epic 2** - Gallery (core value proposition)
3. **Epic 3** - Submissions (user engagement)
4. **Epic 4** - Review workflow (completes loop)
5. **Epic 5** - Integrations (external connections)
6. **Epic 6** - Compliance & Launch (production ready)

**Parallel opportunities:**
- Stories 1.3 and 1.8 can run in parallel
- Story 2.9 (content entry) can happen while 2.1-2.8 are built
- Stories 5.1 and 5.2 (external integrations) can be configured anytime after Epic 3

---

## Document Complete

**Epic Breakdown Status:** COMPLETE ✅

**Generated:** 2025-12-05
**Author:** Jay (with John, PM Agent)
**Total Stories:** 46
**Total FRs Covered:** 41/41 (100%)

**Next Steps:**
1. Review this document with the team
2. Begin Sprint Planning using `/bmad:bmm:workflows:sprint-planning`
3. Create individual story files using `/bmad:bmm:workflows:create-story`
4. Start implementation with Epic 1

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

---

