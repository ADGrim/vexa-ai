import React, { useState } from 'react';
import { SidebarWaveIcon } from "./SidebarWaveIcon";
import { vexaVoice } from "@/lib/vexaVoice";

interface VexaVoiceButtonProps {
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  textToSpeak?: string;
}

export function VexaVoiceButton({ onVoiceStart, onVoiceEnd, textToSpeak }: VexaVoiceButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = async () => {
    if (speaking) return;
    
    try {
      setSpeaking(true);
      onVoiceStart?.();

      await vexaVoice.speak(
        textToSpeak || "Hello! I'm Vexa, created by Adom. How can I help?"
      );
    } catch (error) {
      console.error("Voice error:", error);
    } finally {
      setSpeaking(false);
      onVoiceEnd?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-purple-500/10 transition-all duration-200 disabled:opacity-50"
      disabled={speaking}
    >
      <div className={`${speaking ? 'wave-responding' : ''}`}>
        <SidebarWaveIcon className="w-6 h-6 text-purple-500" />
      </div>
    </button>
  );
}

export default VexaVoiceButton;
