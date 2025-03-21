import React from 'react';

const AnimatedBlackHole = () => {
  return (
    <div className="relative w-16 h-16 mx-auto my-2">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-700 via-black to-blue-700 opacity-80 blur-md animate-spin-slow animate-pulse-glow"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-black via-transparent to-transparent"></div>
      <div className="absolute inset-4 rounded-full bg-black"></div>
    </div>
  );
};

export default AnimatedBlackHole;
