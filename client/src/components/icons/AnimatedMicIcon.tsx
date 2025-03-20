import { motion } from "framer-motion";

interface AnimatedMicIconProps {
  isActive: boolean;
}

export function AnimatedMicIcon({ isActive }: AnimatedMicIconProps) {
  return (
    <motion.div 
      className="relative"
      animate={isActive ? "active" : "inactive"}
    >
      {/* Ripple effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-500/20"
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.2, 0.5] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Mic icon */}
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          active: {
            scale: 1.1,
            color: "rgb(168, 85, 247)", // Purple-500
          },
          inactive: {
            scale: 1,
            color: "currentColor"
          }
        }}
        transition={{ duration: 0.2 }}
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </motion.svg>
    </motion.div>
  );
}
