# Vexa AI — Advanced Multimodal AI Assistant

Vexa AI is a cutting-edge AI assistant featuring emotionally intelligent, dynamically responsive conversational capabilities powered by voice and text interaction technologies, available for both web and mobile platforms.

---

## 🚀 Features  
- **Multimodal Interaction** - Communicate through text, voice, and visual elements
- **Voice Recognition & Synthesis** - Understands spoken input and responds with natural speech
- **Emotional Intelligence** - Detects user mood and adapts response style accordingly
- **Dynamic Chat Interface** - Circular message bubbles with gradient backgrounds and typing animations
- **Persistent Memory** - Stores conversation history and user preferences
- **Advanced Visualizations** - Audio wave animations, Möbius strip, and black hole visualizations  
- **Cross-Platform Support** - Web application and React Native/Expo mobile versions

---

## 🌐 Platform Support

### Web Application
- React + TypeScript frontend
- Vite build system
- Web Speech API for voice recognition
- OpenAI API for intelligent responses
- OpenAI TTS with "Nova" voice
- Three.js for 3D visual effects

### Mobile Application
- React Native + Expo SDK 52
- TypeScript
- expo-speech & expo-av
- Animated 3D-style Möbius visualizations
- ProfileDropdown component for user interface
- Dark theme with futuristic layout
- British-accented Nova voice

---

## 🛠️ Installation & Setup  

### Web Application
1. Clone this repo:
```bash
git clone https://github.com/vexa-ai/vexa-ai.git
cd vexa-ai
```
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the project root:
```
VITE_OPENAI_API_KEY=your_api_key_here
VITE_CREATOR_NAME=your_name_here
```
4. Start the development server:
```bash
npm run dev
```

### Mobile Application
1. Navigate to the Expo components directory:
```bash
cd client/src/expo-components
```
2. Install dependencies:
```bash
npm install
```
3. Start the Expo development server:
```bash
npx expo start --tunnel
```

---

## 📦 Package Contents

For details on components and integration, see:
- [Web Application Documentation](client/src/VexaAI-README.md)
- [Mobile Components Documentation](client/src/expo-components/README.md)
- [Mobile Examples](client/src/expo-components/examples/README.md)

---

## 🔮 Roadmap  
- ✅ GPT-4o powered responses
- ✅ Nova TTS integration
- ✅ Sound wave & Möbius animations
- ✅ Voice recognition with visual feedback
- ✅ Style adaptation with SpeakMyStyle
- ✅ React Native/Expo mobile version
- ✅ Cross-platform memory storage options
- ✅ User profile and settings interface
- 🚧 Standalone Electron desktop app
- 🚧 Wake-word listening (voice trigger activation)

---

## 📚 Technologies  
- React / React Native
- TypeScript
- OpenAI GPT-4o & TTS API
- Three.js for 3D visualizations
- Expo SDK for mobile development
- Web Speech API / Expo Speech
- WebSocket for real-time communication

---

## 🛡 License  
This project is licensed under the MIT License — free to use for personal and commercial projects.

---

Created by the VexaAI Team