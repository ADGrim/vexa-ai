import React from 'react';

export const TypingIndicator = () => (
  <div className="flex items-center space-x-1 bg-[#1c1c1c] text-white p-3 rounded-xl w-fit shadow-md max-w-xs">
    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
  </div>
);
