import * as Location from 'expo-location';

const areCoordinatesAlmostEqual = (
    coords1: Location.LocationObject | null,
    coords2: Location.LocationObject,
    tolerance: number = 0.0005):
    boolean => {
    if (!coords1) {
        return false;
    }
    const latDifference = Math.abs(coords1.coords.latitude - coords2.coords.latitude);
    const lonDifference = Math.abs(coords1.coords.longitude - coords2.coords.longitude);
    return latDifference <= tolerance && lonDifference <= tolerance;
};

export default areCoordinatesAlmostEqual;