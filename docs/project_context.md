# Project Context: is373-final

> AI Agent Reference Guide — Read before implementing any code

## Project Overview

**Type:** Static Web Application with Headless CMS (JAMstack)
**Stack:** Eleventy 3.1.2 + Sanity CMS + Tailwind CSS 3.4.18
**Deployment:** GitHub Pages
**Status:** Brownfield (existing codebase)

## Critical Rules

### DO

- Use Angular/Conventional Commits format: `feat:`, `fix:`, `docs:`, `chore:` (triggers semantic versioning)
- Use `@11ty/eleventy-fetch` for all Sanity data fetching with 1-hour cache
- Wrap all Sanity fetches in try/catch, return empty array on failure
- Use camelCase for Sanity schema fields (`submitterName`, `isFeatured`)
- Use kebab-case for all file names (`cookie-consent.js`, `navigation.njk`)
- Check array length explicitly: `{% if items.length %}` not `{% if items %}`
- Use descriptive loop variables: `style`, `submission` not `item`, `s`
- Follow existing Swiss design system classes from `swiss-lineage.md`

### DON'T

- Don't create custom authentication — use Sanity Studio native auth
- Don't build serverless functions — use Make webhook for form handling
- Don't hardcode Sanity credentials — use environment variables
- Don't let Sanity fetch failures crash the build — graceful degradation
- Don't use truthy checks on arrays in Nunjucks (arrays are always truthy)

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| SSG | Eleventy | 3.1.2 |
| Templating | Nunjucks | — |
| Styling | Tailwind CSS | 3.4.18 |
| CMS | Sanity | v3 |
| Forms | Make webhook | — |
| CRM | Airtable | Free tier |
| Hosting | GitHub Pages | — |

## Directory Structure

```
src/
├── _data/           # Sanity data fetchers
├── _includes/       # Layouts, components, macros
├── pages/           # Page templates
├── scripts/         # Client-side JS (minimal)
└── styles/          # Tailwind CSS entry

studio/              # Sanity Studio (separate)
└── schemas/         # Document type definitions
```

## Sanity Schema Conventions

```javascript
// Document types: camelCase
name: 'designStyle'
name: 'gallerySubmission'

// Fields: camelCase
{ name: 'submitterName', type: 'string' }
{ name: 'accentColor', type: 'string' }

// Booleans: prefix with is/has
{ name: 'isFeatured', type: 'boolean' }
{ name: 'hasPublicDisplayConsent', type: 'boolean' }

// Status: lowercase enum
status: 'pending' | 'approved' | 'rejected'
```

## Data Fetching Pattern

```javascript
// src/_data/designStyles.js
import Fetch from "@11ty/eleventy-fetch";

const PROJECT_ID = process.env.SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || 'production';
const QUERY = encodeURIComponent('*[_type == "designStyle"]');
const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

export default async function() {
  try {
    const data = await Fetch(URL, { duration: "1h", type: "json" });
    return data.result;
  } catch (e) {
    console.error("Failed to fetch designStyles:", e.message);
    return []; // Graceful fallback
  }
}
```

## Template Pattern

```nunjucks
{# Correct: explicit length check #}
{% if designStyles.length %}
  {% for style in designStyles %}
    {% include "components/card.njk" %}
  {% endfor %}
{% else %}
  <p class="text-secondary">No styles available yet.</p>
{% endif %}
```

## Form Submission Flow

```
User submits form (src/pages/submit.njk)
       ↓
POST to Make webhook (MAKE_WEBHOOK_URL env var)
       ↓
Make scenario:
  1. Create Sanity document (status: pending)
  2. Create Airtable record
  3. Fire Discord webhook
```

## Environment Variables

```bash
SANITY_PROJECT_ID=xxx        # Sanity project ID
SANITY_DATASET=production    # Dataset name
SANITY_API_TOKEN=sk-xxx      # Read token (build only)
MAKE_WEBHOOK_URL=https://... # Form submission endpoint
```

## Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Skip links on all pages
- Alt text for all images
- 4.5:1 contrast ratio minimum
- Keyboard navigable
- Focus visible indicators

## Performance Targets

- Lighthouse > 90
- FCP < 1.5s
- LCP < 2.5s
- CLS < 0.1
- CSS < 50KB

## Testing

- E2E tests in `tests/e2e/` using Playwright
- Test gallery rendering, form submission, navigation
- Validate accessibility with axe-core

## Reference Documents

- `docs/architecture.md` — Full architectural decisions
- `docs/prd.md` — Product requirements (FR1-50, NFR1-38)
- `docs/swiss-lineage.md` — UI specifications and design system
