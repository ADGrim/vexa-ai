import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SidebarWaveIcon } from "./SidebarWaveIcon";

interface VexaVoiceListenerProps {
  onVexaRespond: (speech: string) => Promise<string>;
  onListeningChange?: (isListening: boolean) => void;
}

const VexaVoiceListener: React.FC<VexaVoiceListenerProps> = ({ onVexaRespond, onListeningChange }) => {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.start();
    setListening(true);
    onListeningChange?.(true);

    recognition.onresult = async (event) => {
      const userSpeech = event.results[0][0].transcript;
      console.log("User said:", userSpeech);
      
      try {
        const response = await onVexaRespond(userSpeech);
        // Response will be handled by the parent component
      } catch (error) {
        console.error("Error getting AI response:", error);
      }
      
      setListening(false);
      onListeningChange?.(false);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
      onListeningChange?.(false);
    };

    recognition.onend = () => {
      setListening(false);
      onListeningChange?.(false);
    };
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
