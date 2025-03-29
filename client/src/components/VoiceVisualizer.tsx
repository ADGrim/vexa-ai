import React, { useState } from 'react';
import MobiusStrip from './effects/MobiusStrip';
import { Button } from '@/components/ui/button';
import useMicVolume from '@/hooks/useMicVolume';
import { Mic, MicOff } from 'lucide-react';

interface VoiceVisualizerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * A component that visualizes voice input with a MobiusStrip animation
 */
export function VoiceVisualizer({
  size = 'md',
  color = '#9c27b0',
  className = ''
}: VoiceVisualizerProps) {
  const [active, setActive] = useState(false);
  // Use simulation mode when active is true, but we don't have actual mic access
  const [useSimulation, setUseSimulation] = useState(false);
  const volume = useMicVolume(useSimulation && active);

  const toggleActive = async () => {
    if (!active) {
      try {
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setUseSimulation(false); // Use real mic
      } catch (error) {
        console.error("Microphone permission error:", error);
        setUseSimulation(true); // Fall back to simulation
      }
    }
    setActive(!active);
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium mb-2">Voice Visualizer</h3>
        <p className="text-sm text-white/70">
          {active 
            ? 'Mobius strip animates based on voice volume' 
            : 'Click the button to activate'}
        </p>
      </div>
      
      <div className="relative mb-4 h-32 flex items-center justify-center">
        {active && (
          <div className="absolute">
            <MobiusStrip volume={volume} size={size} color={color} />
          </div>
        )}
      </div>
      
      <Button 
        onClick={toggleActive}
        variant={active ? "destructive" : "default"}
        className="rounded-full"
      >
        {active ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
        {active ? 'Stop' : 'Start'} Visualization
      </Button>
      
      {active && (
        <div className="mt-3 w-full max-w-xs bg-black/20 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-100"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default VoiceVisualizer;