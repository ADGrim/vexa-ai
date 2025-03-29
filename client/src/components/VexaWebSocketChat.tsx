import React, { useState, useEffect, useRef } from 'react';
import TypewriterBubble from './TypewriterBubble';
import WaveButton from './WaveButton';
import { ChatInputBar } from './ChatInputBar';
import { VexaVoiceButton } from './VexaVoiceButton';
import MobiusLoader from './effects/MobiusLoader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VexaWebSocketChatProps {
  className?: string;
}

/**
 * VexaWebSocketChat component that uses WebSockets for real-time communication
 * Includes voice input and animated message display
 */
export function VexaWebSocketChat({ className = '' }: VexaWebSocketChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use our WebSocket client utility
  useEffect(() => {
    import('../lib/websocketChat').then(({ createVexaWebSocketClient }) => {
      const wsClient = createVexaWebSocketClient(undefined, {
        onOpen: () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        },
        
        onMessage: (data) => {
          if (data.type === 'typing') {
            // Show typing animation
            setIsTyping(true);
          } else if (data.type === 'typing_stop') {
            // Hide typing animation
            setIsTyping(false);
          } else if (data.type === 'message') {
            // Add the message to the conversation
            setMessages(prev => [...prev, { 
              role: data.role || 'assistant', 
              content: data.content 
            }]);
          }
        },
        
        onError: (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        },
        
        onClose: () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
        }
      });
      
      // Store reference and connect
      wsRef.current = {
        send: wsClient.sendMessage,
        readyState: wsClient.isConnected() ? WebSocket.OPEN : WebSocket.CLOSED,
        close: wsClient.disconnect
      } as unknown as WebSocket;
      
      wsClient.connect();
      
      return () => {
        wsClient.disconnect();
      };
    });
  }, []);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Handle sending a message
  const sendMessage = () => {
    if (!input.trim() || !isConnected) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Use the send method directly which now points to our utility's sendMessage
      wsRef.current.send(input);
    }
    
    setInput('');
  };
  
  // Handle voice input
  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
    if (transcript.trim()) {
      setTimeout(() => sendMessage(), 500);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h2 className="text-white font-medium">Vexa WebSocket Chat</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 space-y-4">
        {messages.map((message, index) => (
          <TypewriterBubble
            key={index}
            text={message.content}
            isUser={message.role === 'user'}
            colorScheme={message.role === 'user' ? 'primary' : 'secondary'}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-3 p-4 bg-gray-800/60 backdrop-blur-md rounded-lg max-w-[80%] border border-purple-500/20">
            <div className="text-white/70 text-sm">Vexa is thinking...</div>
            <div className="ml-2">
              <MobiusLoader size={32} color="#a855f7" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <div className="flex items-center space-x-2">
          <ChatInputBar
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            isTyping={isTyping}
          />
          
          <VexaVoiceButton 
            onTranscript={handleVoiceInput}
            className="flex-shrink-0" 
          />
        </div>
        
        <div className="flex items-center justify-center mt-2">
          <WaveButton 
            listening={!isConnected} 
            onClick={() => window.location.reload()}
            className="h-10 w-10"
          />
          {!isConnected && (
            <p className="text-red-400 text-sm ml-2">
              Disconnected. Click to reconnect.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}