# Landing Page UX/UI Improvement Plan

A roadmap for enhancing the PhotoSite landing page with modern, smooth, and enjoyable user experiences.

---

## 🎯 Priority 1: High Impact, Low Effort

### 1. Color Reveal on Hover
**Status:** ✅ Implemented

**Description:** Transform grayscale images to full color on hover, creating visual delight and reward for user interaction.

**Implementation:**
- Added `.color-reveal` CSS class with grayscale transition
- Cards reveal color on hover via the `revealed` class
- Smooth 0.6s cubic-bezier transition

**Files modified:**
- `src/App.jsx` - Applied `color-reveal` class to images
- `src/index.css` - Added color reveal styles

---

### 2. Progress Indicator
**Status:** ✅ Implemented

**Description:** Horizontal progress bar and dot indicators showing the user's position in the gallery.

**Implementation:**
- Progress bar at bottom of screen (gradient crimson)
- Dot indicators on right side (active/passed states)
- Real-time scroll position tracking

**Files modified:**
- `src/App.jsx` - Added `ProgressIndicator` component
- `src/index.css` - Added progress bar and dot styles

---

### 3. Card Hover Effect
**Status:** ✅ Implemented (Revised)

**Description:** Originally a 3D tilt effect, later replaced with subtle scale + color reveal. The 3D tilt was found to be distracting.

**Current implementation:**
- `scale(1.03)` on hover with smooth cubic-bezier transition
- Grayscale-to-color reveal on hover (`.color-reveal`)
- No 3D rotation or perspective transforms

**Files modified:**
- `src/App.jsx` - Scale on hover, color-reveal class
- `src/index.css` - `.card-hover` scale transition, `.color-reveal` styles

---

### 4. Image Blur-Up Loading
**Status:** ✅ Implemented

**Description:** Show skeleton placeholder while images load, then fade in smoothly.

**Implementation:**
- `LazyImage` component with Intersection Observer
- Skeleton shimmer animation while loading
- Fade-in transition when loaded
- Lazy loading - only loads images when near viewport

**Files modified:**
- `src/App.jsx` - Added `LazyImage` component
- `src/index.css` - Added skeleton shimmer and loading styles

---

## 🎨 Priority 2: Visual Enhancements

### 5. Typography Animations
**Status:** ✅ Implemented

**Description:** Staggered letter animations on project titles when cards enter viewport.

**Implementation:**
- `AnimatedTitle` component splits text into letters
- Each letter has staggered animation delay
- 3D perspective with rotateX transition
- Respects reduced motion preferences

**Files modified:**
- `src/App.jsx` - Added `AnimatedTitle` component
- `src/index.css` - Added `.letter-animate` and `.title-reveal` styles

---

### 6. Parallax Depth Effect
**Status:** ✅ Implemented

**Description:** Cards scale based on distance from viewport center for a depth-of-field feel.

**Implementation:**
- Cards near viewport center scale to 1.0, edge cards scale to 0.95
- Runs inside the existing `requestAnimationFrame` loop (no extra cost)
- Desktop only (disabled on mobile)

**Files modified:**
- `src/App.jsx` - Parallax depth calculation in animation loop

---

## ✨ Priority 3: Interaction Improvements

### 7. Magnetic Cursor Effect
**Status:** ✅ Implemented

**Description:** Cursor is magnetically attracted to interactive elements.

**Implementation:**
- Detects proximity to buttons, cards, and `.magnetic-target` elements
- Subtle pull toward element centers
- Dual cursor design (outer ring + inner dot)
- Scale feedback on hover and click
- Smooth lerp-based animation

**Files modified:**
- `src/components/CustomCursor.jsx` - Complete rewrite with magnetic effect
- `src/index.css` - Added `.magnetic-target` class

---

### 8. Snap-to-Card Scrolling
**Status:** 🔲 Not Started (Optional feature)

**Note:** Kept as optional - current smooth scroll feels natural.

---

## 📱 Priority 4: Mobile Experience

### 9. Swipe Gesture Hint
**Status:** ✅ Implemented

**Description:** Animated tutorial hint for mobile users on first visit.

**Implementation:**
- `SwipeHint` component with animated arrow
- Dismisses on first touch/scroll interaction
- Persists dismissed state in localStorage
- Only shows on mobile devices

**Files modified:**
- `src/App.jsx` - Added `SwipeHint` component
- `src/index.css` - Added `.swipe-hint` animation

---

### 10. Lazy Loading Images
**Status:** ✅ Implemented

**Description:** Load images progressively as users scroll to them.

**Implementation:**
- Intersection Observer with 100px root margin
- Images only load when near viewport
- Skeleton placeholder until loaded

**Files modified:**
- `src/App.jsx` - `LazyImage` component with lazy loading

---

## ✅ Implementation Summary

| Feature | Status | Impact |
|---------|--------|--------|
| Color reveal on hover | ✅ Done | High |
| Progress indicator | ✅ Done | High |
| Card hover (scale + color) | ✅ Done (revised) | High |
| Image blur-up loading | ✅ Done | High |
| Typography animations | ✅ Done | Medium |
| Magnetic cursor | ✅ Done | Medium |
| Swipe hint (mobile) | ✅ Done | Medium |
| Lazy loading images | ✅ Done | High |
| Parallax depth effect | ✅ Done | Medium |
| Snap scrolling | ⏭️ Skipped | Low |

---

## Testing

37 Playwright integration tests covering navigation, accessibility, functionality, and performance. Run with `npx playwright test`.

- [x] Desktop Chrome (Playwright)
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Tablet landscape/portrait
- [x] Reduced motion preference respected
- [x] Performance profiling (no long tasks during scroll)

---

## Accessibility Features

- ✅ Reduced motion media query support
- ✅ Keyboard navigation (arrow keys, Enter/Space, Escape)
- ✅ ARIA attributes on all overlays, dialogs, and interactive elements
- ✅ Focus traps on all overlays and lightbox
- ✅ `:focus-visible` crimson rings on all interactive elements
- ✅ Semantic markup (`<main>`, `<nav>`, `<ul>/<li>`, sr-only `<h1>`)
- ✅ Dynamic document titles for screen readers
