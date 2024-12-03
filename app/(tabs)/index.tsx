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

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [speed, setSpeed] = useState<number | null>(0);
  const [address, setAddress] = useState<Address | null>(null);
  const [details, setDetails] = useState<Details | null>(null);

  const [timeLeft, setTimeLeft] = useState(150); // 2.5 minutes in seconds 
  const [timerRunning, setTimerRunning] = useState(false);

  const [items, setItems] = useState<String[]>([]);

  const addItem = (item: string) => {
    setItems(prevItems => {
      const newItems = [...prevItems, item];
      if (newItems.length > 25) {
        newItems.shift();
      }
      return newItems;
    });
  };

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (timerRunning) {
      timer = setInterval(() => {
        console.log('Timer running: ' + timeLeft);
        addItem('Timer running: ' + timeLeft);
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      clearInterval(timer);
      console.log('Timer expired');
      addItem('Timer expired');
      setTimerRunning(false);
    }
    return () => clearInterval(timer);
  },
    [timerRunning, timeLeft]);
  const startTimer = () => {
    console.log('Start timer');
    addItem('Start timer');
    setTimeLeft(150); // Reset to 2.5 minutes 
    setTimerRunning(true);
  };

  const stopTimer = () => {
    console.log('Stop timer');
    addItem('Stop timer');
    setTimerRunning(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        addItem('Permission to access location was denied');
        return;
      }
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1, }, async (loc) => {
        console.log('Location ', location?.coords);
        console.log('Location ', loc.coords);
        if (loc === undefined || loc.coords === undefined || loc.coords.longitude === undefined || loc.coords.latitude === undefined) {
          console.log('Location undefined');
          addItem('Location undefined');
          return;
        }
        addItem('Location ' + loc?.coords?.latitude + ' ' + loc?.coords?.longitude);
        if (timerRunning) {
          console.log('Timer running');
          addItem('Timer running');
          return;
        }

        if (location?.coords.longitude == loc.coords.longitude && location?.coords.latitude == loc.coords.latitude) {
          console.log('No change in location');
          addItem('No change in location');
          return;
        }

        if (coordinatesAlmostEqual(location, loc)) {
          console.log('No change in coordinates');
          addItem('No change in coordinates');
          return;
        }

        setLocation(loc);
        if (loc.coords.speed) {
          setSpeed(loc.coords.speed * 3.6); // Convert m/s to km/h 
        }
        console.log('lon lat ', location?.coords.longitude.toFixed(9), location?.coords.latitude.toFixed(9));
        addItem('lon lat ' + location?.coords.longitude.toFixed(9) + ' ' + location?.coords.latitude.toFixed(9));
        console.log('speed ', speed?.toFixed(2));
        addItem('speed ' + speed?.toFixed(2) + ' km/h');

        try {
          // Address
          const addressPath = `https://nominatim.openstreetmap.org/reverse.php?lat=${loc?.coords.latitude}&lon=${loc?.coords.longitude}&format=json&zoom=17`;
          console.log(addressPath);
          addItem(addressPath);

          const addressResponse = await fetch(addressPath,
            {
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
            }
          );
          console.log(addressResponse.status);
          addItem('s ' + String(addressResponse.status));

          if (addressResponse.status != 200) {
            stopTimer();
            startTimer();
            return;
          }

          const addressData = await addressResponse.json();

          if (addressData.osm_id == address?.osm_id) {
            console.log('No change in address');
            addItem('No change in address');
            return;
          }

          setAddress(addressData);
          console.log('o ', address?.osm_id);
          console.log('n ', address?.name);
          addItem('a ' + addressData.name + ' ' + addressData.osm_type + ' ' + addressData.type);
          console.log('o ', address?.osm_type);
          console.log('t ', address?.type);

          // Details
          // 207877134
          const id = addressData.osm_id;
          const detailsPath = `https://nominatim.openstreetmap.org/details.php?osmtype=W&osmid=${id}&addressdetails=0&hierarchy=0&group_hierarchy=1&format=json`;
          console.log(detailsPath);
          addItem(detailsPath);
          const detailsResponse = await fetch(detailsPath,
            {
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
            }
          );

          console.log(detailsResponse.status);
          addItem('s ' + String(detailsResponse.status));
          const detailsData = await detailsResponse.json();
          console.log('d ', JSON.stringify(detailsData));
          setDetails(details);
          console.log('p ', details?.place_id);
          console.log('o ', details?.osm_id);
          console.log('l ', details?.localname);
          console.log('e ', JSON.stringify(details?.extratags));
          addItem('d ' + details?.localname + ' ' + JSON.stringify(details?.extratags));
        } catch (error) {
          console.error(error);
          addItem(String(error));
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
        <ThemedText>{speed?.toFixed(2)}</ThemedText>
        <ThemedText>{location?.coords.longitude.toFixed(9)} {location?.coords.latitude.toFixed(9)}</ThemedText>
        <ThemedText>{address?.name} {address?.osm_type} {address?.type}</ThemedText>
        <ThemedText>{details?.localname} {JSON.stringify(details?.extratags)}</ThemedText>
        {items.map((item, index) => (<ThemedText key={index}>{item}</ThemedText>))}
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


