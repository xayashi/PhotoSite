import React from 'react';
import ContentHTML from './ContentHTML';
import ContentGallery from './ContentGallery';
import ContentVideo from './ContentVideo';

/**
 * Main content renderer - renders an array of content blocks
 * Supports: html (parsed markdown), gallery, youtube
 */
const ContentRenderer = ({ blocks, onImageClick }) => {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    // Pre-compute gallery start indices so each gallery knows its global offset
    const galleryStartIndices = [];
    let runningIndex = 0;
    blocks.forEach((block) => {
        if (block.type === 'gallery') {
            galleryStartIndices.push(runningIndex);
            runningIndex += block.images.length;
        }
    });

    let galleryCount = 0;

    return (
        <div className="content-renderer space-y-12">
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'html':
                        return (
                            <ContentHTML
                                key={index}
                                content={block.content}
                                onImageClick={(src) => onImageClick?.(src, -1)}
                            />
                        );

                    case 'gallery': {
                        const startIndex = galleryStartIndices[galleryCount++];
                        return (
                            <ContentGallery
                                key={index}
                                images={block.images}
                                startIndex={startIndex}
                                onImageClick={(src, globalIndex) => onImageClick?.(src, globalIndex)}
                            />
                        );
                    }

                    case 'youtube':
                        return (
                            <ContentVideo
                                key={index}
                                videoId={block.videoId}
                            />
                        );

                    default:
                        console.warn(`Unknown content block type: ${block.type}`);
                        return null;
                }
            })}
        </div>
    );
};

export default ContentRenderer;
