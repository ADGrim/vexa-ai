import React from 'react';
import { ChatInputBar } from './ChatInputBar';
import { TooltipProvider } from "@/components/ui/tooltip";
import { VoiceActivationState } from './VoiceActivationState';
import VexaMessageBoard from './VexaMessageBoard';

interface Message {
  text: string;
  sender: "user" | "ai";
  isHtml?: boolean;
  isTypingBubble?: boolean;
}

interface VexaLayoutProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onGenerateImage: (prompt: string) => Promise<void>;
  isSpeaking: boolean;
  voiceRecognitionActive: boolean;
  setVoiceRecognitionActive: (active: boolean) => void;
  styleAdaptationEnabled: boolean;
  setStyleAdaptationEnabled: (enabled: boolean) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function VexaLayout({
  messages,
  input,
  onInputChange,
  onSendMessage,
  onGenerateImage,
  isSpeaking,
  voiceRecognitionActive,
  setVoiceRecognitionActive,
  styleAdaptationEnabled,
  setStyleAdaptationEnabled,
  canvasRef
}: VexaLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <VoiceActivationState 
        isActive={voiceRecognitionActive} 
        onClose={() => setVoiceRecognitionActive(false)}
      />

      {/* Messages area with full height */}
      <div className="flex-1 min-h-0 relative">
        <VexaMessageBoard messages={messages} isTyping={isSpeaking} />
      </div>

      {/* Input area at bottom */}
      <div className="w-full mt-auto">
        <div className="max-w-5xl mx-auto">
          <canvas
            ref={canvasRef}
            width={600}
            height={60}
            className="w-full h-[60px]"
          />
        </div>

        <TooltipProvider>
          <ChatInputBar
            value={input}
            onChange={onInputChange}
            onSubmit={onSendMessage}
            onGenerateImage={onGenerateImage}
            isTyping={isSpeaking}
            voiceEnabled={voiceRecognitionActive}
            onVoiceToggle={setVoiceRecognitionActive}
            styleEnabled={styleAdaptationEnabled}
            onStyleToggle={setStyleAdaptationEnabled}
            suggestions={[
              "Tell me about quantum physics",
              "How does quantum entanglement work?",
              "Explain superposition",
              "What is wave-particle duality?"
            ]}
          />
        </TooltipProvider>
      </div>
    </div>
  );
}