import React, { useState, useEffect, useRef } from 'react';
import './WaveButton.css';
import { getVoiceVolumeAnalyzer } from '@/lib/voiceVolume';

interface WaveButtonProps {
  onClick: () => void;
  listening: boolean;
  className?: string;
  showMobius?: boolean;
}

const WaveButton: React.FC<WaveButtonProps> = ({ 
  onClick, 
  listening, 
  className = '',
  showMobius = true 
}) => {
  const [volume, setVolume] = useState(0);
  const volumeAnalyzerRef = useRef<ReturnType<typeof getVoiceVolumeAnalyzer> | null>(null);

  useEffect(() => {
    if (listening) {
      // Initialize and start the voice volume analyzer
      volumeAnalyzerRef.current = getVoiceVolumeAnalyzer({
        onVolumeChange: (newVolume) => {
          setVolume(newVolume);
        }
      });
      
      volumeAnalyzerRef.current.start();
    } else if (volumeAnalyzerRef.current) {
      // Stop and clean up
      volumeAnalyzerRef.current.stop();
    }
    
    return () => {
      if (volumeAnalyzerRef.current) {
        volumeAnalyzerRef.current.stop();
      }
    };
  }, [listening]);

  // Render the Mobius Strip if we're on web
  const renderMobiusStrip = () => {
    if (typeof window !== 'undefined' && showMobius && listening) {
      // Dynamic import to avoid SSR issues
      const MobiusStrip = require('@/components/effects/MobiusStrip').default;
      return <MobiusStrip volume={volume} />;
    }
    return null;
  };

  return (
    <div className={`wave-button-container ${className} ${listening ? 'active' : ''}`} onClick={onClick}>
      {showMobius && listening && (
        <div className="mobius-container">
          {renderMobiusStrip()}
        </div>
      )}
      
      <div className={`wave ${listening ? 'listening' : ''}`}>
        <svg 
          className="wave-svg"
          width="24" 
          height="24" 
          viewBox="0 0 100 100"
        >
          <polyline
            points="0,50 10,40 20,60 30,35 40,65 50,30 60,70 70,40 80,60 90,50 100,45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <animate
              attributeName="points"
              dur="1s"
              repeatCount="indefinite"
              values="
                0,50 10,40 20,60 30,35 40,65 50,30 60,70 70,40 80,60 90,50 100,45;
                0,50 10,35 20,65 30,40 40,60 50,30 60,70 70,45 80,60 90,40 100,50;
                0,50 10,40 20,60 30,35 40,65 50,30 60,70 70,40 80,60 90,50 100,45"
            />
          </polyline>
        </svg>
      </div>
    </div>
  );
};

export default WaveButton;