import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

export class NativeAuthController {
    static initialized = false;

    static initialize() {
        if (this.initialized) return;

        // Only initialize on native platforms
        if (Capacitor.isNativePlatform()) {
            GoogleAuth.initialize({
                clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                scopes: ['profile', 'email'],
                grantOfflineAccess: true,
            });
            this.initialized = true;
            console.log('✅ Native Google Auth Initialized');
        }
    }

    static async signIn() {
        if (!Capacitor.isNativePlatform()) {
            console.warn('Native Auth not available on web');
            return null;
        }

        try {
            const user = await GoogleAuth.signIn();
            console.log('Native Sign-In Success:', user);
            return user;
        } catch (error) {
            console.error('Native Sign-In Error:', error);
            throw error;
        }
    }

    static async signOut() {
        if (!Capacitor.isNativePlatform()) return;
        await GoogleAuth.signOut();
    }
}
