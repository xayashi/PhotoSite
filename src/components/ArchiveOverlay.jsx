import React, { useEffect, useState, useMemo } from 'react';
import { X, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import OptimizedImage from './OptimizedImage';
import { siteConfig } from '../config';

const ArchiveOverlay = ({ chapters = [], onClose, onSelectPost }) => {
  const [visible, setVisible] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Collect unique tags from all posts across all chapters
  const allTags = useMemo(() => {
    const tagSet = new Set();
    chapters.forEach(chapter => {
      chapter.posts.forEach(post => {
        (post.tags || []).forEach(tag => tagSet.add(tag));
      });
    });
    return Array.from(tagSet).sort();
  }, [chapters]);

  // Filter chapters by active tag and search
  const filteredChapters = useMemo(() => {
    let result = chapters;

    if (activeTag || searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = chapters
        .map(chapter => {
          let filteredPosts = chapter.posts;

          if (activeTag) {
            filteredPosts = filteredPosts.filter(post =>
              (post.tags || []).includes(activeTag)
            );
          }

          if (searchQuery) {
            filteredPosts = filteredPosts.filter(post => {
              const inTitle = (post.title || '').toLowerCase().includes(lowerQuery);
              const inSubtitle = (post.subtitle || '').toLowerCase().includes(lowerQuery);
              const inTags = (post.tags || []).some(t => t.toLowerCase().includes(lowerQuery));
              const inChapter = (post.chapter || '').toLowerCase().includes(lowerQuery);
              return inTitle || inSubtitle || inTags || inChapter;
            });
          }

          return {
            ...chapter,
            posts: filteredPosts,
          };
        })
        .filter(chapter => chapter.posts.length > 0);
    }
    return result;
  }, [chapters, activeTag, searchQuery]);

  // Adjust expanded state when tag or search changes
  useEffect(() => {
    const expanded = {};
    if (filteredChapters.length > 0) {
      if (searchQuery) {
        // Expand all when searching
        filteredChapters.forEach((_, idx) => expanded[idx] = true);
      } else {
        // Only expand the first when filtering by tag or no filter
        expanded[0] = true;
      }
    }
    setExpandedChapters(expanded);
  }, [activeTag, searchQuery]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger backspace close if we're typing in an input
      if (e.key === 'Backspace' && e.target.tagName.toLowerCase() === 'input') {
        return;
      }

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleTagClick = (tag) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  const hasChapters = filteredChapters && filteredChapters.length > 0;

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label="Archive"
      className={`fixed inset-0 z-[100] bg-[#121212] text-white overflow-y-auto scrollbar-hidden transition-opacity duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
      ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Background Image */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url('${siteConfig.archive?.background || '/background.png'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.06
        }}
      />

      {/* Close Button */}
      <button
        onClick={handleClose}
        aria-label="Close"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 p-2 hover:text-crimson transition-colors"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="min-h-screen flex flex-col items-center py-16 px-8 md:px-16 relative z-10">
        <div className="max-w-4xl w-full">
          <span className="text-xs font-mono tracking-[0.3em] text-crimson uppercase mb-6 block">
            Archive
          </span>

          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            All Chapters
          </h2>

          <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-center justify-between">
            {/* Tag filter bar */}
            <div className="flex flex-wrap gap-2 flex-grow" role="group" aria-label="Filter by tag">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 text-xs font-mono tracking-wider rounded-full border transition-colors
                  ${!activeTag
                    ? 'border-crimson text-crimson'
                    : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/60'
                  }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 text-xs font-mono tracking-wider rounded-full border transition-colors
                    ${activeTag === tag
                      ? 'border-crimson text-crimson'
                      : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/60'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-full py-2 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-crimson focus:text-white transition-colors placeholder:text-white/30 text-white"
              />
            </div>
          </div>

          {hasChapters ? (
            <div className="space-y-8">
              {filteredChapters.map((chapter, chapterIndex) => (
                <div
                  key={chapter.title}
                  className={`transition duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
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
                              imgClassName="opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
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
            // Fallback when no chapters match filter
            <p className="text-center text-stone-500 py-12 font-mono text-sm">
              {searchQuery
                ? 'no posts exist with that criteria'
                : activeTag
                  ? `No posts tagged "${activeTag}"`
                  : null}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchiveOverlay;
