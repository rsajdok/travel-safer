import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import useLocationStore from '@/store/locationStore';

export function HelloWave() {
  const rotationAnimation = useSharedValue(0);
  const warrning = useLocationStore((state) => state.warning);

  rotationAnimation.value = withRepeat(
    withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
    4 // Run the animation 4 times
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    warrning && (
      <View style={styles.column}>
        <Animated.View style={animatedStyle}>
          <ThemedText style={styles.text}>👋</ThemedText>
        </Animated.View>
        <ThemedText style={styles.warningText}>Slow down</ThemedText>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: 16,
    justifyContent: 'center',
  },
  warningText: {
    fontSize: 24,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 12,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
