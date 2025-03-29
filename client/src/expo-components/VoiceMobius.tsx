import React, { useEffect } from 'react';
import { View, Animated, Easing, ViewStyle } from 'react-native';

interface VoiceMobiusProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  isActive?: boolean;
}

/**
 * VoiceMobius - A 3D rotating animation inspired by a Möbius strip
 * For React Native and Expo applications
 */
const VoiceMobius: React.FC<VoiceMobiusProps> = ({
  size = 150,
  color = '#8e44ad',
  style = {},
  isActive = true
}) => {
  const rotate = new Animated.Value(0);
  
  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    
    if (isActive) {
      animation = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      );
      
      animation.start();
    } else {
      rotate.stopAnimation();
    }
    
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isActive, rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ width: size, height: size, ...style }}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#1c1c1c',
          borderWidth: 2,
          borderColor: color,
          transform: [{ rotateY: spin }],
          shadowColor: color,
          shadowOpacity: 0.6,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 15,
        }}
      />
    </View>
  );
};

export default VoiceMobius;