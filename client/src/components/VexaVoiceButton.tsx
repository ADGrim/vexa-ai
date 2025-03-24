import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useVoiceHandler } from '@/hooks/useVoiceHandler';
import WaveButton from './WaveButton';

interface VexaVoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VexaVoiceButton({ onTranscript, className = '' }: VexaVoiceButtonProps) {
  const { toast } = useToast();
  const { startListening, stopListening, listening } = useVoiceHandler({
    onTranscript: (text) => {
      console.log('VexaVoiceButton received transcript:', text);
      onTranscript(text);
      stopListening();
    }
  });

  const handleClick = async () => {
    if (listening) {
      console.log('Stopping voice recognition...');
      stopListening();
      return;
    }

    try {
      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      console.log('Starting voice recognition...');
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
      <WaveButton
        onClick={handleClick}
        listening={listening}
        className={className}
      />
    </div>
  );
}

export default VexaVoiceButton;