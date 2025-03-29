import React, { useState, useEffect, useRef } from 'react';

interface TypewriterBubbleProps {
  text: string;
  isUser: boolean;
  colorScheme?: string;
  typingSpeed?: 'slow' | 'normal' | 'fast';
  glowEffect?: boolean;
}

const TypewriterBubble: React.FC<TypewriterBubbleProps> = ({ 
  text, 
  isUser, 
  colorScheme,
  typingSpeed = 'normal',
  glowEffect = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Calculate typing speed based on prop
  const getTypingDelay = () => {
    switch(typingSpeed) {
      case 'slow': return 40;
      case 'fast': return 10;
      default: return 20;
    }
  };

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setShowCursor(true);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const charsPerFrame = Math.max(1, Math.floor(text.length / 60));
      const timeout = setTimeout(() => {
        const nextIndex = Math.min(currentIndex + charsPerFrame, text.length);
        setDisplayedText(text.slice(0, nextIndex));
        setCurrentIndex(nextIndex);
      }, getTypingDelay());

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      // Hide cursor when typing is complete after a delay
      const cursorTimeout = setTimeout(() => {
        setShowCursor(false);
      }, 1000);
      
      return () => clearTimeout(cursorTimeout);
    }
  }, [currentIndex, text, typingSpeed]);

  // Animation for completed typing
  useEffect(() => {
    if (currentIndex === text.length && bubbleRef.current) {
      // Add a subtle animation when typing is complete
      bubbleRef.current.classList.add('typing-complete');
      
      return () => {
        if (bubbleRef.current) {
          bubbleRef.current.classList.remove('typing-complete');
        }
      };
    }
  }, [currentIndex, text.length]);

  const userGradient = 'bg-gradient-to-br from-emerald-500/95 via-teal-500/90 to-cyan-500/85';
  const aiGradient = colorScheme || 'bg-gradient-to-br from-violet-600/95 via-purple-600/90 to-indigo-600/85';
  
  return (
    <div className="relative">
      <div
        ref={bubbleRef}
        className={`
          relative w-full max-w-[85%] px-6 py-5 rounded-[28px] shadow-lg backdrop-blur-sm border border-white/10
          transition-all duration-300 ease-out
          ${isUser 
            ? `${userGradient} text-white ml-auto` 
            : `${aiGradient} text-white mr-auto`}
        `}
        style={{
          boxShadow: isUser ? 
            "0 4px 24px rgba(16, 185, 129, 0.35)" : 
            "0 4px 24px rgba(147, 51, 234, 0.35)",
        }}
      >
        {/* Subtle inner glow effect */}
        {glowEffect && (
          <div 
            className="absolute inset-0 rounded-[28px] opacity-50 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${isUser ? 'rgba(16, 185, 129, 0.15)' : 'rgba(147, 51, 234, 0.15)'}, transparent 70%)`,
            }}
          />
        )}
        
        <div className="bubble-content relative z-10">
          <span className="text-white font-light tracking-wide leading-relaxed">{displayedText}</span>
          {showCursor && (
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
      
      {/* Extra decorative element */}
      <div 
        className={`absolute w-1.5 h-1.5 rounded-full ${
          isUser ? "-right-2 top-6 bg-teal-300/70" : "-left-2 top-6 bg-indigo-300/70"
        }`}
        style={{
          filter: "blur(0.5px)",
          animation: "float 3s ease-in-out infinite"
        }}
      />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .typing-complete {
          transform: scale(1.01);
          transition: transform 0.3s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default TypewriterBubble;