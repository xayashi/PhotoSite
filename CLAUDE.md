# PhotoSite — Agent Context

## Project Vision
Personal alternative to Instagram. Creative storytelling through photography and videography. Each card represents a story. Japanese design elements reflect personality. Minimal, progressive disclosure UX. Light marketing site with contact, socials, and about sections.

## Tech Stack
- **Framework:** React 18.3.1
- **Build:** Vite 6.0.3
- **Styling:** Tailwind CSS 3.4.16
- **Routing:** react-router-dom (BrowserRouter)
- **Markdown:** marked 17.0.1 (custom frontmatter parser, no gray-matter)
- **Icons:** lucide-react
- **Deployment:** Vercel
- **Testing:** Playwright (41 integration tests)

## Architecture
- **Landing page:** Horizontal scroll reel of project cards with smooth inertia scrolling. Only the `activeChapter` cards are shown ("one roll of film at a time").
- **Routing:** URL-driven overlays via react-router-dom. Landing page always mounted; overlays render on top based on URL.
  - `/` — Landing page
  - `/project/:slug` — Project detail overlay
  - `/about` — About overlay (includes "Get in Touch" button → Contact)
  - `/contact` — Contact overlay
  - `/archive` — Archive overlay (all chapters, including legacy projects)
- **Content system:** Markdown files with YAML frontmatter + custom blocks (`:::gallery`, `:::youtube`)
- **Legacy projects:** Hardcoded in `src/config.js` with `slug`, `chapter`, and image arrays
- **Markdown posts:** Loaded from `/content/posts/` via `src/lib/posts.js`
- **Chapter system:** `siteConfig.activeChapter` controls which chapter shows on landing page. `useProjects` hook filters `landingProjects` by active chapter. Archive shows all chapters (markdown + legacy).
- **Project loading:** `useProjects` hook merges markdown posts + legacy projects, builds chapters from all projects, module-level cache prevents duplicate fetches. Returns `{ allProjects, landingProjects, chapters, loading, findBySlug }`.
- **Per-post backgrounds:** Posts can specify `background:` in frontmatter for a custom detail page background. Falls back to `/ProjectBackground.png`.
- **SEO:** OG/Twitter meta tags in `index.html`, dynamic document titles via `useDocumentTitle` hook
- **Code splitting:** `React.lazy()` for all overlay components, vendor chunk splitting in Vite config

## File Structure
```
src/
  App.jsx              — Main app: scroll logic, animation loop, URL-driven overlays
  config.js            — Site config (siteUrl, social, about, activeChapter) + 5 legacy projects (with slugs, chapters)
  index.css            — Custom animations, responsive styles, a11y, markdown styling, mobile perf
  main.jsx             — React entry point (BrowserRouter wrapper)
  hooks/
    useProjects.js     — Loads & merges markdown + legacy projects, filters by activeChapter, builds chapters
    useFocusTrap.js    — Reusable focus trap for modals/overlays
    useDocumentTitle.js — Sets/restores document.title for dynamic page titles
  lib/
    posts.js           — Markdown post loading, frontmatter parsing, custom blocks, background path resolution
  components/
    AnimatedTitle.jsx   — Staggered letter animation for card titles
    LandingCard.jsx     — Memoized card with OptimizedImage, color-reveal, VIEW prompt
    LazyImage.jsx       — Intersection Observer lazy loading (legacy, not used on landing cards)
    SwipeHint.jsx       — Mobile swipe hint with localStorage persistence
    ProjectDetail.jsx   — Full project detail view + dynamic background + lightbox + share button
    AboutOverlay.jsx    — About page overlay (dialog + focus trap + "Get in Touch" → Contact)
    ContactOverlay.jsx  — Contact page overlay (dialog + focus trap)
    ArchiveOverlay.jsx  — Archive/seasons browser overlay (dialog + focus trap, all chapters)
    CustomCursor.jsx    — Custom cursor (desktop only)
    Lightbox.jsx        — Image lightbox component (dialog + focus trap)
    OptimizedImage.jsx  — Responsive image with srcset/sizes, transition-opacity only
    content/
      ContentRenderer.jsx — Routes content blocks to correct renderer
      ContentHTML.jsx     — Renders parsed markdown HTML
      ContentGallery.jsx  — Renders image galleries from :::gallery blocks (semantic <ul>)
      ContentVideo.jsx    — Renders YouTube embeds from :::youtube blocks
tests/
  navigation.spec.js    — Router, direct URL, back/forward, scroll preservation (10 tests)
  accessibility.spec.js — Focus traps, ARIA, keyboard nav, semantic markup (10 tests)
  functionality.spec.js — SEO, share, lightbox, archive, landing page (14 tests)
  performance.spec.js   — Scroll perf, mobile aspect ratio, re-render check (7 tests)
scripts/
  optimize-images.cjs   — Sharp-based image optimization (responsive sizes, WebP, auto-rotate)
```

## Commands
```bash
npm run dev            # Start dev server (Vite)
npm run build          # Production build
npm run preview        # Preview production build
npm run optimize-images # Optimize images with sharp
npx playwright test    # Run integration tests (auto-starts dev server)
```

## Coding Conventions
- Tailwind-first styling; custom CSS only for animations/effects
- Functional components with hooks
- No class components
- Use `OptimizedImage` for all `<img>` tags (not raw `<img>`)
- Use `useDocumentTitle` for dynamic page titles in overlays
- Custom CSS animations in `src/index.css`
- Image visual effects (grayscale + scale) controlled by `.color-reveal` CSS class — do NOT use Tailwind scale utilities on images with `.color-reveal` (causes mobile rendering conflicts)

## Design Constraints (DO NOT VIOLATE)
- **Card proportions:** Do NOT change without asking the user
- **Background:** `#121212` — do not change
- **Accent color:** Crimson `#C41E3A`
- **Fonts:** Cormorant Garamond (serif) + Space Mono (mono) — do not change
- **Aesthetic:** Minimal, clean, Japanese-influenced, dark theme
- **Progressive disclosure:** Content reveals through interaction
- **Custom cursor:** Desktop only, hidden on mobile

## Content System
Posts live in `/content/posts/<slug>/index.md` with frontmatter:
```yaml
---
title: Post Title
subtitle: Location, Year
cover: cover.jpg
date: 2024-01-15
chapter: Chapter Name
description: Brief description
background: bg-texture.jpg    # Optional: custom detail page background
---
```

Custom blocks in markdown:
- `:::gallery` + image paths + `:::` — renders image grid
- `:::youtube <videoId>` — renders YouTube embed

## Chapter System
- `siteConfig.activeChapter` in `config.js` controls which chapter appears on the landing page
- Legacy projects have a `chapter` field (currently all "Season One")
- Markdown posts use `chapter` frontmatter field
- `useProjects` hook returns `landingProjects` (filtered by activeChapter) and `allProjects` (all)
- To rotate chapters: change `activeChapter` value in config.js — old chapter moves to archive automatically
- Archive shows ALL chapters (both markdown and legacy) via `buildAllChapters()`

## Patterns
- Landing scroll uses `requestAnimationFrame` with inertia physics
- Parallax depth: cards scale 0.95-1.0 based on distance from viewport center (desktop only, inside rAF loop)
- Cards have grayscale-to-color reveal on hover/tap (`.color-reveal` + `.revealed` CSS classes with scale(1.1) → scale(1))
- Overlays use fixed positioning with backdrop blur (desktop only via `md:` prefix)
- Overlay state derived from URL via `useLocation()` — no React state for open/close
- Overlay animations: `setVisible(false)` triggers CSS exit, then `onClose()` calls `navigate('/')` after timeout
- `useFocusTrap` hook on all overlays and lightbox — traps Tab, restores focus on close
- `useDocumentTitle` hook on all overlays — sets title on mount, restores on unmount
- Share: `navigator.share()` on mobile, `navigator.clipboard.writeText()` + toast on desktop
- Keyboard navigation: arrow keys scroll, Escape closes project detail, Enter/Space activates cards
- `:focus-visible` crimson ring on all interactive elements
- `prefers-reduced-motion`: disables animations and film grain
- Code splitting: overlays loaded via `React.lazy()` + `<Suspense>`, vendor chunks split in Vite config
- Detail page background: inline div with `project.background` or fallback to `/ProjectBackground.png`
- Mobile: `overscroll-behavior: none` on body prevents elastic viewport shift
- Mobile: backdrop-blur disabled via `md:` prefix on LandingCard overlay

## Known Pitfalls
- **DO NOT use Tailwind scale utilities on `.color-reveal` images.** The `.color-reveal` CSS already handles `transform: scale()` transitions. Adding Tailwind `scale-*` classes creates competing transition declarations that break on mobile (Samsung A16 tested). All image visual effects should be controlled solely through `.color-reveal` / `.revealed` CSS classes.
- **OptimizedImage uses `transition-opacity` only** (not `transition-all`). Other transitions come from `imgClassName`. This prevents transition conflicts with consumer components.
- **Mobile transition override** in index.css uses `!important` — it must include all transition properties needed (currently `filter` and `transform`).
- **Mobile CSS selector `[data-card] .card-hover > div` must use `:first-child`** — without `:first-child`, the selector also targets the VIEW overlay div, applying `background-color: #121212` which overrides the overlay's semi-transparent `bg-black/40`. This makes the overlay fully opaque and hides the image on tap.
- **`<picture>` element in OptimizedImage needs `className="block w-full h-full"`** — `<picture>` defaults to `display: inline`, which breaks the `height: 100%` resolution chain. Without block display, `<img>` `h-full` resolves to `auto` (intrinsic height), causing images to not fill portrait containers.
