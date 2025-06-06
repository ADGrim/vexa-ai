import React, { useState } from 'react';
import MobiusLoader from './effects/MobiusLoader';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isTyping?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isTyping = false }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isTyping ? "Vexa is typing..." : "Type your message..."}
        className={`w-full p-4 rounded-full bg-black/10 backdrop-blur-sm border-none focus:ring-2 focus:ring-purple-600 placeholder-gray-400 pr-16 ${
          isTyping ? 'border-purple-500 border-opacity-50' : ''
        }`}
      />
      
      {isTyping ? (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <MobiusLoader size={30} color="#9333ea" />
        </div>
      ) : (
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full hover:opacity-80 transition shadow-md"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      )}
    </form>
  );
}