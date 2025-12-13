import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNavbarStore = create(
    persist(
        (set) => ({
            isVisible: true,
            toggleNavbar: () => set((state) => ({ isVisible: !state.isVisible })),
            showNavbar: () => set({ isVisible: true }),
            hideNavbar: () => set({ isVisible: false }),
        }),
        {
            name: 'navbar-storage',
        }
    )
);
