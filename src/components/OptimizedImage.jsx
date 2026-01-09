import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';

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
    widths = [640, 750, 828, 1080, 1200, 1920, 2400], // Available widths
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Check if we're on Vercel (production)
    const isVercel = typeof window !== 'undefined' &&
        !window.location.hostname.includes('localhost') &&
        !window.location.hostname.includes('127.0.0.1');

    // Extract image name and path for optimized images
    const getImageInfo = () => {
        if (!src) return null;

        // Extract filename without extension
        // e.g., /images/landscape.jpg -> landscape
        const match = src.match(/\/([^/]+)\.(jpg|jpeg|png)$/i);
        if (!match) return null;

        const [, name, ext] = match;
        const isInImagesDir = src.includes('/images/');

        return { name, ext, isInImagesDir };
    };

    // Generate srcset for responsive images
    const generateSrcSet = (format = 'jpg') => {
        if (!src) return '';

        const imageInfo = getImageInfo();

        // For Vercel, use their API
        if (isVercel) {
            return widths
                .map(w => `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality} ${w}w`)
                .join(', ');
        }

        // For local, use pre-generated responsive images
        if (imageInfo && !hasError) {
            const basePath = `/images/optimized/${imageInfo.name}`;
            return widths
                .map(w => `${basePath}/${imageInfo.name}-${w}w.${format} ${w}w`)
                .join(', ');
        }

        // Fallback to original
        return '';
    };

    // Build optimized URL for fallback src
    const getOptimizedSrc = () => {
        if (!src) return '';

        const imageInfo = getImageInfo();

        // For Vercel, use their API
        if (isVercel && !hasError) {
            const params = new URLSearchParams({
                url: src,
                w: width.toString(),
                q: quality.toString(),
            });
            return `/_vercel/image?${params.toString()}`;
        }

        // For local with optimized images available
        if (imageInfo && !hasError) {
            // Use a mid-range size as fallback (1080w is good default)
            return `/images/optimized/${imageInfo.name}/${imageInfo.name}-1080w.jpg`;
        }

        // Fallback to original
        return src;
    };

    const optimizedSrc = getOptimizedSrc();
    const webpSrcSet = generateSrcSet('webp');
    const jpgSrcSet = generateSrcSet('jpg');

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
