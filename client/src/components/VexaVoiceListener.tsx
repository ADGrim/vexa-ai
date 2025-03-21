import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SidebarWaveIcon } from "./SidebarWaveIcon";
import { useToast } from "@/hooks/use-toast";

interface VexaVoiceListenerProps {
  onVexaRespond: (speech: string) => Promise<string>;
  onListeningChange?: (isListening: boolean) => void;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const VexaVoiceListener: React.FC<VexaVoiceListenerProps> = ({ onVexaRespond, onListeningChange }) => {
  const [listening, setListening] = useState(false);
  const { toast } = useToast();

  const startListening = async () => {
    try {
      // Check for browser support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          variant: "destructive",
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support voice recognition. Try using Chrome or Edge."
        });
        return;
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream right away, we just needed permission

      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setListening(true);
        onListeningChange?.(true);
        toast({
          title: "Listening...",
          description: "Speak now. I'm ready to help!"
        });
      };

      recognition.onresult = async (event) => {
        const userSpeech = event.results[0][0].transcript;
        console.log("User said:", userSpeech);

        try {
          const response = await onVexaRespond(userSpeech);
          // Response will be handled by the parent component
        } catch (error) {
          console.error("Error getting AI response:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Sorry, I couldn't process that. Please try again."
          });
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);
        onListeningChange?.(false);

        toast({
          variant: "destructive",
          title: "Voice Recognition Error",
          description: event.error === 'not-allowed' 
            ? "Please allow microphone access to use voice features."
            : "There was an error with voice recognition. Please try again."
        });
      };

      recognition.onend = () => {
        setListening(false);
        onListeningChange?.(false);
      };

      recognition.start();
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      toast({
        variant: "destructive",
        title: "Permission Error",
        description: "Please allow microphone access to use voice features."
      });
      setListening(false);
      onListeningChange?.(false);
    }
  };

  return (
    <Button
      onClick={startListening}
      className={`rounded-full p-2 transition-all duration-200 ${
        listening ? 'bg-purple-500/20 text-purple-400 animate-pulse-glow' : 'hover:bg-white/5'
      }`}
      variant="ghost"
    >
      <SidebarWaveIcon />
    </Button>
  );
};

export default VexaVoiceListener;