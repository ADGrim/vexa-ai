import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const MobiusLoader = () => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ rotateZ: rotate }] }]}>
      <View style={styles.strip} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
  },
  strip: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#a855f7',
    borderStyle: 'dashed',
    position: 'absolute',
  },
});

export default MobiusLoader;