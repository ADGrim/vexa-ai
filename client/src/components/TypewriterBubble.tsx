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
        // Type characters one at a time for smoother animation
        const nextIndex = currentIndex + 1;
        setDisplayedText(text.slice(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, 15); // slightly slower delay for better readability

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