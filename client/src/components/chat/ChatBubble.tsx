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
      const timer = setTimeout(() => setShowParticles(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAI]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-3xl px-6 py-4 max-w-[80%] shadow-lg backdrop-blur-sm relative overflow-visible",
        isAI ? 
          "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white ml-2 border border-white/10" :
          "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white ml-auto mr-2 border border-white/10"
      )}
      style={{
        boxShadow: isAI ? 
          "0 0 20px rgba(147, 51, 234, 0.3)" : 
          "0 0 20px rgba(16, 185, 129, 0.3)",
        borderRadius: "24px",
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm md:text-base leading-relaxed text-white font-light">{message}</p>
        {isAI && <SoundWave isActive={isSpeaking} />}
      </div>
      <div 
        className={cn(
          "absolute w-4 h-4 rounded-full",
          isAI ? "-left-1.5 top-1 bg-purple-500/80" : "-right-1.5 top-1 bg-emerald-500/80"
        )}
      />
      <ParticleEffect isActive={showParticles} />
    </motion.div>
  );
}
