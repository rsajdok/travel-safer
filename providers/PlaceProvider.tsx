import React, { createContext, useState, useEffect, ReactNode, FC, useContext } from 'react';
import * as Location from 'expo-location';
import Address from '@/types/address';
import Details from '@/types/details';
import coordinatesAlmostEqual from '@/gis/coordinatesAlmostEqual';
import { TimerContext } from './TimerContext';
import { MonitorContext } from './MonitorProvider';

type PlaceContextType = {
    speed: number;
    details: Details | null;
    maxSpeed: () => number;
    hasMaxSpeed: () => boolean;
}

export const PlaceContext = createContext<PlaceContextType | undefined>(undefined);

type PlaceProviderProps = {
    children: ReactNode;
}

export const PlaceProvider: FC<PlaceProviderProps> = ({ children }) => {

    const [speed, setSpeed] = useState<number>(0);

    // const [address, setAddress] = useState<Address | null>(null);
    const [details, setDetails] = useState<Details | null>(null);

    const timerContext = useContext(TimerContext);

    const monitorContext = useContext(MonitorContext);

    let location1: Location.LocationObject | null = null;

    let address1: Address | null = null as Address | null;
    let details1: Details | null = null as Details | null;

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const startWatchingLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            subscription = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.High, timeInterval: 5 * 1000, distanceInterval: 1,
            }, async (loc) => {

                try {
                    if (loc.coords.longitude === undefined || loc.coords.latitude === undefined) {
                        monitorContext?.addMessage('Location start undefined');
                        return;
                    }
                    setSpeed(loc.coords.speed ?? 0);

                    monitorContext?.addMessage('Location new ' + loc.coords.longitude + ' ' + loc.coords.latitude);

                    if (timerContext && timerContext.timerRunning) {
                        monitorContext?.addMessage(timerContext.timeLeft.toString());
                        return;
                    }

                    if (location1 === null) {
                        monitorContext?.addMessage('No stored location');
                    }

                    if (location1 && coordinatesAlmostEqual(location1, loc)) {
                        monitorContext?.addMessage('coordinatesAlmostEqual');
                        return;
                    }

                    location1 = loc;

                    monitorContext?.addMessage('Location stored ' + location1?.coords.longitude + ' ' + location1?.coords.latitude);

                    // Address
                    monitorContext?.addMessage('Location address ' + loc.coords.longitude + ' ' + loc.coords.latitude);
                    const addressPath = `https://nominatim.openstreetmap.org/reverse.php?lat=${loc?.coords.latitude}&lon=${loc?.coords.longitude}&format=json&zoom=17`;
                    monitorContext?.addMessage(addressPath.substring(0, 96));

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

                    if (address1) {
                        monitorContext?.addMessage('Address stored a ' + address1?.osm_id);
                    }

                    const addressData = await addressResponse.json();
                    monitorContext?.addMessage('Address new ' + JSON.stringify(addressData));
                    if (address1 && addressData.osm_id == address1?.osm_id) {
                        monitorContext?.addMessage('No change in details ' + address1?.osm_id);
                        monitorContext?.addMessage('No change in details ' + details1?.extratags?.maxspeed);
                        return;
                    }

                    address1 = addressData;
                    monitorContext?.addMessage('Address stored b ' + address1?.osm_id);

                    // Details
                    // 207877134
                    const id = addressData.osm_id;
                    monitorContext?.addMessage('Reverse ' + id + ' ' + addressData.display_name);

                    // monitorContext?.addMessage('Reverse stored ' + address1?.osm_id);

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
                    monitorContext?.addMessage('Details ' + JSON.stringify(detailsData?.extratags));
                    details1 = detailsData;
                    setDetails(detailsData);
                    monitorContext?.addMessage('Details stored ' + JSON.stringify(details1?.extratags?.maxspeed));
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

    const maxSpeed = () => {
        if (details && details.extratags && details.extratags.maxspeed) {
            return Number(details.extratags.maxspeed);
        }
        return 5;
    }

    const hasMaxSpeed = () => {
        if (details && details.extratags && details.extratags.maxspeed) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <PlaceContext.Provider value={{ speed, details, maxSpeed, hasMaxSpeed }}>
            {children}
        </PlaceContext.Provider>
    );
};

