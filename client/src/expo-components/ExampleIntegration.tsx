/**
 * This is an example integration showing how to use all Vexa components together
 * in an Expo/React Native application.
 * 
 * IMPORTANT: This file is for reference only and will not run in a web environment.
 * It is intended to be copied into a React Native / Expo project and used there.
 * You'll need to install necessary packages:
 * - expo-speech
 * - expo-file-system
 * - react-native (already included in Expo projects)
 * 
 * This file contains TypeScript/React Native syntax that will show errors in a web context.
 */
// @ts-ignore - Ignoring imports for demonstration purposes
import React, { useState, useEffect } from 'react';
// @ts-ignore - This import would work in a React Native environment
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// @ts-ignore - For demonstration purposes only
import { VoiceButton } from './VoiceButton';
// @ts-ignore - For demonstration purposes only
import { WaveAnimation } from './WaveAnimation';
// @ts-ignore - For demonstration purposes only
import { speakAsNova, isSpeaking, stopSpeaking } from './Voice';
// @ts-ignore - For demonstration purposes only
import { saveMemory, loadMemory } from './memory';

// Example conversation type
type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
};

export const VexaChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentlySpeaking, setCurrentlySpeaking] = useState(false);
  
  // Load conversation on component mount
  useEffect(() => {
    loadSavedConversation();
  }, []);
  
  // Check speaking status periodically
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentlySpeaking) {
      interval = setInterval(async () => {
        const speaking = await isSpeaking();
        if (!speaking) {
          setCurrentlySpeaking(false);
        }
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentlySpeaking]);
  
  // Load saved conversation from storage
  const loadSavedConversation = async () => {
    try {
      const savedMessages = await loadMemory('vexa_conversation');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };
  
  // Save conversation to storage
  const saveConversation = async () => {
    try {
      await saveMemory('vexa_conversation', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };
  
  // Handle user voice input
  const handleVoiceTranscript = (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Save after adding user message
    saveConversation();
    
    // Simulate AI response (in a real app, you would call your API here)
    setTimeout(() => {
      respondToMessage(text);
    }, 1000);
  };
  
  // Generate and speak AI response
  const respondToMessage = (userText: string) => {
    // In a real app, this would be an API call to get the AI response
    const aiResponse = `I received your message: "${userText}". How can I help further?`;
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: aiResponse,
      isUser: false,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, aiMessage];
    setMessages(updatedMessages);
    
    // Save after adding AI message
    saveConversation();
    
    // Speak the response
    speakAsNova(aiResponse);
    setCurrentlySpeaking(true);
  };
  
  // Stop speaking
  const handleStopSpeaking = () => {
    stopSpeaking();
    setCurrentlySpeaking(false);
  };
  
  // Clear conversation
  const clearConversation = async () => {
    setMessages([]);
    await saveMemory('vexa_conversation', '[]');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vexa AI Assistant</Text>
        <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Chat</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageBubble,
              message.isUser ? styles.userMessage : styles.aiMessage
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.inputContainer}>
        {currentlySpeaking ? (
          <View style={styles.speakingContainer}>
            <WaveAnimation isActive={true} />
            <TouchableOpacity onPress={handleStopSpeaking} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <VoiceButton onTranscript={handleVoiceTranscript} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#3b82f6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  aiMessage: {
    backgroundColor: '#6366f1',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  speakingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 24,
  },
  stopButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default VexaChatScreen;