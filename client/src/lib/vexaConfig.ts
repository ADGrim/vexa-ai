import { z } from 'zod';

export const VexaConfigSchema = z.object({
  personaTone: z.enum(['friendly', 'professional', 'casual']),
  creatorName: z.string(),
  enableNovaVoice: z.boolean()
});

export type VexaConfig = z.infer<typeof VexaConfigSchema>;

export const defaultConfig: VexaConfig = {
  personaTone: 'friendly',
  creatorName: 'Adom',
  enableNovaVoice: true
};

export function loadVexaConfig(): VexaConfig {
  try {
    // In a production environment, this would load from an API or environment variables
    return defaultConfig;
  } catch (error) {
    console.warn('Failed to load Vexa config, using defaults:', error);
    return defaultConfig;
  }
}
