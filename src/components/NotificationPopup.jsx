import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiNotification3Fill, RiCloseLine } from 'react-icons/ri';
import './NotificationPopup.css';

// Simple Event Bus for Notifications
export const notify = (title, message) => {
    window.dispatchEvent(new CustomEvent('show-notification', { detail: { title, message } }));
};

export default function NotificationPopup() {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const handleShow = (e) => {
            setNotification(e.detail);
            // Auto hide after 4s
            setTimeout(() => setNotification(null), 4000);
        };

        window.addEventListener('show-notification', handleShow);
        return () => window.removeEventListener('show-notification', handleShow);
    }, []);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    className="notification-popup"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="notif-icon-col">
                        <RiNotification3Fill size={24} />
                    </div>
                    <div className="notif-text-col">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                    </div>
                    <button className="notif-close" onClick={() => setNotification(null)}>
                        <RiCloseLine />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
