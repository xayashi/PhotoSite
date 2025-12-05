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

    return (
        <div className="content-renderer space-y-12">
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'html':
                        return (
                            <ContentHTML
                                key={index}
                                content={block.content}
                                onImageClick={(src) => onImageClick?.(src)}
                            />
                        );

                    case 'gallery':
                        return (
                            <ContentGallery
                                key={index}
                                images={block.images}
                                onImageClick={(src) => onImageClick?.(src)}
                            />
                        );

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
