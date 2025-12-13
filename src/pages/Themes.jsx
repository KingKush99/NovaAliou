import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiCheckLine, RiLockFill, RiCoinFill } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import Button from '../components/Button';
import './Themes.css';

const THEMES = [
    { id: 'theme-1', name: 'Classic Dark', price: 0, pattern: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)' },
    { id: 'theme-2', name: 'Midnight Blue', price: 0, pattern: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
    { id: 'theme-3', name: 'Purple Haze', price: 0, pattern: 'linear-gradient(135deg, #240b36 0%, #c31432 100%)' },
    { id: 'theme-4', name: 'Ocean Vibes', price: 100, pattern: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)' },
    { id: 'theme-5', name: 'Sunset Glow', price: 200, pattern: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' },
    { id: 'theme-6', name: 'Forest Mist', price: 400, pattern: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
    { id: 'theme-7', name: 'Royal Gold', price: 800, pattern: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)' },
    { id: 'theme-8', name: 'Neon Cyber', price: 1600, pattern: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)' },
    { id: 'theme-9', name: 'Deep Space', price: 3200, pattern: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)' },
    { id: 'theme-10', name: 'Diamond Lux', price: 6400, pattern: 'linear-gradient(135deg, #E0E0E0 0%, #ffffff 50%, #E0E0E0 100%)' }
];

export default function Themes() {
    const { coins, ownedThemes, currentTheme, buyTheme, setTheme } = useUserStore();
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const handleThemeClick = (theme) => {
        if (ownedThemes.includes(theme.id)) {
            setTheme(theme.id);
        } else {
            setSelectedTheme(theme);
            setShowPurchaseModal(true);
        }
    };

    const handlePurchase = () => {
        if (!selectedTheme) return;

        const success = buyTheme(selectedTheme.id, selectedTheme.price);
        if (success) {
            setTheme(selectedTheme.id);
            setShowPurchaseModal(false);
            setSelectedTheme(null);
        } else {
            alert('Not enough coins!'); // Could be a better UI feedback
        }
    };

    return (
        <div className="themes-page">
            <Header title="Themes" showBalance />

            <div className="themes-content">
                <div className="themes-grid">
                    {THEMES.map((theme, index) => {
                        const isOwned = ownedThemes.includes(theme.id);
                        const isCurrent = currentTheme === theme.id;

                        return (
                            <motion.div
                                key={theme.id}
                                className={`theme-card ${isCurrent ? 'active' : ''}`}
                                onClick={() => handleThemeClick(theme)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div
                                    className="theme-preview"
                                    style={{ background: theme.pattern }}
                                >
                                    {isCurrent && (
                                        <div className="current-badge">
                                            <RiCheckLine />
                                        </div>
                                    )}
                                    {!isOwned && (
                                        <div className="lock-overlay">
                                            <RiLockFill size={24} />
                                        </div>
                                    )}
                                </div>

                                <div className="theme-info">
                                    <span className="theme-name">{theme.name}</span>
                                    {isOwned ? (
                                        <span className="theme-status owned">Owned</span>
                                    ) : (
                                        <span className="theme-price">
                                            <RiCoinFill className="coin-icon" />
                                            {theme.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <BottomNav />

            <Modal
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                title="Unlock Theme"
            >
                {selectedTheme && (
                    <div className="purchase-modal">
                        <div
                            className="theme-preview-large"
                            style={{ background: selectedTheme.pattern }}
                        />
                        <h3>{selectedTheme.name}</h3>
                        <p>Unlock this theme for {selectedTheme.price.toLocaleString()} coins?</p>

                        <div className="purchase-actions">
                            <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handlePurchase}>
                                Buy for {selectedTheme.price} Coins
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
