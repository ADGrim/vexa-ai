import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

interface VoiceActivationStateProps {
  isActive: boolean;
}

export function VoiceActivationState({ isActive }: VoiceActivationStateProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Central content */}
          <motion.div className="relative flex flex-col items-center">
            {/* Outer pulse ring */}
            <motion.div
              className="absolute rounded-full bg-purple-500/20"
              initial={{ width: 120, height: 120 }}
              animate={{
                width: 160,
                height: 160,
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Inner pulse ring */}
            <motion.div
              className="absolute rounded-full bg-purple-500/30"
              initial={{ width: 100, height: 100 }}
              animate={{
                width: 120,
                height: 120,
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />

            {/* Center circle with mic icon */}
            <motion.div
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Mic className="w-10 h-10 text-white" />
            </motion.div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-purple-500"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{
                  y: [-20, -60],
                  x: Math.sin(i) * 30,
                  scale: [1, 0],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Status text */}
            <motion.p
              className="mt-8 text-lg font-medium text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Listening...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
