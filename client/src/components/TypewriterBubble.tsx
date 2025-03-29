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
    <div className="relative">
      <div
        className={`
          w-full max-w-[85%] p-6 rounded-3xl shadow-md backdrop-blur-sm border border-white/10 
          ${isUser 
            ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white ml-auto' 
            : `${colorScheme || 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white'} mr-auto`}
        `}
        style={{
          boxShadow: isUser ? 
            "0 0 20px rgba(16, 185, 129, 0.3)" : 
            "0 0 20px rgba(147, 51, 234, 0.3)",
          borderRadius: "24px"
        }}
      >
        <div className="bubble-content">
          <span className="text-white font-light">{displayedText}</span>
          {currentIndex < text.length && (
            <span className="blinking-cursor ml-[2px] inline-block w-[2px] h-[1em] bg-current align-middle animate-blink">|</span>
          )}
        </div>
      </div>
      
      <div 
        className={`absolute w-4 h-4 rounded-full ${
          isUser ? "-right-1.5 top-1 bg-emerald-500/80" : "-left-1.5 top-1 bg-purple-500/80"
        }`}
      />
    </div>
  );
};

export default TypewriterBubble;