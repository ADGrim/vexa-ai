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
        "rounded-[28px] px-6 py-5 max-w-[80%] shadow-lg backdrop-blur-sm relative overflow-visible",
        isAI ? 
          "bg-gradient-to-br from-violet-600/95 via-purple-600/90 to-indigo-600/85 text-white ml-2 border border-white/10" :
          "bg-gradient-to-br from-emerald-500/95 via-teal-500/90 to-cyan-500/85 text-white ml-auto mr-2 border border-white/10"
      )}
      style={{
        boxShadow: isAI ? 
          "0 4px 24px rgba(147, 51, 234, 0.35)" : 
          "0 4px 24px rgba(16, 185, 129, 0.35)",
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm md:text-base leading-relaxed text-white font-light tracking-wide">{message}</p>
        {isAI && <SoundWave isActive={isSpeaking} />}
      </div>
      
      {/* Small circle accent */}
      <div 
        className={cn(
          "absolute w-4 h-4 rounded-full",
          isAI ? "-left-1.5 top-1 bg-violet-500/90" : "-right-1.5 top-1 bg-cyan-500/90"
        )}
      />
      
      {/* Additional glow effect */}
      <div 
        className={cn(
          "absolute w-2 h-2 rounded-full",
          isAI ? "-left-0.5 top-3 bg-purple-400/60" : "-right-0.5 top-3 bg-emerald-400/60"
        )}
        style={{
          filter: "blur(1px)",
          animation: "pulse 2s infinite"
        }}
      />
      
      <ParticleEffect isActive={showParticles} />
    </motion.div>
  );
}
