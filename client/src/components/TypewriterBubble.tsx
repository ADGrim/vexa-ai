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
          w-full max-w-[85%] px-6 py-5 rounded-[28px] shadow-lg backdrop-blur-sm border border-white/10
          ${isUser 
            ? 'bg-gradient-to-br from-emerald-500/95 via-teal-500/90 to-cyan-500/85 text-white ml-auto' 
            : `${colorScheme || 'bg-gradient-to-br from-violet-600/95 via-purple-600/90 to-indigo-600/85 text-white'} mr-auto`}
        `}
        style={{
          boxShadow: isUser ? 
            "0 4px 24px rgba(16, 185, 129, 0.35)" : 
            "0 4px 24px rgba(147, 51, 234, 0.35)",
        }}
      >
        <div className="bubble-content">
          <span className="text-white font-light tracking-wide">{displayedText}</span>
          {currentIndex < text.length && (
            <span className="blinking-cursor ml-[2px] inline-block w-[2px] h-[1em] bg-current align-middle animate-blink">|</span>
          )}
        </div>
      </div>
      
      {/* Small circle accent */}
      <div 
        className={`absolute w-4 h-4 rounded-full ${
          isUser ? "-right-1.5 top-1 bg-cyan-500/90" : "-left-1.5 top-1 bg-violet-500/90"
        }`}
      />
      
      {/* Additional glow effect */}
      <div 
        className={`absolute w-2 h-2 rounded-full ${
          isUser ? "-right-0.5 top-3 bg-emerald-400/60" : "-left-0.5 top-3 bg-purple-400/60"
        }`}
        style={{
          filter: "blur(1px)",
          animation: "pulse 2s infinite"
        }}
      />
    </div>
  );
};

export default TypewriterBubble;