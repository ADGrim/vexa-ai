import React, { useEffect } from 'react';

interface MobiusLoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * MobiusLoader - A simple loading animation inspired by a Möbius strip
 * Web version of the React Native MobiusLoader
 */
const MobiusLoader: React.FC<MobiusLoaderProps> = ({
  size = 100,
  color = '#a855f7',
  className = ''
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size
      }}
    >
      <div 
        className="absolute animate-spin"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `4px dashed ${color}`,
          animationDuration: '6s',
        }}
      />

      {/* Optional inner circle for more visual interest */}
      <div 
        className="absolute animate-ping"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          backgroundColor: `${color}20`, // Color with low opacity
          borderRadius: '50%',
          animationDuration: '3s',
          animationIterationCount: 'infinite',
        }}
      />
    </div>
  );
};

export default MobiusLoader;