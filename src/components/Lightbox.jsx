import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import OptimizedImage from './OptimizedImage';

const Lightbox = ({ image, onClose, onPrev, onNext, hasPrev, hasNext, prevImageSrc, nextImageSrc }) => {
  const trapRef = useFocusTrap(true);

  // Preload adjacent images
  useEffect(() => {
    if (prevImageSrc) {
      const img = new Image();
      img.src = prevImageSrc;
    }
    if (nextImageSrc) {
      const img = new Image();
      img.src = nextImageSrc;
    }
  }, [prevImageSrc, nextImageSrc]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Stabilize onClose for history event listener
  const onCloseRef = React.useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Handle mobile back button
  useEffect(() => {
    // Push a dummy state into the history stack when the lightbox opens
    window.history.pushState({ lightbox: true }, '');

    const handlePopState = () => {
      // If the back button is pressed, close the lightbox instead of navigating away
      onCloseRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If unmounted via UI (e.g. clicking 'X'), manually pop the dummy state to keep history clean
      if (window.history.state?.lightbox) {
        window.history.back();
      }
    };
  }, []);

  // Normalize image data (support both string URLs and objects)
  const src = typeof image === 'string' ? image : image.src;
  const caption = typeof image === 'string' ? null : image.caption;
  const exif = typeof image === 'string' ? null : image.exif;

  // Use portal to render at document.body level (bypasses transformed parents)
  return createPortal(
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        aria-label="Close lightbox"
        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      {/* Navigation arrows */}
      {hasPrev && (
        <button
          aria-label="Previous image"
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all p-2 md:p-3 z-50"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
        </button>
      )}
      {hasNext && (
        <button
          aria-label="Next image"
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all p-2 md:p-3 z-50"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
        </button>
      )}

      {/* Image + Caption container */}
      <div
        className="max-w-[95vw] md:max-w-[90vw] max-h-[90vh] flex flex-col items-center px-4 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <OptimizedImage
          src={src}
          alt={caption || ''}
          className="flex justify-center items-center !w-auto !h-auto max-w-[95vw] md:max-w-[90vw] max-h-[85vh] md:max-h-[80vh]"
          imgClassName="!w-auto !h-auto max-w-full max-h-[85vh] md:max-h-[80vh] rounded-sm"
          objectFit="contain"
          sizes="(max-width: 768px) 95vw, 90vw"
          priority
        />

        {/* Caption & EXIF */}
        {(caption || exif) && (
          <div className="mt-6 text-center max-w-2xl">
            {caption && (
              <p className="text-white/90 font-serif text-lg mb-2">{caption}</p>
            )}
            {exif && (
              <p className="text-white/40 text-sm font-mono tracking-wide">
                {exif.camera && <span>{exif.camera}</span>}
                {exif.lens && <span> · {exif.lens}</span>}
                {exif.settings && <span> · {exif.settings}</span>}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-1.5 rounded-full text-sm font-mono hidden md:block backdrop-blur-sm z-10">
        Press ESC to close · ← → to navigate
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;

