import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMouseMove = (e) => {
      // Update cursor position instantly
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
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
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center transition-[width,height,margin,background-color,border-color] duration-300 ease-out
        ${isHovering ? 'w-20 h-20 -ml-10 -mt-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white' : 'w-6 h-6 -ml-3 -mt-3 border border-white rounded-full'}
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
