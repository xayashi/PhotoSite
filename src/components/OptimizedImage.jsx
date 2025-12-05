import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';

/**
 * OptimizedImage component that uses Vercel's Image Optimization API
 * - On Vercel: Uses /_vercel/image endpoint for automatic optimization
 * - Locally: Falls back to original image
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
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Check if we're on Vercel (production)
    const isVercel = typeof window !== 'undefined' &&
        !window.location.hostname.includes('localhost') &&
        !window.location.hostname.includes('127.0.0.1');

    // Build optimized URL for Vercel
    const getOptimizedSrc = () => {
        if (!isVercel || hasError || !src) {
            return src;
        }

        // Vercel image optimization API
        const params = new URLSearchParams({
            url: src,
            w: width.toString(),
            q: quality.toString(),
        });

        return `/_vercel/image?${params.toString()}`;
    };

    const optimizedSrc = getOptimizedSrc();

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

            <img
                src={optimizedSrc}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
                className={`w-full h-full object-cover transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${imgClassName}`}
                data-full-src={fullSrc || src}
            />

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
