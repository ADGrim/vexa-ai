import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { SidebarWaveIcon } from "./SidebarWaveIcon";
import { useToast } from "@/hooks/use-toast";
import useVoiceHandler from '@/hooks/useVoiceHandler';
import MobiusStrip from '@/components/effects/MobiusStrip';
import MobiusLoader from '@/components/effects/MobiusLoader';
import { getVoiceVolumeAnalyzer } from '@/lib/voiceVolume';

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
  const [volume, setVolume] = useState(0.3);
  const volumeAnalyzerRef = useRef<ReturnType<typeof getVoiceVolumeAnalyzer> | null>(null);
  
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
    
    if (listening) {
      // Initialize and start voice volume detection
      volumeAnalyzerRef.current = getVoiceVolumeAnalyzer({
        onVolumeChange: (newVolume) => {
          setVolume(newVolume);
        }
      });
      
      volumeAnalyzerRef.current.start();
    } else if (volumeAnalyzerRef.current) {
      // Clean up when not listening
      volumeAnalyzerRef.current.stop();
    }
    
    return () => {
      if (volumeAnalyzerRef.current) {
        volumeAnalyzerRef.current.stop();
      }
    };
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
        <>
          {/* MobiusStrip for volume visualization */}
          <div className="absolute -top-10 -left-6 z-10">
            <MobiusStrip volume={volume} size="sm" color="#9c27b0" />
          </div>
          
          {/* MobiusLoader for additional visual feedback */}
          <div className="absolute -top-6 -right-6 z-10">
            <MobiusLoader size={24} color="#8855ff" />
          </div>
        </>
      )}
      <Button
        onClick={listening ? stopListening : handleVoiceStart}
        className={`rounded-full p-2 transition-all duration-200 ${
          listening ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5'
        }`}
        variant="ghost"
        disabled={!isEnabled}
      >
        <SidebarWaveIcon className={listening ? 'animate-pulse' : ''} />
      </Button>
      {listening && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-white/70">
          Tap to stop
        </div>
      )}
    </div>
  );
};

export default VexaVoiceListener;