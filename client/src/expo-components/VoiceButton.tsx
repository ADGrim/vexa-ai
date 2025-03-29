import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Alert, Animated } from 'react-native';
import { useVoiceHandler } from './VoiceHandler';
import { WaveAnimation } from './WaveAnimation';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
  size?: number;
  color?: string;
}

/**
 * Voice activation button component for React Native
 * Handles microphone activation and voice-to-text transcription
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({ 
  onTranscript, 
  isActive: externalIsActive, 
  onToggle,
  size = 80,
  color = '#8e44ad'
}) => {
  // Use voice recognition hook
  const { 
    toggleListening, 
    listening: internalListening, 
    hasPermission,
    volume 
  } = useVoiceHandler((text) => {
    if (text.trim()) {
      console.log('Voice transcript:', text);
      onTranscript(text);
    }
  });

  // Determine if button is in controlled or uncontrolled mode
  const isControlled = externalIsActive !== undefined;
  const isListening = isControlled ? externalIsActive : internalListening;
  
  // Pulse animation for the button
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  // Setup pulse animation when listening
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isListening]);

  // Handle button press
  const handlePress = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permission Required', 
        'Please grant microphone access to use voice chat.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Toggle state and call external handler if provided
    await toggleListening();
    if (onToggle) {
      onToggle(!isListening);
    }
  };

  // Create dynamic styles based on props
  const buttonSize = size;
  const innerCircleSize = buttonSize * 0.7;
  
  const dynamicStyles = {
    container: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      borderColor: color,
    },
    innerCircle: {
      width: innerCircleSize,
      height: innerCircleSize,
      borderRadius: innerCircleSize / 2,
      backgroundColor: color,
    }
  };

  return (
    <View style={[styles.buttonWrapper, { width: buttonSize, height: buttonSize }]}>
      {/* Wave animation that surrounds the button */}
      <WaveAnimation 
        isActive={isListening} 
        volume={volume}
        color={color}
        size={buttonSize * 1.8}
      />
      
      {/* The actual button */}
      <Animated.View
        style={[
          { transform: [{ scale: pulseAnim }] }
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.container, 
            dynamicStyles.container,
            isListening && styles.activeContainer
          ]} 
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View 
            style={[
              styles.innerCircle,
              dynamicStyles.innerCircle,
              isListening && styles.activeInnerCircle
            ]} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  activeContainer: {
    borderWidth: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  innerCircle: {
    opacity: 0.8,
  },
  activeInnerCircle: {
    opacity: 1,
  },
});

export default VoiceButton;
