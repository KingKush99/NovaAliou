import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import './GiftAnimation.css';

export default function GiftAnimation({ gift, onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            <motion.div
                className="gift-animation-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="gift-animation-content"
                    initial={{ scale: 0, y: 100, rotate: -10 }}
                    animate={{
                        scale: [0, 1.5, 1],
                        y: [100, -50, 0],
                        rotate: [-10, 10, 0]
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <div className="gift-emoji">{gift.image}</div>
                    <motion.div
                        className="gift-name"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {gift.name}
                    </motion.div>
                </motion.div>

                {/* Particle effects could go here */}
            </motion.div>
        </AnimatePresence>
    );
}
