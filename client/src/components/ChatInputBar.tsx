import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MicroscopeIcon, ImageIcon, PlusIcon, Send, Volume2, Wand2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FancyCloudBubble } from "./FancyCloudBubble";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle file upload here
      console.log("Uploaded files:", files);
    }
  };

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

  const handleGenerateImage = async () => {
    const prompt = window.prompt("What kind of image would you like me to generate?");
    if (prompt) {
      setIsGeneratingImage(true);
      try {
        await onGenerateImage(prompt);
      } catch (error) {
        console.error("Image generation failed:", error);
      } finally {
        setIsGeneratingImage(false);
      }
    }
  };

  return (
    <div className="w-full sticky bottom-0 backdrop-blur-xl bg-black/85 border-t border-white/5 shadow-lg transition-all duration-300 hover:bg-black/90">
      <div className="p-4 space-y-3">
        {isTyping && (
          <div className="text-sm text-white/60 animate-pulse pl-2">
            Vexa is thinking...
          </div>
        )}

        {isGeneratingImage && (
          <div className="mx-auto flex justify-center mb-4">
            <FancyCloudBubble text="☁️ Vexa is crafting your image..." />
          </div>
        )}

        {value.trim() === "" && suggestions?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onChange(suggestion)}
                className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all duration-200 hover:shadow-sm text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {(onVoiceToggle || onStyleToggle) && (
          <>
            <div className="flex items-center gap-4">
              {onVoiceToggle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onVoiceToggle(!voiceEnabled)}
                      variant="ghost"
                      size="icon"
                      className={`rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 ${
                        voiceEnabled 
                          ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                          : 'text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium">Vexa</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Vexa voice</TooltipContent>
                </Tooltip>
              )}

              {onStyleToggle && (
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={styleEnabled} 
                    onCheckedChange={onStyleToggle}
                    className="data-[state=checked]:bg-purple-500"
                  />
                  <Wand2 className="w-5 h-5 text-white/80" />
                  <span className="text-sm text-white/80">Speak My Style</span>
                </div>
              )}
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </>
        )}

        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <label className="rounded-full p-2 hover:bg-white/5 cursor-pointer transition-all duration-200">
                <PlusIcon className="w-6 h-6 text-white/80" />
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </TooltipTrigger>
            <TooltipContent>Upload files</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => console.log("Trigger deep dive")}
                className="rounded-full p-2 hover:bg-purple-500/10 transition-all duration-200"
                variant="ghost"
              >
                <MicroscopeIcon className="w-6 h-6 text-purple-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deep dive analysis</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleGenerateImage}
                className="rounded-full p-2 hover:bg-emerald-500/10 transition-all duration-200"
                variant="ghost"
                disabled={isGeneratingImage}
              >
                <ImageIcon className="w-6 h-6 text-emerald-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate image</TooltipContent>
          </Tooltip>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="w-full min-h-[40px] max-h-[120px] rounded-full px-4 py-2 text-base bg-white/5 border-none focus:ring-2 focus:ring-purple-500/30 resize-none overflow-hidden text-white placeholder-white/40"
              placeholder="Type a message..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <Button
            onClick={onSubmit}
            className="rounded-full p-2 hover:bg-purple-500/10 transition-all duration-200 hover:shadow-sm disabled:opacity-50"
            variant="ghost"
            disabled={!value.trim() || isGeneratingImage}
          >
            <Send className="w-6 h-6 text-purple-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}