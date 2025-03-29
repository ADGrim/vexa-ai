# Vexa Voice Chat Components for Expo

This package provides voice chat components optimized for React Native and Expo applications.

## Installation

```bash
npm install vexa-voice-chat expo-av expo-speech expo-speech-recognition expo-file-system
```

For AsyncStorage support (optional, recommended for React Native apps):
```bash
npm install @react-native-async-storage/async-storage
```

## Required Permissions

Add these to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-av",
        {
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone."
        }
      ]
    ]
  }
}
```

## Usage

### Voice Recognition

```jsx
import { VoiceButton, useVoiceHandler } from 'vexa-voice-chat';

export default function ChatScreen() {
  const handleTranscript = (text) => {
    console.log('Received voice transcript:', text);
    // Handle the transcribed text
  };

  return (
    <VoiceButton onTranscript={handleTranscript} />
  );
}
```

### Text-to-Speech

```jsx
import { speakAsNova, stopSpeaking } from 'vexa-voice-chat';

// Speak text with the Nova voice
speakAsNova("Hello, I'm Nova. How can I assist you today?");

// Check if speaking
const checkSpeaking = async () => {
  const speaking = await isSpeaking();
  console.log('Is speaking:', speaking);
};

// Stop speech
const handleStop = () => {
  stopSpeaking();
};
```

### Memory Storage

Two storage options are available:

#### Option 1: FileSystem Storage (Default)
```jsx
import { saveMemory, getMemory } from 'vexa-voice-chat';

// Save a conversation
const saveConversation = async () => {
  await saveMemory('conversation', JSON.stringify(messages));
};

// Load a conversation
const loadConversation = async () => {
  const savedConversation = await getMemory('conversation');
  if (savedConversation) {
    setMessages(JSON.parse(savedConversation));
  }
};
```

#### Option 2: AsyncStorage 
```jsx
// Import AsyncStorage implementation instead
import { saveMemory, getMemory, loadAllMemory, clearMemory } from 'vexa-voice-chat/AsyncStorageMemory';

// Save data
await saveMemory('vexa_settings', JSON.stringify(settings));

// Load data
const settings = await getMemory('vexa_settings');

// Load all conversations with a specific prefix
const allConversations = await loadAllMemory('conversation_');

// Clear specific data types
await clearMemory('temp_');
```

## Components

### VoiceButton
A button component that handles voice input with an animated wave effect.

### WaveAnimation
A standalone wave animation component that can be used independently.

### Voice
Text-to-speech functionality with configurable voice settings.

## Utilities

### useVoiceHandler
A hook that provides voice recognition functionality.

### Memory
Utilities for persistent storage of conversations and settings.

## Features
- Voice recognition with Expo's Speech Recognition API
- Text-to-speech with custom voice configuration
- Animated wave effect during voice input
- Dual storage options: FileSystem or AsyncStorage
- Persistent storage for conversations and preferences
- Microphone permission handling
- TypeScript support
- Expo-optimized animations
- Complete example implementation with working UI
