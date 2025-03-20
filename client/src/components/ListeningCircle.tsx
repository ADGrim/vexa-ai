import React from 'react';

export const ListeningCircle = () => (
  <div className="flex justify-center items-center mt-4">
    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-ping opacity-70"></div>
    <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-90"></div>
  </div>
);
