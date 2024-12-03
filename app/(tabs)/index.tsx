import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetch } from 'expo/fetch';

import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import Address from '@/types/address';
import Details from '@/types/details';
import coordinatesAlmostEqual from '@/gis/coordinatesAlmostEqual';

const timeToWait = 300; // 5 minutes in seconds

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [speed, setSpeed] = useState<string | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [details, setDetails] = useState<Details | null>(null);

  const [timeLeft, setTimeLeft] = useState(timeToWait);
  const [timerRunning, setTimerRunning] = useState(false);

  const [logs, setLogs] = useState<String[]>([]);
  const [ways, setWays] = useState<Address[]>([]);

  const addLog = (log: string) => {
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, log];
      if (newLogs.length > 25) {
        newLogs.shift();
      }
      return newLogs;
    });
  };

  const addWay = (way: Address) => {
    setWays(prevWays => {
      const newWays = [...prevWays, way];
      if (newWays.length > 25) {
        newWays.shift();
      }
      return newWays;
    });
  };


  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (timerRunning) {
      timer = setInterval(() => {
        console.log('Timer running: ' + timeLeft);
        addLog('Timer running: ' + timeLeft);
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      clearInterval(timer);
      console.log('Timer expired');
      addLog('Timer expired');
      setTimerRunning(false);
    }
    return () => clearInterval(timer);
  },
    [timerRunning, timeLeft]);
  const startTimer = () => {
    console.log('Start timer');
    addLog('Start timer');
    setTimeLeft(timeToWait);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    console.log('Stop timer');
    addLog('Stop timer');
    setTimerRunning(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        addLog('Permission to access location was denied');
        return;
      }
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 15 * 1000, distanceInterval: 5, }, async (loc) => {
        console.log('Location ', location?.coords.longitude, location?.coords.latitude);
        if (loc === undefined || loc.coords === undefined || loc.coords.longitude === undefined || loc.coords.latitude === undefined) {
          console.log('Location undefined');
          addLog('Location undefined');
          return;
        }
        addLog('Location ' + loc?.coords?.longitude + ' ' + loc?.coords?.latitude);
        if (timerRunning) {
          console.log('Timer running');
          addLog('Timer running');
          return;
        }

        if (location?.coords.longitude == loc.coords.longitude && location?.coords.latitude == loc.coords.latitude) {
          console.log('No change in location');
          addLog('No change in location');
          return;
        }

        if (coordinatesAlmostEqual(location, loc)) {
          console.log('No change in coordinates');
          addLog('No change in coordinates');
          return;
        }

        setLocation(loc);
        if (loc.coords.speed) {
          setSpeed(loc.coords.speed.toFixed(2)); // * 3.6); // Convert m/s to km/h 
        }
        console.log('lon lat ', loc?.coords.longitude.toFixed(9), loc?.coords.latitude.toFixed(9));
        addLog('lon lat ' + loc?.coords.longitude.toFixed(9) + ' ' + loc?.coords.latitude.toFixed(9));
        console.log('speed ', loc?.coords.speed?.toFixed(2));
        addLog('speed ' + loc?.coords.speed?.toFixed(2) + ' km/h');

        try {
          // Address
          const addressPath = `https://nominatim.openstreetmap.org/reverse.php?lat=${loc?.coords.latitude}&lon=${loc?.coords.longitude}&format=json&zoom=17`;
          console.log(addressPath.substring(0, 42));
          addLog(addressPath.substring(0, 42));

          const addressResponse = await fetch(addressPath,
            {
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
            }
          );
          console.log(addressResponse.status);
          addLog('s ' + String(addressResponse.status));

          if (addressResponse.status != 200) {
            stopTimer();
            startTimer();
            return;
          }

          const addressData = await addressResponse.json();

          if (addressData.osm_id == address?.osm_id) {
            console.log('No change in address');
            addLog('No change in address');
            return;
          }

          console.log('o ', address?.osm_id);
          console.log('n ', address?.name);
          addLog('a ' + addressData.name + ' ' + addressData.osm_type + ' ' + addressData.type);
          console.log('o ', address?.osm_type);
          console.log('t ', address?.type);

          // Simply cache
          const foundWay = ways.find(way => way.osm_id === addressData.osm_id);
          if (foundWay) {
            console.log('Way already found');
            addLog('Way already found');
            setAddress(foundWay);
            return;
          }

          setAddress(addressData);

          addWay(addressData);

          // Details
          // 207877134
          const id = addressData.osm_id;
          addLog('id ' + id);
          console.log('id ', id);
          const detailsPath = `https://nominatim.openstreetmap.org/details.php?osmtype=W&osmid=${id}&addressdetails=0&hierarchy=0&group_hierarchy=1&format=json`;
          console.log(detailsPath.substring(0, 42));
          addLog(detailsPath.substring(0, 42));
          const detailsResponse = await fetch(detailsPath,
            {
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
            }
          );

          console.log(detailsResponse.status);
          addLog('s ' + String(detailsResponse.status));
          const detailsData = await detailsResponse.json();
          console.log('d ', JSON.stringify(detailsData));
          setDetails(details);
          console.log('p ', details?.place_id);
          console.log('o ', details?.osm_id);
          console.log('l ', details?.localname);
          console.log('e ', JSON.stringify(details?.extratags));
          addLog('d ' + details?.localname + ' ' + JSON.stringify(details?.extratags));
        } catch (error) {
          console.error(error);
          addLog(String(error));
        }
      });
    }
    )();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView>
        <ThemedText>{speed} km/h</ThemedText>
        <ThemedText>{location?.coords.longitude.toFixed(9)} {location?.coords.latitude.toFixed(9)}</ThemedText>
        <ThemedText>{address?.name} {address?.osm_type} {address?.type} {address?.osm_id}</ThemedText>
        <ThemedText>{details?.localname} {JSON.stringify(details?.extratags)}</ThemedText>
        {logs.map((item, index) => (<ThemedText key={index}>{item}</ThemedText>))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});


