import React from 'react';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ListeningCircle } from './ListeningCircle';
import { SidebarWaveIcon } from './SidebarWaveIcon';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wand2 } from 'lucide-react';
import { AnimatedMicIcon } from './icons/AnimatedMicIcon';
import { motion } from 'framer-motion';

interface VexaLayoutProps {
  messages: Array<{ text: string; sender: "user" | "ai" }>;
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
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
  isSpeaking,
  voiceRecognitionActive,
  setVoiceRecognitionActive,
  styleAdaptationEnabled,
  setStyleAdaptationEnabled,
  canvasRef
}: VexaLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-20 bg-black/20 backdrop-blur-lg flex flex-col items-center py-6 space-y-10 shadow-xl">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        <SidebarWaveIcon />

        {/* Voice Recognition Toggle */}
        <motion.div 
          className="flex flex-col items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Switch
            checked={voiceRecognitionActive}
            onCheckedChange={setVoiceRecognitionActive}
            className="data-[state=checked]:bg-purple-500"
          />
          <div className="relative">
            <AnimatedMicIcon isActive={voiceRecognitionActive} />
            <Label className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
              {voiceRecognitionActive ? 'Listening...' : 'Voice'}
            </Label>
          </div>
        </motion.div>

        {/* Style Adaptation Toggle */}
        <motion.div 
          className="flex flex-col items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Switch
            checked={styleAdaptationEnabled}
            onCheckedChange={setStyleAdaptationEnabled}
            className="data-[state=checked]:bg-purple-500"
          />
          <div className="relative">
            <Wand2 className={`w-6 h-6 ${styleAdaptationEnabled ? 'text-purple-500' : ''}`} />
            <Label className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
              Style
            </Label>
          </div>
        </motion.div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top profile */}
        <div className="absolute top-4 right-4">
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="rounded-full border-2 border-purple-500"
          />
        </div>

        {/* Chat bubbles container */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 space-y-4 mt-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.sender === "user"
                  ? "bg-purple-600/90 text-white ml-auto"
                  : "bg-black/20 backdrop-blur-sm"
              } p-3 rounded-xl shadow-xl max-w-[80%] transition-all duration-200 hover:shadow-2xl`}
            >
              {msg.text}
            </div>
          ))}
          {isSpeaking && <TypingIndicator />}
          {voiceRecognitionActive && <ListeningCircle />}
        </div>

        {/* Audio Visualizer */}
        <div className="px-6 py-2">
          <canvas
            ref={canvasRef}
            width={600}
            height={100}
            className="w-full h-[100px] rounded-lg bg-black/10 backdrop-blur-sm"
          />
        </div>

        {/* Chat input */}
        <div className="p-4">
          <ChatInput
            value={input}
            onChange={onInputChange}
            onSubmit={onSendMessage}
          />
        </div>
      </div>
    </div>
  );
}