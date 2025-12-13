import { create } from 'zustand';

const useStoreStore = create((set) => ({
    // VIP Packages
    vipPackages: [
        {
            id: 'vip-1-month',
            name: '1 Month VIP',
            duration: '1 month',
            price: 9.99,
            features: [
                'Unlimited likes',
                'See who liked you',
                'Rewind last swipe',
                'No ads',
                'VIP badge',
                'Priority support'
            ]
        },
        {
            id: 'vip-3-months',
            name: '3 Months VIP',
            duration: '3 months',
            price: 24.99,
            savings: '17%',
            features: [
                'All 1 Month features',
                'Save 17%',
                'Exclusive filters',
                'Advanced search'
            ]
        },
        {
            id: 'vip-12-months',
            name: '12 Months VIP',
            duration: '12 months',
            price: 79.99,
            savings: '33%',
            popular: true,
            features: [
                'All 3 Month features',
                'Save 33%',
                'Premium gifts',
                'Profile boost'
            ]
        }
    ],

    // Diamond Packages
    diamondPackages: [
        { id: 'diamonds-100', amount: 100, price: 4.99, bonus: 0 },
        { id: 'diamonds-500', amount: 500, price: 19.99, bonus: 50 },
        { id: 'diamonds-1000', amount: 1000, price: 34.99, bonus: 150, popular: true },
        { id: 'diamonds-2500', amount: 2500, price: 79.99, bonus: 500 },
        { id: 'diamonds-5000', amount: 5000, price: 149.99, bonus: 1200 }
    ],

    // Coin Packages
    coinPackages: [
        { id: 'coins-1', amount: 1000, price: 0.99, bonusPercent: 0 },
        { id: 'coins-2', amount: 2100, price: 1.99, bonusPercent: 5 },
        { id: 'coins-3', amount: 5600, price: 4.99, bonusPercent: 10 },
        { id: 'coins-4', amount: 11700, price: 9.99, bonusPercent: 15 },
        { id: 'coins-5', amount: 24500, price: 19.99, bonusPercent: 20 },
        { id: 'coins-6', amount: 38700, price: 29.99, bonusPercent: 25 },
        { id: 'coins-7', amount: 60200, price: 44.44, bonusPercent: 30 },
        { id: 'coins-8', amount: 71100, price: 50.00, bonusPercent: 35 },
        { id: 'coins-9', amount: 104500, price: 69.99, bonusPercent: 40 },
        { id: 'coins-10', amount: 156700, price: 99.99, bonusPercent: 45 },
        { id: 'coins-11', amount: 213900, price: 129.99, bonusPercent: 50 }
    ],

    // Gifts
    gifts: [
        { id: 'rose', name: 'Rose', category: 'flowers', price: 10, image: '🌹' },
        { id: 'bouquet', name: 'Bouquet', category: 'flowers', price: 50, image: '💐' },
        { id: 'chocolate', name: 'Chocolate', category: 'sweets', price: 20, image: '🍫' },
        { id: 'cake', name: 'Cake', category: 'sweets', price: 30, image: '🎂' },
        { id: 'ring', name: 'Ring', category: 'jewelry', price: 100, image: '💍' },
        { id: 'crown', name: 'Crown', category: 'jewelry', price: 200, image: '👑' },
        { id: 'car', name: 'Sports Car', category: 'luxury', price: 500, image: '🏎️' },
        { id: 'yacht', name: 'Yacht', category: 'luxury', price: 1000, image: '🛥️' },
        { id: 'island', name: 'Private Island', category: 'luxury', price: 5000, image: '🏝️' }
    ],

    // Purchase history
    purchases: [],

    // Actions
    purchaseVIP: (packageId) => set((state) => ({
        purchases: [...state.purchases, {
            id: Date.now(),
            type: 'vip',
            packageId,
            timestamp: new Date()
        }]
    })),

    purchaseDiamonds: (packageId) => set((state) => ({
        purchases: [...state.purchases, {
            id: Date.now(),
            type: 'diamonds',
            packageId,
            timestamp: new Date()
        }]
    })),

    purchaseCoins: (packageId) => set((state) => ({
        purchases: [...state.purchases, {
            id: Date.now(),
            type: 'coins',
            packageId,
            timestamp: new Date()
        }]
    })),

    sendGift: (giftId, recipientId) => set((state) => ({
        purchases: [...state.purchases, {
            id: Date.now(),
            type: 'gift',
            giftId,
            recipientId,
            timestamp: new Date()
        }]
    }))
}));

export { useStoreStore };
