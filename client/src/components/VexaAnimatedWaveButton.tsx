import React from 'react';
import AnimatedBlackHole from './AnimatedBlackHole';

interface VexaAnimatedWaveButtonProps {
  speaking: boolean;
  onClick: () => void;
}

const VexaAnimatedWaveButton: React.FC<VexaAnimatedWaveButtonProps> = ({ speaking, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-32 h-32 rounded-full bg-cover bg-center cursor-pointer transition-transform hover:scale-105 relative flex items-center justify-center ${
        speaking ? 'animate-wave-glow' : ''
      }`}
    >
      <div className="absolute inset-0 rounded-full bg-black bg-opacity-10"></div>
      <AnimatedBlackHole />
    </div>
  );
};

export default VexaAnimatedWaveButton;