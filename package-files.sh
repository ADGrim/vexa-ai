#!/bin/bash

# Create directories
mkdir -p vexa_package/components
mkdir -p vexa_package/expo-components
mkdir -p vexa_package/hooks
mkdir -p vexa_package/lib

# Copy key components
cp client/src/components/VexaVoiceButton.tsx vexa_package/components/
cp client/src/components/VexaVoiceListener.tsx vexa_package/components/
cp client/src/components/WaveButton.tsx vexa_package/components/
cp client/src/components/WaveButton.css vexa_package/components/
cp client/src/components/TypewriterBubble.tsx vexa_package/components/
cp client/src/components/ChatInputBar.tsx vexa_package/components/
cp client/src/components/SidebarWaveIcon.tsx vexa_package/components/
cp client/src/components/VexaChatUI.tsx vexa_package/components/
cp client/src/components/VexaLayout.tsx vexa_package/components/

# Copy chat components
mkdir -p vexa_package/components/chat
cp client/src/components/chat/ChatBubble.tsx vexa_package/components/chat/
cp client/src/components/chat/ChatMessage.tsx vexa_package/components/chat/
cp client/src/components/chat/SoundWave.tsx vexa_package/components/chat/

# Copy Expo components
cp client/src/expo-components/* vexa_package/expo-components/

# Copy hooks
cp client/src/hooks/useVoiceHandler.ts vexa_package/hooks/

# Copy lib files
cp client/src/lib/vexaConfig.ts vexa_package/lib/
cp client/src/lib/vexaSystemPrompt.ts vexa_package/lib/
cp client/src/lib/userTasks.json vexa_package/lib/

# Copy existing zips
cp client/src/vexa-voice-chat.zip vexa_package/
cp attached_assets.zip vexa_package/
cp complete_project.zip vexa_package/

# Create metadata file
cat > vexa_package/README.md << 'EOF'
# VexaAI Package

This package contains all the components and assets for VexaAI, including:

## Voice Components
- VexaVoiceButton: Handles voice recognition and UI
- VexaVoiceListener: Processes voice commands
- WaveButton: Animated button for voice interactions

## Chat Components
- ChatBubble: Advanced circular message bubbles with gradients
- TypewriterBubble: Animated typing effect for AI responses
- ChatInputBar: Enhanced input bar with voice integration

## Expo Integration
The expo-components folder contains mobile-optimized versions of all voice features

## Data
- userTasks.json: Contains your tasks and reminders
- vexaConfig.ts: Configuration system that supports the creator name setting
- vexaSystemPrompt.ts: Customizable system prompt for the AI

## Zip Archives
- vexa-voice-chat.zip: Core voice chat components
- attached_assets.zip: All user-provided assets
- complete_project.zip: Full project including all components

Created for adom - VexaAI (March 2025)
EOF

# Create the final zip file
zip -r vexa_complete_package.zip vexa_package/

echo "Package created: vexa_complete_package.zip"