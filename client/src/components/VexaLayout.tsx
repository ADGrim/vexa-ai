import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import { ChatInputBar } from './ChatInputBar';
import { TooltipProvider } from "@/components/ui/tooltip";
import { VoiceActivationState } from './VoiceActivationState';
import AnimatedBlackHole from './AnimatedBlackHole';
import TypewriterResponse from './TypewriterResponse';

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
    <div className="flex flex-col h-screen max-h-screen w-full bg-gradient-to-b from-gray-900 to-black">
      <VoiceActivationState 
        isActive={voiceRecognitionActive} 
        onClose={() => setVoiceRecognitionActive(false)}
      />

      {/* Main scrollable content area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-8">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pb-32">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender === "user" ? "ml-auto" : ""
                }`}
              >
                {msg.isHtml ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: msg.text }} 
                    className="w-full overflow-hidden rounded-lg"
                  />
                ) : (
                  <div className={msg.sender === "user" ? "text-right" : "text-left"}>
                    {msg.sender === "ai" ? (
                      <div className="bubble-pop">
                        <TypewriterResponse 
                          text={msg.text} 
                          colorScheme="bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                        />
                      </div>
                    ) : (
                      <div className="inline-block px-4 py-2 rounded-xl bg-purple-600/50 text-white shadow-xl">
                        {msg.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isSpeaking && (
              <div className="flex items-center gap-3 justify-center">
                <AnimatedBlackHole />
                <p className="text-gray-400 italic">Vexa is responding from the depths of space...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom section with canvas and input */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg">
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