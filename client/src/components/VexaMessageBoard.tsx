import React from 'react';
import TypewriterBubble from './TypewriterBubble';
import { detectUserMood, moodStyles } from '@/lib/moodDetection';

interface Message {
  text: string;
  content?: string;
  sender: "user" | "ai";
  isHtml?: boolean;
  isTypingBubble?: boolean;
}

interface VexaMessageBoardProps {
  messages: Message[];
  isTyping: boolean;
}

const VexaMessageBoard: React.FC<VexaMessageBoardProps> = ({ messages, isTyping }) => {
  const renderMessage = (msg: Message) => {
    const messageContent = msg.content || msg.text; // Support both content and text properties

    if (msg.isHtml) {
      return (
        <div className={`
          inline-block px-4 py-3 rounded-xl shadow-md mb-3 bubble-pop
          ${msg.sender === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none self-end' 
            : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-bl-none self-start'}
        `}>
          <div 
            className="bubble-content"
            dangerouslySetInnerHTML={{ __html: messageContent }}
          />
        </div>
      );
    } else if (msg.sender === 'ai') {
      return <TypewriterBubble text={messageContent} isUser={false} />;
    } else {
      return (
        <TypewriterBubble 
          text={messageContent} 
          isUser={true} 
          colorScheme={moodStyles[detectUserMood(messageContent)]}
        />
      );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-4">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
          {renderMessage(msg)}
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start my-2">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl rounded-bl-none shadow-md bubble-pop">
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