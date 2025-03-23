import { z } from 'zod';

// Configuration schema with environment variable support
export const VexaConfigSchema = z.object({
  personaTone: z.enum(['friendly', 'professional', 'casual']),
  creatorName: z.string().default(import.meta.env.VITE_CREATOR_NAME || 'User'),
  enableNovaVoice: z.boolean()
});

export type VexaConfig = z.infer<typeof VexaConfigSchema>;

// Load configuration from environment variables when possible
export const defaultConfig: VexaConfig = {
  personaTone: (import.meta.env.VITE_PERSONA_TONE as 'friendly' | 'professional' | 'casual') || 'friendly',
  creatorName: import.meta.env.VITE_CREATOR_NAME || 'User',
  enableNovaVoice: import.meta.env.VITE_ENABLE_NOVA_VOICE === 'true'
};

export function loadVexaConfig(): VexaConfig {
  try {
    // In a production environment, this would load from environment variables
    const config = {
      ...defaultConfig,
      // Allow runtime overrides through environment variables
      personaTone: (import.meta.env.VITE_PERSONA_TONE as 'friendly' | 'professional' | 'casual') || defaultConfig.personaTone,
      creatorName: import.meta.env.VITE_CREATOR_NAME || defaultConfig.creatorName,
      enableNovaVoice: import.meta.env.VITE_ENABLE_NOVA_VOICE === 'true'
    };

    return VexaConfigSchema.parse(config);
  } catch (error) {
    console.warn('Failed to load Vexa config, using defaults:', error);
    return defaultConfig;
  }
}