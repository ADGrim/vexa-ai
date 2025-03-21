import React, { useState } from 'react';
import { ChatInputBar } from './ChatInputBar';
import { TooltipProvider } from "@/components/ui/tooltip";
import { VoiceActivationState } from './VoiceActivationState';
import VexaMessageBoard from './VexaMessageBoard';
import ConversationSidebar from './ConversationSidebar';

interface Message {
  text: string;
  sender: "user" | "ai";
  isHtml?: boolean;
  isTypingBubble?: boolean;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
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

const exampleConversations = [
  { id: 1, title: "Quantum physics Q&A", messages: [] },
  { id: 2, title: "Daily quote inspiration", messages: [] },
  { id: 3, title: "Business plan discussion", messages: [] },
];

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
  const [conversations, setConversations] = useState<Conversation[]>(exampleConversations);
  const [currentConversation, setCurrentConversation] = useState<Conversation>(conversations[0]);

  const handleSelectConversation = (conversationId: number) => {
    const found = conversations.find((c) => c.id === conversationId);
    if (found) {
      setCurrentConversation(found);
    }
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <VoiceActivationState 
          isActive={voiceRecognitionActive} 
          onClose={() => setVoiceRecognitionActive(false)}
        />

        {/* Messages area with maximized height */}
        <div className="flex-1 min-h-0">
          <VexaMessageBoard messages={messages} isTyping={isSpeaking} />
        </div>

        {/* Input area */}
        <div className="bg-black/85">
          <div className="max-w-5xl mx-auto">
            <canvas
              ref={canvasRef}
              width={600}
              height={60}
              className="w-full h-[60px]"
            />
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
      </div>
    </div>
  );
}