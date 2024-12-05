import { Image, StyleSheet, Platform, View, Text, FlatList } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useContext } from 'react';
import { PlaceContext } from '@/providers/PlaceProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MonitorContext } from '@/providers/MonitorProvider';


export default function HomeScreen() {
  const placeContext = useContext(PlaceContext);

  const monitorContext = useContext(MonitorContext);

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.topSection}>
        <Text style={styles.speedText}>Current speed: {((placeContext?.location?.coords.speed ?? 0) * 3.6).toFixed(1)}</Text>
        <Text style={styles.roadText}>Road name: {placeContext?.details?.localname}</Text>
        <Text style={styles.roadText}>Max speed: {placeContext?.details?.extratags?.maxspeed ?? 'N/A'}</Text>

      </View>
      <View style={styles.bottomSection}>
        <FlatList
          data={monitorContext?.messages}
          renderItem={({ item }) => <Text style={styles.messageText}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e9ecef', // Slightly darker color
    padding: 32,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef', // Slightly darker color
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speedText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  roadText: {
    fontSize: 20,
    marginVertical: 10,
  },
  warningText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
  bottomSection: {
    flex: 1,
    marginTop: 20,
  },
  messageText: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#e9ecef', // Slightly darker color
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
});

