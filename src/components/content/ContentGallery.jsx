import React from 'react';
import OptimizedImage from '../OptimizedImage';

/**
 * Image gallery component - displays multiple images in a grid
 * Uses OptimizedImage for Vercel optimization
 */
const ContentGallery = ({ images, onImageClick }) => {
    // Determine grid layout based on number of images
    const getGridClass = () => {
        const count = images.length;
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-2';
        if (count === 3) return 'grid-cols-3';
        if (count === 4) return 'grid-cols-2 md:grid-cols-4';
        return 'grid-cols-2 md:grid-cols-3'; // 5+ images
    };

    return (
        <div className={`grid ${getGridClass()} gap-4 max-w-6xl mx-auto px-4`}>
            {images.map((src, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-sm shadow-lg cursor-pointer group aspect-[4/3]"
                >
                    <OptimizedImage
                        src={src}
                        fullSrc={src}
                        width={640}
                        quality={80}
                        alt={`Gallery image ${index + 1}`}
                        onClick={() => onImageClick?.(src, index)}
                        className="w-full h-full"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        widths={[640, 828, 1080]}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>
            ))}
        </div>
    );
};

export default ContentGallery;
