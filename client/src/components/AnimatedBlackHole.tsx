import React from 'react';

const AnimatedBlackHole = () => {
  console.log("Rendering AnimatedBlackHole component"); // Debug log

  return (
    <div className="relative w-16 h-16 mx-auto my-2 border border-red-500"> {/* Debug border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-700 via-black to-blue-700 opacity-80 blur-md animate-spin-slow animate-pulse-glow" />
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-black via-transparent to-transparent" />
      <div className="absolute inset-4 rounded-full bg-black" />
    </div>
  );
};

export default AnimatedBlackHole;