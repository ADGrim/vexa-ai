import React from 'react';
import './WaveButton.css';

interface WaveButtonProps {
  onClick: () => void;
  listening: boolean;
  className?: string;
}

const WaveButton: React.FC<WaveButtonProps> = ({ onClick, listening, className = '' }) => {
  return (
    <div className={`wave-button-container ${className}`} onClick={onClick}>
      <div className={`wave ${listening ? 'listening' : ''}`}></div>
      <div className="mic-icon">🎙️</div>
    </div>
  );
};

export default WaveButton;