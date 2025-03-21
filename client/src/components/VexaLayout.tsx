import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import { ChatInputBar } from './ChatInputBar';
import { TooltipProvider } from "@/components/ui/tooltip";
import { VoiceActivationState } from './VoiceActivationState';

interface Message {
  text: string;
  sender: "user" | "ai";
  isHtml?: boolean;
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
    <div className="flex flex-col min-h-screen max-h-screen w-full bg-gradient-to-b from-gray-900 to-black">
      <VoiceActivationState isActive={voiceRecognitionActive} />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pb-32">
          <div className="space-y-4 py-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "user"
                    ? "bg-purple-600/50 text-white ml-auto"
                    : "bg-blue-500/20 backdrop-blur-sm text-white"
                } p-4 rounded-xl shadow-xl ${
                  msg.isHtml ? "w-full" : "max-w-[80%]"
                } transition-all duration-200 hover:shadow-2xl`}
              >
                {msg.isHtml ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: msg.text }} 
                    className="w-full overflow-hidden rounded-lg"
                  />
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isSpeaking && <TypingIndicator />}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black">
        <div className="max-w-5xl mx-auto">
          <canvas
            ref={canvasRef}
            width={600}
            height={60}
            className="w-full h-[60px] rounded-lg mb-2"
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