import { motion } from "framer-motion";

interface SoundWaveProps {
  isActive: boolean;
}

export function SoundWave({ isActive }: SoundWaveProps) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: isActive ? ["40%", "100%", "40%"][i % 3] : "40%",
            opacity: isActive ? 1 : 0.3,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
