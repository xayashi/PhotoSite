import React from 'react';

/**
 * YouTube video embed component
 * Responsive, maintains 16:9 aspect ratio
 */
const ContentVideo = ({ videoId }) => {
    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-lg">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        </div>
    );
};

export default ContentVideo;
