import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface WaveAnimationProps {
  isActive: boolean;
  volume?: number;
  color?: string;
  size?: number;
}

/**
 * A React Native component that displays an animated wave effect
 * Used to visualize voice input and activation states
 */
export const WaveAnimation: React.FC<WaveAnimationProps> = ({ 
  isActive, 
  volume = 0.5,
  color = '#8e44ad',
  size = 80 
}) => {
  // Main animation value for the wave effect
  const animatedValue = useRef(new Animated.Value(0)).current;
  // Animation controller
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  // When active state or volume changes, update animation
  useEffect(() => {
    if (isActive) {
      const duration = 1000 / (0.5 + volume * 0.5); // Speed up animation with higher volume
      
      // Cancel any existing animation
      if (animationRef.current) {
        animationRef.current.stop();
      }
      
      // Create and start the looping animation
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
      
      animationRef.current.start();
    } else {
      // Stop animation when not active
      if (animationRef.current) {
        animationRef.current.stop();
      }
      animatedValue.setValue(0);
    }
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isActive, volume]);

  // Calculate animation values
  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2 + (volume * 0.3), 1], // Higher volume = larger wave
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.5 + (volume * 0.4), 0.3], // Higher volume = more opacity
  });

  // Create dynamic styles based on props
  const dynamicStyles = {
    container: {
      width: size,
      height: size,
    },
    wave: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color ? 
        `rgba(${hexToRgb(color)}, 0.4)` : 
        'rgba(138, 43, 226, 0.4)',
    }
  };

  // Render wave animation
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Multiple wave layers for a richer effect */}
      <Animated.View
        style={[
          styles.wave,
          dynamicStyles.wave,
          {
            transform: [{ scale }],
            opacity: isActive ? opacity : 0,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          dynamicStyles.wave,
          {
            transform: [{ scale: Animated.multiply(scale, 0.8) }],
            opacity: isActive ? Animated.multiply(opacity, 0.7) : 0,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          dynamicStyles.wave,
          {
            transform: [{ scale: Animated.multiply(scale, 0.6) }],
            opacity: isActive ? Animated.multiply(opacity, 0.5) : 0,
          },
        ]}
      />
    </View>
  );
};

// Utility function to convert hex to rgba
const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};

// Base styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
  },
});
