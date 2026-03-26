import { Capacitor } from '@capacitor/core';

export const getApiUrl = () => {
    if (Capacitor.getPlatform() === 'android') {
        return 'http://10.0.2.2:3003';
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:3003';
};

export const getChatUrl = () => {
    if (Capacitor.getPlatform() === 'android') {
        return 'http://10.0.2.2:3001';
    }
    return import.meta.env.VITE_CHAT_URL || 'http://localhost:3001';
};

export const getStreamUrl = () => {
    if (Capacitor.getPlatform() === 'android') {
        return 'http://10.0.2.2:3002';
    }
    return import.meta.env.VITE_STREAM_URL || 'http://localhost:3002';
};
