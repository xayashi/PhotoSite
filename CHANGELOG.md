# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.1] - 2026-02-07

### Fixed
- Mobile card tap image vanish: CSS selector `[data-card] .card-hover > div` was applying `background-color: #121212` to the VIEW overlay, overriding its semi-transparent `bg-black/40` and making it fully opaque. Changed to `> div:first-child` to target only the OptimizedImage wrapper.
- `<picture>` element in OptimizedImage now uses `display: block` with full width/height, fixing the `height: 100%` resolution chain so images properly fill portrait containers.

## [2.0.0] - 2026-02-06

### Added
- SEO: Open Graph meta tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`)
- SEO: Twitter Card meta tags (`summary_large_image`)
- SEO: `<link rel="canonical">` in `index.html`
- SEO: Dynamic document titles via `useDocumentTitle` hook on all overlays and project detail
- SEO: `siteUrl` added to `siteConfig` for canonical/OG URLs
- Playwright integration tests: `navigation.spec.js` (10 tests), `accessibility.spec.js` (10 tests), `functionality.spec.js` (14 tests)
- Playwright `webServer` config for auto-starting Vite dev server during tests
- Vendor chunk splitting in Vite config (`vendor-react`, `vendor-markdown`, `vendor-icons`)
- `React.lazy()` + `Suspense` code splitting for overlay components (ProjectDetail, AboutOverlay, ContactOverlay, ArchiveOverlay)
- `<link rel="preload">` for font stylesheet and logo in `index.html`
- `npm run optimize-images` script with auto-discovery of content post images
- `CLAUDE.md` agent context file
- `README.md` with quick start and project overview
- `CHANGELOG.md` (this file)
- Extracted `AnimatedTitle`, `LazyImage`, `SwipeHint` into standalone components
- 3 test posts: "Urban Shadows" (gallery + YouTube), "Northern Lights" (gallery only), "City Reflections" (text only)
- Posts span 3 chapters (Season One, Two, Three) with varied dates for sort/grouping testing
- React Router (`react-router-dom`) for client-side routing with shareable URLs
- `src/hooks/useProjects.js` hook — loads and merges markdown posts with legacy projects, module-level cache
- `slug` fields on all 5 legacy projects in `config.js`
- SPA rewrite rule in `vercel.json` for direct URL access
- URL routes: `/project/:slug`, `/about`, `/contact`, `/archive`
- Browser back/forward navigation support
- Share button: Web Share API on mobile, clipboard fallback on desktop with "Link copied" toast

### Fixed
- Detail page final quote now vertically centers in viewport when scrolled to bottom (accounts for footer height)
- Accessibility: `:focus-visible` crimson ring on all interactive elements
- Accessibility: `.sr-only` utility class for screen-reader-only content
- Accessibility: `<main>` landmark wrapping landing content, sr-only `<h1>` with site name
- Accessibility: `aria-label` on main nav
- Accessibility: `role="dialog"`, `aria-modal`, `aria-label` on all overlays and lightbox
- Accessibility: Focus trap (`useFocusTrap` hook) on About, Contact, Archive overlays and Lightbox
- Accessibility: `aria-expanded`/`aria-controls` on Archive chapter toggles
- Accessibility: Semantic `<ul>/<li>` in Archive post grid and ContentGallery
- Accessibility: `aria-label` and keyboard Enter/Space handling on landing page cards
- Accessibility: `aria-label="Close"` on all close buttons
- Accessibility: Film grain disabled under `prefers-reduced-motion`

### Changed
- Lightbox, AboutOverlay, ArchiveOverlay now use `OptimizedImage` instead of raw `<img>` for responsive image serving
- Replaced 3D card tilt hover effect with subtle `scale(1.03)` + box-shadow
- Replaced card skew wobble with parallax depth effect (cards near center scale to 1.0, edge cards to 0.95)
- Refactored `App.jsx` from ~620 lines to ~460 lines
- `App.jsx` overlay state now derived from URL (`useLocation`) instead of React state
- `main.jsx` wraps `<App>` in `<BrowserRouter>`
- Overlay close actions navigate to `/` instead of toggling state
- Archive post selection navigates to `/project/:slug` instead of setting state directly

### Removed
- Orphaned `ScrollContext.js` and `FadeIn.jsx` components
- Unused `gray-matter` dependency
- 3D card tilt effect (`cardTilt` state, `handleCardMouseMove`, perspective transforms)
- Scroll velocity `skewX` distortion on cards

## [1.0.0] - 2026-02-06

### Added
- Horizontal scroll landing page with inertia physics
- 5 legacy photo projects with lightbox viewer
- Markdown content system with custom blocks (`:::gallery`, `:::youtube`)
- About, Contact, and Archive overlay pages
- Custom cursor (desktop)
- Grayscale-to-color reveal on card hover
- Lazy image loading with blur-up placeholder
- Mobile swipe hint with localStorage persistence
- Staggered letter animation for card titles
- Keyboard navigation (arrow keys, Escape)
- Responsive design with mobile optimizations
- Film grain texture overlay
- Kintsugi background pattern
- Custom scrollbar styling
- Progress bar indicator
