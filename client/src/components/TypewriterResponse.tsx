import React, { useState, useEffect } from 'react';

interface TypewriterResponseProps {
  text: string;
  colorScheme?: string;
}

const TypewriterResponse: React.FC<TypewriterResponseProps> = ({ 
  text, 
  colorScheme = 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 8); // Super speed typing
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div className={`inline-block px-4 py-2 rounded-xl ${colorScheme} shadow-lg transition-all scale-100`}>
      <span>{displayedText}</span>
      {currentIndex < text.length && <span className="blinking-cursor">|</span>}
    </div>
  );
};

export default TypewriterResponse;
