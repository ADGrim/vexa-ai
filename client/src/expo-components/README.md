# Vexa Voice Chat Components for Expo

This package provides voice chat components optimized for React Native and Expo applications.

## Installation

```bash
npm install vexa-voice-chat expo-av@~14.0.2 expo-speech@~12.4.0
```

For AsyncStorage support (optional, recommended for React Native apps):
```bash
npm install @react-native-async-storage/async-storage
```

### Compatible Versions
- Expo: 52.0.3+
- React Native: 0.73.6+
- React: 18.2.0+

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
import { saveMemory, getMemory, loadAllMemory, forgetMemory, clearAllMemory } from 'vexa-voice-chat/AsyncStorageMemory';

// Save data (automatically handles JSON.stringify)
await saveMemory('user_settings', { darkMode: true, voiceEnabled: true });

// Load data (automatically handles JSON.parse)
const settings = await getMemory('user_settings');

// Load all conversations with a specific prefix
const allConversations = await loadAllMemory('conversation_');

// Remove specific data
await forgetMemory('temp_data');

// Clear all Vexa data
await clearAllMemory();
```

#### Usage in Application Startup

```jsx
import { useEffect } from 'react';
import { saveMemory, getMemory } from './utils/memory';

export default function App() {
  useEffect(() => {
    const boot = async () => {
      const mood = await getMemory('user-mood');
      if (!mood) {
        await saveMemory('user-mood', 'curious');
      }
    };

    boot();
  }, []);

  return (
    // your app...
  );
}
```

### WebSocket Integration

For real-time communication with an AI server:

```jsx
import { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage } from 'vexa-voice-chat/websocket';

export default function VexaChat() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Connect to the WebSocket server
    const ws = connectWebSocket({
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
      onMessage: (data) => {
        if (data.type === 'chat' && data.role === 'assistant') {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.content 
          }]);
        }
      }
    });
    
    return () => {
      // Clean up the connection
      if (ws) ws.close();
    };
  }, []);
  
  const handleSendMessage = (text) => {
    // Send a message to the server
    sendMessage({ type: 'chat', content: text });
    
    // Add the user message to the UI
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: text 
    }]);
  };
  
  return (
    <View>
      {/* Messages */}
      {messages.map((msg, i) => (
        <ChatBubble 
          key={i}
          text={msg.content}
          isUser={msg.role === 'user'}
        />
      ))}
      
      {/* Connection indicator */}
      {!isConnected && (
        <Text style={styles.errorText}>
          Disconnected from server
        </Text>
      )}
      
      {/* Input */}
      <VoiceButton onTranscript={handleSendMessage} />
    </View>
  );
}
```

## Components

### VoiceButton
A button component that handles voice input with an animated wave effect.

### WaveAnimation
A standalone wave animation component that can be used independently.

### MobiusStrip
An animated Möbius strip (infinity-like) rotating animation with customizable styles.

```jsx
import { MobiusStrip } from 'vexa-voice-chat';

// Use as a voice listening indicator
{voiceListening && <MobiusStrip />}

// Or as a loading indicator
{isLoading && <MobiusStrip />}
```

### MobiusLoader
A simplified loading animation inspired by a Möbius strip, using a dashed circular border animation.

```jsx
import { MobiusLoader } from 'vexa-voice-chat';

// Use as a compact loading indicator
<MobiusLoader />

// With custom size and color
<MobiusLoader 
  size={80}  // Default is 100
  color="#a855f7" // Default is purple
/>
```

### VoiceMobius
A 3D rotating animation inspired by a Möbius strip, perfect for indicating active voice listening.

```jsx
import { VoiceMobius } from 'vexa-voice-chat';

// Basic usage
<VoiceMobius />

// With custom properties
<VoiceMobius
  size={150}           // Size in pixels (default: 150)
  color="#8e44ad"      // Border and shadow color (default: #8e44ad)
  isActive={listening} // Control animation (default: true)
  style={{ margin: 10 }} // Additional styles (React Native only)
/>
```

### Voice
Text-to-speech functionality with configurable voice settings.

## Utilities

### useVoiceHandler
A hook that provides voice recognition functionality.

### Memory
Utilities for persistent storage of conversations and settings.

## Features
- Voice recognition with Expo's Speech API
- Text-to-speech with custom voice configuration
- Animated wave effect during voice input
- Dual storage options: FileSystem or AsyncStorage
- Persistent storage for conversations and preferences
- Microphone permission handling
- Real-time communication via WebSockets
- Multiple visual loading animations (MobiusStrip, MobiusLoader, VoiceMobius)
- 3D rotating animations compatible with both web and React Native
- TypeScript support
- Expo-optimized animations
- Complete example implementation with working UI
- Compatible with the latest Expo 52.0.3 and React Native 0.73.6
