import { motion } from "framer-motion";
import { ChatBubble } from "./ChatBubble";

interface Message {
  text: string;
  sender: "user" | "ai";
}

interface ChatMessageProps {
  messages: Message[];
  isSpeaking: boolean;
}

export function ChatMessage({ messages, isSpeaking }: ChatMessageProps) {
  return (
    <motion.div 
      className="flex flex-col space-y-4 p-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {messages.map((msg, index) => (
        <ChatBubble 
          key={index}
          message={msg.text}
          isAI={msg.sender === "ai"}
          isSpeaking={msg.sender === "ai" && isSpeaking}
        />
      ))}
    </motion.div>
  );
}