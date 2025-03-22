import React, { useState, useEffect } from 'react';
import { ChatInputBar } from './ChatInputBar';
import { TooltipProvider } from "@/components/ui/tooltip";
import { VoiceActivationState } from './VoiceActivationState';
import VexaMessageBoard from './VexaMessageBoard';
import CollapsibleSidebar from './CollapsibleSidebar';
import OnboardingModal from './OnboardingModal';
import SettingsModal from './SettingsModal';
import { loadVexaConfig, type VexaConfig } from '@/lib/vexaConfig';

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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [vexaConfig] = useState<VexaConfig>(loadVexaConfig());
  const [settings, setSettings] = useState({
    voiceEnabled: voiceRecognitionActive && vexaConfig.enableNovaVoice,
    styleAdaptation: styleAdaptationEnabled,
    darkMode: true
  });

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('vexa_has_seen_onboarding');
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));

    switch (setting) {
      case 'voiceEnabled':
        setVoiceRecognitionActive(value);
        break;
      case 'styleAdaptation':
        setStyleAdaptationEnabled(value);
        break;
    }
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('vexa_has_seen_onboarding', 'true');
  };

  const handleSelectConversation = (conversationId: number) => {
    const found = conversations.find((c) => c.id === conversationId);
    if (found) {
      setCurrentConversation(found);
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <OnboardingModal 
        open={showOnboarding} 
        onOpenChange={handleOnboardingClose} 
      />

      <SettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingChange={handleSettingChange}
      />

      <CollapsibleSidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />

      <div className="flex-1 flex flex-col">
        <VoiceActivationState 
          isActive={voiceRecognitionActive} 
          onClose={() => setVoiceRecognitionActive(false)}
        />

        <div className="flex-1 min-h-0">
          <VexaMessageBoard messages={messages} isTyping={isSpeaking} />
        </div>

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