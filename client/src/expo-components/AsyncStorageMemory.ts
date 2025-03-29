/**
 * IMPORTANT: This file is for React Native use only
 * It requires '@react-native-async-storage/async-storage' package to be installed
 * Install with: npm install @react-native-async-storage/async-storage
 * 
 * This provides an alternative storage implementation using AsyncStorage
 * instead of expo-file-system, which may be preferable in certain React Native setups.
 */

// @ts-ignore - Ignoring import error since this will only be used in React Native environment
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'vexa-memory:';

/**
 * Save a key-value pair to persistent storage
 * @param key The storage key
 * @param value The value to store (will be JSON stringified)
 */
export const saveMemory = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(PREFIX + key, jsonValue);
  } catch (e) {
    console.error('Error saving memory:', e);
  }
};

/**
 * Retrieve a value from persistent storage
 * @param key The storage key to retrieve
 * @returns The parsed value, or null if not found
 */
export const getMemory = async (key: string): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(PREFIX + key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading memory:', e);
    return null;
  }
};

/**
 * Load all key-value pairs with a specific prefix
 * @param customPrefix Additional prefix to filter keys by (optional)
 * @returns A Record object with all matching key-value pairs
 */
export const loadAllMemory = async (customPrefix?: string): Promise<Record<string, any>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const prefixToUse = customPrefix ? PREFIX + customPrefix : PREFIX;
    const filteredKeys = keys.filter(key => key.startsWith(prefixToUse));
    
    const result: Record<string, any> = {};
    for (const key of filteredKeys) {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        // Remove the PREFIX from the key for cleaner access
        const cleanKey = key.substring(PREFIX.length);
        result[cleanKey] = JSON.parse(jsonValue);
      }
    }
    
    return result;
  } catch (e) {
    console.error('Error loading all memory:', e);
    return {};
  }
};

/**
 * Remove a specific value from storage
 * @param key The key to remove
 */
export const forgetMemory = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch (e) {
    console.error('Error forgetting memory:', e);
  }
};

// Alias for forgetMemory to maintain compatibility with previous version
export const removeMemory = forgetMemory;

/**
 * Clear all stored values with the Vexa prefix
 */
export const clearAllMemory = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const vexaKeys = keys.filter((key) => key.startsWith(PREFIX));
    await AsyncStorage.multiRemove(vexaKeys);
  } catch (e) {
    console.error('Error clearing memory:', e);
  }
};

// Alias for clearAllMemory to maintain compatibility with previous version
export const clearMemory = async (customPrefix?: string): Promise<void> => {
  if (customPrefix) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => key.startsWith(PREFIX + customPrefix));
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (e) {
      console.error('Error clearing memory with prefix:', e);
    }
  } else {
    await clearAllMemory();
  }
};