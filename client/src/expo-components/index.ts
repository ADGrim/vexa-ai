// Core React Native Components
export { default as VexaChat } from './VexaChat';
export { default as VexaMobileChat } from './VexaMobileChat';
export { VoiceButton } from './VoiceButton';
export { WaveAnimation } from './WaveAnimation';
export { default as MobiusWave } from './MobiusWave';
export { default as ExpoApp } from './App';

// Voice handling
export { 
  useVoiceHandler,
  type VoiceRecognitionResult 
} from './VoiceHandler';

// Memory/Storage utilities
export {
  saveMemory,
  getMemory,
  loadAllMemory,
  removeMemory,
  forgetMemory,
  clearMemory,
  clearAllMemory,
  addToConversationMemory,
  loadConversationMemory,
  clearConversationMemory,
  type ConversationMessage,
  type ConversationMemory
} from './memory';

// Visual effects and visualizations
export { MobiusStrip } from './MobiusStrip';

// Text-to-speech
export { speakAsNova, isSpeaking, stopSpeaking, getAvailableVoices } from './Voice';

// Full example implementations
export { default as VexaChatScreen } from './ExampleIntegration';

// Alternative storage implementations
import * as AsyncStorageMemory from './AsyncStorageMemory';
export { AsyncStorageMemory };
