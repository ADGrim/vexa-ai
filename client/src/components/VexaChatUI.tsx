import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-[60vh] bg-background/40 backdrop-blur-sm flex flex-col justify-between rounded-lg border border-primary/20">
      <div className="overflow-y-auto flex-grow space-y-4 p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.sender === "user"
                ? "ml-auto bg-gradient-to-r from-primary to-primary/80"
                : "bg-gradient-to-r from-secondary to-secondary/80"
            } text-primary-foreground p-3 rounded-xl w-fit shadow-xl max-w-xs`}
          >
            {msg.text}
          </div>
        ))}
        {isSpeaking && (
          <div className="mx-auto mt-8">
            <div className="h-2 w-64 bg-gradient-to-r from-primary to-primary/50 animate-pulse rounded-full opacity-90"></div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-primary/20 bg-background/60 backdrop-blur-sm rounded-b-lg">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-background/50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button
            onClick={onSendMessage}
            className="bg-primary hover:bg-primary/90"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
