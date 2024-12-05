import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useContext, useEffect, useState } from 'react';
import { TimerContext, TimerProvider } from '@/providers/TimerContext';
import { PlaceContext } from '@/providers/PlaceProvider';
import { MonitorContext } from '@/providers/MonitorProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {

  const timerContext = useContext(TimerContext);
  const placeContext = useContext(PlaceContext);

  const monitorContext = useContext(MonitorContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedText style={styles.infoText}>
        {timerContext?.timeLeft} {placeContext?.location?.coords.longitude} {placeContext?.details?.localname}
      </ThemedText>
      {monitorContext?.messages.map((item, index) => (
        <ThemedText key={index} style={styles.messageText}>{item}</ThemedText>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    padding: 32,
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 16,
  },
  messageText: {
    fontSize: 16,
  }
});
