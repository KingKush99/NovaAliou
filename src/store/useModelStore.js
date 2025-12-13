import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MODEL_ACCESS_CODE = 'MODELACCESS2024';

export const useModelStore = create(
    persist(
        (set) => ({
            hasAccess: false,
            verifyCode: (code) => {
                const isValid = code === MODEL_ACCESS_CODE;
                if (isValid) {
                    set({ hasAccess: true });
                }
                return isValid;
            },
            revokeAccess: () => set({ hasAccess: false }),
        }),
        {
            name: 'model-storage',
        }
    )
);
