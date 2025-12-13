import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// ⚠️ REPLACE THESE WITH YOUR REAL IDS FROM ADMOB CONSOLE
const AD_IDS = {
    android: {
        banner: 'ca-app-pub-4860697858864944/2699291851', // Real ID from User
        reward: 'ca-app-pub-4860697858864944/7999719992', // Real ID from User
        interstitial: 'ca-app-pub-3940256099942544/1033173712'
    },
    ios: {
        banner: 'ca-app-pub-3940256099942544/2934735716',
        reward: 'ca-app-pub-3940256099942544/1712485313',
        interstitial: 'ca-app-pub-3940256099942544/4411468910'
    }
};

const getAdId = (type) => {
    const platform = Capacitor.getPlatform() === 'android' ? 'android' : 'ios';
    return AD_IDS[platform][type];
};

let isInitialized = false;

export const AdMobController = {
    initialize: async () => {
        if (!Capacitor.isNativePlatform()) return;
        if (isInitialized) return;

        try {
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'], // Add your device ID for test mode
                initializeForTesting: true,
            });
            isInitialized = true;
            console.log('✅ AdMob Initialized');
        } catch (e) {
            console.error('❌ AdMob Init Fail:', e);
        }
    },

    showBanner: async (margin = 0) => {
        if (!Capacitor.isNativePlatform()) return;
        if (!isInitialized) {
            console.warn('⚠️ AdMob not initialized yet, skipping banner show');
            return;
        }

        try {
            await AdMob.showBanner({
                adId: getAdId('banner'),
                adSize: BannerAdSize.ADAPTIVE_BANNER,
                position: BannerAdPosition.TOP_CENTER,
                margin: margin,
                isTesting: true // Set to false when publishing
            });
        } catch (e) {
            console.error('❌ Show Banner Fail:', e);
        }
    },

    hideBanner: async () => {
        if (!Capacitor.isNativePlatform()) return;
        try {
            await AdMob.hideBanner();
        } catch (e) {
            console.warn('⚠️ Hide banner failed (maybe none shown)');
        }
    },

    showRewardVideo: async () => {
        if (!Capacitor.isNativePlatform()) {
            alert('Ads only work on mobile devices!');
            return true;
        }

        if (!isInitialized) {
            console.warn('⚠️ AdMob not initialized yet');
            return false;
        }

        return new Promise(async (resolve) => {
            let earnedReward = false;
            let listeners = [];

            const cleanup = async () => {
                listeners.forEach(async (listener) => await listener.remove());
            };

            try {
                // Listen for Reward (User verified watched)
                const onReward = await AdMob.addListener('onRewardVideoReward', (info) => {
                    console.log('💰 User Earned Reward:', info);
                    earnedReward = true;
                });
                listeners.push(onReward);

                // Listen for Close (User clicked X)
                const onDismiss = await AdMob.addListener('onRewardVideoAdDismissed', async () => {
                    console.log('❌ Ad Closed');
                    await cleanup();
                    resolve(earnedReward);
                });
                listeners.push(onDismiss);

                // Prepare and Show
                await AdMob.prepareRewardVideoAd({
                    adId: getAdId('reward'),
                    isTesting: true
                });
                await AdMob.showRewardVideoAd();

            } catch (e) {
                console.error('❌ Reward Fail:', e);
                await cleanup();
                resolve(false);
            }
        });
    }
};
