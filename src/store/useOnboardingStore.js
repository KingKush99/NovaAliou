import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOnboardingStore = create(
    persist(
        (set) => ({
            completed: false,
            ageVerified: false,
            cameraPermission: false,
            micPermission: false,
            completeOnboarding: () => set({ completed: true }),
            setAgeVerified: (verified) => set({ ageVerified: verified }),
            setCameraPermission: (granted) => set({ cameraPermission: granted }),
            setMicPermission: (granted) => set({ micPermission: granted }),
        }),
        {
            name: 'onboarding-storage',
        }
    )
);
