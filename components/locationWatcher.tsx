import React, { useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import useLocationStore from '@/store/locationStore';
import { MonitorContext } from '@/providers/MonitorProvider';
import Address from '@/types/address';

const LocationWatcher: React.FC = () => {
    const setSpeed = useLocationStore((state) => state.setSpeed);
    const setStreet = useLocationStore((state) => state.setStreet);
    const setWarning = useLocationStore((state) => state.setWarning);
    const setMaxSpeed = useLocationStore((state) => state.setMaxSpeed);

    const monitorContext = useContext(MonitorContext);

    let address1: Address | null = null as Address | null;

    let maxSpeed: number | null = null;

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;
        monitorContext?.addMessage('LocationWatcher useEffect');

        const startWatching = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                monitorContext?.addMessage('Permission to access location was denied');
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 8 * 1000,
                    distanceInterval: 2,
                },
                async (location) => {
                    const { latitude, longitude } = location.coords;
                    monitorContext?.addMessage('Location new ' + latitude + ' ' + longitude);

                    if (location.coords.speed) {
                        setSpeed((location.coords.speed ?? 0) * 3.6);
                        monitorContext?.addMessage('Speed ' + (location.coords.speed ?? 0) * 3.6);

                        if (maxSpeed && ((location.coords.speed ?? 0) * 3.6) > maxSpeed) {
                            monitorContext?.addMessage('warrning');
                            setWarning(true);
                        } else {
                            setWarning(false);
                        }

                    } else {
                        setSpeed(0);
                    }

                    try {
                        const addressPath = `https://nominatim.openstreetmap.org/reverse.php?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&format=json&zoom=17`;
                        monitorContext?.addMessage(addressPath.substring(0, 96));

                        const addressResponse = await fetch(addressPath,
                            {
                                method: 'GET',
                                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'Accept': 'application/json' }
                            }
                        );
                        monitorContext?.addMessage('Address ' + addressResponse.status);

                        /*
                        if (addressResponse.status != 200 && timerContext) {
                            timerContext.stopTimer();
                            timerContext.startTimer();
                            return;
                        }
                        */

                        const addressData = await addressResponse.json();
                        monitorContext?.addMessage('LocationWatcher ' + addressData?.osm_id);
                        if (addressData) {
                            setStreet(addressData.address.road);
                        }

                        const id = addressData.osm_id;
                        if (address1 && addressData.osm_id == address1?.osm_id) {
                            monitorContext?.addMessage('No change in details ' + address1?.osm_id);
                            return;
                        }

                        address1 = addressData;

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
                        monitorContext?.addMessage('Details ' + JSON.stringify(detailsData));

                        if (detailsData && detailsData.extratags && detailsData.extratags.maxspeed) {
                            monitorContext?.addMessage('Details ' + detailsData.extratags.maxspeed);

                            maxSpeed = detailsData?.extratags?.maxspeed;

                            if (maxSpeed !== null) {
                                setMaxSpeed(maxSpeed);
                            }

                            if (maxSpeed && ((location.coords.speed ?? 0) * 3.6) > maxSpeed) {
                                monitorContext?.addMessage('warrning');
                                setWarning(true);
                            } else {
                                setWarning(false);
                            }
                        }

                    } catch (error) {
                        monitorContext?.addMessage('LocationWatcher ' + error);
                    }
                }
            );
        };

        startWatching();

        return () => {
            if (subscription) {
                subscription?.remove();
            }
        };
    }, []);

    // No UI component, just background location watching
    return null;
};

export default LocationWatcher;

