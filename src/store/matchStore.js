import { create } from 'zustand';

const useMatchStore = create((set, get) => ({
    // Match feed
    profiles: [],
    currentProfileIndex: 0,
    filters: {
        ageRange: [18, 50],
        maxDistance: 50,
        interests: []
    },

    // Matches
    matches: [],
    newMatches: [],

    // Actions
    likes: [],
    passes: [],

    // Initialize profiles
    setProfiles: (profiles) => set({ profiles }),

    // Swipe actions
    likeProfile: (profileId) => set((state) => {
        const profile = state.profiles[state.currentProfileIndex];
        const isMatch = Math.random() > 0.7; // 30% chance of match for demo

        return {
            likes: [...state.likes, profileId],
            currentProfileIndex: state.currentProfileIndex + 1,
            matches: isMatch ? [...state.matches, profile] : state.matches,
            newMatches: isMatch ? [...state.newMatches, profile] : state.newMatches
        };
    }),

    passProfile: (profileId) => set((state) => ({
        passes: [...state.passes, profileId],
        currentProfileIndex: state.currentProfileIndex + 1
    })),

    superLike: (profileId) => set((state) => {
        const profile = state.profiles[state.currentProfileIndex];
        const isMatch = Math.random() > 0.5; // 50% chance for super like

        return {
            likes: [...state.likes, profileId],
            currentProfileIndex: state.currentProfileIndex + 1,
            matches: isMatch ? [...state.matches, profile] : state.matches,
            newMatches: isMatch ? [...state.newMatches, profile] : state.newMatches
        };
    }),

    // Clear new matches notification
    clearNewMatches: () => set({ newMatches: [] }),

    // Update filters
    updateFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    // Reset
    reset: () => set({
        currentProfileIndex: 0,
        likes: [],
        passes: []
    })
}));

export { useMatchStore };
