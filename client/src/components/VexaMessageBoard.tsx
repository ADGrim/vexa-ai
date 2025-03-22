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
    const messageContent = msg.content || msg.text;

    if (msg.isHtml) {
      return (
        <div
          className={`
            max-w-[80%] px-5 py-4 rounded-xl shadow-sm bubble-fade
            ${msg.sender === 'user'
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-bl-none'}
          `}
        >
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
        <div 
          key={idx} 
          className={`my-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {renderMessage(msg)}
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start my-3">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-4 rounded-xl rounded-bl-none shadow-sm bubble-fade">
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