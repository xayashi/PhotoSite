import { useRef, useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { siteConfig } from './config';
import { useProjects } from './hooks/useProjects';
import CustomCursor from './components/CustomCursor';
import LandingCard from './components/LandingCard';
import SwipeHint from './components/SwipeHint';

// Lazy-loaded overlays — only fetched when their routes are active
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const AboutOverlay = lazy(() => import('./components/AboutOverlay'));
const ContactOverlay = lazy(() => import('./components/ContactOverlay'));
const ArchiveOverlay = lazy(() => import('./components/ArchiveOverlay'));

export default function App() {
  const scrollContainerRef = useRef(null);
  // Calculate initial scroll position to center slide 1
  // The container has pl-[50vw] which puts content starting at viewport center
  // Cards have dimensions and margins that we need to account for to center the first card
  const getInitialScroll = () => {
    // Card width uses: clamp(280px, 40vh, 400px) on desktop, clamp(280px, 85vw, 360px) on mobile
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile
      ? Math.max(280, Math.min(window.innerWidth * 0.85, 360))
      : Math.max(280, Math.min(window.innerHeight * 0.4, 400));
    // Card margin uses: clamp(16px, 5vw, 48px) on each side
    const cardMargin = Math.max(16, Math.min(window.innerWidth * 0.05, 48));
    // To center the first card: scroll by (cardWidth / 2) + left margin
    return (cardWidth / 2) + cardMargin;
  };
  const scrollRef = useRef({ current: getInitialScroll(), target: getInitialScroll() });
  const touchRef = useRef({ startX: 0, startY: 0, samples: [], isScrolling: false });
  const cardRefs = useRef({});
  const progressBarRef = useRef(null);
  const currentCardIndexRef = useRef(0);

  // Routing
  const location = useLocation();
  const navigate = useNavigate();
  const { allProjects, landingProjects, chapters, findBySlug } = useProjects();

  // Derive overlay state from URL
  const projectSlug = location.pathname.match(/^\/project\/(.+)/)?.[1];
  const selectedProject = projectSlug ? findBySlug(decodeURIComponent(projectSlug)) : null;
  const showAbout = location.pathname === '/about';
  const showContact = location.pathname === '/contact';
  const showArchive = location.pathname === '/archive';

  // Interaction States
  const [focusedId, setFocusedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Check if any overlay is open
  const isOverlayOpen = location.pathname !== '/';
  const isOverlayOpenRef = useRef(isOverlayOpen);

  // Sync overlay ref so the RAF loop can check without re-registering listeners
  useEffect(() => {
    isOverlayOpenRef.current = isOverlayOpen;
  }, [isOverlayOpen]);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Click outside to deactivate focused card
  const handleBackgroundClick = (e) => {
    // Only deactivate if clicking on the background, not on a card
    if (e.target === e.currentTarget || e.target.closest('[data-scroll-container]')) {
      if (!e.target.closest('[data-card]')) {
        setFocusedId(null);
      }
    }
  };

  useEffect(() => {
    let animationFrame;
    const scroll = scrollRef.current;
    const touch = touchRef.current;

    // Card width uses: clamp(280px, 40vh, 400px) on desktop, clamp(280px, 85vw, 360px) on mobile
    const getCardWidth = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        return Math.max(280, Math.min(window.innerWidth * 0.85, 360));
      }
      return Math.max(280, Math.min(window.innerHeight * 0.4, 400));
    };

    // Card margin uses: clamp(16px, 5vw, 48px) on desktop, 12px on mobile
    const getCardMargin = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return 12;
      return Math.max(16, Math.min(window.innerWidth * 0.05, 48));
    };

    // Minimum scroll keeps the first card centered
    const getMinScroll = () => {
      const cardWidth = getCardWidth();
      const cardMargin = getCardMargin();
      return (cardWidth / 2) + cardMargin;
    };

    const getMaxScroll = () => {
      const cardWidth = getCardWidth();
      const cardMargin = getCardMargin();
      const startPadding = window.innerWidth * 0.5;
      const endSectionWidth = window.innerWidth * 0.5;
      const totalContentWidth = startPadding + (landingProjects.length * (cardWidth + (cardMargin * 2))) + endSectionWidth;
      return Math.max(getMinScroll(), totalContentWidth - window.innerWidth + 100);
    };

    const updateProgress = () => {
      const minScroll = getMinScroll();
      const maxScroll = getMaxScroll();
      const progress = (scroll.current - minScroll) / (maxScroll - minScroll);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      // Direct DOM manipulation for performance
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${clampedProgress})`;
      }

      // Calculate current card index
      const cardWidth = getCardWidth();
      const cardMargin = getCardMargin();
      const cardStep = cardWidth + (cardMargin * 2);
      const index = Math.round((scroll.current - minScroll) / cardStep);
      const newIndex = Math.max(0, Math.min(landingProjects.length - 1, index));

      // Update ref instead of state to avoid re-renders on every scroll movement
      if (currentCardIndexRef.current !== newIndex) {
        currentCardIndexRef.current = newIndex;
      }
    };

    const handleWheel = (e) => {
      if (isOverlayOpenRef.current) return;
      e.preventDefault();

      let delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (e.deltaMode === 1) delta *= 40;
      else if (e.deltaMode === 2) delta *= window.innerHeight;

      delta = Math.max(-150, Math.min(150, delta));

      if (Math.abs(delta) > 5) setFocusedId(null);

      scroll.target += delta * 2;
      scroll.target = Math.max(getMinScroll(), Math.min(scroll.target, getMaxScroll()));
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (isOverlayOpenRef.current) return;

      const cardWidth = getCardWidth();
      const cardMargin = getCardMargin();
      const jumpDistance = cardWidth + (cardMargin * 2);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scroll.target = Math.min(scroll.target + jumpDistance, getMaxScroll());
        setFocusedId(null);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scroll.target = Math.max(scroll.target - jumpDistance, getMinScroll());
        setFocusedId(null);
      } else if (e.key === 'Escape') {
        setFocusedId(null);
      }
    };

    // Touch support
    const handleTouchStart = (e) => {
      if (isOverlayOpenRef.current) return;
      touch.startX = e.touches[0].clientX;
      touch.startY = e.touches[0].clientY;
      touch.samples = [{ x: e.touches[0].clientX, time: Date.now() }];
      touch.isScrolling = false;
    };

    const handleTouchMove = (e) => {
      if (isOverlayOpenRef.current) return;

      const currentX = e.touches[0].clientX;
      const deltaX = touch.startX - currentX;
      const deltaY = touch.startY - e.touches[0].clientY;

      // Commit to horizontal scrolling on first qualifying move
      if (!touch.isScrolling && Math.abs(deltaX) > Math.abs(deltaY)) {
        touch.isScrolling = true;
      }

      if (touch.isScrolling) {
        e.preventDefault();
        scroll.target += deltaX * 1.5;
        scroll.target = Math.max(getMinScroll(), Math.min(scroll.target, getMaxScroll()));
        touch.startX = currentX;

        // Record sample for velocity calculation (keep last 5)
        const now = Date.now();
        touch.samples.push({ x: currentX, time: now });
        if (touch.samples.length > 5) touch.samples.shift();
      }
    };

    const handleTouchEnd = () => {
      if (isOverlayOpenRef.current) return;
      if (!touch.isScrolling || touch.samples.length < 2) return;

      const last = touch.samples[touch.samples.length - 1];
      const first = touch.samples[0];
      const dt = last.time - first.time;

      if (dt > 0 && dt < 300) {
        const velocity = (first.x - last.x) / dt; // px/ms, positive = scrolling right
        if (Math.abs(velocity) > 0.3) {
          scroll.target += velocity * 400;
          scroll.target = Math.max(getMinScroll(), Math.min(scroll.target, getMaxScroll()));
        }
      }

      touch.samples = [];
      touch.isScrolling = false;
    };

    const animate = () => {
      // Skip work when overlays are open but keep the loop warm (no listener teardown)
      if (isOverlayOpenRef.current) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const ease = 0.08;
      const diff = scroll.target - scroll.current;
      scroll.current += diff * ease;

      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transform = `translate3d(-${scroll.current}px, 0, 0)`;

        // Parallax depth: desktop only (>=1024 excludes tablets), math-based position
        if (window.innerWidth >= 1024) {
          const viewportCenter = window.innerWidth / 2;
          const startPadding = window.innerWidth * 0.5;
          const cardWidth = getCardWidth();
          const cardMargin = getCardMargin();
          const cardStep = cardWidth + (cardMargin * 2);

          Object.entries(cardRefs.current).forEach(([, card]) => {
            if (card && !card.dataset.focused) {
              const index = parseInt(card.dataset.index, 10);
              if (isNaN(index)) return;
              // Calculate card center position from scroll offset + known geometry
              const cardLeft = startPadding + (index * cardStep) + cardMargin - scroll.current;
              const cardCenter = cardLeft + cardWidth / 2;
              const distance = Math.abs(cardCenter - viewportCenter) / viewportCenter;
              const clampedDistance = Math.min(distance, 1);
              const scale = 1 - clampedDistance * 0.05;
              card.style.transform = `scale(${scale})`;
            }
          });
        }
      }

      updateProgress();
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    animate();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrame);
    };
  }, [landingProjects.length]);

  const handleCardClick = useCallback((id) => {
    setFocusedId(prev => prev === id ? null : id);
  }, []);

  const handleViewClick = useCallback((e, project) => {
    e.stopPropagation();
    navigate(`/project/${project.slug}`);
    setFocusedId(null);
  }, [navigate]);

  const handleCardMouseEnter = useCallback((id) => {
    setHoveredId(id);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  // Responsive card sizing — computed once
  const cardStyle = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? 'clamp(280px, 85vw, 360px)' : 'clamp(280px, 40vh, 400px)',
      height: isMobile ? 'auto' : 'clamp(400px, 60vh, 600px)',
      aspectRatio: isMobile ? '4/5' : 'unset',
    };
  }, []);

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white font-sans"
      onClick={handleBackgroundClick}
    >
      <h1 className="sr-only">{siteConfig.siteName} — {siteConfig.tagline}</h1>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Swipe Hint for Mobile */}
      {!isOverlayOpen && <SwipeHint />}

      {/* LANDING NAV */}
      <nav aria-label="Main navigation" className={`fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-40 pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {/* Logo - clickable to open About */}
        <button
          onClick={() => navigate('/about')}
          className="pointer-events-auto logo-interactive"
          aria-label="About"
        >
          <img
            src="/logo.png"
            alt={siteConfig.siteName}
            className="h-12 md:h-16 w-auto invert"
          />
        </button>

        {/* Navigation Links - Contact button removed */}
        <div className="flex items-center gap-8 pointer-events-auto">
          {/* Contact button removed - accessible via "Get in Touch" at end of reel */}
        </div>
      </nav>

      {/* Scroll Hint */}
      <div className={`fixed bottom-8 left-8 text-xs tracking-[0.2em] uppercase opacity-40 hidden md:block pointer-events-none transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        Scroll to Explore
      </div>

      {/* HORIZONTAL CONTENT */}
      <main
        ref={scrollContainerRef}
        data-scroll-container
        className={`h-full flex items-center pl-[50vw] will-change-transform ${isOverlayOpen ? 'opacity-0 scale-95 pointer-events-none transition-all duration-700' : 'opacity-100 scale-100'}`}
      >
        {landingProjects.map((item, index) => (
          <LandingCard
            key={item.id}
            item={item}
            index={index}
            isFocused={focusedId === item.id}
            isHovered={hoveredId === item.id}
            isLoaded={isLoaded}
            cardStyle={cardStyle}
            onCardClick={handleCardClick}
            onViewClick={handleViewClick}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            cardRef={el => cardRefs.current[item.id] = el}
          />
        ))}

        {/* End Section - See Additional Seasons */}
        <div
          className={`w-[50vw] flex-shrink-0 flex flex-col items-start justify-center gap-6 pl-12 transition-all duration-1000
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: `${300 + landingProjects.length * 100 + 200}ms` }}
        >
          <div>
            <span className="text-white/30 text-sm tracking-widest uppercase block mb-2">
              See Additional Seasons
            </span>
            <button
              onClick={() => navigate('/archive')}
              className="text-left text-2xl font-serif text-white/50 hover:text-crimson transition-colors"
            >
              Browse the Archive →
            </button>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="text-left text-2xl font-serif text-white/40 hover:text-crimson transition-colors"
          >
            Get in Touch →
          </button>
        </div>
      </main>

      {/* Backdrop — masks landing page during overlay transitions */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-[99] bg-[#121212]" />
      )}

      {/* OVERLAYS — driven by URL, lazy-loaded */}
      <Suspense fallback={null}>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => navigate('/')}
          />
        )}

        {showAbout && (
          <AboutOverlay onClose={() => navigate('/')} />
        )}

        {showContact && (
          <ContactOverlay onClose={() => navigate('/')} />
        )}

        {showArchive && (
          <ArchiveOverlay
            chapters={chapters}
            onClose={() => navigate('/')}
            onSelectPost={(post) => navigate(`/project/${post.slug}`)}
          />
        )}
      </Suspense>
    </div>
  );
}
