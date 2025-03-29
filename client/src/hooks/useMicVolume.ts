import { useEffect, useState, useRef } from 'react';
import { getVoiceVolumeAnalyzer } from '@/lib/voiceVolume';

/**
 * A hook to get microphone volume in real-time
 * @param simulationMode - If true, will use simulated volume values instead of real microphone
 * @returns The current volume level between 0-1
 */
export const useMicVolume = (simulationMode = false) => {
  const [volume, setVolume] = useState(0);
  const analyzerRef = useRef<ReturnType<typeof getVoiceVolumeAnalyzer> | null>(null);
  const simulatorRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clean up function
    const cleanupFunc = () => {
      if (analyzerRef.current) {
        analyzerRef.current.stop();
        analyzerRef.current = null;
      }
      
      if (simulatorRef.current) {
        clearInterval(simulatorRef.current);
        simulatorRef.current = null;
      }
    };
    
    if (simulationMode) {
      // Use simulated volume for testing
      simulatorRef.current = window.setInterval(() => {
        // Generate smooth random volume changes
        setVolume((prev) => {
          const change = Math.random() * 0.1 - 0.05; // Small random change
          return Math.max(0, Math.min(1, prev + change));
        });
      }, 100);
    } else {
      // Use real microphone
      try {
        analyzerRef.current = getVoiceVolumeAnalyzer({
          onVolumeChange: (newVolume) => {
            setVolume(newVolume);
          }
        });
        
        analyzerRef.current.start();
      } catch (err) {
        console.error('Error initializing microphone:', err);
        // Fall back to simulation if mic access fails
        simulatorRef.current = window.setInterval(() => {
          setVolume(Math.random() * 0.4 + 0.1); // Random volume between 0.1-0.5
        }, 300);
      }
    }
    
    return cleanupFunc;
  }, [simulationMode]);
  
  return volume;
};

export default useMicVolume;