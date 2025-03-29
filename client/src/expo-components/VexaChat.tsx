import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { VoiceButton } from './VoiceButton';
import { WaveAnimation } from './WaveAnimation';
import { saveMemory, getMemory } from './memory';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  isTyping?: boolean;
}

export default function VexaChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const animationTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Load conversation history on start
  useEffect(() => {
    async function loadHistory() {
      try {
        const savedMessages = await getMemory('vexa_conversation');
        if (savedMessages) {
          setMessages(savedMessages);
        } else {
          // Welcome message if no history
          setMessages([
            {
              text: "Hello! I'm Vexa, your AI assistant. How can I help you today?",
              sender: 'ai'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    }
    
    loadHistory();
    
    return () => {
      // Clear any animation timeouts when component unmounts
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Save messages when they change
  useEffect(() => {
    if (messages.length > 0 && !messages.some(m => m.isTyping)) {
      saveMemory('vexa_conversation', messages);
    }
  }, [messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Type animation effect
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping, typingAnimation]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    Keyboard.dismiss();
    
    // Show typing indicator
    setIsTyping(true);
    const typingIndicator: Message = { text: '', sender: 'ai', isTyping: true };
    setMessages(prev => [...prev, typingIndicator]);
    
    try {
      // Simulate AI response (replace with actual API call)
      let response = await simulateAIResponse(input);
      
      // Remove typing indicator and add AI response
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      setIsTyping(false);
      
      // Animate the response text with typewriter effect
      const aiMessage: Message = { text: '', sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
      
      // Simulate typewriter effect for the response
      let displayedText = '';
      
      for (let i = 0; i < response.length; i++) {
        const timeoutId = setTimeout(() => {
          displayedText += response[i];
          setMessages(prev => [
            ...prev.slice(0, prev.length - 1),
            { text: displayedText, sender: 'ai' }
          ]);
        }, i * 15); // Speed of typing
        
        animationTimeouts.current.push(timeoutId);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { text: 'Sorry, I encountered an error while processing your request.', sender: 'ai' }
      ]);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript.trim()) {
      setInput(transcript);
      // Auto-send after voice input is received
      setTimeout(() => {
        handleSend();
      }, 500);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  // In a real app, replace this with actual API call
  const simulateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      `I understand you're asking about "${userInput}". Let me help with that.`,
      `Thanks for your message. Here's what I know about "${userInput}".`,
      `That's an interesting question about "${userInput}". Let me share my thoughts.`,
      `I'd be happy to assist with your query on "${userInput}".`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const moreInfo = 'The Möbius strip visualization in this app demonstrates mathematical concepts in a visually engaging way. The strip follows a parametric equation with a single continuous surface.\n\nThis effect is part of the Vexa AI experience, which combines advanced conversational abilities with immersive visual elements.';
    
    return `${randomResponse}\n\n${moreInfo}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vexa AI</Text>
        <Text style={styles.headerSubtitle}>Mobile Assistant</Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userBubble : styles.aiBubble,
              message.isTyping && styles.typingBubble
            ]}
          >
            {message.isTyping ? (
              <View style={styles.typingIndicator}>
                <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnimation, marginHorizontal: 4 }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
              </View>
            ) : (
              <Text style={[styles.messageText, message.sender === 'user' ? styles.userText : styles.aiText]}>
                {message.text}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        {input.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.voiceButtonContainer}>
            <VoiceButton 
              onTranscript={handleVoiceInput} 
              isActive={isListening}
              onToggle={toggleListening}
            />
          </View>
        )}
      </View>
      
      {/* Wave animation at the bottom of the screen that appears when listening */}
      {isListening && (
        <View style={styles.waveContainer}>
          <WaveAnimation isActive={true} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#2c2c2c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6a3de8',
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderBottomLeftRadius: 0,
  },
  typingBubble: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 70,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#fff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    color: '#fff',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#6a3de8',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  voiceButtonContainer: {
    marginLeft: 10,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'transparent',
  },
});