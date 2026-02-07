import React, { useEffect, useState } from 'react';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import OptimizedImage from './OptimizedImage';

const ArchiveOverlay = ({ chapters = [], onClose, onSelectPost }) => {
  const [visible, setVisible] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  const trapRef = useFocusTrap(visible);
  useDocumentTitle('Archive — 林');

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);

    // Only expand the first chapter by default (progressive disclosure)
    const expanded = {};
    if (chapters.length > 0) {
      expanded[0] = true;
    }
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
    }, 300);
  };

  const hasChapters = chapters && chapters.length > 0;

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label="Archive"
      className={`fixed inset-0 z-[100] bg-[#121212] text-white overflow-y-auto scrollbar-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
      ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        aria-label="Close"
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
                    aria-expanded={!!expandedChapters[chapterIndex]}
                    aria-controls={`chapter-${chapterIndex}`}
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
                    <ul id={`chapter-${chapterIndex}`} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 list-none">
                      {chapter.posts.map((post, postIndex) => (
                        <li key={postIndex}>
                          <button
                            onClick={() => handlePostClick(post)}
                            aria-label={`${post.title} — ${post.subtitle}`}
                            className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-stone-900 w-full"
                          >
                            <OptimizedImage
                              src={post.cover}
                              alt={post.title}
                              className="w-full h-full"
                              imgClassName="opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
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
                        </li>
                      ))}
                    </ul>
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
