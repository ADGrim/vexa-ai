/**
 * Simplified AsyncStorage-compatible memory system for React Native
 * This implementation uses local variables for demonstration purposes
 * In a real app, you would use AsyncStorage from React Native or expo-file-system
 */

// Create a memory store
const memoryStore: Record<string, string> = {};

// Storage key prefix to avoid collisions
const STORAGE_KEY_PREFIX = 'vexa_';

/**
 * Save a key-value pair to persistent storage
 * @param key The storage key
 * @param value The value to store (will be JSON stringified)
 */
export const saveMemory = async (key: string, value: any): Promise<void> => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
    const valueToStore = JSON.stringify(value);
    
    // In a real implementation, you would use AsyncStorage:
    // await AsyncStorage.setItem(storageKey, valueToStore);
    
    // For demo purposes, we store in memory:
    memoryStore[storageKey] = valueToStore;
    
    console.log(`Saved data for key: ${key}`);
  } catch (error) {
    console.error('Error saving memory:', error);
    throw error;
  }
};

/**
 * Retrieve a value from persistent storage
 * @param key The storage key to retrieve
 * @returns The parsed value, or null if not found
 */
export const getMemory = async (key: string): Promise<any | null> => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
    
    // In a real implementation, you would use AsyncStorage:
    // const value = await AsyncStorage.getItem(storageKey);
    
    // For demo purposes, we retrieve from memory:
    const value = memoryStore[storageKey];
    
    if (value) {
      return JSON.parse(value);
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving memory:', error);
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
    const prefix = customPrefix 
      ? `${STORAGE_KEY_PREFIX}${customPrefix}`
      : STORAGE_KEY_PREFIX;
    
    // In a real implementation with AsyncStorage, you would:
    // const allKeys = await AsyncStorage.getAllKeys();
    // const filteredKeys = allKeys.filter(key => key.startsWith(prefix));
    // const pairs = await AsyncStorage.multiGet(filteredKeys);
    
    // For demo purposes, we filter from memory:
    const result: Record<string, any> = {};
    
    Object.keys(memoryStore)
      .filter(key => key.startsWith(prefix))
      .forEach(key => {
        const originalKey = key.replace(STORAGE_KEY_PREFIX, '');
        result[originalKey] = JSON.parse(memoryStore[key]);
      });
    
    return result;
  } catch (error) {
    console.error('Error loading all memory:', error);
    return {};
  }
};

/**
 * Remove a specific value from storage
 * @param key The key to remove
 */
export const removeMemory = async (key: string): Promise<void> => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
    
    // In a real implementation:
    // await AsyncStorage.removeItem(storageKey);
    
    // For demo:
    delete memoryStore[storageKey];
    
    console.log(`Removed data for key: ${key}`);
  } catch (error) {
    console.error('Error removing memory:', error);
    throw error;
  }
};

/**
 * Alias for removeMemory
 */
export const forgetMemory = removeMemory;

/**
 * Clear all stored values with the specified prefix
 * @param customPrefix Additional prefix to filter keys by (optional)
 */
export const clearMemory = async (customPrefix?: string): Promise<void> => {
  try {
    const prefix = customPrefix 
      ? `${STORAGE_KEY_PREFIX}${customPrefix}`
      : STORAGE_KEY_PREFIX;
    
    // In a real implementation:
    // const keys = await AsyncStorage.getAllKeys();
    // const keysToRemove = keys.filter(key => key.startsWith(prefix));
    // await AsyncStorage.multiRemove(keysToRemove);
    
    // For demo:
    Object.keys(memoryStore)
      .filter(key => key.startsWith(prefix))
      .forEach(key => {
        delete memoryStore[key];
      });
    
    console.log(`Cleared all data with prefix: ${prefix}`);
  } catch (error) {
    console.error('Error clearing memory:', error);
    throw error;
  }
};

/**
 * Alias for clearMemory with no prefix
 */
export const clearAllMemory = async (): Promise<void> => clearMemory();

// Export conversation-specific memory types and functions for convenience
export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ConversationMemory = ConversationMessage[];

/**
 * Add a message to the conversation memory
 */
export const addToConversationMemory = async (
  role: 'system' | 'user' | 'assistant',
  content: string
): Promise<void> => {
  try {
    // Get current memory
    const currentMemory = await getMemory('conversation') || [];
    
    // Add new message
    const updatedMemory = [
      ...currentMemory,
      { role, content }
    ];
    
    // Save updated memory
    await saveMemory('conversation', updatedMemory);
  } catch (error) {
    console.error('Error adding to conversation memory:', error);
    throw error;
  }
};

/**
 * Load the conversation memory
 */
export const loadConversationMemory = async (): Promise<ConversationMemory> => {
  try {
    return await getMemory('conversation') || [];
  } catch (error) {
    console.error('Error loading conversation memory:', error);
    return [];
  }
};

/**
 * Clear the conversation memory
 */
export const clearConversationMemory = async (): Promise<void> => {
  try {
    await saveMemory('conversation', []);
  } catch (error) {
    console.error('Error clearing conversation memory:', error);
    throw error;
  }
};