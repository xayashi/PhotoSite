import { useState, useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

const LazyImage = ({ src, alt, className, style, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
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
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center gap-2 text-neutral-500">
          <ImageOff size={24} />
          <span className="text-xs font-mono tracking-wider">Image unavailable</span>
        </div>
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={() => setHasError(true)}
          className={`${className} image-main ${isLoaded ? 'loaded' : ''}`}
          style={style}
        />
      )}
    </div>
  );
};

export default LazyImage;
