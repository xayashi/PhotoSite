import React, { useState } from 'react';

/**
 * OptimizedImage component that uses Vercel's Image Optimization API
 * - On Vercel: Uses /_vercel/image endpoint for automatic optimization
 * - Locally: Falls back to original image
 * 
 * @param {string} src - Image source path (e.g., "/images/photo.jpg")
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Desired width (default: 800)
 * @param {number} quality - Image quality 1-100 (default: 75)
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 * @param {boolean} priority - If true, loads immediately (no lazy loading)
 */
const OptimizedImage = ({
    src,
    alt = '',
    width = 800,
    quality = 75,
    className = '',
    onClick,
    priority = false,
    fullSrc, // Optional: full resolution src for lightbox
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Check if we're on Vercel (production)
    const isVercel = typeof window !== 'undefined' &&
        window.location.hostname.includes('vercel.app') ||
        window.location.hostname !== 'localhost';

    // Build optimized URL for Vercel
    const getOptimizedSrc = () => {
        if (!isVercel || hasError) {
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
        <div className={`relative ${className}`}>
            {/* Skeleton loader */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-stone-200 animate-pulse rounded-sm" />
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
                onClick={onClick}
                className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${onClick ? 'cursor-pointer' : ''}`}
                // Store full resolution src for lightbox access
                data-full-src={fullSrc || src}
            />
        </div>
    );
};

/**
 * Get full resolution image URL (for lightbox)
 * Call this when opening lightbox to get the original image
 */
export const getFullResolutionSrc = (element) => {
    return element?.dataset?.fullSrc || element?.src;
};

export default OptimizedImage;
