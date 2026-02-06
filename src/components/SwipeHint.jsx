import { useState, useEffect } from 'react';

const SwipeHint = ({ onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeen = localStorage.getItem('swipeHintSeen');
    if (hasSeen) {
      setIsDismissed(true);
    }

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setTimeout(() => {
          setIsDismissed(true);
          localStorage.setItem('swipeHintSeen', 'true');
          onDismiss?.();
        }, 300);
      }
    };

    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('wheel', handleInteraction);

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
    };
  }, [hasInteracted, onDismiss]);

  if (isDismissed) return null;

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center gap-3 text-white/60 ${hasInteracted ? 'swipe-hint dismissed' : 'swipe-hint'}`}>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="text-xs tracking-widest uppercase">Swipe to explore</span>
    </div>
  );
};

export default SwipeHint;
