import React from 'react';

interface FancyCloudBubbleProps {
  text?: string;
}

export function FancyCloudBubble({ text = "✨ Generating your image..." }: FancyCloudBubbleProps) {
  return (
    <div className="relative bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 px-4 py-3 rounded-3xl shadow-md animate-float max-w-fit">
      <div className="text-black font-medium text-sm">{text}</div>
      <div className="absolute bottom-0 left-4 w-4 h-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 transform rotate-45 rounded-sm -mb-2"></div>
    </div>
  );
}

export default FancyCloudBubble;