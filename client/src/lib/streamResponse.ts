import OpenAI from 'openai';
import { vexaSystemPrompt } from './vexaSystemPrompt';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export type StreamCallback = (chunk: string) => void;

export const streamVexaResponse = async (
  userPrompt: string,
  onDataChunk: StreamCallback
): Promise<void> => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: vexaSystemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onDataChunk(content);
      }
    }
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
