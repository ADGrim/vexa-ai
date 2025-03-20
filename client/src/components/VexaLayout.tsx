import React from 'react';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ListeningCircle } from './ListeningCircle';

export default function VexaLayout() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-800 bg-opacity-50 backdrop-blur-lg flex flex-col items-center py-6 space-y-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        <button className="hover:opacity-80">🎙️</button>
        <button className="hover:opacity-80">📋</button>
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
          <div className="bg-[#1c1c1c] p-3 rounded-xl shadow-md max-w-md">Hello! How can I assist you today?</div>
          <div className="bg-[#5b2c6f] p-3 rounded-xl shadow-xl ml-auto max-w-md">Tell me something interesting!</div>
          <TypingIndicator />
        </div>

        {/* Chat input */}
        <div className="p-4">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
