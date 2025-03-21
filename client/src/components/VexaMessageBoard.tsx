import React from 'react';

interface Message {
  text: string;
  sender: "user" | "ai";
  isHtml?: boolean;
}

interface VexaMessageBoardProps {
  messages: Message[];
  isTyping: boolean;
}

const VexaMessageBoard: React.FC<VexaMessageBoardProps> = ({ messages, isTyping }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-4 bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {messages.map((msg, idx) => (
        <div key={idx} className={`my-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`
              max-w-[75%] px-4 py-3 rounded-2xl shadow-md
              ${msg.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-bl-none'}
              bubble-pop
            `}
          >
            {msg.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              <span>{msg.text}</span>
            )}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start my-3">
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
