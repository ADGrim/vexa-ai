# VexaAI: Advanced Multimodal AI Assistant

VexaAI is a cutting-edge AI assistant with emotionally intelligent, dynamically responsive conversational capabilities powered by voice and text interaction technologies.

## Features

### Core Capabilities
- **Multimodal Interaction**: Communicate through text, voice, and visual elements
- **Emotional Intelligence**: Detects user mood and adapts response style accordingly
- **Voice Recognition & Synthesis**: Understands spoken input and responds with natural speech
- **Dynamic Chat Interface**: Circular message bubbles with gradient backgrounds and typing animations
- **Persistent Memory**: Stores conversation history and user preferences

### Advanced UI Elements
- **Animated Sound Wave**: Visualizes audio input and output
- **Black Hole Visualization**: Creates visual representations of AI thinking process
- **Circular Message Bubbles**: Modern chat interface with gradient backgrounds
- **Animated Typing Indicators**: Shows when AI is generating a response
- **Responsive Layouts**: Adapts to different screen sizes and orientations

### Platform Support
- **Web Application**: Full-featured web interface
- **Mobile Integration**: Expo-compatible components for React Native apps
- **Cross-Platform**: Core functionality works across devices

## Package Contents

This complete package includes:

```
components/          # React components for web interface
├── chat/            # Chat UI components
├── controls/        # UI control elements
├── effects/         # Visual effects and animations
├── ui/              # Base UI components (from shadcn/ui)
├── ...              # Various specialized components

lib/                 # Core functionality and utilities
├── vexaConfig.ts    # Configuration settings
├── vexaVoice.ts     # Voice synthesis functionality
├── vexaSafety.ts    # Safety and content guidelines
├── speakMyStyle.ts  # Style adaptation system
├── AsyncStorageCompatMemory.ts # Web-compatible AsyncStorage implementation
├── userTasks.json   # Task and reminder data
├── ...              # Other utility functions

expo-components/     # Expo/React Native compatible components
├── VoiceButton.tsx  # Voice input button for mobile
├── WaveAnimation.tsx # Audio visualization for mobile
├── Voice.tsx             # Text-to-speech for Expo
├── memory.ts             # FileSystem storage for mobile
├── AsyncStorageMemory.ts # Alternative storage using AsyncStorage
├── ...                   # Other mobile components

pages/               # Complete page components
└── VexaAI.tsx       # Main VexaAI interface

hooks/               # Custom React hooks
└── useVoiceHandler.ts # Voice recognition hook
```

## Installation

### Web Application
1. Copy the components into your React project
2. Install dependencies:
   ```
   npm install @radix-ui/react-* shadcn-ui tailwindcss openai react-icons
   ```
3. Configure your OpenAI API key in environment variables:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   VITE_CREATOR_NAME=your_name_here
   ```

### Mobile Application (Expo)
1. Copy the `expo-components` directory into your React Native project
2. Install required Expo packages:
   ```
   expo install expo-speech expo-file-system openai react-native-reanimated
   ```
3. For AsyncStorage support (optional):
   ```
   expo install @react-native-async-storage/async-storage
   ```
4. See the `expo-components/README.md` for detailed integration instructions

## Usage

### Basic Implementation
```jsx
import { VexaChatUI } from './components/VexaChatUI';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSendMessage = () => {
    // Add message to chat
    // Process with AI
    // Update state
  };

  return (
    <VexaChatUI
      messages={messages}
      input={input}
      onInputChange={setInput}
      onSendMessage={handleSendMessage}
      isSpeaking={isSpeaking}
    />
  );
}
```

### Persistent Storage
VexaAI supports multiple storage options for saving conversations and settings:

#### Web Applications
```jsx
// Import web-compatible AsyncStorage implementation
import { 
  saveMemory, 
  getMemory, 
  loadAllMemory, 
  forgetMemory, 
  clearAllMemory 
} from './lib/AsyncStorageCompatMemory';

// Save user preferences
await saveMemory('user_settings', { darkMode: true, voiceEnabled: true });

// Load user preferences
const settings = await getMemory('user_settings');

// Get all conversations
const allConversations = await loadAllMemory('conversation_');

// Clear specific settings
await forgetMemory('temp_data');

// Clear all Vexa data
await clearAllMemory();
```

### Complete Application
For a full implementation, see the `pages/VexaAI.tsx` component which demonstrates how all pieces work together.

## Customization

### Visual Styling
- Modify the color schemes in `MoodSyncWrapper.tsx` for different themes
- Adjust the chat bubble styling in `ChatBubble.tsx`
- Customize animations in the various animation components

### Voice Configuration
- Change the voice settings in `vexaVoice.ts` for web
- Modify the voice configuration in `expo-components/Voice.tsx` for mobile

### AI Behavior
- Adjust the system prompt in `vexaSystemPrompt.ts` to change AI personality
- Modify the style adaptation logic in `SpeakMyStyle.ts`

## License
MIT

---

Created by the VexaAI Team