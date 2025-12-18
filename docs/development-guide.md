# MyWebClass.org - Development Guide

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Included with Node.js
- **Git**: For version control
- **Code Editor**: VS Code recommended (with Nunjucks, Tailwind CSS extensions)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/[your-username]/MyWebClass.git
cd MyWebClass
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `@11ty/eleventy` - Static site generator
- `@11ty/eleventy-img` - Image optimization
- `tailwindcss` - CSS framework
- `postcss` - CSS processing
- `autoprefixer` - Vendor prefixes
- `cssnano` - CSS minification
- `@sanity/client` - CMS client (for future integration)

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

### 4. Start Development Server

```bash
npm run dev
```

This starts two parallel processes:
1. **Eleventy**: Watches templates, serves on `http://localhost:8080`
2. **Tailwind**: Watches for class changes, recompiles CSS

Visit `http://localhost:8080` to see the site.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:css` | Compile and minify CSS only |
| `npm run build:eleventy` | Build HTML only |
| `npm start` | Start Eleventy server (no CSS watch) |

## Project Structure

```
src/
├── _data/          # Data files (available in templates)
├── _includes/      # Layouts, components, macros
├── pages/          # Page templates
├── scripts/        # Client-side JavaScript
└── styles/         # CSS (Tailwind)
```

## Development Workflow

### Creating a New Page

1. Create a new `.njk` file in `src/pages/`:

```njk
---
layout: layouts/page.njk
title: My New Page
description: Page description for SEO
permalink: /my-page/
---

<p>Page content goes here.</p>
```

2. The page will be available at `/my-page/`

### Using Layouts

**For content pages** (about, legal pages):
```njk
---
layout: layouts/page.njk
---
```

**For custom layouts** (homepage, forms):
```njk
---
layout: layouts/base.njk
---
```

### Using Macros

Import macros at the top of your template:

```njk
{% import "macros/button.njk" as btn %}
{% import "macros/card.njk" as cards %}
{% import "macros/form-field.njk" as field %}
{% import "macros/badge.njk" as badge %}
```

Usage:
```njk
{{ btn.button("Click Me", "/link/", "primary") }}
{{ cards.galleryCard(style) }}
{{ field.input("email", "Email", "email", "you@example.com", true) }}
{{ badge.statusBadge("pending") }}
```

### Working with Data

Data files in `src/_data/` are automatically available in templates:

**`site.js`** → available as `site`:
```njk
<title>{{ site.title }}</title>
<p>{{ site.stats.designStyles }} Design Styles</p>
```

**`designStyles.js`** → available as `designStyles`:
```njk
{% for style in designStyles %}
  <h2>{{ style.title }}</h2>
{% endfor %}
```

**`submissions.js`** → available as `submissions`:
```njk
{% for sub in submissions | filterByStatus("pending") %}
  <p>{{ sub.name }}</p>
{% endfor %}
```

### Custom Filters

Available in `.eleventy.js`:

| Filter | Usage | Description |
|--------|-------|-------------|
| `limit` | `array \| limit(3)` | Limit array to n items |
| `filterByStatus` | `array \| filterByStatus("approved")` | Filter by status field |

### Adding Styles

Edit `src/styles/main.css`:

**For base styles** (global elements):
```css
@layer base {
  a { @apply text-black hover:text-swiss-red; }
}
```

**For component classes**:
```css
@layer components {
  .my-component {
    @apply px-4 py-2 border-2 border-black;
  }
}
```

**For utilities**:
```css
@layer utilities {
  .my-utility { ... }
}
```

### Tailwind Configuration

Edit `tailwind.config.js` to extend the design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'my-color': '#123456',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
};
```

## Adding Client-Side JavaScript

1. Create a new file in `src/scripts/`:

```javascript
// src/scripts/my-feature.js
(function() {
  const element = document.getElementById('my-element');
  if (!element) return;

  // Your code here
})();
```

2. Include in `base.njk` or specific page:

```html
<script src="/scripts/my-feature.js" defer></script>
```

## Testing

### Manual Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works (desktop and mobile)
- [ ] Forms validate correctly
- [ ] Cookie banner appears and functions
- [ ] Links work and external links open in new tabs
- [ ] Responsive design at mobile/tablet/desktop

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Skip link is visible on focus
- [ ] ARIA labels are present
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader compatible

### Performance Testing

Run Lighthouse audit:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for Performance, Accessibility, Best Practices, SEO

Target scores: >90 for all categories

## Build for Production

```bash
npm run build
```

This:
1. Compiles and minifies CSS with cssnano
2. Generates static HTML to `public/`
3. Copies assets and scripts

Output is in `public/` directory.

## Deployment

### Netlify (Required)

This project **requires Netlify** for hosting because the submission form uses a Netlify Function to:
- Upload screenshots to Sanity CDN
- Create submission documents in Sanity CMS
- Send Discord notifications
- Sync to Airtable CRM

GitHub Pages and Vercel cannot be used because they don't support our serverless function architecture.

**Setup:**

1. Connect repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
3. Set environment variables in Netlify Dashboard:
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET`
   - `SANITY_API_TOKEN` (write access)
   - `DISCORD_WEBHOOK_URL` (optional)
   - `AIRTABLE_API_KEY` (optional)
   - `AIRTABLE_BASE_ID` (optional)
4. Configure Sanity webhook to trigger Netlify Build Hook
5. Deploy

### Form Submission Flow

```
User submits form
       ↓
POST to /.netlify/functions/submit-form
       ↓
Netlify Function:
  1. Upload screenshot to Sanity CDN [blocking]
  2. Create gallerySubmission document [blocking]
  3. Send Discord notification [non-blocking]
  4. Sync to Airtable [non-blocking]
       ↓
Return success/error to client
```

**Note:** We use Netlify Functions, NOT Netlify Forms. The `data-netlify="true"` attribute is a fallback only.

## Common Tasks

### Add a New Design Style

1. Edit `src/_data/designStyles.js`:

```javascript
{
  id: 'new-style',
  title: 'New Style Name',
  slug: 'new-style',
  era: '2000s–present',
  thumbnail: '🎨',
  accentColor: '#FF5722',
  description: 'Brief description...',
  origin: 'Detailed history...',
  characteristics: ['Point 1', 'Point 2', 'Point 3'],
  typography: 'Font names',
  colorPalette: ['#000000', '#FFFFFF', '#FF5722'],
  gridSystem: 'Grid description',
  demoUrl: '/demos/new-style.html',
  status: 'approved'
}
```

2. Page is automatically generated at `/styles/new-style/`

### Add a New Submission

1. Edit `src/_data/submissions.js`:

```javascript
{
  id: 4,
  name: 'Student Name',
  email: 'student@example.com',
  style: 'Style Name',
  styleSlug: 'style-slug',
  demoUrl: 'https://...',
  screenshot: '/assets/images/...',
  authenticityExplanation: '...',
  status: 'pending',
  submittedDate: '2025-01-15',
  reviewedDate: null
}
```

### Modify the Navigation

Edit `src/_includes/components/navigation.njk`:

- Desktop links are in the first `<div class="hidden md:flex">`
- Mobile links are in the `#mobile-menu` div
- Update both for consistency

### Update Footer Links

Edit `src/_includes/components/footer.njk`:

- Four columns: Brand, Gallery, Resources, Legal
- Each column has a heading and list of links

## Troubleshooting

### CSS Not Updating

1. Check Tailwind is running: `npm run dev:css`
2. Clear browser cache
3. Verify class is in content files (scanned by Tailwind)

### Template Changes Not Reflected

1. Check Eleventy is running
2. Look for syntax errors in terminal
3. Verify front matter is valid YAML

### Build Fails

1. Check for Nunjucks syntax errors
2. Verify all includes/imports exist
3. Check data file exports are valid

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080
# Kill process
kill -9 <PID>
```

## Code Style Guidelines

### Templates (Nunjucks)

- Use 2-space indentation
- Use double quotes for attributes
- Use meaningful block names
- Comment complex logic

### CSS (Tailwind)

- Use utility classes when possible
- Create components for repeated patterns
- Follow Swiss design tokens
- Use `@apply` for component classes

### JavaScript

- Use IIFE pattern to avoid globals
- Check for element existence before use
- Use `const`/`let`, not `var`
- Add `defer` attribute to script tags

## Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
