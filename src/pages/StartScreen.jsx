import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import backgroundImage from '../assets/logo_bg.jpg';
import './StartScreen.css';

function StartScreen() {
    const navigate = useNavigate();
    const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check local storage directly for robustness
        const localOnboarded = localStorage.getItem('hasOnboarded');
        if (hasCompletedOnboarding || localOnboarded === 'true') {
            navigate('/home', { replace: true });
        }
        setIsLoaded(true);
    }, [hasCompletedOnboarding, navigate]);

    const handleConnect = () => {
        navigate('/onboarding');
    };

    if (!isLoaded) return null;

    return (
        <div className="start-screen">
            {/* Background Image */}
            <div className="start-screen__background">
                <img
                    src={backgroundImage}
                    alt="Background"
                    className="start-screen__bg-img"
                />
                <div className="start-screen__overlay" />
            </div>

            {/* Content */}
            <motion.div
                className="start-screen__content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                {/* Logo */}
                <motion.div
                    className="start-screen__logo"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <h1 className="start-screen__title">NoveltyCams</h1>
                    <p className="start-screen__subtitle">Live Video Chat</p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    className="start-screen__cta"
                    onClick={handleConnect}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="start-screen__cta-text">Connect & Enjoy</span>
                    <div className="start-screen__cta-glow" />
                </motion.button>

                {/* Terms */}
                <motion.p
                    className="start-screen__terms"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    By continuing, you agree to our{' '}
                    <a href="/legal/terms" className="start-screen__link">Terms</a>
                    {' & '}
                    <a href="/legal/privacy" className="start-screen__link">Privacy Policy</a>
                </motion.p>
            </motion.div>
        </div>
    );
}

export default StartScreen;
