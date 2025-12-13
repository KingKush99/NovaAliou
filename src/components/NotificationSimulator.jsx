import { useEffect } from 'react';
import { notify } from './NotificationPopup';

const MOCK_NOTIFICATIONS = [
    { title: 'Jessica Rose', body: 'Sent you a photo 📷', img: 'https://i.pravatar.cc/150?img=5', type: 'message' },
    { title: 'Raven Sky', body: 'Missed video call 📞', img: 'https://i.pravatar.cc/150?img=9', type: 'call' },
    { title: 'New Follower', body: 'Emma Stone started following you', img: 'https://i.pravatar.cc/150?img=20', type: 'follow' },
    { title: 'System', body: 'You earned 50 diamonds! 💎', img: '', type: 'system' }
];

const NON_SYSTEM_NOTIFICATIONS = MOCK_NOTIFICATIONS.filter(notif => notif.type !== 'system');

export default function NotificationSimulator() {
    useEffect(() => {
        // Randomly trigger notification every 30-120 seconds
        const loop = () => {
            const delay = Math.random() * 90000 + 30000;
            setTimeout(() => {
                // Removed 'system' (coins/diamonds)
                const randomNotif = NON_SYSTEM_NOTIFICATIONS[Math.floor(Math.random() * NON_SYSTEM_NOTIFICATIONS.length)];

                // Use the new Global Popup
                notify(randomNotif.title, randomNotif.body);

                loop();
            }, delay);
        };

        // Start loop
        const timer = setTimeout(loop, 5000); // First one after 5s
        return () => clearTimeout(timer);
    }, []);

    return null; // Logic only
}
