import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    return `<img src="${imageUrl}" alt="${prompt}" class="w-full h-auto rounded-lg" />`;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to generate image'
    );
  }
};
