import { motion, AnimatePresence } from "framer-motion";
import { SidebarWaveIcon } from "./SidebarWaveIcon";

interface VoiceActivationStateProps {
  isActive: boolean;
}

export function VoiceActivationState({ isActive }: VoiceActivationStateProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Blurred background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Central content */}
          <motion.div 
            className="relative flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Outer pulse ring */}
            <motion.div
              className="absolute rounded-full bg-purple-500/20"
              initial={{ width: 140, height: 140 }}
              animate={{
                width: 180,
                height: 180,
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
              initial={{ width: 120, height: 120 }}
              animate={{
                width: 140,
                height: 140,
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />

            {/* Center circle with wave icon */}
            <motion.div
              className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SidebarWaveIcon className="w-12 h-12 text-white" />
            </motion.div>

            {/* Status text */}
            <motion.p
              className="mt-8 text-xl font-medium text-white"
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