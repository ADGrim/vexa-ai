import React, { useRef, useEffect } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';

interface MobiusProps {
  volume?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const MobiusStrip = ({ volume = 0.5, size = 'md', color = '#9c27b0' }: MobiusProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(volume)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(glowAnim, {
      toValue: volume,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [volume]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 1],
  });

  // Size variations
  const sizeValues = {
    sm: {
      container: { height: 60, width: 60 },
      strip: { width: 40, height: 40, borderRadius: 20, borderWidth: 2 }
    },
    md: {
      container: { height: 100, width: 100 },
      strip: { width: 60, height: 60, borderRadius: 30, borderWidth: 3 }
    },
    lg: {
      container: { height: 140, width: 140 },
      strip: { width: 80, height: 80, borderRadius: 40, borderWidth: 4 }
    }
  };

  return (
    <View style={[styles.container, sizeValues[size].container]}>
      <Animated.View
        style={[
          styles.strip,
          sizeValues[size].strip,
          {
            transform: [{ rotateY: rotation }],
            shadowOpacity,
            shadowRadius: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [2, 15] }),
            borderColor: color,
            shadowColor: color
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  strip: {
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
});