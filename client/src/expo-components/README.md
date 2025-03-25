# Vexa Voice Chat Components for Expo

This package provides voice chat components optimized for React Native and Expo applications.

## Installation

```bash
npm install vexa-voice-chat expo-av expo-speech-recognition
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

## Components

### VoiceButton
A button component that handles voice input with an animated wave effect.

### WaveAnimation
A standalone wave animation component that can be used independently.

### useVoiceHandler
A hook that provides voice recognition functionality.

## Features
- Voice recognition with Expo's Speech Recognition API
- Animated wave effect during voice input
- Microphone permission handling
- TypeScript support
- Expo-optimized animations
