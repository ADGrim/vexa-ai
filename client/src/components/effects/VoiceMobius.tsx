import React, { useEffect, useRef } from 'react';

interface VoiceMobiusProps {
  size?: number;
  color?: string;
  className?: string;
  isActive?: boolean;
}

/**
 * VoiceMobius - A 3D rotating animation inspired by a Möbius strip
 * Web version of the React Native VoiceMobius component
 */
const VoiceMobius: React.FC<VoiceMobiusProps> = ({
  size = 150,
  color = '#8e44ad',
  className = '',
  isActive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
      return;
    }

    const animate = () => {
      if (containerRef.current) {
        rotationRef.current = (rotationRef.current + 0.5) % 360;
        containerRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive]);

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: size, 
        height: size 
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 rounded-full bg-black transition-all duration-300 ease-linear"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: color,
          backgroundColor: '#1c1c1c',
          boxShadow: `0 5px 15px ${color}99`,
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
      />
    </div>
  );
};

export default VoiceMobius;