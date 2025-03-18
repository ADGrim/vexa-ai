import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  initialX: number;
  initialY: number;
  scale: number;
}

interface ParticleEffectProps {
  isActive: boolean;
}

export function ParticleEffect({ isActive }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 30 }).map((_, index) => ({
        id: index,
        x: 0,
        y: 0,
        initialX: (Math.random() * 300 - 150) * (Math.random() > 0.5 ? 1 : -1),
        initialY: (Math.random() * 300 - 150) * (Math.random() > 0.5 ? 1 : -1),
        scale: Math.random() * 2 + 1,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-primary/80"
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
            scale: particle.scale
          }}
          transition={{ 
            duration: 2,
            ease: [0.32, 0, 0.67, 0]
          }}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 8px var(--primary)"
          }}
        />
      ))}
    </div>
  );
}