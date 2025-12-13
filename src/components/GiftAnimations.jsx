import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import './GiftAnimations.css';

const GIFTS = {
    rose: { icon: '🌹', color: '#ff4b4b' },
    heart: { icon: '❤️', color: '#ff0000' },
    diamond: { icon: '💎', color: '#00d4ff' },
    crown: { icon: '👑', color: '#ffd700' },
    rocket: { icon: '🚀', color: '#ff9f43' }
};

export default function GiftAnimations({ type, onComplete }) {
    useEffect(() => {
        if (type) {
            const timer = setTimeout(() => {
                onComplete && onComplete();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [type, onComplete]);

    if (!type || !GIFTS[type]) return null;

    return (
        <div className="gift-animation-overlay">
            <motion.div
                className="gift-main"
                initial={{ scale: 0, y: 100, opacity: 0 }}
                animate={{
                    scale: [0, 1.5, 1],
                    y: [100, 0, -50],
                    opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
            >
                <span className="gift-icon">{GIFTS[type].icon}</span>
                <div className="gift-glow" style={{ background: GIFTS[type].color }} />
            </motion.div>

            {/* Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="gift-particle"
                    initial={{ x: 0, y: 0, scale: 0 }}
                    animate={{
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                        scale: [0, 1, 0],
                        opacity: [1, 0]
                    }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    style={{ background: GIFTS[type].color }}
                />
            ))}
        </div>
    );
}
