import React, { useState, useEffect } from 'react';

interface TypewriterBubbleProps {
  text: string;
  isUser: boolean;
}

const TypewriterBubble: React.FC<TypewriterBubbleProps> = ({ text, isUser }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 10); // ultra-fast speed typing
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div
      className={`
        max-w-[75%] px-4 py-3 rounded-2xl shadow-md mb-3 bubble-pop
        ${isUser 
          ? 'bg-blue-500 text-white rounded-br-none self-end' 
          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-bl-none self-start'}
      `}
    >
      <span>{displayedText}</span>
      {currentIndex < text.length && <span className="blinking-cursor">|</span>}
    </div>
  );
};

export default TypewriterBubble;
