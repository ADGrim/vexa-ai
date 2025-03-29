# Vexa AI Mobile

Vexa is an intelligent AI assistant built with React Native + Expo. Inspired by ChatGPT and modern voice UX.

## Features

- Mobius strip animation for voice mode
- British-accented Nova voice
- Text & speech chat
- Sidebar for voice & task control
- Profile dropdown (top-right)
- Dark theme, futuristic layout

## Tech

- Expo SDK 52
- React Native 0.73
- TypeScript
- expo-speech, expo-av
- Animated + 3D-style Mobius

## Getting Started

```bash
npm install
npx expo start --tunnel
```

## Components Overview

- **VexaIntro**: Welcome screen with fade-in animation and voice greeting
- **ProfileDropdown**: User account menu with settings, voice toggle, and logout options
- **VoiceButton**: Voice input button with animated wave effect 
- **MobiusStrip**: Infinity-like animation that responds to voice volume
- **MobiusLoader**: Compact loading animation with customizable size and color
- **VoiceMobius**: 3D rotating animation for voice listening indicator
- **WaveAnimation**: Audio visualization component for speech feedback
- **VexaChat**: Complete chat interface with AI responses
- **Voice**: Text-to-speech functionality with Nova voice

## Integrating with Expo

See the main [documentation](../README.md) for detailed integration instructions.

## Example Implementation

For a complete implementation example:
- See [ProfileDropdownExample.tsx](./ProfileDropdownExample.tsx) for the user profile menu
- Additional examples are available in this directory for other components