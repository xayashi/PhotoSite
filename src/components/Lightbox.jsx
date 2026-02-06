import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import OptimizedImage from './OptimizedImage';

const Lightbox = ({ image, onClose, onPrev, onNext, hasPrev, hasNext }) => {
  const trapRef = useFocusTrap(true);

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
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-2"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft size={48} />
        </button>
      )}
      {hasNext && (
        <button
          aria-label="Next image"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-2"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* Image + Caption container */}
      <div 
        className="max-w-[90vw] max-h-[90vh] flex flex-col items-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <OptimizedImage
          src={src}
          alt={caption || ''}
          className="max-w-full max-h-[75vh]"
          imgClassName="!object-contain rounded-sm"
          sizes="90vw"
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-mono">
        Press ESC to close · ← → to navigate
      </div>
    </div>,
    document.body
  );
};

export default Lightbox;

