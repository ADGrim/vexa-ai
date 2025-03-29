import React from 'react';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage } from './chat/ChatMessage';
import { ChatInputBar } from './ChatInputBar';

interface Message {
  text: string;
  sender: "user" | "ai";
}

interface VexaChatUIProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isSpeaking: boolean;
}

export default function VexaChatUI({
  messages,
  input,
  onInputChange,
  onSendMessage,
  isSpeaking
}: VexaChatUIProps) {
  const suggestedQuestions = [
    "Tell me about yourself",
    "What can you help me with?",
    "How does voice chat work?",
    "Show me something interesting"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col justify-between text-white">
      <div className="overflow-y-auto flex-grow pb-20">
        <ChatMessage 
          messages={messages} 
          isSpeaking={isSpeaking} 
        />
        {isSpeaking && (
          <div className="mx-auto my-4 flex justify-center">
            <TypingIndicator />
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 w-full">
        <ChatInputBar
          value={input}
          onChange={onInputChange}
          onSubmit={onSendMessage}
          isTyping={isSpeaking}
          suggestions={messages.length === 0 ? suggestedQuestions : []}
        />
      </div>
    </div>
  );
}