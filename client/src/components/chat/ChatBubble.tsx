import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
}

export function ChatBubble({ message, isAI }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-full px-6 py-3 max-w-[80%] shadow-lg backdrop-blur-sm",
        isAI ? 
          "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white ml-2" :
          "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white ml-auto mr-2"
      )}
      style={{
        boxShadow: isAI ? 
          "0 0 20px rgba(147, 51, 234, 0.3)" : 
          "0 0 20px rgba(16, 185, 129, 0.3)"
      }}
    >
      <p className="text-sm md:text-base leading-relaxed">{message}</p>
    </motion.div>
  );
}
