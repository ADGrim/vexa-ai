import React from 'react';
import { Button } from "@/components/ui/button";
import { SidebarWaveIcon } from "./SidebarWaveIcon";
import { useToast } from "@/hooks/use-toast";
import { useVoiceHandler } from '@/hooks/useVoiceHandler';

interface VexaVoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VexaVoiceButton({ onTranscript, className = '' }: VexaVoiceButtonProps) {
  const { toast } = useToast();
  const { startListening, stopListening, listening } = useVoiceHandler({
    onTranscript: (text) => {
      onTranscript(text);
      console.log('Transcript:', text);
    }
  });

  const handleClick = async () => {
    if (listening) {
      stopListening();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
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
  };

  return (
    <Button
      onClick={handleClick}
      className={`rounded-full p-2 transition-all duration-200 ${
        listening ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'hover:bg-white/5'
      } ${className}`}
      variant="ghost"
    >
      <SidebarWaveIcon className={listening ? 'animate-pulse' : ''} />
    </Button>
  );
}

export default VexaVoiceButton;