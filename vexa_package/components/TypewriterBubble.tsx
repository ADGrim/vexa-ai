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
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const charsPerFrame = Math.max(1, Math.floor(text.length / 50));
      const timeout = setTimeout(() => {
        const nextIndex = Math.min(currentIndex + charsPerFrame, text.length);
        setDisplayedText(text.slice(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div
      className={`
        w-full max-w-[85%] p-6 rounded-xl shadow-sm bubble-pop
        ${isUser 
          ? 'bg-blue-500 text-white rounded-br-none ml-auto' 
          : `${colorScheme || 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'} rounded-bl-none mr-auto`}
      `}
    >
      <div className="bubble-content">
        <span>{displayedText}</span>
        {currentIndex < text.length && (
          <span className="blinking-cursor ml-[2px] inline-block w-[2px] h-[1em] bg-current align-middle animate-blink">|</span>
        )}
      </div>
    </div>
  );
};

export default TypewriterBubble;