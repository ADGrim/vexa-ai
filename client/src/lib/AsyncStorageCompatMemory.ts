/**
 * AsyncStorage-compatible implementation of ConversationMemory for web
 * This provides the same API as the AsyncStorageMemory.ts in expo-components
 * but uses localStorage for web applications
 */

import { vexaSystemPrompt } from './vexaSystemPrompt';
import { ConversationMessage, ConversationMemory } from './conversationMemory';

const PREFIX = 'vexa-memory:';

/**
 * Save a key-value pair to persistent storage
 * @param key The storage key
 * @param value The value to store (will be JSON stringified)
 */
export const saveMemory = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(PREFIX + key, jsonValue);
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
    const jsonValue = localStorage.getItem(PREFIX + key);
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
    const result: Record<string, any> = {};
    const prefixToUse = customPrefix ? PREFIX + customPrefix : PREFIX;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefixToUse)) {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue !== null) {
          // Remove the PREFIX from the key for cleaner access
          const cleanKey = key.substring(PREFIX.length);
          result[cleanKey] = JSON.parse(jsonValue);
        }
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
    localStorage.removeItem(PREFIX + key);
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
    const vexaKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        vexaKeys.push(key);
      }
    }
    
    vexaKeys.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error('Error clearing memory:', e);
  }
};

// Alias for clearAllMemory to maintain compatibility with previous version
export const clearMemory = async (customPrefix?: string): Promise<void> => {
  if (customPrefix) {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX + customPrefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error('Error clearing memory with prefix:', e);
    }
  } else {
    await clearAllMemory();
  }
};

/**
 * Utility functions specific to conversation memory
 */

const CONVERSATION_KEY = 'conversations';
const MAX_MEMORY_LENGTH = 100;

/**
 * Add a message to the conversation memory
 */
export const addToConversationMemory = async (
  role: ConversationMessage['role'],
  content: string,
  maxMemoryLength: number = MAX_MEMORY_LENGTH
): Promise<ConversationMemory> => {
  try {
    const memory = await getMemory(CONVERSATION_KEY) || [{ role: 'system', content: vexaSystemPrompt }];
    
    const updatedMemory = [...memory, { role, content }];
    
    if (updatedMemory.length > maxMemoryLength) {
      updatedMemory.splice(1, updatedMemory.length - maxMemoryLength - 1);
    }
    
    await saveMemory(CONVERSATION_KEY, updatedMemory);
    return updatedMemory;
  } catch (error) {
    console.error('Failed to add to conversation memory:', error);
    return [{ role: 'system', content: vexaSystemPrompt }];
  }
};

/**
 * Load the conversation memory
 */
export const loadConversationMemory = async (): Promise<ConversationMemory> => {
  try {
    const memory = await getMemory(CONVERSATION_KEY);
    if (!memory) {
      return [{ role: 'system', content: vexaSystemPrompt }];
    }
    return memory;
  } catch (error) {
    console.error('Failed to load conversation memory:', error);
    return [{ role: 'system', content: vexaSystemPrompt }];
  }
};

/**
 * Clear the conversation memory
 */
export const clearConversationMemory = async (): Promise<void> => {
  try {
    await forgetMemory(CONVERSATION_KEY);
  } catch (error) {
    console.error('Failed to clear conversation memory:', error);
  }
};