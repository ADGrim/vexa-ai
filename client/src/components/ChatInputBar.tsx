import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SidebarWaveIcon } from "./SidebarWaveIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import useVoiceHandler from '@/hooks/useVoiceHandler';

interface ChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  isTyping?: boolean;
  suggestions?: string[];
  voiceEnabled?: boolean;
  onVoiceToggle?: (enabled: boolean) => void;
  styleEnabled?: boolean;
  onStyleToggle?: (enabled: boolean) => void;
}

export function ChatInputBar({
  value,
  onChange,
  onSubmit,
  onGenerateImage,
  isTyping = false,
  suggestions = [],
  voiceEnabled = false,
  onVoiceToggle,
  styleEnabled = false,
  onStyleToggle
}: ChatInputBarProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { transcript, isListening, startListening } = useVoiceHandler();

  useEffect(() => {
    if (transcript && !isListening) {
      onChange(transcript);
      onSubmit();
    }
  }, [transcript, isListening]);

  const handleVoiceToggle = async () => {
    if (!onVoiceToggle) return;

    if (!voiceEnabled) {
      // Check browser support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          variant: "destructive",
          title: "Voice Chat Unavailable",
          description: "Your browser doesn't support voice recognition. Please use Chrome or Edge."
        });
        return;
      }

      try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());

        onVoiceToggle(true);
        startListening();

        toast({
          title: "Voice Chat Active",
          description: "Speak now - I'm listening!"
        });
      } catch (error) {
        console.error("Microphone permission error:", error);
        toast({
          variant: "destructive",
          title: "Voice Chat Error",
          description: "Please allow microphone access to use voice chat."
        });
      }
    } else {
      onVoiceToggle(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full sticky bottom-0 backdrop-blur-xl bg-black/85 border-t border-white/10 shadow-lg">
      <div className="p-4 space-y-3">
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

        {/* Input area */}
        <div className="flex items-center gap-3">
          {/* Voice toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleVoiceToggle}
                className={`rounded-full p-2 transition-all duration-200 ${
                  isListening ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'hover:bg-white/5'
                }`}
                variant="ghost"
              >
                <SidebarWaveIcon className={isListening ? 'animate-pulse' : ''} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isListening ? 'Listening... Click to stop' : 'Click to use voice'}
            </TooltipContent>
          </Tooltip>

          {/* Text input */}
          <div className="flex-1">
            <textarea
              ref={inputRef}
              className="w-full min-h-[40px] max-h-[120px] rounded-full px-4 py-2 text-base bg-white/5 border-none focus:ring-2 focus:ring-purple-500/30 resize-none overflow-hidden text-white placeholder-white/40"
              placeholder={isListening ? "Listening... Speak your message" : "Type your message..."}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isListening}
            />
          </div>

          {/* Send button */}
          <Button
            onClick={onSubmit}
            className="rounded-full p-2 hover:bg-purple-500/10 transition-all duration-200 hover:shadow-sm disabled:opacity-50"
            variant="ghost"
            disabled={!value.trim() || isGeneratingImage || isListening}
          >
            <Send className="w-6 h-6 text-purple-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}