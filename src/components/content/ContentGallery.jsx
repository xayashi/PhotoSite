import React, { useState } from 'react';

/**
 * Image gallery component - displays multiple images in a grid
 * Supports both portrait and landscape orientations
 */
const ContentGallery = ({ images, onImageClick }) => {
    const [loadedImages, setLoadedImages] = useState({});

    const handleImageLoad = (index) => {
        setLoadedImages(prev => ({ ...prev, [index]: true }));
    };

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
                    onClick={() => onImageClick?.(src, index)}
                >
                    {/* Skeleton loader */}
                    {!loadedImages[index] && (
                        <div className="absolute inset-0 bg-stone-200 animate-pulse" />
                    )}

                    <img
                        src={src}
                        alt={`Gallery image ${index + 1}`}
                        onLoad={() => handleImageLoad(index)}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105
              ${loadedImages[index] ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>
            ))}
        </div>
    );
};

export default ContentGallery;
