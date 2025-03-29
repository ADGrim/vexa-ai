import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import VoiceMobius from './VoiceMobius';

interface VexaIntroProps {
  onIntroComplete?: () => void;
  customStyles?: {
    container?: object;
    text?: object;
    subtitle?: object;
  }
}

/**
 * VexaIntro - A stylish animated introduction component for Vexa
 * 
 * @param onIntroComplete - Callback function called when intro animation completes
 * @param customStyles - Optional styling overrides 
 */
const VexaIntro: React.FC<VexaIntroProps> = ({ 
  onIntroComplete,
  customStyles = {}
}) => {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    ]).start();
    
    // Speak intro text
    Speech.speak("Hello. I'm Vexa, your AI assistant.", {
      voice: 'com.apple.ttsbundle.Samantha-compact',
      rate: 0.9,
    });
    
    // Trigger completion callback
    const timer = setTimeout(() => {
      onIntroComplete?.();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity: fade },
        customStyles.container
      ]}
    >
      {/* Background Mobius animation */}
      <View style={styles.mobiusContainer}>
        <VoiceMobius size={300} color="#a855f7" />
      </View>
      
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text style={[styles.text, customStyles.text]}>VEXA</Text>
        <Text style={[styles.subtitle, customStyles.subtitle]}>
          Your AI Assistant
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0c0c',
  },
  mobiusContainer: {
    position: 'absolute',
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
  },
  text: {
    fontSize: 42,
    letterSpacing: 6,
    color: '#a855f7',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default VexaIntro;