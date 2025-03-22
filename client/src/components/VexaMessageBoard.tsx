import React from 'react';
import TypewriterBubble from './TypewriterBubble';
import { detectUserMood, moodStyles } from '@/lib/moodDetection';

interface Message {
  text: string;
  sender: "user" | "ai";
  isHtml?: boolean;
  isTypingBubble?: boolean;
}

interface VexaMessageBoardProps {
  messages: Message[];
  isTyping: boolean;
}

const VexaMessageBoard: React.FC<VexaMessageBoardProps> = ({ messages, isTyping }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-4">
      {messages.map((msg, idx) => (
        <div key={idx} className="flex flex-col">
          {msg.isHtml ? (
            // Handle HTML content (like generated images) without typewriter effect
            <div
              className={`
                max-w-[75%] rounded-2xl shadow-md mb-3 bubble-pop
                ${msg.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none self-end' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-bl-none self-start'}
              `}
            >
              <div className="px-4 py-3" dangerouslySetInnerHTML={{ __html: msg.text }} />
            </div>
          ) : msg.sender === 'ai' ? (
            // Use TypewriterBubble for AI text responses
            <TypewriterBubble text={msg.text} isUser={false} />
          ) : (
            // Regular bubble for user messages with mood detection
            <TypewriterBubble 
              text={msg.text} 
              isUser={true} 
              colorScheme={moodStyles[detectUserMood(msg.text)]}
            />
          )}
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start my-2">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-2xl rounded-bl-none shadow-md bubble-pop">
            <span className="dot animate-bounce">•</span>
            <span className="dot animate-bounce" style={{ animationDelay: '0.15s' }}>•</span>
            <span className="dot animate-bounce" style={{ animationDelay: '0.3s' }}>•</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VexaMessageBoard;