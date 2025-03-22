import OpenAI from 'openai';
import { vexaSystemPrompt } from './vexaSystemPrompt';
import { ConversationMemory, addToConversationMemory, saveMemory } from './conversationMemory';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export type StreamCallback = (chunk: string) => void;

export const streamVexaResponse = async (
  userPrompt: string,
  onDataChunk: StreamCallback,
  memory: ConversationMemory
): Promise<ConversationMemory> => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // Add user message to memory
    let updatedMemory = addToConversationMemory('user', userPrompt, memory);

    let fullResponse = '';
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: updatedMemory,
      stream: true,
      temperature: 0.6,
      max_tokens: 500,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        onDataChunk(content);
      }
    }

    // Add assistant's response to memory
    updatedMemory = addToConversationMemory('assistant', fullResponse, updatedMemory);
    saveMemory(updatedMemory);
    return updatedMemory;

  } catch (error) {
    console.error('Error streaming response:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to stream response'
    );
  }
};

export const generateStreamError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return "OpenAI API key is not properly configured. Please check your settings.";
    }
    return `An error occurred: ${error.message}`;
  }
  return "An unknown error occurred while streaming the response.";
};