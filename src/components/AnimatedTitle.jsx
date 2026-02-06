import React from 'react';

const AnimatedTitle = ({ text, isVisible, delay = 0 }) => {
  return (
    <span className="title-reveal">
      {text.split('').map((letter, index) => (
        <span
          key={index}
          className={`letter-animate ${letter === ' ' ? 'w-2' : ''}`}
          style={{
            animationDelay: isVisible ? `${delay + index * 50}ms` : '0ms',
            animationPlayState: isVisible ? 'running' : 'paused',
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};

export default AnimatedTitle;
