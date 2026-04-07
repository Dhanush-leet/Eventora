import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocationStore = create(
    persist(
        (set) => ({
            location: 'Mumbai', // Default state as per requirements
            setLocation: (location) => set({ location }),
        }),
        { name: 'eventora-location' }
    )
);
