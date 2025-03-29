import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { SidebarWaveIcon } from "./SidebarWaveIcon";
import { useToast } from "@/hooks/use-toast";
import useVoiceHandler from '@/hooks/useVoiceHandler';

interface VexaVoiceListenerProps {
  onVexaRespond: (speech: string) => Promise<string>;
  onListeningChange?: (isListening: boolean) => void;
  isEnabled: boolean;
}

const VexaVoiceListener: React.FC<VexaVoiceListenerProps> = ({ 
  onVexaRespond, 
  onListeningChange,
  isEnabled 
}) => {
  const { transcript, isListening, startListening } = useVoiceHandler();
  const { toast } = useToast();

  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  useEffect(() => {
    if (transcript && !isListening) {
      handleTranscript(transcript);
    }
  }, [transcript, isListening]);

  const handleTranscript = async (text: string) => {
    try {
      const response = await onVexaRespond(text);
      console.log("Vexa response:", response);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sorry, I couldn't process that. Please try again."
      });
    }
  };

  const handleVoiceStart = async () => {
    if (!isEnabled) {
      toast({
        variant: "destructive",
        title: "Voice Chat Disabled",
        description: "Please enable voice chat in settings first."
      });
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());

      startListening();

      toast({
        title: "Listening...",
        description: "Speak now. I'm ready to help!"
      });
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      toast({
        variant: "destructive",
        title: "Permission Error",
        description: "Please allow microphone access to use voice features."
      });
    }
  };

  return (
    <Button
      onClick={handleVoiceStart}
      className={`rounded-full p-2 transition-all duration-200 ${
        isListening ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'hover:bg-white/5'
      }`}
      variant="ghost"
      disabled={isListening || !isEnabled}
    >
      <SidebarWaveIcon className={isListening ? 'animate-pulse' : ''} />
    </Button>
  );
};

export default VexaVoiceListener;