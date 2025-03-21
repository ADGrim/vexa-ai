import { motion, AnimatePresence } from "framer-motion";
import VexaAnimatedWaveButton from "./VexaAnimatedWaveButton";
import AnimatedBlackHole from "./AnimatedBlackHole";

interface VoiceActivationStateProps {
  isActive: boolean;
  onClose: () => void;
}

export function VoiceActivationState({ isActive, onClose }: VoiceActivationStateProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
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
            className="relative flex flex-col items-center gap-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatedBlackHole />
            <VexaAnimatedWaveButton speaking={isActive} onClick={(e) => e.stopPropagation()} />
            <p className="text-white/80 text-lg font-medium">
              Vexa is ready to chat
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}