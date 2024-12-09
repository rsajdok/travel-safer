import { StyleSheet, Platform, View, Text } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import LocationWatcher from '@/components/locationWatcher';
import SpeedDisplay from '@/components/SpeedDisplay';
import StreetDisplay from '@/components/StreetDisplay';
import DetailsDisplay from '@/components/DetailsDisplay';
import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LocationWatcher />
      <View style={styles.topSection}>
        <SpeedDisplay />
        <StreetDisplay />
        <DetailsDisplay />
        <HelloWave />
      </View>
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
    backgroundColor: '#e9ecef',
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

