import React, { useState, useEffect } from 'react';

interface TypewriterBubbleProps {
  text: string;
  isUser: boolean;
  colorScheme?: string;
}

const TypewriterBubble: React.FC<TypewriterBubbleProps> = ({ 
  text, 
  isUser, 
  colorScheme 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        // Type multiple characters at once for ultra-fast speed
        const chunkSize = 4;
        const nextIndex = Math.min(currentIndex + chunkSize, text.length);
        const nextChunk = text.slice(currentIndex, nextIndex);
        setDisplayedText(prev => prev + nextChunk);
        setCurrentIndex(nextIndex);
      }, 5); // ultra-low delay between steps

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div
      className={`
        max-w-[75%] px-4 py-3 rounded-2xl shadow-md mb-3 bubble-pop transition-all
        ${isUser 
          ? 'bg-blue-500 text-white rounded-br-none self-end' 
          : `${colorScheme || 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'} rounded-bl-none self-start`}
      `}
    >
      <span>{displayedText}</span>
      {currentIndex < text.length && <span className="blinking-cursor">|</span>}
    </div>
  );
};

export default TypewriterBubble;