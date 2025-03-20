import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChatInputBar({ value, onChange, onSubmit }: ChatInputBarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "40px"; // Reset height
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Auto resize
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full flex items-center gap-3 p-3 border-t border-gray-800/20 bg-black/5 backdrop-blur-sm sticky bottom-0 shadow-lg">
      {/* Emoji Button */}
      <Button
        className="rounded-full p-2 hover:bg-gray-800/20 transition duration-200"
        variant="ghost"
      >
        <Smile className="w-6 h-6 text-gray-300" />
      </Button>

      {/* Chat Input */}
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

      {/* Send Button */}
      <Button
        onClick={onSubmit}
        className="rounded-full p-2 hover:bg-blue-500/20 transition duration-200"
        variant="ghost"
        disabled={!value.trim()}
      >
        <Send className="w-6 h-6 text-blue-400" />
      </Button>
    </div>
  );
}