import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchProfile, logout as apiLogout } from '../services/api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: false,
            isLoading: false,

            loadUser: async () => {
                set({ isLoading: true });
                try {
                    const user = await fetchProfile();
                    set({ user, isLoggedIn: true });
                } catch {
                    set({ user: null, isLoggedIn: false });
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await apiLogout();
                } catch {}
                set({ user: null, isLoggedIn: false });
                window.location.href = '/';
            },

            setUser: (user) => set({ user, isLoggedIn: !!user }),
        }),
        { name: 'eventora-auth', partialize: (state) => ({ isLoggedIn: state.isLoggedIn }) }
    )
);
