import React, { memo } from 'react';
import AnimatedTitle from './AnimatedTitle';
import OptimizedImage from './OptimizedImage';

const LandingCard = memo(({
  item,
  index,
  isFocused,
  isHovered,
  isLoaded,
  cardStyle,
  onCardClick,
  onViewClick,
  onMouseEnter,
  onMouseLeave,
  cardRef,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick(item.id);
    }
  };

  return (
    <div
      ref={cardRef}
      data-card
      data-index={index}
      data-focused={isFocused || undefined}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} — ${item.subtitle}`}
      onClick={() => onCardClick(item.id)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onMouseEnter(item.id)}
      onMouseLeave={onMouseLeave}
      className={`relative flex-shrink-0 cursor-pointer will-change-transform
        ${isFocused ? 'z-20 scale-110 transition-transform duration-500' : 'z-0 scale-100 hover:opacity-100 opacity-70 transition-opacity duration-300'}
        ${isLoaded ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-12'}
      `}
      style={{
        ...cardStyle,
        margin: window.innerWidth < 768 ? '0 12px' : '0 clamp(16px, 5vw, 48px)',
        transitionDelay: isLoaded ? '0ms' : `${300 + index * 100}ms`,
        transitionProperty: 'opacity, transform',
        transitionDuration: '800ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Image Container */}
      <div className="card-hover w-full h-full overflow-hidden relative shadow-2xl">
        <OptimizedImage
          src={item.cover}
          alt={item.title}
          className="w-full h-full"
          imgClassName={`color-reveal
              ${isFocused || isHovered ? 'revealed' : ''}
          `}
          sizes="(max-width: 768px) 90vw, 40vw"
          widths={[640, 750, 828, 1080, 1200]}
        />

        {/* The "View" Prompt - Only visible when focused */}
        <div
          className={`absolute inset-0 bg-black/40 md:backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-500
          ${isFocused ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <button
            onClick={(e) => onViewClick(e, item)}
            className="group flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center bg-white/10 md:backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300">
              <span className="text-xs font-bold tracking-widest">VIEW</span>
            </div>
          </button>
        </div>
      </div>

      {/* Typography with animated title */}
      <div className={`absolute -bottom-16 left-0 transition-all duration-500 ${isFocused ? 'translate-y-4 opacity-100' : 'opacity-60'}`}>
        <p className="text-xs text-white/60 mb-1 font-mono">{item.subtitle}</p>
        <h2 className="text-3xl sm:text-4xl md:text-7xl font-serif text-transparent stroke-text">
          <AnimatedTitle
            text={item.title}
            isVisible={isLoaded}
            delay={500 + index * 150}
          />
        </h2>
      </div>

      {/* Background Number */}
      <div className="absolute -top-32 -left-10 text-[10rem] font-bold text-white/5 z-10 select-none font-serif pointer-events-none">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
});

LandingCard.displayName = 'LandingCard';

export default LandingCard;
