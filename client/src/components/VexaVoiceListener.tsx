import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { SidebarWaveIcon } from "./SidebarWaveIcon";
import { useToast } from "@/hooks/use-toast";
import useVoiceHandler from '@/hooks/useVoiceHandler';
import { MobiusStrip } from '@/components/effects/MobiusStrip';

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
  const { toast } = useToast();
  
  const handleRecognizedSpeech = async (text: string) => {
    if (text.trim()) {
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
    }
  };
  
  const { startListening, stopListening, listening } = useVoiceHandler(handleRecognizedSpeech);

  useEffect(() => {
    onListeningChange?.(listening);
  }, [listening, onListeningChange]);

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
    <div className="relative">
      {listening && (
        <div className="absolute -top-8 -left-4 z-10">
          <MobiusStrip size="sm" color="primary" />
        </div>
      )}
      <Button
        onClick={handleVoiceStart}
        className={`rounded-full p-2 transition-all duration-200 ${
          listening ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5'
        }`}
        variant="ghost"
        disabled={listening || !isEnabled}
      >
        <SidebarWaveIcon className={listening ? 'animate-pulse' : ''} />
      </Button>
    </div>
  );
};

export default VexaVoiceListener;