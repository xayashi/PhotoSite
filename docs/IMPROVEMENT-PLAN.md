# PhotoSite Comprehensive Quality Improvement Plan

## Project Vision

This site is a **personal alternative to Instagram** - a creative outlet for visual storytelling through photography and videography. Each "card" is a story told through images and narrative. The Japanese design elements reflect the creator's personality and soul. The UX philosophy is **minimal and progressive** - reveal through interaction, not information overload.

**Key principles**:
- Landing page stays clean: limited cards visible, older stories archived
- Archive serves as a visual memory timeline
- Light marketing function: contact info, socials, hidden "about me" for potential collaborators
- Every design decision should feel intentional and personal

**Engineering goals**: This project serves as a learning vehicle for SWE best practices - clean code, proper documentation, maintainable architecture, and professional project management.

---

## Context

React 18 + Vite + Tailwind CSS photography portfolio deployed on Vercel. Full audit identified **40+ issues** across performance, accessibility, UX, and functionality. The site has a horizontal-scroll landing page, overlay-based navigation (no router), a markdown content system, and custom animations.

**Priorities**: Performance > Accessibility > UX Polish > Functionality
**Deferred**: PWA (future project)
**Workflow**: Standard sequential agent execution, docs-first approach

**Key decisions**:
- Add React Router (shareable URLs, browser back/forward)
- Share button: Web Share API with clipboard fallback
- Refactor App.jsx (620 lines) into modules
- Remove 3D card hover effect (replace with subtle growth + color reveal)
- Fix detail page final element centering
- Create 2-3 test posts for validation
- Set up full project documentation infrastructure first

---

## Phase -1: Project Documentation Infrastructure (FIRST)

### WP-DOC: Set Up Documentation & Engineering Practices — COMPLETED

**Why**: Establishes project standards, gives agents persistent context via CLAUDE.md, and creates a professional project foundation. Must be done before any code changes.

**Create**:
- `CLAUDE.md` - Agent context file at project root:
  - Project overview and vision (alternative to Instagram, storytelling platform)
  - Tech stack summary (React 18, Vite 6, Tailwind 3.4, Vercel)
  - Architecture notes (horizontal scroll landing, overlay navigation -> routing, markdown content system)
  - File structure map
  - Development commands (`npm run dev`, `npm run build`, `npm run preview`)
  - Coding conventions (Tailwind-first CSS, functional React components, hooks pattern)
  - Design constraints: preserve card proportions, minimal/clean aesthetic, Japanese design elements, crimson accent color, dark theme
  - Content system: how posts work (markdown + frontmatter + custom blocks)
  - Known patterns: `OptimizedImage` for all images, `useFocusTrap` for modals (once created)

- `README.md` - Professional project README:
  - Project description and purpose
  - Tech stack with versions
  - Quick start (clone, install, dev server)
  - Project structure overview
  - Content management guide (link to CONTENT_GUIDE.md)
  - Deployment instructions (Vercel)
  - Contributing guidelines

- `CHANGELOG.md` - Keep running log of all changes:
  - Follow [Keep a Changelog](https://keepachangelog.com/) format
  - Sections: Added, Changed, Fixed, Removed
  - Start with current state as v1.0.0 baseline
  - Each WP completion adds an entry

- Update `MEMORY.md` (Claude auto-memory) with:
  - Project context and vision
  - Key architectural decisions made
  - File structure quick reference
  - Common patterns and gotchas discovered during audit

**Verify**: All docs are accurate, CLAUDE.md is picked up by Claude Code sessions.

---

## Phase 0: Foundation (Sequential - After Docs)

### WP-0: Refactor App.jsx & Cleanup — COMPLETED

**Why**: App.jsx is 620 lines with 3 inline components. Every subsequent WP touches this file - extracting first prevents merge conflicts.

**Create**:
- `src/components/AnimatedTitle.jsx` - Extract lines 11-28 (staggered letter animation)
- `src/components/LazyImage.jsx` - Extract lines 31-78 (IntersectionObserver lazy loading)
- `src/components/SwipeHint.jsx` - Extract lines 83-129 (mobile swipe tutorial)

**Modify**:
- `src/App.jsx` - Remove 3 inline components, add imports. ~620 lines -> ~490 lines
- `src/components/FadeIn.jsx` - Remove unused `ScrollContext` import (line 2) and `useContext` call
- `package.json` - Remove unused `gray-matter` dependency

**Delete**: `src/components/ScrollContext.js` (orphaned, never provided by any parent)

**Verify**: `npm run build` succeeds. Dev server shows identical landing page behavior. Update CHANGELOG.

---

### WP-0B: Remove 3D Card Hover Effect — COMPLETED

**Why**: User finds the 3D tilt effect distracting. Replace with subtle card growth + existing color reveal.

**Additional change**: Also replaced `skewX` scroll velocity wobble with parallax depth effect (cards scale 0.95-1.0 based on distance from viewport center, desktop only).

**IMPORTANT**: Do NOT change card proportions or sizing. Only modify the hover interaction.

**Modify**:
- `src/App.jsx`:
  - Remove `tiltState`/`setTiltState` and all mouse position tracking for tilt (`handleMouseMove` tilt calculation, lines ~379-386)
  - Remove `transform: rotateX/rotateY/translateZ` inline styles from cards
  - Replace with simple CSS scale transition on hover: `hover:scale-[1.03]` (subtle growth)
  - Keep the existing `color-reveal` class and grayscale->color transition untouched
  - Remove `data-cursor` tilt-related attributes if any
- `src/index.css`:
  - Remove `.card-3d-container` perspective styles (lines ~242-258)
  - Remove `.card-3d` transform styles
  - Remove `.card-lift` translateY/translateZ hover
  - Keep `.color-reveal` styles exactly as-is
  - Add simple card hover: smooth `transform: scale(1.03)` with `transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)`
  - Mobile: no scale change (keep current mobile behavior)
- `src/components/CustomCursor.jsx` - Remove any tilt-related magnetic target logic if present

**Verify**: Hover over cards - subtle growth + color appears, no 3D rotation. Card proportions unchanged. Mobile behavior unchanged. Update CHANGELOG.

---

## Phase 1: Core Feature Work (Sequential after Phase 0)

### WP-1C: Create Test Posts

**Why**: Only 1 example post exists. Need varied content to test the full pipeline before making structural changes.

**Create**:
- `public/content/posts/urban-shadows/index.md` - Chapter "Season Two", has `:::gallery` + `:::youtube` blocks
- `public/content/posts/northern-lights/index.md` - Chapter "Season Three", single gallery, different date
- `public/content/posts/city-reflections/index.md` - Chapter "Season One", text-only (no galleries), markdown-only path

**Modify**:
- `public/content/posts/index.json` - Add 3 new entries

**Notes**: Use existing images (`/images/landscape.jpg`, `/images/portrait.jpg`). Vary dates and chapters for sort/grouping testing.

**Verify**: Landing shows multiple posts. Archive shows multiple chapters. Gallery and YouTube embeds render. Update CHANGELOG.

---

### WP-1A: Add React Router

**Why**: Enables shareable URLs, browser back/forward, proper navigation.

**Install**: `react-router-dom`

**Create**:
- `src/hooks/useProjects.js` - Custom hook: loads markdown posts, merges with legacy projects, slug-based lookup

**Modify**:
- `src/main.jsx` - Wrap `<App />` in `<BrowserRouter>`
- `src/App.jsx` - Replace state-based overlays with `<Routes>`:
  - `/` - Landing page carousel (always mounted, hidden when overlay route active)
  - `/project/:slug` - ProjectDetail
  - `/about` - AboutOverlay
  - `/contact` - ContactOverlay
  - `/archive` - ArchiveOverlay
- `src/config.js` - Add `slug` field to each legacy project
- `src/components/ProjectDetail.jsx` - `useParams()` for slug, `navigate('/')` for close
- `src/components/AboutOverlay.jsx` - `navigate('/')` for close
- `src/components/ContactOverlay.jsx` - `navigate('/')` for close
- `src/components/ArchiveOverlay.jsx` - `navigate('/')` for close, post click -> `navigate('/project/${slug}')`
- `vercel.json` - Add SPA rewrite rule

**Verify**: URL changes on navigation. Back button works. Direct URL access works. Scroll position preserved on return to landing. Update CHANGELOG.

---

### WP-1B: Implement Share Button

**Why**: Share button in `ProjectDetail.jsx:87-89` has no `onClick` handler.

**Modify**:
- `src/components/ProjectDetail.jsx`:
  - `handleShare()`: `navigator.share()` on mobile, `navigator.clipboard.writeText()` fallback
  - Toast state for "Link copied!" feedback
  - `onClick={handleShare}` on existing button

**Verify**: Mobile -> native share sheet. Desktop -> clipboard + toast. Update CHANGELOG.

---

### WP-1E: Fix Detail Page Final Element Centering

**Why**: The final quote/element on each project detail page is not properly centered on screen when scrolled to the bottom.

**Modify**:
- `src/components/ProjectDetail.jsx` - The final section (lines 184-189) uses `min-h-screen flex items-center justify-center` but may not account for the nav bar height or footer below it. Fix:
  - Ensure the quote section fills exactly the remaining viewport when you reach the bottom
  - May need `min-h-[calc(100vh-footer-height)]` or flexbox adjustment
  - Test with varying content lengths to ensure it centers in the visible area

**Verify**: Scroll to bottom of any project detail -> final quote element is vertically centered in the visible viewport. Update CHANGELOG.

---

### WP-1D: Accessibility Improvements

**Why**: Multiple WCAG violations: no focus indicators, missing landmarks, no ARIA, no focus traps.

**Create**:
- `src/hooks/useFocusTrap.js` - Reusable focus trap hook for modals/overlays

**Modify**:
- `src/index.css` - `:focus-visible` ring styles, `.sr-only` class, reduced-motion film grain removal
- `src/App.jsx` - `<main>` landmark, sr-only `<h1>`, `aria-label` on nav, keyboard handlers on cards
- `src/components/ArchiveOverlay.jsx` - `aria-expanded`, `aria-controls`, semantic `<ul>/<li>`, `useFocusTrap`
- `src/components/Lightbox.jsx` - `role="dialog"`, `aria-modal`, `useFocusTrap`, button labels
- `src/components/AboutOverlay.jsx` - Dialog pattern, `useFocusTrap`
- `src/components/ContactOverlay.jsx` - Dialog pattern, `useFocusTrap`
- `src/components/ProjectDetail.jsx` - `role="dialog"`, `aria-label`
- `src/components/content/ContentGallery.jsx` - Semantic `<ul>/<li>` list

**Verify**: Full keyboard-only navigation works. Focus rings visible. Tab trapped in overlays. Update CHANGELOG.

---

## Phase 2: Optimization (After Phase 1)

### WP-2A: Performance Optimization

**Why**: Source images oversized (20MB+), no code splitting, no resource preloading.

**Create**:
- `scripts/optimize-images.js` - Node script using `sharp` for responsive image generation

**Modify**:
- `vite.config.js` - Manual chunks for vendor splitting
- `src/App.jsx` - `React.lazy()` + `<Suspense>` for overlay components
- `src/components/Lightbox.jsx` - Use `OptimizedImage` instead of raw `<img>`
- `src/components/AboutOverlay.jsx` - Use `OptimizedImage` with `<picture>`
- `src/components/ArchiveOverlay.jsx` - Use `OptimizedImage` for thumbnails
- `index.html` - `<link rel="preload">` for critical assets
- `package.json` - Add `"optimize-images"` script

**Verify**: Separate vendor chunks in build. Lighthouse score improves. Responsive images at all viewports. Update CHANGELOG.

---

### WP-2B: UX Polish - Lightbox Consistency & Error States

**Why**: Markdown post lightbox has no prev/next (legacy posts do). No error states for failed images.

**Modify**:
- `src/components/content/ContentGallery.jsx` - Pass `(images, index)` to `onImageClick`
- `src/components/content/ContentRenderer.jsx` - Collect all gallery images, pass global index
- `src/components/ProjectDetail.jsx` - Unified lightbox with prev/next for both post types
- `src/components/OptimizedImage.jsx` - Visible fallback UI on `hasError`
- `src/components/LazyImage.jsx` - `onError` handler with fallback display

**Verify**: Markdown gallery lightbox has prev/next. Broken image shows error state. Legacy lightbox unchanged. Update CHANGELOG.

---

## Phase 3: Polish (After Phase 2)

### WP-3A: SEO & Meta Tags

**Why**: No Open Graph tags, generic title, no dynamic page titles.

**Create**:
- `src/hooks/useDocumentTitle.js` - Set/reset document title hook

**Modify**:
- `index.html` - OG tags, canonical URL
- All overlay/detail components - Dynamic `document.title` via hook

**Verify**: Titles update on navigation. OG tags in source. Update CHANGELOG.

---

### WP-3B: Integration Testing & Functional Verification

**Why**: Validate everything works together end-to-end.

**Create**:
- `tests/navigation.spec.js` - Router, direct URL, back/forward, scroll preservation
- `tests/accessibility.spec.js` - Focus, tab order, focus traps, ARIA
- `tests/functionality.spec.js` - Share, posts, archive, lightbox

**Modify**:
- `tests/performance.spec.js` - Update selectors if changed

**Verify**: `npx playwright test` passes. Update CHANGELOG.

---

### WP-3C: Final Documentation Update

**Why**: Ensure all docs reflect the completed state of the project.

**Modify**:
- `CLAUDE.md` - Update with all new patterns, hooks, and architecture changes
- `README.md` - Update with final feature list, architecture diagram
- `CHANGELOG.md` - Finalize all entries
- `CONTENT_GUIDE.md` - Update if content system changed
- `UX-IMPROVEMENTS.md` - Update status of all items
- `MEMORY.md` - Final lessons learned and project state

**Verify**: All documentation is accurate and complete.

---

## Execution Order (Linear, Safe)

```
WP-DOC (Documentation)     <- DONE
  |
WP-0  (Refactor App.jsx)   <- DONE
WP-0B (Remove 3D hover)    <- DONE (also replaced skew wobble with parallax depth)
  |
WP-1C (Test Posts)          <- NEXT: enables testing of subsequent changes
WP-1A (React Router)        <- Architecture: biggest structural change
WP-1B (Share Button)        <- Feature: small, builds on routing
WP-1E (Detail centering)    <- UX fix: small, isolated
WP-1D (Accessibility)       <- Quality: touches many files
  |
WP-2A (Performance)         <- Optimization: code splitting, images
WP-2B (UX Polish)           <- Quality: lightbox, error states
  |
WP-3A (SEO)                 <- Polish: meta tags, titles
WP-3B (Testing)             <- Validation: end-to-end
WP-3C (Final Docs)          <- Close out: documentation
```

---

## Future Work (Deferred)

- **PWA**: Service worker, manifest.json, offline support
- **Contact form**: Replace email link with form (e.g., Formspree)
- **Font subsetting**: Reduce Google Fonts payload
- **Snap-to-card scrolling**: Optional from UX-IMPROVEMENTS.md
- **Performance monitoring**: Lighthouse CI, budgets
- **Separate photography marketing site**: Future project

---

## Design Constraints (Do Not Violate)

- **Card proportions**: Do NOT change card sizing/aspect ratios without checking with user
- **Aesthetic**: Minimal, clean, Japanese-influenced, dark theme with crimson accents
- **Progressive disclosure**: Reveal through interaction, not clutter
- **Font families**: Cormorant Garamond (serif) + Space Mono (mono) - do not change
- **Color palette**: Crimson (#C41E3A) primary, dark (#121212) background - do not change

---

## Critical Files Reference

| File | Lines | Touched By |
|------|-------|------------|
| `src/App.jsx` | ~460 | WP-0, WP-0B, WP-1A, WP-1D, WP-2A |
| `src/components/ProjectDetail.jsx` | 247 | WP-1A, WP-1B, WP-1D, WP-1E, WP-2B, WP-3A |
| `src/components/Lightbox.jsx` | 92 | WP-1D, WP-2A, WP-2B |
| `src/components/ArchiveOverlay.jsx` | 136 | WP-1A, WP-1D, WP-2A, WP-3A |
| `src/components/AboutOverlay.jsx` | 79 | WP-1A, WP-1D, WP-2A, WP-3A |
| `src/components/ContactOverlay.jsx` | 108 | WP-1A, WP-1D, WP-3A |
| `src/index.css` | 528 | WP-0B, WP-1D, WP-2A |
| `index.html` | 20 | WP-2A, WP-3A |
| `vite.config.js` | ~10 | WP-2A |
| `vercel.json` | ~20 | WP-1A |
