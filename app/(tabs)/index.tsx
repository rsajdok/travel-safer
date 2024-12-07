import { Image, StyleSheet, Platform, View, Text, FlatList, Button, Switch } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import React, { useContext } from 'react';
import { PlaceContext } from '@/providers/PlaceProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MonitorContext } from '@/providers/MonitorProvider';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';


import { HelloWave } from '@/components/HelloWave';

const description = 'This is a simple app that shows your current speed and the road you are on. It also warns you if you are driving too fast.';

export default function HomeScreen() {
  const placeContext = useContext(PlaceContext);
  const monitorContext = useContext(MonitorContext);

  useEffect(() => {
    if (placeContext && placeContext?.currentSpeed() > placeContext?.maxSpeed()) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Speed Alert',
          body: 'You are driving too fast! Slow down.',
        },
        trigger: null,
      });
    }
  }, [placeContext?.currentSpeed()]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topSection}>
        <View style={styles.row}>
          <ThemedText type="subtitle">You drive{' '}</ThemedText>
          <ThemedText type="title">{placeContext?.currentSpeed()}{' '}</ThemedText>
          <ThemedText type='subtitle'>km\h</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">on{' '}</ThemedText>
          <ThemedText type="title">{placeContext?.details?.localname}</ThemedText>
        </View>
        {
          placeContext && placeContext?.hasMaxSpeed() &&
          <View style={styles.row}>
            <ThemedText type="subtitle">maximum speed is{' '}</ThemedText>
            <ThemedText type="title">{placeContext?.maxSpeed()}</ThemedText>
          </View>
        }

        <Text style={styles.warningText}>{placeContext && placeContext?.hasMaxSpeed() && placeContext?.currentSpeed() > placeContext?.maxSpeed() ? 'Slow down' : ''}</Text>
        {placeContext && placeContext.hasMaxSpeed() && placeContext?.currentSpeed() > placeContext?.maxSpeed() ? <HelloWave /> : ''}
      </View >
      <View style={styles.bottomSection}>
        <Text style={styles.descriptionText}>
          This proof-of-concept app improves road safety.
        </Text>
        <Text style={styles.descriptionText}>
          More features to consider, sound notifications, background app.
        </Text>
        <Text style={styles.descriptionText}>
          All done at Expo.</Text>
      </View>
      { /*
      <View style={styles.bottomSection}>
        <FlatList
          data={monitorContext?.messages}
          renderItem={({ item }) => <Text style={styles.messageText}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
        */
      }
    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e9ecef', // Slightly darker color
    // padding: 32,
    paddingTop: 64,
    paddingHorizontal: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: '40%',
    maxHeight: '40%',
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
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
  bottomSection: {
    flex: 2,
    marginTop: 40,
  },
  messageText: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#e9ecef',
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  descriptionText: {
    paddingVertical: 12,
    fontSize: 22,
    justifyContent: 'center',
  }
});

