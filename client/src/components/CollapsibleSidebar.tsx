import React, { useState } from 'react';
import { MenuIcon, ChevronLeftIcon } from 'lucide-react';

interface Conversation {
  id: number;
  title: string;
  messages: any[]; // We'll type this properly later
}

interface CollapsibleSidebarProps {
  conversations: Conversation[];
  onSelectConversation: (id: number) => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ conversations, onSelectConversation }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-full">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-4 left-4 bg-indigo-600 p-2 rounded-full hover:bg-indigo-700 transition"
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
      )}

      {isOpen && (
        <div className="w-64 bg-[#1f1f2e] text-white h-full shadow-xl flex flex-col transition-all">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Conversations</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-700 p-1 rounded-full hover:bg-gray-600 transition"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelectConversation(conv.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#2e2e44] border-b border-gray-700 truncate"
              >
                {conv.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleSidebar;
