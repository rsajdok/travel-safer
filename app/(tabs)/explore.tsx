import { StyleSheet, View, FlatList, Text } from 'react-native';

import React, { useContext, useEffect, useState } from 'react';
import { MonitorContext } from '@/providers/MonitorProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {

  const monitorContext = useContext(MonitorContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View >
        <FlatList
          data={monitorContext?.messages}
          renderItem={({ item }) => <Text style={styles.messageText}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
    padding: 10,
    backgroundColor: '#e9ecef',
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  }
});
