import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isTyping?: boolean;
  suggestions?: string[];
}

export function ChatInputBar({ 
  value, 
  onChange, 
  onSubmit,
  isTyping = false,
  suggestions = []
}: ChatInputBarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "40px";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full p-3 border-t border-gray-800/20 bg-black/5 backdrop-blur-sm sticky bottom-0 shadow-xl">
      {isTyping && (
        <div className="text-sm text-gray-400 mb-2 animate-pulse pl-2">
          Vexa is thinking...
        </div>
      )}

      {value.trim() === "" && suggestions?.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onChange(suggestion)}
              className="text-sm bg-gray-800/20 hover:bg-gray-700/30 px-3 py-1 rounded-full transition text-gray-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          className="rounded-full p-2 hover:bg-gray-800/20 transition duration-200"
          variant="ghost"
        >
          <Smile className="w-6 h-6 text-gray-300" />
        </Button>

        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            className="w-full min-h-[40px] max-h-[120px] rounded-full px-4 py-2 text-base bg-gray-900/20 backdrop-blur-sm border border-gray-700/30 focus:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-400 resize-none overflow-hidden text-white placeholder-gray-400"
            placeholder="Type a message..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <Button
          onClick={onSubmit}
          className="rounded-full p-2 hover:bg-blue-500/20 transition duration-200"
          variant="ghost"
          disabled={!value.trim()}
        >
          <Send className="w-6 h-6 text-blue-400" />
        </Button>
      </div>
    </div>
  );
}