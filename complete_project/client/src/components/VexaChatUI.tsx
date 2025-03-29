import React from 'react';
import { TypingIndicator } from './TypingIndicator';

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
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-between p-4 text-white">
      <div className="overflow-y-auto flex-grow space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === "user"
                ? "bg-[#5b2c6f] ml-auto"
                : "bg-[#1c1c1c]"
            } text-white p-3 rounded-xl w-fit shadow-xl max-w-xs`}
          >
            {msg.text}
          </div>
        ))}
        {isSpeaking && (
          <div className="mx-auto mt-8">
            <TypingIndicator />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 rounded-full bg-gray-800 border-none focus:ring-2 focus:ring-purple-600 placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
        />
        <button
          onClick={onSendMessage}
          className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full hover:opacity-80 transition shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}