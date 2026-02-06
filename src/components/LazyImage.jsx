import { useState, useRef, useEffect } from 'react';

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

export default LazyImage;
