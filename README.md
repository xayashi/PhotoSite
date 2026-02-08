# PhotoSite

A personal photography portfolio built as a creative alternative to Instagram. Each project card tells a visual story through a minimal, Japanese-influenced design.

## Features

- Horizontal scroll landing page with inertia physics and parallax depth
- URL-driven overlays (About, Contact, Archive, Project Detail) via React Router
- Markdown content system with custom blocks (`:::gallery`, `:::youtube`)
- Grayscale-to-color card reveal on hover
- Lightbox with prev/next navigation for both legacy and markdown posts
- Share button (Web Share API on mobile, clipboard on desktop)
- Focus traps, ARIA attributes, keyboard navigation (WCAG compliant)
- Dynamic document titles and Open Graph / Twitter Card meta tags
- Code-split overlays via `React.lazy()` + vendor chunk splitting
- Responsive images via `OptimizedImage` with srcset/sizes
- Custom cursor (desktop), swipe hint (mobile)
- 41 Playwright integration tests

## Tech Stack

- **React** 18.3.1
- **Vite** 6.0.3
- **Tailwind CSS** 3.4.16
- **react-router-dom** 7.x
- **Marked** 17.0.1 (markdown rendering)
- **Lucide React** (icons)
- **Playwright** (integration testing)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/xayashi/PhotoSite.git
cd PhotoSite

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
# Run all integration tests (auto-starts dev server)
npx playwright test

# Run with headed browser for debugging
npx playwright test --headed

# Run a specific test file
npx playwright test tests/navigation.spec.js
```

Test suites:
- `navigation.spec.js` — Routing, direct URL access, back/forward, dynamic titles
- `accessibility.spec.js` — Focus traps, ARIA, keyboard navigation, semantic markup
- `functionality.spec.js` — SEO meta tags, share button, lightbox, archive
- `performance.spec.js` — Scroll performance, mobile aspect ratio, re-render checks

## Project Structure

```
src/
  App.jsx              — Main app with horizontal scroll landing
  config.js            — Site configuration and legacy projects
  index.css            — Custom animations and responsive styles
  hooks/               — useProjects, useFocusTrap, useDocumentTitle
  lib/posts.js         — Markdown content loading and parsing
  components/          — React components (overlays, cursor, image handling, content renderers)
tests/                 — Playwright integration tests
scripts/               — Manifest generation, post scaffolding, image optimization
content/
  posts/               — Markdown posts with frontmatter
public/
  images/              — Static images
```

## Content

Projects can be added two ways:

1. **Legacy projects** — Define in `src/config.js` with cover image and image arrays
2. **Markdown posts** — Create a folder in `public/content/posts/<slug>/` with an `index.md` file using frontmatter and custom content blocks (`:::gallery`, `:::youtube`)

See `CONTENT_GUIDE.md` for full authoring instructions.

## Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic deployment. SPA rewrites configured in `vercel.json`.
