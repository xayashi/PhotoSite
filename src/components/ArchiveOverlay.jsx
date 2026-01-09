import React, { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

const ArchiveOverlay = ({ chapters = [], onClose, onSelectPost }) => {
  const [visible, setVisible] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);

    // Expand all chapters by default
    const expanded = {};
    chapters.forEach((chapter, index) => {
      expanded[index] = true;
    });
    setExpandedChapters(expanded);
  }, [chapters]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  const toggleChapter = (index) => {
    setExpandedChapters(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePostClick = (post) => {
    setVisible(false);
    setTimeout(() => {
      onSelectPost?.(post);
      onClose();
    }, 300);
  };

  const hasChapters = chapters && chapters.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#121212] text-white overflow-y-auto scrollbar-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
      ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:text-crimson transition-colors"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="min-h-screen flex flex-col items-center py-16 px-8 md:px-16">
        <div className="max-w-4xl w-full">
          <span className="text-xs font-mono tracking-[0.3em] text-crimson uppercase mb-6 block">
            Archive
          </span>

          <h2 className="text-4xl md:text-6xl font-serif mb-12 leading-tight">
            All Chapters
          </h2>

          {hasChapters ? (
            <div className="space-y-8">
              {chapters.map((chapter, chapterIndex) => (
                <div
                  key={chapterIndex}
                  className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${200 + chapterIndex * 100}ms` }}
                >
                  {/* Chapter Header */}
                  <button
                    onClick={() => toggleChapter(chapterIndex)}
                    className="w-full flex items-center justify-between p-4 border-b border-white/10 hover:border-crimson/50 transition-colors group"
                  >
                    <h3 className="text-2xl font-serif text-white/80 group-hover:text-white transition-colors">
                      {chapter.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-stone-500">
                        {chapter.posts.length} {chapter.posts.length === 1 ? 'post' : 'posts'}
                      </span>
                      {expandedChapters[chapterIndex] ? (
                        <ChevronDown size={18} className="text-stone-500" />
                      ) : (
                        <ChevronRight size={18} className="text-stone-500" />
                      )}
                    </div>
                  </button>

                  {/* Chapter Posts */}
                  {expandedChapters[chapterIndex] && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                      {chapter.posts.map((post, postIndex) => (
                        <button
                          key={postIndex}
                          onClick={() => handlePostClick(post)}
                          className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-stone-900"
                        >
                          <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-xs text-crimson font-mono tracking-wider mb-1">
                              {post.subtitle}
                            </p>
                            <h4 className="text-sm font-serif text-white truncate">
                              {post.title}
                            </h4>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Fallback when no chapters
            <p className="text-center text-stone-500 py-12">
              No archived posts yet. Start creating content!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchiveOverlay;
