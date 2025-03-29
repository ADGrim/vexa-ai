import React from 'react';
import { VexaWebSocketChat } from '../components/VexaWebSocketChat';

export default function WebSocketDemo() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Vexa WebSocket Demo</h1>
        <p className="text-purple-200">Real-time chat with WebSocket technology</p>
      </header>
      
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <div className="bg-black/30 rounded-xl overflow-hidden shadow-xl border border-purple-500/20 h-[calc(100vh-12rem)]">
          <VexaWebSocketChat className="h-full" />
        </div>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>This demo showcases real-time WebSocket communication with the Vexa AI assistant.</p>
          <p>Try sending a message or using voice input to start a conversation.</p>
        </div>
      </main>
      
      <footer className="bg-black/50 border-t border-purple-900/20 p-4 text-center text-gray-500 text-sm">
        <p>Vexa AI &copy; {new Date().getFullYear()} - WebSocket Technology Demo</p>
      </footer>
    </div>
  );
}