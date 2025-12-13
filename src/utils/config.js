import { Capacitor } from '@capacitor/core';

export const getApiUrl = () => {
    // Check if running on a physical device or emulator via Capacitor
    if (Capacitor.getPlatform() === 'android') {
        // 10.0.2.2 is the special alias to your host loopback interface (127.0.0.1)
        // on the Android Development Emulator
        return 'http://10.0.2.2:3001';
    }

    // Default to localhost for web/iOS emulator
    // Use import.meta.env.VITE_API_URL if set, otherwise localhost
    return import.meta.env.VITE_API_URL || 'http://localhost:3001';
};
