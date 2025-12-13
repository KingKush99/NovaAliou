import { create } from 'zustand';

// Mock referral codes - in production, these would come from backend
const MOCK_REFERRAL_CODES = {
    'ADMIN001': { type: 'admin', usedCount: 0, maxReferrals: Infinity, referredUsers: [] },
    'MODEL123': { type: 'model', usedCount: 2, maxReferrals: 5, referredUsers: ['user1', 'user2'] },
    'MODEL456': { type: 'model', usedCount: 5, maxReferrals: 5, referredUsers: ['user3', 'user4', 'user5', 'user6', 'user7'] },
    'MODEL789': { type: 'model', usedCount: 0, maxReferrals: 5, referredUsers: [] },
};

export const useReferralStore = create((set, get) => ({
    referralCodes: MOCK_REFERRAL_CODES,
    userReferralCode: null, // User's own referral code if they're a model

    // Validate a referral code
    validateReferralCode: (code) => {
        const { referralCodes } = get();
        const referralData = referralCodes[code];

        if (!referralData) {
            return { valid: false, message: 'Invalid referral code' };
        }

        if (referralData.usedCount >= referralData.maxReferrals) {
            return { valid: false, message: 'This referral code has reached its limit' };
        }

        return { valid: true, message: 'Valid referral code' };
    },

    // Use a referral code (called when someone signs up)
    useReferralCode: (code, newUserId) => {
        const { referralCodes } = get();
        const referralData = referralCodes[code];

        if (!referralData) return false;
        if (referralData.usedCount >= referralData.maxReferrals) return false;

        set({
            referralCodes: {
                ...referralCodes,
                [code]: {
                    ...referralData,
                    usedCount: referralData.usedCount + 1,
                    referredUsers: [...referralData.referredUsers, newUserId]
                }
            }
        });

        return true;
    },

    // Generate a new referral code for a user (when they become a model)
    generateReferralCode: (userId) => {
        const code = `MODEL${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const { referralCodes } = get();

        set({
            referralCodes: {
                ...referralCodes,
                [code]: {
                    type: 'model',
                    usedCount: 0,
                    maxReferrals: 5,
                    referredUsers: [],
                    ownerId: userId
                }
            },
            userReferralCode: code
        });

        return code;
    },

    // Get referral stats for a code
    getReferralStats: (code) => {
        const { referralCodes } = get();
        const referralData = referralCodes[code];

        if (!referralData) return null;

        return {
            code,
            used: referralData.usedCount,
            max: referralData.maxReferrals,
            remaining: referralData.maxReferrals - referralData.usedCount,
            referredUsers: referralData.referredUsers
        };
    },

    // Set user's referral code (when they log in as a model)
    setUserReferralCode: (code) => set({ userReferralCode: code }),
}));
