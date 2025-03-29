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