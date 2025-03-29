// Voice recognition
export { useVoiceHandler } from './VoiceHandler';
export { WaveAnimation } from './WaveAnimation';
export { VoiceButton } from './VoiceButton';

// Visual effects
export { MobiusStrip } from './MobiusStrip';

// Storage implementations
export { saveMemory, loadMemory, getMemory } from './memory';

// Text-to-speech
export { speakAsNova, isSpeaking, stopSpeaking, getAvailableVoices } from './Voice';

// Full example
export { default as VexaChatScreen } from './ExampleIntegration';

// Alternative storage
import * as AsyncStorageMemory from './AsyncStorageMemory';
export { AsyncStorageMemory };
