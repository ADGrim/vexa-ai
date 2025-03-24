import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VexaVoiceButton } from "./VexaVoiceButton";

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isTyping?: boolean;
  suggestions?: string[];
  voiceEnabled?: boolean;
  onVoiceToggle?: (enabled: boolean) => void;
}

export function ChatInputBar({
  value,
  onChange,
  onSubmit,
  isTyping = false,
  suggestions = [],
  voiceEnabled = false,
  onVoiceToggle
}: ChatInputBarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleTranscript = (text: string) => {
    onChange(text);
    onSubmit();
  };

  return (
    <div className="w-full sticky bottom-0 bg-black/85 border-t border-white/10 p-4">
      {/* Message suggestions */}
      {value.trim() === "" && suggestions?.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onChange(suggestion)}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all duration-200 text-white/80"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Voice button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <VexaVoiceButton onTranscript={handleTranscript} />
          </TooltipTrigger>
          <TooltipContent>
            Click to use voice chat
          </TooltipContent>
        </Tooltip>

        {/* Text input */}
        <div className="flex-1">
          <textarea
            ref={inputRef}
            className="w-full min-h-[40px] max-h-[120px] rounded-full px-4 py-2 text-base bg-white/5 border-none focus:ring-2 focus:ring-purple-500/30 resize-none overflow-hidden text-white placeholder-white/40"
            placeholder="Type your message..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Send button */}
        <Button
          onClick={onSubmit}
          className="rounded-full p-2 hover:bg-purple-500/10 transition-all duration-200 hover:shadow-sm disabled:opacity-50"
          variant="ghost"
          disabled={!value.trim() || isTyping}
        >
          <Send className="w-6 h-6 text-purple-500" />
        </Button>
      </div>
    </div>
  );
}