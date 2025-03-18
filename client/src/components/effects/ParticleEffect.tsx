import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  initialX: number;
  initialY: number;
}

interface ParticleEffectProps {
  isActive: boolean;
}

export function ParticleEffect({ isActive }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Create more particles and spread them out more
      const newParticles = Array.from({ length: 20 }).map((_, index) => ({
        id: index,
        x: 0,
        y: 0,
        initialX: (Math.random() * 200 - 100) * (Math.random() > 0.5 ? 1 : -1),
        initialY: (Math.random() * 200 - 100) * (Math.random() > 0.5 ? 1 : -1),
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary"
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1,
            scale: 0
          }}
          animate={{ 
            x: particle.initialX,
            y: particle.initialY,
            opacity: 0,
            scale: 2
          }}
          transition={{ 
            duration: 1.5,
            ease: "easeOut"
          }}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
    </div>
  );
}