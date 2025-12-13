import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const TIERS = {
    FREE: 'FREE',
    GOLD: 'GOLD',
    DIAMOND: 'DIAMOND',
    PLATINUM: 'PLATINUM'
};

export const TIER_BENEFITS = {
    [TIERS.FREE]: {
        name: 'Free',
        price: 0,
        color: '#ffffff',
        features: []
    },
    [TIERS.GOLD]: {
        name: 'Gold',
        price: 9.99,
        color: '#FFD700',
        features: [
            '10,000 Coin Bonus',
            'No Ads',
            'Unlimited Unsolicited Messages',
            'Multi-Chat Access',
            'Black & Gold UI'
        ]
    },
    [TIERS.DIAMOND]: {
        name: 'Diamond',
        price: 19.99,
        color: '#00D4FF',
        features: [
            'All Gold Benefits',
            '15% Store Discount',
            'Exclusive Filters',
            'Multiple Simultaneous Chats',
            'Group Chat Creation',
            'Diamond UI'
        ]
    },
    [TIERS.PLATINUM]: {
        name: 'Platinum',
        price: 29.99,
        color: '#E5E4E2',
        features: [
            'All Diamond Benefits',
            '25,000 Coin Bonus',
            '30% Store Discount',
            'Multi-Person Video Calls',
            'Premium Gifts',
            'Exclusive Games Tab',
            'Platinum UI'
        ]
    }
};

export const useSubscriptionStore = create(
    persist(
        (set, get) => ({
            tier: TIERS.FREE, // Default to FREE

            setTier: (newTier) => set({ tier: newTier }),

            upgradeTier: (newTier) => {
                // Logic for upgrading (e.g., adding coins) could go here or in the component
                set({ tier: newTier });
            },

            getTheme: () => {
                const tier = get().tier;
                switch (tier) {
                    case TIERS.DIAMOND:
                        return 'diamond';
                    case TIERS.PLATINUM:
                        return 'platinum';
                    default:
                        return 'default'; // Black & Gold
                }
            }
        }),
        {
            name: 'subscription-storage',
        }
    )
);
