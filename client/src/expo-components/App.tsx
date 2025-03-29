import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar, 
  Platform
} from 'react-native';
import VexaChat from './VexaChat';

/**
 * The main App component for the Expo/React Native version of the VexaAI assistant
 * This component serves as the entry point for the mobile application
 */
export default function App() {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VexaAI</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowInfo(!showInfo)}
        >
          <Text style={styles.infoButtonText}>ⓘ</Text>
        </TouchableOpacity>
      </View>
      
      {showInfo && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About VexaAI Mobile</Text>
          <Text style={styles.infoText}>
            This is the mobile version of VexaAI, featuring voice interaction,
            immersive visualizations, and intelligent conversation capabilities.
          </Text>
          <Text style={styles.infoText}>
            Use the voice button to speak to Vexa, or type your messages in the text field.
            Conversations are saved locally for your convenience.
          </Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowInfo(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <VexaChat />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  infoCard: {
    margin: 15,
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 10,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#6a3de8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});