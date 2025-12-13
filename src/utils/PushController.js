import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export class PushController {
    static async requestPermissions() {
        if (!Capacitor.isNativePlatform()) return false;

        try {
            const result = await PushNotifications.requestPermissions();
            if (result.receive === 'granted') {
                await PushNotifications.register();
                return true;
            }
        } catch (error) {
            console.error('Push Permission Error:', error);
        }
        return false;
    }

    static addListeners() {
        if (!Capacitor.isNativePlatform()) return;

        PushNotifications.addListener('registration', (token) => {
            console.log('Push Registration Token:', token.value);
            // TODO: Send token to backend
        });

        PushNotifications.addListener('registrationError', (error) => {
            console.error('Push Registration Error:', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push Received:', notification);
            // Show HUD notification or toast
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
            console.log('Push Action Performed:', notification);
            // Navigate to specific page
        });
    }
}
