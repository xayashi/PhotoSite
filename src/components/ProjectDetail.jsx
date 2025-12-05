import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import Lightbox from './Lightbox';
import ContentRenderer from './content/ContentRenderer';
import OptimizedImage from './OptimizedImage';

const ProjectDetail = ({ project, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const containerRef = useRef(null);

  // Check if this is a markdown-based post (has content array)
  const isMarkdownPost = Array.isArray(project.content);

  // For legacy posts, get all images for lightbox
  const legacyImages = !isMarkdownPost && project.images ? project.images : [];
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Helper to get image src (supports both string URLs and objects with metadata)
  const getImageSrc = (image) => typeof image === 'string' ? image : image.src;

  // Lightbox handlers
  const openLightbox = (src) => setLightboxImage(src);
  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxIndex(null);
  };

  // Legacy lightbox navigation
  const openLegacyLightbox = (index) => setLightboxIndex(index);
  const prevImage = () => setLightboxIndex((i) => Math.max(0, i - 1));
  const nextImage = () => setLightboxIndex((i) => Math.min(legacyImages.length - 1, i + 1));

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 600);
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null || lightboxImage !== null) return;

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, lightboxImage]);

  return (
    <div
      className={`fixed inset-0 z-[100] outline-none transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
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
      {/* Navigation - Absolute relative to the fixed wrapper */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 mix-blend-difference">
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

      {/* SCROLLABLE CONTENT CONTAINER */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className="w-full h-full overflow-y-auto scrollbar-hidden"
      >

        {/* SCROLLABLE CONTENT LAYER */}
        <div className="relative z-10">

          {/* HERO COVER PHOTO - Optimized */}
          <div className="h-screen w-full relative bg-black">
            <OptimizedImage
              src={project.cover}
              fullSrc={project.cover}
              width={1920}
              quality={85}
              priority={true}
              alt={project.title}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
              <span className="block text-xs md:text-sm font-mono tracking-[0.3em] mb-4 uppercase text-crimson">
                {project.chapter && `${project.chapter} — `}{project.subtitle}
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

          {/* CONTENT SECTION */}
          <div className="py-16 md:py-24">
            {isMarkdownPost ? (
              // NEW: Markdown-based content
              <ContentRenderer
                blocks={project.content}
                onImageClick={openLightbox}
              />
            ) : (
              // LEGACY: Old format with description + images array
              <>
                {/* About the Series */}
                <div className="text-center px-8 mb-8">
                  <span className="block text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-crimson">
                    About the Series
                  </span>
                </div>

                {/* Description */}
                <div className="px-8 md:px-16 lg:px-32 mb-16">
                  <p className="text-xl md:text-3xl lg:text-4xl font-serif leading-relaxed text-stone-700 max-w-4xl text-center mx-auto">
                    {project.description}
                  </p>
                </div>

                {/* Image Gallery - Optimized */}
                <div className="space-y-16 md:space-y-24">
                  {legacyImages.map((image, index) => (
                    <div key={index} className="flex justify-center px-4 md:px-16">
                      <div className="overflow-hidden rounded-sm shadow-2xl cursor-pointer group max-w-full">
                        <OptimizedImage
                          src={getImageSrc(image)}
                          fullSrc={getImageSrc(image)}
                          width={1200}
                          quality={80}
                          alt={`${project.title} - Image ${index + 1}`}
                          onClick={() => openLegacyLightbox(index)}
                          className="max-h-[80vh]"
                          imgClassName="w-auto h-auto max-w-full max-h-[80vh] object-contain group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* FINAL SECTION: Quote + Footer combined for better centering */}
          <div className="min-h-screen flex flex-col">
            {/* Quote - centered in available space */}
            <div className="flex-grow flex items-center justify-center px-8 py-24">
              <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center max-w-lg">
                "The camera is an instrument that teaches people how to see without a camera."
              </p>
            </div>

            {/* Footer - at bottom */}
            <footer className="py-16 md:py-24 border-t border-stone-200">
              <div className="max-w-md mx-auto text-center px-8">
                {/* Project info */}
                <p className="text-xs font-mono tracking-[0.3em] text-crimson uppercase mb-2">
                  {project.chapter || 'Featured'}
                </p>
                <h3 className="text-2xl md:text-3xl font-serif text-stone-700 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-stone-500 mb-8">
                  {project.subtitle}
                </p>

                {/* Back to top */}
                <button
                  onClick={scrollToTop}
                  className="text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-crimson transition-colors"
                >
                  ↑ Back to Top
                </button>
              </div>
            </footer>
          </div>
        </div>

      </div>


      {/* Lightbox for markdown posts - single image (Portal-based) */}
      {
        lightboxImage && (
          <Lightbox
            image={lightboxImage}
            onClose={closeLightbox}
          />
        )
      }

      {/* Lightbox for legacy posts (Portal-based) */}
      {
        lightboxIndex !== null && legacyImages.length > 0 && (
          <Lightbox
            image={legacyImages[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < legacyImages.length - 1}
          />
        )
      }
    </div >
  );
};

export default ProjectDetail;
