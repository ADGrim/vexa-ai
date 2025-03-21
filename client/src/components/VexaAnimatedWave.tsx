import React, { useEffect, useState } from 'react';

interface VexaAnimatedWaveProps {
  speaking: boolean;
}

export function VexaAnimatedWave({ speaking }: VexaAnimatedWaveProps) {
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    if (speaking) {
      setAnimationTrigger(true);
    } else {
      setTimeout(() => setAnimationTrigger(false), 500);
    }
  }, [speaking]);

  return (
    <div className="flex justify-center items-center">
      <svg
        width="150"
        height="50"
        viewBox="0 0 150 50"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animationTrigger ? 'wave-animate' : ''}`}
      >
        {[...Array(5)].map((_, i) => (
          <rect
            key={i}
            x={i * 30}
            y="10"
            width="8"
            height="30"
            rx="4"
            fill="currentColor"
            className="text-purple-500"
          >
            <animate
              attributeName="height"
              values="20;40;20"
              dur={`${0.8 + i * 0.1}s`}
              repeatCount="indefinite"
              begin={speaking ? "0s" : "indefinite"}
            />
            <animate
              attributeName="y"
              values="15;5;15"
              dur={`${0.8 + i * 0.1}s`}
              repeatCount="indefinite"
              begin={speaking ? "0s" : "indefinite"}
            />
          </rect>
        ))}
      </svg>
    </div>
  );
}

export default VexaAnimatedWave;
