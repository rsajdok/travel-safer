import { create } from 'zustand';

type State = {
    name: string;
};

type Actions = {
    setName: (name: string) => void;
};

const useStore = create<State & Actions>((set) => ({
    name: 'John Doe',
    setName: (name: string) => set({ name }),
}));

export default useStore;
