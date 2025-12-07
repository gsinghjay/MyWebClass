# MyWebClass.org

[![CI/CD Pipeline](https://github.com/gsinghjay/MyWebClass/actions/workflows/ci.yml/badge.svg)](https://github.com/gsinghjay/MyWebClass/actions/workflows/ci.yml)
[![Sanity Content Rebuild](https://github.com/gsinghjay/MyWebClass/actions/workflows/sanity-rebuild.yml/badge.svg)](https://github.com/gsinghjay/MyWebClass/actions/workflows/sanity-rebuild.yml)

A design education platform built with Eleventy, Nunjucks, Tailwind CSS, and Sanity CMS. Teaches design history through authentic, fully-implemented website demos.

## Project Overview

MyWebClass.org showcases iconic design movements (Swiss International Style, Bauhaus, Brutalism, etc.) through real, functional website implementations. Students can submit their own demos for instructor review and publication.

## Tech Stack

- **Static Site Generator**: Eleventy (11ty) v3.1.2
- **Templating**: Nunjucks
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity (headless CMS)
- **Hosting**: Netlify/Vercel
- **Design System**: Swiss International Style

## Project Structure

```
project/
├── src/
│   ├── _includes/
│   │   ├── layouts/         # Base layouts
│   │   ├── components/      # Reusable components
│   │   └── macros/          # Nunjucks macros
│   ├── _data/               # Data files (Sanity integration)
│   ├── pages/               # Page templates
│   ├── styles/              # CSS (Tailwind)
│   ├── scripts/             # Client-side JavaScript
│   └── assets/              # Images, fonts
├── public/                  # Build output
├── .eleventy.js             # Eleventy config
├── tailwind.config.js       # Tailwind config
└── postcss.config.js        # PostCSS config
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start Eleventy server

## Design System

Built following Swiss International Style principles:

- **Colors**: Black (#000), White (#FFF), Swiss Red (#E53935)
- **Typography**: Inter font family, systematic type scale
- **Spacing**: 8px base unit system
- **Grid**: 12-column CSS Grid
- **Borders**: 2px solid borders
- **Accessibility**: WCAG AA compliance

## Features

### For Students
- Browse gallery of design style demos
- Submit own design implementations
- Learn through authentic examples

### For Instructors
- Review submitted demos
- Approve/reject submissions
- Manage gallery content

### Technical Features
- Responsive design (mobile-first)
- GDPR-compliant cookie consent
- Conditional analytics loading
- Accessible (WCAG AA)
- Performance optimized
- SEO friendly

## Pages

- **Homepage** (`/`) - Hero, stats, gallery preview, how it works
- **Gallery Detail** (`/styles/[slug]/`) - Individual design style pages
- **Submit** (`/submit/`) - Demo submission form
- **Admin Dashboard** (`/admin/`) - Instructor review panel
- **About** (`/about/`) - Platform information
- **Legal** - Privacy Policy, Terms of Service, Cookie Policy

## Data Sources

Currently using mock data in `src/_data/`. To integrate with Sanity CMS:

1. Set up Sanity project
2. Configure Sanity client in `src/_data/sanity.js`
3. Update data files to fetch from Sanity
4. Set environment variables for Sanity credentials

## Deployment

### Netlify

1. Connect Git repository
2. Set build command: `npm run build`
3. Set publish directory: `public`
4. Add environment variables for Sanity

### Vercel

1. Import project from Git
2. Set framework preset to "Other"
3. Set build command: `npm run build`
4. Set output directory: `public`

## License

MIT License - NJIT S373 Project

## Contact

Questions? Contact info@mywebclass.org
