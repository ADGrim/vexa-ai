/**
 * IMPORTANT: This file is for Expo (React Native) use only
 * It requires 'expo-file-system' package to be installed in your Expo/React Native project
 * Install with: expo install expo-file-system
 * 
 * This will not work in a web environment without modification
 */

// @ts-ignore - Ignoring import error since this will only be used in Expo environment
import * as fs from 'expo-file-system';

const memoryFilePath = `${fs.documentDirectory}vexa-memory.json`;

export const saveMemory = async (key: string, value: string) => {
  const memory = await loadMemory();
  memory[key] = value;
  await fs.writeAsStringAsync(memoryFilePath, JSON.stringify(memory, null, 2));
};

export const loadMemory = async (): Promise<Record<string, string>> => {
  try {
    const content = await fs.readAsStringAsync(memoryFilePath);
    return JSON.parse(content);
  } catch {
    return {};
  }
};

export const getMemory = async (key: string) => {
  const memory = await loadMemory();
  return memory[key] || null;
};