import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHUDStore = create(
    persist(
        (set) => ({
            showChatbot: true,
            showMiniSlots: true,
            toggleChatbot: () => set((state) => ({ showChatbot: !state.showChatbot })),
            toggleMiniSlots: () => set((state) => ({ showMiniSlots: !state.showMiniSlots })),
        }),
        {
            name: 'hud-storage',
        }
    )
);
