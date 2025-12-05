import React from 'react';

/**
 * Renders HTML content (parsed markdown)
 * Applies custom styling to different elements
 */
const ContentHTML = ({ content, onImageClick }) => {
    // Create a div ref to handle image clicks
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (!containerRef.current) return;

        // Find all images and add click handlers
        const images = containerRef.current.querySelectorAll('img');
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.setAttribute('data-cursor', 'click');
            img.onclick = () => onImageClick?.(img.src, index);
        });
    }, [content, onImageClick]);

    return (
        <div
            ref={containerRef}
            className="content-html prose prose-lg max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default ContentHTML;
