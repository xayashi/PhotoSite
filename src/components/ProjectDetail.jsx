import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import Lightbox from './Lightbox';

// Hook to track element visibility for scroll-triggered animations
const useScrollFade = (threshold = 0.3) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin: '-10% 0px -10% 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Reusable fade-in section component
const FadeSection = ({ children, className = '' }) => {
  const [ref, isVisible] = useScrollFade(0.2);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-16'
        } ${className}`}
    >
      {children}
    </div>
  );
};

const ProjectDetail = ({ project, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const containerRef = useRef(null);

  // Helper to get image src (supports both string URLs and objects with metadata)
  const getImageSrc = (image) => typeof image === 'string' ? image : image.src;

  // Lightbox navigation
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => Math.max(0, i - 1));
  const nextImage = () => setLightboxIndex((i) => Math.min(project.images.length - 1, i + 1));

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    // Focus the container for keyboard events
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 600);
  };

  // Keyboard event handler (disabled when lightbox is open)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't handle keys when lightbox is open (it has its own handlers)
      if (lightboxIndex !== null) return;

      const container = containerRef.current;
      if (!container) return;

      const scrollAmount = 100;
      const largeScrollAmount = window.innerHeight * 0.8;

      switch (e.key) {
        // Close handlers
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          handleClose();
          break;

        // Scroll handlers
        case 'ArrowDown':
          e.preventDefault();
          container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          break;
        case 'ArrowUp':
          e.preventDefault();
          container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
          break;
        case 'PageDown':
        case ' ': // Spacebar
          e.preventDefault();
          container.scrollBy({ top: largeScrollAmount, behavior: 'smooth' });
          break;
        case 'PageUp':
          e.preventDefault();
          container.scrollBy({ top: -largeScrollAmount, behavior: 'smooth' });
          break;
        case 'Home':
          e.preventDefault();
          container.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          e.preventDefault();
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={`fixed inset-0 z-[100] overflow-y-auto outline-none scrollbar-hidden transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
      ${visible ? 'translate-y-0 opacity-100' : 'translate-y-[100vh] opacity-0'}`}
      style={{
        backgroundColor: '#f5f3ed',
        backgroundImage: `url('/ProjectBackground.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Navigation - Fixed */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 mix-blend-difference">
        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-crimson transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-crimson transition-colors"
        >
          <Share2 size={16} /> Share
        </button>
      </nav>

      {/* SCROLLABLE CONTENT LAYER */}
      <div className="relative z-10 min-h-screen">

        {/* HERO COVER PHOTO - Full screen, immediate impact */}
        <div className="h-screen w-full relative bg-black">
          <img
            src={project.cover}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

          {/* Title overlay on the cover photo */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
            <span className="block text-xs md:text-sm font-mono tracking-[0.3em] mb-4 uppercase text-crimson">
              Project 0{project.id} — {project.subtitle}
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-medium leading-none">
              {project.title}
            </h1>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-white/40"></div>
          </div>
        </div>

        {/* Spacer to reveal ink wash background */}
        <div className="h-[15vh]" />

        {/* About the Series - Section title */}
        <FadeSection className="flex flex-col items-center justify-center min-h-[10vh] text-center px-8 mb-4">
          <span className="block text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-crimson">
            About the Series
          </span>
        </FadeSection>

        {/* Description */}
        <FadeSection className="min-h-[20vh] flex items-center justify-center px-8 md:px-16 lg:px-32 mb-8">
          <p className="text-xl md:text-3xl lg:text-4xl font-serif leading-relaxed text-stone-700 max-w-4xl text-center">
            {project.description}
          </p>
        </FadeSection>

        {/* Image Gallery - Each image fades in separately */}
        <div className="space-y-[15vh] py-16">
          {project.images.map((image, index) => (
            <FadeSection key={index} className="flex justify-center px-4 md:px-16">
              <div
                className="overflow-hidden rounded-sm shadow-2xl cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={getImageSrc(image)}
                  className="w-auto h-auto max-w-full max-h-[80vh] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  alt={`${project.title} - Image ${index + 1}`}
                />
              </div>
            </FadeSection>
          ))}
        </div>

        {/* Closing Quote */}
        <FadeSection className="min-h-[30vh] flex items-center justify-center px-8">
          <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center max-w-lg">
            "The camera is an instrument that teaches people how to see without a camera."
          </p>
        </FadeSection>

        {/* Footer */}
        <FadeSection className="py-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
            {project.title} — {project.subtitle}
          </p>
        </FadeSection>

        {/* Bottom spacer */}
        <div className="h-[10vh]" />
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          image={project.images[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < project.images.length - 1}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
