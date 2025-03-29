import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MobiusWave from './MobiusWave';
import { VoiceButton } from './VoiceButton';
import { ConversationMessage } from './memory';

interface VexaMobileChatProps {
  initialMessage?: string;
  themeColor?: string;
  onSendMessage?: (message: string) => Promise<string>;
  wsEndpoint?: string;
}

/**
 * VexaMobileChat - A complete chat interface for mobile applications
 * Features voice input, animated responses, and WebSocket support
 */
const VexaMobileChat: React.FC<VexaMobileChatProps> = ({
  initialMessage = 'How can I help you today?',
  themeColor = '#6a0dad',
  onSendMessage,
  wsEndpoint
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to WebSocket if endpoint is provided
  useEffect(() => {
    if (wsEndpoint) {
      const socket = new WebSocket(wsEndpoint);
      
      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setWs(socket);
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.role === 'assistant') {
            setMessages(prev => [
              ...prev.slice(0, -1), // Remove loading message
              { role: 'assistant', content: data.content }
            ]);
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setWs(null);
      };
      
      return () => {
        socket.close();
      };
    }
  }, [wsEndpoint]);

  // Handle sending messages via WebSocket or callback
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    
    const userMsg: ConversationMessage = { role: 'user', content: input };
    const loadingMsg: ConversationMessage = { 
      role: 'assistant', 
      content: 'Processing your request...' 
    };
    
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setIsProcessing(true);
    
    if (ws && isConnected) {
      // Send via WebSocket
      ws.send(JSON.stringify({
        type: 'message',
        content: input
      }));
    } else if (onSendMessage) {
      // Send via callback
      try {
        const response = await onSendMessage(input);
        setMessages(prev => [
          ...prev.slice(0, -1), // Remove loading message
          { role: 'assistant', content: response }
        ]);
      } catch (error) {
        setMessages(prev => [
          ...prev.slice(0, -1), // Remove loading message
          { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
        ]);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // No connection or callback
      setTimeout(() => {
        setMessages(prev => [
          ...prev.slice(0, -1), // Remove loading message
          { role: 'assistant', content: 'Please configure a message handler or WebSocket endpoint.' }
        ]);
        setIsProcessing(false);
      }, 1000);
    }
  }, [input, ws, isConnected, onSendMessage]);

  // Handle voice input
  const handleVoiceInput = useCallback((transcript: string) => {
    setInput(transcript);
    if (transcript.trim()) {
      setTimeout(() => sendMessage(), 500);
    }
  }, [sendMessage]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            {
              alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: item.role === 'user' ? themeColor : '#1c1c1c',
            }
          ]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        style={styles.messageList}
      />

      {isProcessing && (
        <View style={styles.loaderContainer}>
          <MobiusWave active={true} color={themeColor} />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Speak or type..."
          placeholderTextColor="#aaa"
          style={styles.input}
          multiline
        />
        
        <VoiceButton 
          onTranscript={handleVoiceInput}
          color={themeColor}
          size={42}
        />
        
        <TouchableOpacity 
          onPress={sendMessage}
          style={[styles.sendButton, { backgroundColor: themeColor }]}
          disabled={!input.trim() || isProcessing}
        >
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
      
      {wsEndpoint && (
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  messageList: {
    flex: 1,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#252525',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#aaa',
    fontSize: 12,
  }
});

export default VexaMobileChat;