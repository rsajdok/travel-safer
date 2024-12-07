import React, { createContext, useState, useEffect, ReactNode, FC, useContext } from 'react';
import * as Location from 'expo-location';
import Address from '@/types/address';
import Details from '@/types/details';
import coordinatesAlmostEqual from '@/gis/coordinatesAlmostEqual';
import { TimerContext } from './TimerContext';
import { MonitorContext } from './MonitorProvider';

type PlaceContextType = {
    location: Location.LocationObject | null;
    details: Details | null;
    currentSpeed: () => number;
    maxSpeed: () => number;
    hasMaxSpeed: () => boolean;
}

export const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

type PlaceProviderProps = {
    children: ReactNode;
}

export const PlaceProvider: FC<PlaceProviderProps> = ({ children }) => {

    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [details, setDetails] = useState<Details | null>(null);

    const timerContext = useContext(TimerContext);

    const monitorContext = useContext(MonitorContext);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startWatchingLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            subscription = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1 * 1000, distanceInterval: 1, }, async (loc) => {
                monitorContext?.addMessage('Location ' + location?.coords.longitude + ' ' + location?.coords.latitude);
                if (loc === undefined || loc.coords === undefined || loc.coords.longitude === undefined || loc.coords.latitude === undefined) {
                    monitorContext?.addMessage('Location undefined');
                    return;
                }
                if (timerContext && timerContext.timerRunning) {
                    return;
                }

                if (location?.coords.longitude == loc.coords.longitude && location?.coords.latitude == loc.coords.latitude) {
                    monitorContext?.addMessage('No change in location');
                    return;
                }

                if (coordinatesAlmostEqual(location, loc)) {
                    monitorContext?.addMessage('No change in coordinates');
                    return;
                }

                setLocation(loc);
                if (loc.coords.speed) {
                    // place.speed = loc.coords.speed.toFixed(2) ?? 0;
                    // setSpeed(loc.coords.speed.toFixed(2)); // * 3.6); // Convert m/s to km/h 
                }

                try {
                    // Address
                    const addressPath = `https://nominatim.openstreetmap.org/reverse.php?lat=${loc?.coords.latitude}&lon=${loc?.coords.longitude}&format=json&zoom=17`;
                    monitorContext?.addMessage(addressPath.substring(0, 42));

                    const addressResponse = await fetch(addressPath,
                        {
                            method: 'GET',
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
                        }
                    );
                    monitorContext?.addMessage('Address ' + addressResponse.status);

                    if (addressResponse.status != 200 && timerContext) {
                        timerContext.stopTimer();
                        timerContext.startTimer();
                        return;
                    }

                    const addressData = await addressResponse.json();
                    // place.address = addressData;
                    if (addressData.osm_id == address?.osm_id) {
                        monitorContext?.addMessage('No change in address');
                        return;
                    }

                    setAddress(addressData);

                    // Details
                    // 207877134
                    const id = addressData.osm_id;
                    monitorContext?.addMessage('Details ' + id);
                    const detailsPath = `https://nominatim.openstreetmap.org/details.php?osmtype=W&osmid=${id}&addressdetails=0&hierarchy=0&group_hierarchy=1&format=json`;
                    monitorContext?.addMessage(detailsPath.substring(0, 42));
                    const detailsResponse = await fetch(detailsPath,
                        {
                            method: 'GET',
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
                        }
                    );

                    monitorContext?.addMessage('Details ' + detailsResponse.status);
                    const detailsData = await detailsResponse.json();
                    // monitorContext?.addMessage('Details ' + JSON.stringify(detailsData));
                    setDetails(detailsData);
                    monitorContext?.addMessage('Details ' + JSON.stringify(detailsData?.extratags));
                } catch (error) {
                    monitorContext?.addMessage('Error ' + error);
                    // console.error(error);
                }
            });
        };

        startWatchingLocation();

        return () => {
            if (subscription) {
                subscription?.remove();
            }
        };
    }, []);

    const currentSpeed = () => {
        const speed = location?.coords.speed ?? 0;
        return Number((speed * 3.6).toFixed(0));
    };

    const maxSpeed = () => {
        return Number(details?.extratags?.maxspeed ?? 5);
    }

    const hasMaxSpeed = () => {
        if (details && details.extratags && details.extratags.maxspeed) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <PlaceContext.Provider value={{ location, details, currentSpeed, maxSpeed, hasMaxSpeed }}>
            {children}
        </PlaceContext.Provider>
    );
};

