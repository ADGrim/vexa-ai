import React from 'react';
import { Mic } from "lucide-react";

interface VoiceChatButtonProps {
  onStartListening: () => void;
  onStopListening: () => void;
  listening: boolean;
}

export function VoiceChatButton({ onStartListening, onStopListening, listening }: VoiceChatButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={listening ? onStopListening : onStartListening}
        className={`relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-105 ${
          listening ? 'animate-pulse-glow' : ''
        }`}
      >
        {/* Background ripple effect when active */}
        {listening && (
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
        )}
        <Mic className={`w-8 h-8 ${listening ? 'text-white' : 'text-white/90'}`} />
      </button>
      <p className="text-center text-sm mt-2 text-white/60">
        {listening ? 'Listening...' : 'Tap to speak'}
      </p>
    </div>
  );
}

export default VoiceChatButton;
