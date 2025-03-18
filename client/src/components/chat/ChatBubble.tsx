import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SoundWave } from "./SoundWave";
import { ParticleEffect } from "../effects/ParticleEffect";
import { useEffect, useState } from "react";

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
  isSpeaking?: boolean;
}

export function ChatBubble({ message, isAI, isSpeaking = false }: ChatBubbleProps) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isAI) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAI]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-full px-6 py-3 max-w-[80%] shadow-lg backdrop-blur-sm relative",
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
      <div className="flex flex-col gap-2">
        <p className="text-sm md:text-base leading-relaxed">{message}</p>
        {isAI && <SoundWave isActive={isSpeaking} />}
      </div>
      {isAI && <ParticleEffect isActive={showParticles} />}
    </motion.div>
  );
}