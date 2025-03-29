/**
 * IMPORTANT: This file is for Expo (React Native) use only
 * It requires 'expo-speech' package to be installed in your Expo/React Native project
 * Install with: expo install expo-speech
 * 
 * This will not work in a web environment without modification
 */

// @ts-ignore - Ignoring import error since this will only be used in Expo environment
import * as Speech from 'expo-speech';

const novaConfig = {
  language: 'en-GB',
  pitch: 1.2,
  rate: 0.95,
  voice: 'com.apple.ttsbundle.Moira-compact',
};

export const speakAsNova = (text: string) => {
  Speech.speak(text, novaConfig);
};

/**
 * Checks if text-to-speech is currently speaking
 * @returns A Promise that resolves to a boolean indicating speaking status
 */
export const isSpeaking = async (): Promise<boolean> => {
  return await Speech.isSpeakingAsync();
};

/**
 * Stops any ongoing text-to-speech
 */
export const stopSpeaking = () => {
  Speech.stop();
};

/**
 * Gets available voices on the device (available only on specific platforms)
 * @returns A Promise that resolves to an array of available voices
 */
export const getAvailableVoices = async () => {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.error('Error getting available voices:', error);
    return [];
  }
};