import React, { useEffect, useRef } from 'react';
import { Animated, View, Easing, StyleSheet } from 'react-native';

interface MobiusWaveProps {
  active?: boolean;
  color?: string;
  size?: number;
}

/**
 * A rotating Möbius wave animation component for React Native
 * Used to visualize active state or loading in the chat interface
 */
export const MobiusWave: React.FC<MobiusWaveProps> = ({ 
  active = true, 
  color = '#6a0dad',
  size = 64
}) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    // Rotation animation
    if (active) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    } else {
      rotation.stopAnimation();
    }

    // Scale animation (show/hide)
    Animated.timing(scale, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: active ? Easing.out(Easing.back(1.5)) : Easing.in(Easing.ease),
    }).start();
  }, [active]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.mobiusContainer,
          {
            width: size,
            height: size,
            transform: [
              { rotate },
              { scale }
            ]
          }
        ]}
      >
        {/* Möbius strip visualization */}
        <View style={[styles.mobiusStrip, { borderColor: color, width: size * 0.8, height: size * 0.4 }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  mobiusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobiusStrip: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 20,
    transform: [
      { rotateX: '60deg' },
      { rotateY: '45deg' }
    ],
    shadowColor: '#6a0dad',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    backgroundColor: 'transparent',
  }
});

export default MobiusWave;