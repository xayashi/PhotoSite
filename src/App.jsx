import { useRef, useEffect, useState, useCallback } from 'react';
import { siteConfig, projects } from './config';
import { loadPosts, getAllChapters, LANDING_PAGE_POSTS } from './lib/posts';
import ProjectDetail from './components/ProjectDetail';
import AboutOverlay from './components/AboutOverlay';
import ContactOverlay from './components/ContactOverlay';
import ArchiveOverlay from './components/ArchiveOverlay';
import CustomCursor from './components/CustomCursor';

// Animated Title Component with staggered letter animation
const AnimatedTitle = ({ text, isVisible, delay = 0 }) => {
  return (
    <span className="title-reveal">
      {text.split('').map((letter, index) => (
        <span
          key={index}
          className={`letter-animate ${letter === ' ' ? 'w-2' : ''}`}
          style={{
            animationDelay: isVisible ? `${delay + index * 50}ms` : '0ms',
            animationPlayState: isVisible ? 'running' : 'paused',
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};

// Image with blur-up loading effect
const LazyImage = ({ src, alt, className, style, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div ref={imgRef} className="image-container w-full h-full">
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Main image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`${className} image-main ${isLoaded ? 'loaded' : ''}`}
          style={style}
        />
      )}
    </div>
  );
};



// Swipe Hint for mobile
const SwipeHint = ({ onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeen = localStorage.getItem('swipeHintSeen');
    if (hasSeen) {
      setIsDismissed(true);
    }

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setTimeout(() => {
          setIsDismissed(true);
          localStorage.setItem('swipeHintSeen', 'true');
          onDismiss?.();
        }, 300);
      }
    };

    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('wheel', handleInteraction);

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
    };
  }, [hasInteracted, onDismiss]);

  if (isDismissed) return null;

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center gap-3 text-white/60 ${hasInteracted ? 'swipe-hint dismissed' : 'swipe-hint'}`}>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="text-xs tracking-widest uppercase">Swipe to explore</span>
    </div>
  );
};

export default function App() {
  const scrollContainerRef = useRef(null);
  // Calculate initial scroll position to center slide 1
  // The container has pl-[50vw] which puts content starting at viewport center
  // Cards have dimensions and margins that we need to account for to center the first card
  const getInitialScroll = () => {
    // Card width uses: clamp(280px, 40vh, 400px)
    const cardWidth = Math.max(280, Math.min(window.innerHeight * 0.4, 400));
    // Card margin uses: clamp(16px, 5vw, 48px) on each side
    const cardMargin = Math.max(16, Math.min(window.innerWidth * 0.05, 48));
    // To center the first card: scroll by (cardWidth / 2) + left margin
    return (cardWidth / 2) + cardMargin;
  };
  const scrollRef = useRef({ current: getInitialScroll(), target: getInitialScroll(), skew: 0 });
  const touchRef = useRef({ startX: 0, startY: 0 });
  const cardRefs = useRef({});
  const progressBarRef = useRef(null);

  // Interaction States
  const [focusedId, setFocusedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardTilt, setCardTilt] = useState({});

  // Markdown posts state
  const [markdownPosts, setMarkdownPosts] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Combined projects (hardcoded + markdown posts)
  // Markdown posts appear first (they have dates), followed by legacy projects
  const allProjects = [
    ...markdownPosts.map((post, idx) => ({
      ...post,
      id: `md-${post.slug || idx}`,
    })),
    ...projects.map((p, idx) => ({
      ...p,
      id: p.id || `legacy-${idx}`,
    })),
  ];

  // Check if any overlay is open
  const isOverlayOpen = selectedProject || showAbout || showContact || showArchive;

  // Load markdown posts on mount
  useEffect(() => {
    loadPosts().then(posts => {
      setMarkdownPosts(posts);
      setChapters(getAllChapters(posts));
    });
  }, []);

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

  // Card tilt effect handler
  const handleCardMouseMove = useCallback((e, cardId) => {
    const card = cardRefs.current[cardId];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;

    setCardTilt(prev => ({
      ...prev,
      [cardId]: { rotateX, rotateY }
    }));
  }, []);

  const handleCardMouseLeave = useCallback((cardId) => {
    setCardTilt(prev => ({
      ...prev,
      [cardId]: { rotateX: 0, rotateY: 0 }
    }));
    setHoveredId(null);
  }, []);

  useEffect(() => {
    let animationFrame;
    const scroll = scrollRef.current;
    const touch = touchRef.current;

    // Card width uses: clamp(280px, 40vh, 400px) on desktop, clamp(260px, 80vw, 340px) on mobile
    const getCardWidth = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        return Math.max(260, Math.min(window.innerWidth * 0.8, 340));
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
      const totalContentWidth = startPadding + (allProjects.length * (cardWidth + (cardMargin * 2))) + endSectionWidth;
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
      const newIndex = Math.max(0, Math.min(allProjects.length - 1, index));

      // Only update state if index changed
      setCurrentCardIndex(prev => prev !== newIndex ? newIndex : prev);
    };

    const handleWheel = (e) => {
      if (isOverlayOpen) return;
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
      if (isOverlayOpen) return;

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
      if (isOverlayOpen) return;
      touch.startX = e.touches[0].clientX;
      touch.startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isOverlayOpen) return;

      const deltaX = touch.startX - e.touches[0].clientX;
      const deltaY = touch.startY - e.touches[0].clientY;

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
        // Increased sensitivity for mobile (2.0 instead of 1.5)
        scroll.target += deltaX * 2.0;
        scroll.target = Math.max(getMinScroll(), Math.min(scroll.target, getMaxScroll()));
        touch.startX = e.touches[0].clientX;
      }
    };

    const animate = () => {
      const ease = 0.08;
      const diff = scroll.target - scroll.current;
      scroll.current += diff * ease;

      const velocity = diff * ease;
      const skewTarget = velocity * 0.15;
      scroll.skew += (skewTarget - scroll.skew) * 0.1;

      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transform = `translate3d(-${scroll.current}px, 0, 0)`;

        // Optimization: Skip skew effect on mobile
        if (window.innerWidth >= 768) {
          Object.values(cardRefs.current).forEach(card => {
            if (card && !card.dataset.focused) {
              card.style.transform = `skewX(${-scroll.skew}deg)`;
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
    animate();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [isOverlayOpen, allProjects.length]);

  const handleCardClick = (id) => {
    if (focusedId === id) {
      setFocusedId(null);
    } else {
      setFocusedId(id);
    }
  };

  const handleViewClick = (e, project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setFocusedId(null);
  };

  // Responsive card sizing
  const getCardStyle = () => {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? 'clamp(260px, 80vw, 340px)' : 'clamp(280px, 40vh, 400px)',
      height: isMobile ? 'auto' : 'clamp(400px, 60vh, 600px)',
      aspectRatio: isMobile ? '3/4' : 'unset',
    };
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white font-sans"
      onClick={handleBackgroundClick}
    >

      {/* Custom Cursor */}
      <CustomCursor />



      {/* Swipe Hint for Mobile */}
      {!isOverlayOpen && <SwipeHint />}

      {/* LANDING NAV */}
      <nav className={`fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-40 pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        {/* Logo - clickable to open About */}
        <button
          onClick={() => setShowAbout(true)}
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
      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`h-full flex items-center pl-[50vw] will-change-transform ${isOverlayOpen ? 'opacity-0 scale-95 pointer-events-none transition-all duration-700' : 'opacity-100 scale-100'}`}
      >
        {allProjects.map((item, index) => {
          const isFocused = focusedId === item.id;
          const isHovered = hoveredId === item.id;
          const tilt = cardTilt[item.id] || { rotateX: 0, rotateY: 0 };

          return (
            <div
              key={item.id}
              ref={el => cardRefs.current[item.id] = el}
              data-card
              data-focused={isFocused || undefined}
              onClick={() => handleCardClick(item.id)}
              onMouseMove={(e) => handleCardMouseMove(e, item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => handleCardMouseLeave(item.id)}
              className={`card-3d-container relative flex-shrink-0 cursor-pointer will-change-transform
                ${isFocused ? 'z-20 scale-110 transition-transform duration-500' : 'z-0 scale-100 hover:opacity-100 opacity-70 transition-opacity duration-300'}
                ${isLoaded ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-12'}
              `}
              style={{
                ...getCardStyle(),
                margin: window.innerWidth < 768 ? '0 12px' : '0 clamp(16px, 5vw, 48px)',
                transitionDelay: isLoaded ? '0ms' : `${300 + index * 100}ms`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '800ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Image Container with 3D tilt */}
              <div
                className="card-3d w-full h-full overflow-hidden relative shadow-2xl"
                style={{
                  transform: isHovered && !isFocused
                    ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(10px)`
                    : 'rotateX(0) rotateY(0) translateZ(0)',
                }}
              >
                <LazyImage
                  src={item.cover}
                  alt={item.title}
                  className={`w-full h-full object-cover color-reveal
                      ${isFocused ? 'scale-100 revealed' : 'scale-110'}
                      ${isHovered ? 'revealed' : ''}
                    `}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />

                {/* The "View" Prompt - Only visible when focused */}
                <div
                  className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-500
                  ${isFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <button
                    onClick={(e) => handleViewClick(e, item)}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <span className="text-xs font-bold tracking-widest">VIEW</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Typography with animated title */}
              <div className={`absolute -bottom-16 left-0 transition-all duration-500 ${isFocused ? 'translate-y-4 opacity-100' : 'opacity-60'}`}>
                <p className="text-xs text-white/60 mb-1 font-mono">{item.subtitle}</p>
                <h2 className="text-3xl sm:text-4xl md:text-7xl font-serif text-transparent stroke-text">
                  <AnimatedTitle
                    text={item.title}
                    isVisible={isLoaded}
                    delay={500 + index * 150}
                  />
                </h2>
              </div>

              {/* Background Number */}
              <div className="absolute -top-32 -left-10 text-[10rem] font-bold text-white/5 z-10 select-none font-serif pointer-events-none">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          );
        })}

        {/* End Section - See Additional Seasons */}
        <div
          className={`w-[50vw] flex-shrink-0 flex flex-col items-start justify-center gap-6 pl-12 transition-all duration-1000
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: `${300 + allProjects.length * 100 + 200}ms` }}
        >
          <button
            onClick={() => setShowArchive(true)}
            className="group text-left"
          >
            <span className="text-white/30 text-sm tracking-widest uppercase block mb-2 group-hover:text-crimson transition-colors">
              See Additional Seasons
            </span>
            <span className="text-2xl font-serif text-white/50 group-hover:text-crimson transition-colors">
              Browse the Archive →
            </span>
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="text-left text-2xl font-serif text-white/40 hover:text-crimson transition-colors"
          >
            Get in Touch →
          </button>
        </div>
      </div>

      {/* OVERLAYS */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {showAbout && (
        <AboutOverlay onClose={() => setShowAbout(false)} />
      )}

      {showContact && (
        <ContactOverlay onClose={() => setShowContact(false)} />
      )}

      {showArchive && (
        <ArchiveOverlay
          chapters={chapters}
          onClose={() => setShowArchive(false)}
          onSelectPost={(post) => {
            setShowArchive(false);
            setSelectedProject(post);
          }}
        />
      )}
      {/* Custom Cursor */}
      <CustomCursor />
    </div>
  );
}
