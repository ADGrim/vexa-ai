import { vexaSystemPrompt } from './vexaSystemPrompt';

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ConversationMemory = ConversationMessage[];

const MEMORY_KEY = 'vexa_conversation_memory';
const MAX_MEMORY_LENGTH = 100;

export const addToConversationMemory = (
  role: ConversationMessage['role'],
  content: string,
  memory: ConversationMemory,
  maxMemoryLength: number = MAX_MEMORY_LENGTH
): ConversationMemory => {
  const updatedMemory = [...memory, { role, content }];
  if (updatedMemory.length > maxMemoryLength) {
    updatedMemory.splice(1, updatedMemory.length - maxMemoryLength - 1);
  }
  return updatedMemory;
};

export const saveMemory = (memory: ConversationMemory): void => {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch (error) {
    console.error('Failed to save conversation memory:', error);
  }
};

export const loadMemory = (): ConversationMemory => {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (!stored) {
      return [{ role: 'system', content: vexaSystemPrompt }];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load conversation memory:', error);
    return [{ role: 'system', content: vexaSystemPrompt }];
  }
};

export const clearMemory = (): void => {
  try {
    localStorage.removeItem(MEMORY_KEY);
  } catch (error) {
    console.error('Failed to clear conversation memory:', error);
  }
};
