import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetch } from 'expo/fetch';

import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

type Address = {
  place_id: number;
  osm_type: string;
  osm_id: number;
  type: string;
  name: string;
  addressType: string;
};

type Details = {
  place_id: number;
  osm_type: string;
  osm_id: number;
  category: string;
  type: string;
  localname: any;
  extratags: ExtraTags;
}

type ExtraTags = {
  maxspeed: string;
}


export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number | null>(0);
  const [address, setAddress] = useState<Address | null>(null);
  const [details, setDetails] = useState<Details | null>(null);

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds 
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (timerRunning) {
      timer = setInterval(() => {
        console.log('Timer running: ' + timeLeft);
        setErrorMsg('Timer running: ' + timeLeft);
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      clearInterval(timer);
      setTimerRunning(false);
    }
    return () => clearInterval(timer);
  },
    [timerRunning, timeLeft]);
  const startTimer = () => {
    console.log('Start timer');
    setErrorMsg('Start timer');
    setTimeLeft(300); // Reset to 5 minutes 
    setTimerRunning(true);
  };

  const stopTimer = () => {
    console.log('Stop timer');
    setErrorMsg('Stop timer');
    setTimerRunning(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1, }, async (loc) => {
        if (location?.coords.longitude == loc.coords.longitude && location?.coords.latitude == loc.coords.latitude) {
          console.log('No change in location');
          setErrorMsg('No change in location');
          return;
        }

        setLocation(loc);
        if (loc.coords.speed) {
          setSpeed(loc.coords.speed * 3.6); // Convert m/s to km/h 
        }
        console.log(location?.coords.longitude.toFixed(9), location?.coords.latitude.toFixed(9));
        console.log(speed?.toFixed(2));

        if (timerRunning) {
          console.log('Timer running');
          setErrorMsg('Timer running: ' + timeLeft);
          return;
        }

        // Tests only
        // https://nominatim.openstreetmap.org/reverse.php?lat=49.881243&lon=19.4889423&format=json&zoom=17
        // https://nominatim.openstreetmap.org/details.php?osmtype=W&osmid=207877134&addressdetails=0&hierarchy=0&group_hierarchy=1&format=json
        // https://www.openstreetmap.org/way/207877134

        try {
          // Address
          const addressPath = `https://nominatim.openstreetmap.org/reverse.php?lat=${loc?.coords.latitude}&lon=${loc?.coords.longitude}&format=json&zoom=17`;
          console.log(addressPath);

          const addressResponse = await fetch(addressPath,
            {
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
            }
          );
          console.log(addressResponse.status);

          if (addressResponse.status != 200) {
            startTimer();
            return;
          }

          const addressData = await addressResponse.json();

          if (addressData.osm_id == address?.osm_id) {
            console.log('No change in address');
            setErrorMsg('No change in address');
            return;
          }

          setAddress(addressData);
          console.log(address?.osm_id);
          console.log(address?.name);
          console.log(address?.osm_type);
          console.log(address?.type);


          // Details
          // 207877134
          const id = addressData.osm_id;
          const detailsPath = `https://nominatim.openstreetmap.org/details.php?osmtype=W&osmid=${id}&addressdetails=0&hierarchy=0&group_hierarchy=1&format=json`;
          const detailsResponse = await fetch(detailsPath,
            {
              method: 'GET',
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
            }
          );

          console.log(detailsResponse.status);
          const detailsData = await detailsResponse.json();
          console.log(JSON.stringify(detailsData));
          setDetails(details);
          console.log(details?.place_id);
          console.log(details?.osm_id);
          console.log(details?.localname);
          console.log(JSON.stringify(details?.extratags));
        } catch (error) {
          console.error(error);
          setErrorMsg(String(error));
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
        <ThemedText>{errorMsg}</ThemedText>
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
