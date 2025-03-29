import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useVoiceHandler } from '@/hooks/useVoiceHandler';
import WaveButton from './WaveButton';
import { MobiusStrip } from '@/components/effects/MobiusStrip';

interface VexaVoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VexaVoiceButton({ onTranscript, className = '' }: VexaVoiceButtonProps) {
  const { toast } = useToast();
  const { startListening, stopListening, listening } = useVoiceHandler((text) => {
    console.log('VexaVoiceButton received transcript:', text);
    onTranscript(text);
  });

  const handleClick = async () => {
    if (listening) {
      stopListening();
      return;
    }

    try {
      // Request microphone permission
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
    <div className="relative">
      {listening && (
        <div className="absolute -top-10 -left-2 z-10 opacity-80">
          <MobiusStrip size="sm" color="primary" />
        </div>
      )}
      <WaveButton
        onClick={handleClick}
        listening={listening}
        className={className}
      />
    </div>
  );
}

export default VexaVoiceButton;