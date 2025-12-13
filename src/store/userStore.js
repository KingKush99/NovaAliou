import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
    persist(
        (set, get) => ({
            // User Profile
            user: {
                id: '1',
                name: '',
                displayName: '',
                username: '',
                age: null,
                bio: '',
                photos: [], // Array of URLs
                interests: [],
                location: {
                    city: 'New York',
                    distance: 0
                },
                isVIP: false,
                isVerified: false,
                lastUsernameChange: null,
                gender: null
            },

            // Currency
            diamonds: 150,
            coins: 2500,

            // Stats
            followers: 0,
            following: 0,
            giftsReceived: 0,
            giftsSent: [], // Array of {giftType, recipientId, recipientName, timestamp, coinCost}

            // Onboarding
            hasCompletedOnboarding: false,
            onboardingStep: 0,
            hasAcceptedEULA: false,

            // Permissions
            hasGrantedPermissions: {
                camera: false,
                microphone: false,
                notifications: false
            },

            // Settings
            settings: {
                notifications: {
                    matches: true,
                    messages: true,
                    likes: true,
                    promotions: false,
                    directMessages: true,
                    videoCalls: true,
                    newFollowers: true,
                    specialOffers: true,
                    reminderTime: null
                },
                privacy: {
                    showOnline: true,
                    incognito: false
                },
                blurEffect: false
            },

            // Themes
            ownedThemes: ['theme-1', 'theme-2', 'theme-3'],
            currentTheme: 'theme-1',

            // Actions
            setUser: (userData) => set((state) => ({
                user: { ...state.user, ...userData }
            })),

            updateProfile: (updates) => set((state) => ({
                user: { ...state.user, ...updates }
            })),

            addPhoto: (photo) => set((state) => ({
                user: {
                    ...state.user,
                    photos: [...state.user.photos, photo]
                }
            })),

            removePhoto: (photoIndex) => set((state) => ({
                user: {
                    ...state.user,
                    photos: state.user.photos.filter((_, i) => i !== photoIndex)
                }
            })),

            setCoins: (amount) => set({ coins: amount }),

            addCoins: (amount) => set((state) => ({
                coins: state.coins + amount
            })),

            spendCoins: (amount) => set((state) => ({
                coins: Math.max(0, state.coins - amount)
            })),

            deductCoins: (amount) => {
                const current = get().coins;
                if (current >= amount) {
                    set({ coins: current - amount });
                    return true;
                }
                return false;
            },

            setDiamonds: (amount) => set({ diamonds: amount }),

            addDiamonds: (amount) => set((state) => ({
                diamonds: state.diamonds + amount
            })),

            spendDiamonds: (amount) => set((state) => ({
                diamonds: Math.max(0, state.diamonds - amount)
            })),

            deductDiamonds: (amount) => {
                const current = get().diamonds;
                if (current >= amount) {
                    set({ diamonds: current - amount });
                    return true;
                }
                return false;
            },

            upgradeToVIP: () => set((state) => ({
                user: { ...state.user, isVIP: true }
            })),

            completeOnboarding: () => set({
                hasCompletedOnboarding: true
            }),

            setOnboardingStep: (step) => set({
                onboardingStep: step
            }),

            acceptEULA: () => set({ hasAcceptedEULA: true }),

            grantPermission: (type) => set((state) => ({
                hasGrantedPermissions: {
                    ...state.hasGrantedPermissions,
                    [type]: true
                }
            })),

            updateSettings: (category, updates) => set((state) => ({
                settings: {
                    ...state.settings,
                    [category]: {
                        ...state.settings[category],
                        ...updates
                    }
                }
            })),

            // Helpers
            getDisplayCoins: () => get().coins * 10,
            getDisplayDiamonds: () => get().diamonds * 10,

            buyTheme: (themeId, cost) => {
                const { coins, ownedThemes } = get();
                if (ownedThemes.includes(themeId)) return true;
                if (coins >= cost) {
                    set({
                        coins: coins - cost,
                        ownedThemes: [...ownedThemes, themeId]
                    });
                    return true;
                }
                return false;
            },

            sendGift: (giftType, recipientId, recipientName, coinCost) => {
                const { coins, giftsSent } = get();
                if (coins >= coinCost) {
                    set({
                        coins: coins - coinCost,
                        giftsSent: [...giftsSent, {
                            giftType,
                            recipientId,
                            recipientName,
                            timestamp: Date.now(),
                            coinCost
                        }]
                    });
                    return true;
                }
                return false;
            },

            setTheme: (themeId) => set({ currentTheme: themeId })
        }),
        {
            name: 'joi-user-storage-v2'
        }
    )
);
