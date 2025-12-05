import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMouseMove = (e) => {
      position.current = { x: e.clientX, y: e.clientY };

      // Update cursor position instantly
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center w-5 h-5 -ml-2.5 -mt-2.5"
    >
      <div className="w-full h-full rounded-full border border-white" />
    </div>
  );
};

export default CustomCursor;
