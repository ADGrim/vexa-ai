import React, { useState, useEffect } from 'react';
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

  // Initialize recognition on component mount
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        variant: "destructive",
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support voice recognition. Try using Chrome or Edge."
      });
    }
  }, []);

  const startListening = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream right away

      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
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
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        if (event.results[0].isFinal) {
          console.log("Final transcript:", transcript);
          try {
            const response = await onVexaRespond(transcript);
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

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);
        onListeningChange?.(false);

        let errorMessage = "There was an error with voice recognition. Please try again.";
        if (event.error === 'not-allowed') {
          errorMessage = "Please allow microphone access to use voice features.";
        } else if (event.error === 'no-speech') {
          errorMessage = "No speech was detected. Please try again.";
        }

        toast({
          variant: "destructive",
          title: "Voice Recognition Error",
          description: errorMessage
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
        listening ? 'bg-purple-500/20 text-purple-400 animate-pulse' : 'hover:bg-white/5'
      }`}
      variant="ghost"
      disabled={listening}
    >
      <SidebarWaveIcon className={listening ? 'animate-pulse' : ''} />
    </Button>
  );
};

export default VexaVoiceListener;