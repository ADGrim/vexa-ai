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
      className="flex flex-col space-y-6 p-6 pb-24"
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
        <motion.div
          key={index}
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChatBubble 
            message={msg.text}
            isAI={msg.sender === "ai"}
            isSpeaking={msg.sender === "ai" && isSpeaking}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}