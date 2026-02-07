import React, { useState, useMemo } from 'react';
import { Maximize2 } from 'lucide-react';

// Module-level constants — stable references, computed once
const IS_VERCEL = typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1');

const DEFAULT_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2400];

/**
 * OptimizedImage component with responsive image support
 * - Serves multiple image sizes based on viewport (srcset)
 * - Uses modern formats (WebP) with fallbacks (JPG)
 * - On Vercel: Uses /_vercel/image endpoint for optimization
 * - Locally: Uses pre-generated optimized images
 */
const OptimizedImage = ({
    src,
    alt = '',
    width = 800,
    quality = 75,
    className = '',
    imgClassName = '',
    onClick,
    priority = false,
    fullSrc,
    style = {},
    sizes = '100vw', // Responsive sizing hint
    widths = DEFAULT_WIDTHS, // Available widths
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Extract image name and path for optimized images
    const imageInfo = useMemo(() => {
        if (!src) return null;
        const match = src.match(/\/([^/]+)\.(jpg|jpeg|png)$/i);
        if (!match) return null;
        const [, name, ext] = match;
        return { name, ext };
    }, [src]);

    // Memoize srcSet and optimizedSrc to avoid recalculating on every render
    const optimizedSrc = useMemo(() => {
        if (!src) return '';
        if (IS_VERCEL && !hasError) {
            const params = new URLSearchParams({
                url: src,
                w: width.toString(),
                q: quality.toString(),
            });
            return `/_vercel/image?${params.toString()}`;
        }
        if (imageInfo && !hasError) {
            return `/images/optimized/${imageInfo.name}/${imageInfo.name}-1080w.jpg`;
        }
        return src;
    }, [src, width, quality, imageInfo, hasError]);

    const webpSrcSet = useMemo(() => {
        if (!src) return '';
        if (IS_VERCEL) {
            return widths
                .map(w => `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality} ${w}w`)
                .join(', ');
        }
        if (imageInfo && !hasError) {
            const basePath = `/images/optimized/${imageInfo.name}`;
            return widths
                .map(w => `${basePath}/${imageInfo.name}-${w}w.webp ${w}w`)
                .join(', ');
        }
        return '';
    }, [src, widths, quality, imageInfo, hasError]);

    const jpgSrcSet = useMemo(() => {
        if (!src) return '';
        if (IS_VERCEL) {
            return widths
                .map(w => `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality} ${w}w`)
                .join(', ');
        }
        if (imageInfo && !hasError) {
            const basePath = `/images/optimized/${imageInfo.name}`;
            return widths
                .map(w => `${basePath}/${imageInfo.name}-${w}w.jpg ${w}w`)
                .join(', ');
        }
        return '';
    }, [src, widths, quality, imageInfo, hasError]);

    return (
        <div
            className={`relative overflow-hidden group/image ${className} ${onClick ? 'cursor-pointer' : ''}`}
            style={style}
            onClick={onClick}
            data-cursor={onClick ? "click" : undefined}
        >
            {/* Skeleton loader */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-stone-200 animate-pulse" />
            )}

            {/* Use picture element for format negotiation */}
            <picture>
                {/* WebP sources for modern browsers */}
                {webpSrcSet && (
                    <source
                        type="image/webp"
                        srcSet={webpSrcSet}
                        sizes={sizes}
                    />
                )}

                {/* JPEG sources as fallback */}
                {jpgSrcSet && (
                    <source
                        type="image/jpeg"
                        srcSet={jpgSrcSet}
                        sizes={sizes}
                    />
                )}

                {/* Fallback img element */}
                <img
                    src={optimizedSrc}
                    srcSet={jpgSrcSet || undefined}
                    sizes={sizes}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setHasError(true);
                        setIsLoaded(true);
                    }}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${imgClassName}`}
                    data-full-src={fullSrc || src}
                />
            </picture>

            {/* Mobile/Touch Hint Icon */}
            {onClick && isLoaded && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white opacity-0 md:group-hover/image:opacity-100 md:opacity-0 opacity-100 transition-opacity duration-300 pointer-events-none">
                    <Maximize2 size={14} />
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
