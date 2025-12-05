import { useRef, useEffect, useState } from 'react';
import { siteConfig, projects } from './config';
import ProjectDetail from './components/ProjectDetail';
import AboutOverlay from './components/AboutOverlay';
import ContactOverlay from './components/ContactOverlay';
import ArchiveOverlay from './components/ArchiveOverlay';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const scrollContainerRef = useRef(null);
  // Calculate initial scroll position to center slide 1
  const getInitialScroll = () => {
    const cardWidth = Math.min(window.innerHeight * 0.4, window.innerWidth * 0.35);
    const startPadding = window.innerWidth * 0.5;
    const viewportCenter = window.innerWidth / 2;
    const cardCenter = startPadding + (cardWidth / 2);
    return Math.max(0, cardCenter - viewportCenter);
  };
  const scrollRef = useRef({ current: getInitialScroll(), target: getInitialScroll(), skew: 0 });
  const touchRef = useRef({ startX: 0, startY: 0 });

  // Interaction States
  const [focusedId, setFocusedId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if any overlay is open
  const isOverlayOpen = selectedProject || showAbout || showContact || showArchive;

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

    const getCardWidth = () => Math.min(window.innerHeight * 0.4, window.innerWidth * 0.35);

    const getMaxScroll = () => {
      const cardWidth = getCardWidth();
      const cardMargin = Math.min(96, window.innerWidth * 0.05);
      const startPadding = window.innerWidth * 0.5;
      const endSectionWidth = window.innerWidth * 0.5;
      const totalContentWidth = startPadding + (projects.length * (cardWidth + cardMargin)) + endSectionWidth;
      return Math.max(0, totalContentWidth - window.innerWidth + 100);
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
      scroll.target = Math.max(0, Math.min(scroll.target, getMaxScroll()));
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (isOverlayOpen) return;

      const cardWidth = getCardWidth();
      const cardMargin = Math.min(96, window.innerWidth * 0.05);
      const jumpDistance = cardWidth + cardMargin;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scroll.target = Math.min(scroll.target + jumpDistance, getMaxScroll());
        setFocusedId(null);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scroll.target = Math.max(scroll.target - jumpDistance, 0);
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
        scroll.target += deltaX * 1.5;
        scroll.target = Math.max(0, Math.min(scroll.target, getMaxScroll()));
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

        const cards = scrollContainerRef.current.querySelectorAll('[data-card]');
        cards.forEach(card => {
          if (!card.dataset.focused) {
            card.style.transform = `skewX(${-scroll.skew}deg)`;
          }
        });
      }

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
  }, [isOverlayOpen]);

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
    return {
      width: 'clamp(280px, 40vh, 400px)',
      height: 'clamp(400px, 60vh, 600px)',
    };
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white font-sans"
      onClick={handleBackgroundClick}
    >

      {/* Custom Cursor */}
      <CustomCursor />

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
        {projects.map((item, index) => {
          const isFocused = focusedId === item.id;

          return (
            <div
              key={item.id}
              data-card
              data-focused={isFocused || undefined}
              onClick={() => handleCardClick(item.id)}
              className={`relative flex-shrink-0 cursor-pointer will-change-transform
                ${isFocused ? 'z-20 scale-110 transition-transform duration-500' : 'z-0 scale-100 hover:opacity-100 opacity-70 transition-opacity duration-300'}
                ${isLoaded ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-12'}
              `}
              style={{
                ...getCardStyle(),
                margin: '0 clamp(16px, 5vw, 48px)',
                transitionDelay: isLoaded ? '0ms' : `${300 + index * 100}ms`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '800ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Image Container */}
              <div className="w-full h-full overflow-hidden relative shadow-2xl">
                <img
                  src={item.cover}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-all duration-700 
                    ${isFocused ? 'scale-100 grayscale' : 'scale-110 grayscale'}
                  `}
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

              {/* Typography */}
              <div className={`absolute -bottom-16 left-0 transition-all duration-500 ${isFocused ? 'translate-y-4 opacity-100' : 'opacity-60'}`}>
                <p className="text-xs text-white/60 mb-1 font-mono">{item.subtitle}</p>
                <h2 className="text-5xl md:text-7xl font-serif text-transparent stroke-text">
                  {item.title}
                </h2>
              </div>

              {/* Background Number */}
              <div className="absolute -top-32 -left-10 text-[10rem] font-bold text-white/5 z-10 select-none font-serif pointer-events-none">
                0{item.id}
              </div>
            </div>
          );
        })}

        {/* End Section - See Additional Seasons */}
        <div
          className={`w-[50vw] flex-shrink-0 flex flex-col items-start justify-center gap-6 pl-12 transition-all duration-1000
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: `${300 + projects.length * 100 + 200}ms` }}
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
        <ArchiveOverlay onClose={() => setShowArchive(false)} />
      )}
    </div>
  );
}
