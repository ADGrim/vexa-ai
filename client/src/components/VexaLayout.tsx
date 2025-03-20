import React from 'react';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ListeningCircle } from './ListeningCircle';
import { SidebarWaveIcon } from './SidebarWaveIcon';

interface VexaLayoutProps {
  messages: Array<{ text: string; sender: "user" | "ai" }>;
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isSpeaking: boolean;
  voiceRecognitionActive: boolean;
  setVoiceRecognitionActive: (active: boolean) => void;
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
  canvasRef
}: VexaLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-800 bg-opacity-50 backdrop-blur-lg flex flex-col items-center py-6 space-y-10 shadow-xl">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        <SidebarWaveIcon />
        <button className="hover:opacity-80 text-2xl">📋</button>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 mt-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.sender === "user"
                  ? "bg-[#5b2c6f] ml-auto"
                  : "bg-[#1c1c1c]"
              } p-3 rounded-xl shadow-xl max-w-md`}
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
            className="w-full h-[100px] rounded-lg bg-gray-800 bg-opacity-50"
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