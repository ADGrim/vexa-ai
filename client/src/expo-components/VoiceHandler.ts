import { Audio } from 'expo-av';
import * as Speech from 'expo-speech-recognition';
import { useState, useEffect } from 'react';

export interface VoiceRecognitionResult {
  value: string;
  isFinal: boolean;
}

/**
 * React hook for handling voice input in React Native using Expo
 * Manages permissions, listening state, and voice recognition
 * 
 * @param callback Function to call when voice recognition returns a result
 */
export function useVoiceHandler(callback: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [volume, setVolume] = useState(0);

  // Request microphone permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Speech.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Cleanup listener on unmount
    return () => {
      if (listening) {
        Speech.stopListeningAsync().catch(console.error);
      }
    };
  }, []);

  /**
   * Begin listening for voice input
   */
  const startListening = async () => {
    if (!hasPermission) {
      console.error('Voice recognition permission not granted');
      return;
    }

    try {
      setListening(true);
      await Speech.startListeningAsync({
        onResult: (result: VoiceRecognitionResult) => {
          if (result.value) {
            callback(result.value);
            Speech.stopListeningAsync();
            setListening(false);
          }
        },
        onVolumeChanged: (volume: number) => {
          setVolume(Math.min(1, Math.max(0, volume))); // Ensure volume is between 0-1
        },
        continuous: false,
        partialResults: false,
        language: 'en-US'
      });
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setListening(false);
    }
  };

  /**
   * Stop listening for voice input
   */
  const stopListening = async () => {
    if (listening) {
      await Speech.stopListeningAsync();
      setListening(false);
      setVolume(0);
    }
  };

  /**
   * Toggle listening state
   */
  const toggleListening = async () => {
    if (listening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  return { 
    startListening, 
    stopListening, 
    toggleListening,
    listening, 
    hasPermission,
    volume 
  };
}

export default useVoiceHandler;
