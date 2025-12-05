# Landing Page UX/UI Improvement Plan

A roadmap for enhancing the PhotoSite landing page with modern, smooth, and enjoyable user experiences.

---

## 🎯 Priority 1: High Impact, Low Effort

### 1. Color Reveal on Hover
**Status:** 🔲 Not Started

**Description:** Transform grayscale images to full color on hover, creating visual delight and reward for user interaction.

**Implementation:**
- Modify card hover state in `App.jsx`
- Remove `grayscale` filter on hover
- Add smooth transition (0.5s ease)
- Consider subtle saturation animation

**Files to modify:**
- `src/App.jsx` (card component styles)

---

### 2. Progress Indicator
**Status:** 🔲 Not Started

**Description:** Add a horizontal progress bar or dot indicators showing the user's position in the gallery.

**Implementation Options:**
- **Option A:** Thin progress bar at bottom of screen
- **Option B:** Dot indicators (one per project)
- **Option C:** Fraction display (e.g., "2/5")

**Files to modify:**
- `src/App.jsx` (new component)
- `src/index.css` (progress bar styles)

---

### 3. Card Hover Lift/Tilt Effect
**Status:** 🔲 Not Started

**Description:** Add a 3D tilt effect on card hover for a premium, tactile feel.

**Implementation:**
- Track mouse position relative to card
- Apply subtle `rotateX` and `rotateY` transforms
- Add `translateZ` for lift effect
- Use `perspective` on parent container

**Files to modify:**
- `src/App.jsx` (add mouse tracking)
- `src/index.css` (3D transform styles)

---

### 4. Image Blur-Up Loading
**Status:** 🔲 Not Started

**Description:** Show a blurred placeholder while images load, then transition to sharp image.

**Implementation:**
- Generate low-res placeholder images (or use CSS blur)
- Track image load state
- Animate from blur to sharp on load
- Add skeleton placeholder for layout stability

**Files to modify:**
- `src/App.jsx` (image loading state)
- `src/index.css` (blur transition styles)

---

## 🎨 Priority 2: Visual Enhancements

### 5. Parallax Depth Effect
**Status:** 🔲 Not Started

**Description:** Add subtle parallax movement to background and cards based on scroll position.

**Implementation:**
- Calculate parallax offset from scroll position
- Apply different movement speeds to layers
- Background moves slower than cards
- Consider mouse-based parallax for desktop

**Files to modify:**
- `src/App.jsx` (parallax calculations)
- Background image component

---

### 6. Typography Animations
**Status:** 🔲 Not Started

**Description:** Staggered letter animations on project titles when cards enter viewport.

**Implementation:**
- Split title text into individual letter spans
- Apply staggered animation delays
- Trigger on card visibility (Intersection Observer)
- Consider using a library like Framer Motion

**Files to modify:**
- `src/App.jsx` (title component)
- `src/index.css` (letter animation keyframes)

---

## ✨ Priority 3: Interaction Improvements

### 7. Magnetic Cursor Effect
**Status:** 🔲 Not Started

**Description:** Cursor is magnetically attracted to interactive elements.

**Implementation:**
- Detect proximity to interactive elements
- Calculate attraction force based on distance
- Apply smooth interpolation to cursor position
- Enhance existing `CustomCursor.jsx`

**Files to modify:**
- `src/components/CustomCursor.jsx`

---

### 8. Snap-to-Card Scrolling (Optional)
**Status:** 🔲 Not Started

**Description:** Cards snap into center alignment when scrolling stops.

**Implementation:**
- Detect scroll end (debounce)
- Calculate nearest card position
- Animate to snapped position
- Make this toggleable for user preference

**Files to modify:**
- `src/App.jsx` (scroll handler)

---

## 📱 Priority 4: Mobile Experience

### 9. Swipe Gesture Hint
**Status:** 🔲 Not Started

**Description:** Animated tutorial hint for mobile users on first visit.

**Implementation:**
- Show animated hand/arrow icon on first load
- Dismiss after first swipe interaction
- Store dismissed state in localStorage

**Files to modify:**
- `src/App.jsx` (new hint component)
- `src/index.css` (hint animation)

---

### 10. Lazy Loading Images
**Status:** 🔲 Not Started

**Description:** Load images progressively as users scroll to them.

**Implementation:**
- Use Intersection Observer API
- Load images when within threshold of viewport
- Preload next 1-2 cards ahead
- Show placeholder until loaded

**Files to modify:**
- `src/App.jsx` (image loading logic)

---

## 📋 Implementation Order

| Phase | Features | Estimated Effort |
|-------|----------|------------------|
| **Phase 1** | Color reveal, Progress indicator | 1-2 hours |
| **Phase 2** | Card tilt effect, Blur-up loading | 2-3 hours |
| **Phase 3** | Parallax, Typography animations | 3-4 hours |
| **Phase 4** | Magnetic cursor, Mobile hints | 2-3 hours |

---

## 🧪 Testing Checklist

- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Tablet landscape/portrait
- [ ] Reduced motion preference respected
- [ ] Performance profiling (60fps maintained)

---

## Notes

- All animations should respect `prefers-reduced-motion` media query
- Performance is critical - maintain 60fps during scroll
- Test on lower-end devices to ensure smooth experience
- Consider A/B testing for major UX changes
