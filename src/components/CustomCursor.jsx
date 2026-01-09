import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const rafId = useRef(null); // Track animation frame ID
  const lastPos = useRef({ x: 0, y: 0 }); // Store last cursor position

  useEffect(() => {
    const cursor = cursorRef.current;

    // Update cursor position using stored coordinates
    const updateCursorPosition = () => {
      if (cursor && lastPos.current) {
        cursor.style.transform = `translate(${lastPos.current.x}px, ${lastPos.current.y}px)`;
      }
      rafId.current = null; // Reset RAF ID after update
    };

    const handleMouseMove = (e) => {
      // Store the latest mouse position
      lastPos.current = { x: e.clientX, y: e.clientY };

      // Throttle updates to animation frame rate (~60fps)
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updateCursorPosition);
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor');
        setCursorText(text || '');
        setIsHovering(true);
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      // Cancel any pending animation frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center transition-[width,height,margin,background-color,border-color] duration-300 ease-out
        ${isHovering ? 'w-20 h-20 -ml-10 -mt-10 bg-stone-500/10 backdrop-blur-sm border border-stone-400/50 text-stone-200' : 'w-6 h-6 -ml-3 -mt-3 border border-stone-400 rounded-full'}
        rounded-full`}
    >
      {isHovering && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-none">
          {cursorText}
        </span>
      )}
    </div>
  );
};

export default CustomCursor;
