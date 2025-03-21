import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import { ChatInputBar } from './ChatInputBar';
import { TooltipProvider } from "@/components/ui/tooltip";

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
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="flex-1 overflow-y-auto scroll-smooth px-4 md:px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.sender === "user"
                  ? "bg-purple-600/50 text-white ml-auto"
                  : "bg-blue-500/20 backdrop-blur-sm text-white"
              } p-4 rounded-xl shadow-xl ${msg.isHtml ? "max-w-full w-full" : "max-w-[80%]"} transition-all duration-200 hover:shadow-2xl`}
            >
              {msg.isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: msg.text }} className="w-full" />
              ) : (
                msg.text
              )}
            </div>
          ))}
          {isSpeaking && <TypingIndicator />}
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-2 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <canvas
            ref={canvasRef}
            width={600}
            height={100}
            className="w-full h-[100px] rounded-lg bg-black/10 backdrop-blur-sm"
          />
        </div>
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
  );
}