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
      const newParticles = Array.from({ length: 12 }).map((_, index) => ({
        id: index,
        x: 0,
        y: 0,
        initialX: Math.random() * 100 - 50,
        initialY: Math.random() * 100 - 50,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-primary/50"
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
            scale: 1
          }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
          style={{
            left: "50%",
            top: "50%",
          }}
        />
      ))}
    </div>
  );
}
