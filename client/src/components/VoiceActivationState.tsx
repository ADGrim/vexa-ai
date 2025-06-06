import { motion, AnimatePresence } from "framer-motion";
import VexaAnimatedWaveButton from "./VexaAnimatedWaveButton";

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
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <VexaAnimatedWaveButton speaking={isActive} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}