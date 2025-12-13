// AdService.js
// Handles Google AdMob integration for NoveltyCams

const ADMOB_PUBLISHER_ID = import.meta.env.VITE_ADMOB_PUBLISHER_ID || 'pub-4860697858864944';

class AdService {
    constructor() {
        this.initialized = false;
        this.rewardedAdLoaded = false;
        this.testMode = import.meta.env.DEV;
    }

    init() {
        if (this.initialized) return;

        console.log('AdService: Initializing AdMob with ID', ADMOB_PUBLISHER_ID);

        // In a real implementation, this would load the Google Mobile Ads SDK
        // For web, we might use AdSense or AdMob Web SDK

        this.initialized = true;
        this.loadRewardedAd();
    }

    loadRewardedAd() {
        console.log('AdService: Loading rewarded video ad...');
        // Simulate loading delay
        setTimeout(() => {
            this.rewardedAdLoaded = true;
            console.log('AdService: Rewarded ad loaded');
        }, 2000);
    }

    showRewardedAd(onReward, onClose) {
        if (!this.rewardedAdLoaded) {
            console.warn('AdService: Ad not ready');
            // Try to load for next time
            this.loadRewardedAd();
            return false;
        }

        console.log('AdService: Showing rewarded video ad');

        // Simulate ad playback
        // In real app, this would show the full screen ad overlay

        // Mocking the ad experience for now
        const adOverlay = document.createElement('div');
        adOverlay.style.position = 'fixed';
        adOverlay.style.top = '0';
        adOverlay.style.left = '0';
        adOverlay.style.width = '100vw';
        adOverlay.style.height = '100vh';
        adOverlay.style.background = 'black';
        adOverlay.style.zIndex = '9999';
        adOverlay.style.display = 'flex';
        adOverlay.style.flexDirection = 'column';
        adOverlay.style.alignItems = 'center';
        adOverlay.style.justifyContent = 'center';
        adOverlay.style.color = 'white';
        adOverlay.innerHTML = `
            <h2>Ad Playing...</h2>
            <p>Simulating 5 second video ad</p>
            <div style="width: 200px; height: 4px; background: #333; margin-top: 20px; border-radius: 2px;">
                <div id="ad-progress" style="width: 0%; height: 100%; background: #4CAF50; transition: width 5s linear;"></div>
            </div>
        `;

        document.body.appendChild(adOverlay);

        // Animate progress
        setTimeout(() => {
            const progress = document.getElementById('ad-progress');
            if (progress) progress.style.width = '100%';
        }, 100);

        // Finish ad
        setTimeout(() => {
            document.body.removeChild(adOverlay);
            this.rewardedAdLoaded = false; // Consumed
            this.loadRewardedAd(); // Load next one

            if (onReward) onReward();
            if (onClose) onClose();
        }, 5000);

        return true;
    }
}

export const adService = new AdService();
