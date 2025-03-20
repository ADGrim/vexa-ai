import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChatInputBar({ value, onChange, onSubmit }: ChatInputBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full flex items-center gap-2 p-3 bg-black/10 backdrop-blur-sm sticky bottom-0">
      <Input
        className="flex-1 rounded-2xl px-4 py-3 text-base border-none bg-black/20 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-purple-500"
        placeholder="Send a message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button
        onClick={onSubmit}
        className="rounded-full p-2 hover:bg-purple-500/20 transition"
        variant="ghost"
        disabled={!value.trim()}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
