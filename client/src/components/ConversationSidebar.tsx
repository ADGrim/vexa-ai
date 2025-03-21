import React from 'react';

interface Conversation {
  id: number;
  title: string;
  messages: any[]; // We'll type this properly later
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  onSelectConversation: (id: number) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({ conversations, onSelectConversation }) => {
  return (
    <div className="w-64 bg-[#1f1f2e] text-white h-full flex flex-col shadow-md">
      <h2 className="text-xl font-bold p-4 border-b border-gray-700">Past Conversations</h2>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv, index) => (
          <button
            key={index}
            onClick={() => onSelectConversation(conv.id)}
            className="w-full text-left px-4 py-3 hover:bg-[#2e2e44] border-b border-gray-700 truncate"
          >
            {conv.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationSidebar;
