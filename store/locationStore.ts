import Details from '@/types/details';
import { create } from 'zustand';

type State = {
    latitude: number | null;
    longitude: number | null;
    speed: number;
    street: string;
    warning: boolean;
    maxSpeed: number | null;
};

type Actions = {
    setLocation: (
        latitude: number,
        longitude: number
    ) => void;

    setSpeed: (speed: number) => void;

    setStreet: (street: string) => void;

    setWarning: (warning: boolean) => void;

    setMaxSpeed: (maxSpeed: number) => void;
};

const useLocationStore = create<State & Actions>((set, get) => ({
    latitude: null,
    longitude: null,
    speed: 0,
    street: '',
    warning: false,
    maxSpeed: 0,

    setLocation: (
        latitude: number,
        longitude: number
    ) =>
        set({
            latitude, longitude
        }),
    setSpeed: (
        speed: number
    ) =>
        set({
            speed
        }),
    setStreet: (street: string) => set({ street }),

    setWarning: (warning: boolean) => set({ warning }),

    setMaxSpeed: (maxSpeed: number) => set({ maxSpeed }),

}));

export default useLocationStore;
