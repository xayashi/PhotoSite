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
- **Testing:** Playwright

## Architecture
- **Landing page:** Horizontal scroll reel of project cards with smooth inertia scrolling
- **Routing:** URL-driven overlays via react-router-dom. Landing page always mounted; overlays render on top based on URL.
  - `/` — Landing page
  - `/project/:slug` — Project detail overlay
  - `/about` — About overlay
  - `/contact` — Contact overlay
  - `/archive` — Archive overlay
- **Content system:** Markdown files with YAML frontmatter + custom blocks (`:::gallery`, `:::youtube`)
- **Legacy projects:** Hardcoded in `src/config.js` with `slug` fields and image arrays
- **Markdown posts:** Loaded from `/content/posts/` via `src/lib/posts.js`
- **Project loading:** `useProjects` hook merges markdown posts + legacy projects, module-level cache prevents duplicate fetches

## File Structure
```
src/
  App.jsx              — Main app: scroll logic, animation loop, URL-driven overlays
  config.js            — Site config + 5 legacy projects (with slugs)
  index.css            — Custom animations, responsive styles, a11y, markdown styling
  main.jsx             — React entry point (BrowserRouter wrapper)
  hooks/
    useProjects.js     — Loads & merges markdown + legacy projects, slug-based lookup
    useFocusTrap.js    — Reusable focus trap for modals/overlays
  lib/
    posts.js           — Markdown post loading, frontmatter parsing, custom blocks
  components/
    AnimatedTitle.jsx   — Staggered letter animation for card titles
    LazyImage.jsx       — Intersection Observer lazy loading with blur-up
    SwipeHint.jsx       — Mobile swipe hint with localStorage persistence
    ProjectDetail.jsx   — Full project detail view + lightbox + share button
    AboutOverlay.jsx    — About page overlay (dialog + focus trap)
    ContactOverlay.jsx  — Contact page overlay (dialog + focus trap)
    ArchiveOverlay.jsx  — Archive/seasons browser overlay (dialog + focus trap)
    CustomCursor.jsx    — Custom cursor (desktop only)
    Lightbox.jsx        — Image lightbox component (dialog + focus trap)
    OptimizedImage.jsx  — Responsive image with srcset/sizes
    content/
      ContentRenderer.jsx — Routes content blocks to correct renderer
      ContentHTML.jsx     — Renders parsed markdown HTML
      ContentGallery.jsx  — Renders image galleries from :::gallery blocks (semantic <ul>)
      ContentVideo.jsx    — Renders YouTube embeds from :::youtube blocks
```

## Commands
```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

## Coding Conventions
- Tailwind-first styling; custom CSS only for animations/effects
- Functional components with hooks
- No class components
- Use `OptimizedImage` for all `<img>` tags (not raw `<img>`)
- Custom CSS animations in `src/index.css`

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
---
```

Custom blocks in markdown:
- `:::gallery` + image paths + `:::` — renders image grid
- `:::youtube <videoId>` — renders YouTube embed

## Patterns
- Landing scroll uses `requestAnimationFrame` with inertia physics
- Parallax depth: cards scale 0.95–1.0 based on distance from viewport center (desktop only, inside rAF loop)
- Cards have grayscale-to-color reveal on hover (`.color-reveal`)
- Overlays use fixed positioning with backdrop blur
- Overlay state derived from URL via `useLocation()` — no React state for open/close
- Overlay animations: `setVisible(false)` triggers CSS exit, then `onClose()` calls `navigate('/')` after timeout
- `useFocusTrap` hook on all overlays and lightbox — traps Tab, restores focus on close
- Share: `navigator.share()` on mobile, `navigator.clipboard.writeText()` + toast on desktop
- Keyboard navigation: arrow keys scroll, Escape closes overlays, Enter/Space activates cards
- `:focus-visible` crimson ring on all interactive elements
- `prefers-reduced-motion`: disables animations and film grain
