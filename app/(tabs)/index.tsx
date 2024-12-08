import { StyleSheet, Platform, View, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import React, { useContext } from 'react';
import { PlaceContext } from '@/providers/PlaceProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
// import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';


import { HelloWave } from '@/components/HelloWave';
import { MonitorContext, MonitorProvider } from '@/providers/MonitorProvider';

export default function HomeScreen() {
  const placeContext = useContext(PlaceContext);

  const monitorContext = useContext(MonitorContext);

  /*
  useEffect(() => {
    registerForPushNotificationsAsync();

  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default',
        {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  }

  const scheduleNotification = async () => {
    monitorContext?.addMessage('schedule notification');
    await Notifications.scheduleNotificationAsync({
      content: {
        sound: true,
        title: '',
        body: '',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        repeats: false,
      },
    });
  };
  */


  useEffect(() => {
    if (placeContext && (placeContext?.speed * 3.6) > placeContext?.maxSpeed()) {
      monitorContext?.addMessage('set notification');
      // scheduleNotification();
      /*
      Notifications.scheduleNotificationAsync({
        content: {
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        },
      });
      */
    }
  }, [placeContext && (placeContext?.speed * 3.6) > placeContext?.maxSpeed()]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topSection}>
        <View style={styles.row}>
          <ThemedText type="subtitle">You drive{' '}</ThemedText>
          <ThemedText type="title">{((placeContext?.speed ?? 0) * 3.6).toFixed(0)}{' '}</ThemedText>
          <ThemedText type='subtitle'>km\h</ThemedText>
        </View>
        {
          placeContext && placeContext?.details &&
          <View style={styles.row}>
            <ThemedText type="subtitle">on{' '}</ThemedText>
            <ThemedText type="title">{placeContext?.details?.localname}</ThemedText>
          </View>
        }
        {
          placeContext && placeContext?.hasMaxSpeed() &&
          <View style={styles.row}>
            <ThemedText type="subtitle">maximum speed is{' '}</ThemedText>
            <ThemedText type="title">{placeContext?.maxSpeed()}</ThemedText>
          </View>
        }

        <Text style={styles.warningText}>{placeContext && placeContext?.hasMaxSpeed() && placeContext?.speed * 3.6 > placeContext?.maxSpeed() ? 'Slow down' : ''}</Text>
        {placeContext && placeContext.hasMaxSpeed() && placeContext?.speed * 3.6 > placeContext?.maxSpeed() ? <HelloWave /> : ''}
      </View >
      <View style={styles.bottomSection}>
        <Text style={styles.descriptionText}>
          The Proof-of-concept application.
        </Text>
        <Text style={styles.descriptionText}>
          This simple app shows your current speed and the road you are on. It also warns you if you are driving too fast.
        </Text>
        <Text style={styles.descriptionText}>
          More features to consider, sound notifications, background app.
        </Text>
        <Text style={styles.descriptionText}>
          Any comments or suggestions, please contact me.
        </Text>
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
    marginTop: 35,
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
    paddingVertical: 6,
    fontSize: 22,
    justifyContent: 'center',
  }
});

