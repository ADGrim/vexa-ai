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
    // Reset animation when text changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const charsPerFrame = Math.max(1, Math.floor(text.length / 50)); // Dynamic speed based on length
      const timeout = setTimeout(() => {
        const nextIndex = Math.min(currentIndex + charsPerFrame, text.length);
        setDisplayedText(text.slice(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, 20); // Consistent timing for smooth animation

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
      {currentIndex < text.length && (
        <span className="blinking-cursor ml-[2px] inline-block w-[2px] h-[1em] bg-current align-middle animate-blink">|</span>
      )}
    </div>
  );
};

export default TypewriterBubble;