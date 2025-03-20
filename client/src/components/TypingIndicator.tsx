import React from 'react';

export const TypingIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 inline-flex items-center gap-1">
      <span className="text-2xl text-white/80 animate-bounce" style={{ animationDelay: '0s' }}>•</span>
      <span className="text-2xl text-white/80 animate-bounce" style={{ animationDelay: '0.15s' }}>•</span>
      <span className="text-2xl text-white/80 animate-bounce" style={{ animationDelay: '0.3s' }}>•</span>
    </div>
  </div>
);

export default TypingIndicator;