import React, { useEffect, useState, useRef } from 'react';
import VoiceMobius from '@/components/effects/VoiceMobius';
import { vexaVoice } from '@/lib/vexaVoice';

interface VexaIntroProps {
  onIntroComplete?: () => void;
}

/**
 * VexaIntro - A stylish animated introduction component for VexaAI
 * Web version of the React Native VexaIntro component
 */
const VexaIntro: React.FC<VexaIntroProps> = ({ 
  onIntroComplete 
}) => {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.9);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Start fade-in animation
    setOpacity(0);
    setScale(0.9);
    
    const animateIn = () => {
      setOpacity(1);
      setScale(1);
    };
    
    // Slight delay before animation starts
    setTimeout(animateIn, 300);
    
    // Speak the intro text
    const speakIntro = async () => {
      try {
        await vexaVoice.speak("Hello. I'm Vexa, your AI assistant.");
      } catch (error) {
        console.error("Error speaking intro:", error);
      }
    };
    
    speakIntro();
    
    // Trigger onIntroComplete after animation finishes
    timeoutRef.current = setTimeout(() => {
      onIntroComplete?.();
    }, 5000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onIntroComplete]);
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      style={{
        opacity: opacity,
        transition: 'opacity 3s ease-in-out',
      }}
    >
      <div 
        className="relative flex flex-col items-center"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 2.5s ease-out',
        }}
      >
        {/* Background Mobius animation */}
        <div className="absolute -z-10 opacity-30 scale-150">
          <VoiceMobius size={300} color="#a855f7" />
        </div>
        
        <h1 className="text-6xl font-bold tracking-widest text-purple-500 mb-6">
          VEXA
        </h1>
        
        <div className="text-white/70 text-xl animate-pulse">
          Your AI Assistant
        </div>
      </div>
    </div>
  );
};

export default VexaIntro;