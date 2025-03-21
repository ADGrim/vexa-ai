import React from 'react';

interface VexaAnimatedWaveButtonProps {
  speaking: boolean;
  onClick: () => void;
}

const VexaAnimatedWaveButton: React.FC<VexaAnimatedWaveButtonProps> = ({ speaking, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-32 h-32 rounded-full bg-cover bg-center cursor-pointer transition-transform hover:scale-105 relative ${
        speaking ? 'animate-wave-glow' : ''
      }`}
      style={{ backgroundImage: 'url(/vexa-soundwave.jpg)' }}
    >
      <div className="absolute inset-0 rounded-full bg-black bg-opacity-10"></div>
    </div>
  );
};

export default VexaAnimatedWaveButton;
