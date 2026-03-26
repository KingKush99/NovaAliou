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
                gender: null,
                blockedUsers: []
            },

            // Currency
            diamonds: 150,
            coins: 2500,

            // Stats
            followers: 0,
            following: 0,
            giftsReceived: 0,
            giftsSent: [],

            // Social Tracking - Real user lists (Empty for launch)
            followingList: [],
            friendsList: [],
            followersList: [],

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
                    pushEnabled: true,
                    friendRequests: true,
                    reminderTime: null
                },
                display: {
                    darkMode: true
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

            setTheme: (themeId) => set({ currentTheme: themeId }),

            // Social Actions
            followUser: (userId) => set((state) => {
                if (state.followingList.includes(userId)) return state;
                return {
                    followingList: [...state.followingList, userId],
                    following: state.followingList.length + 1
                };
            }),

            unfollowUser: (userId) => set((state) => ({
                followingList: state.followingList.filter(id => id !== userId),
                following: Math.max(0, state.followingList.length - 1)
            })),

            addFriend: (userId) => set((state) => {
                if (state.friendsList.includes(userId)) return state;
                return {
                    friendsList: [...state.friendsList, userId]
                };
            }),

            removeFriend: (userId) => set((state) => ({
                friendsList: state.friendsList.filter(id => id !== userId)
            })),

            isFollowing: (userId) => get().followingList.includes(userId),
            isFriend: (userId) => get().friendsList.includes(userId),

            logout: () => {
                set({
                    user: {
                        id: '1',
                        name: '',
                        displayName: '',
                        username: '',
                        photos: [],
                        blockedUsers: []
                    },
                    coins: 0,
                    diamonds: 0,
                    hasCompletedOnboarding: false
                });
                localStorage.removeItem('hasOnboarded');
                localStorage.removeItem('joi-user-storage-v3');
                window.location.href = '/';
            }
        }),
        {
            name: 'joi-user-storage-v3',
            version: 1, // Migration for real data only launch
            migrate: (persistedState, version) => {
                if (version === 0) {
                    return {
                        ...persistedState,
                        followers: 0,
                        following: 0,
                        followingList: [],
                        friendsList: [],
                        followersList: []
                    };
                }
                return persistedState;
            }
        }
    )
);
