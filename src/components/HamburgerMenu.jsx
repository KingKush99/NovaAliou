import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMenuFill, RiMusicFill, RiSettings4Fill, RiAdvertisementFill, RiCloseLine } from 'react-icons/ri';
import coinImg from '../assets/NCoin.png';
import { useUserStore } from '../store/userStore';
import { AdMobController } from '../utils/AdMobController'; // Import AdMob
import MusicPlayer from './MusicPlayer';
import './HamburgerMenu.css';

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    const navigate = useNavigate();
    const { coins, addCoins } = useUserStore(); // Get addCoins
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleWatchAd = async () => {
        try {
            const earned = await AdMobController.showRewardVideo();
            if (earned) {
                addCoins(15);
                alert("Thanks for watching! +15 Coins");
            }
        } catch (error) {
            console.error("Ad failed", error);
            alert("No ad available right now.");
        }
        setIsOpen(false);
    };

    return (
        <>
            <div className="hamburger-menu-container" ref={menuRef}>
                <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <RiCloseLine size={24} /> : <RiMenuFill size={24} />}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="hamburger-dropdown"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="menu-header">
                                <span className="menu-title">Menu</span>
                            </div>

                            <div className="menu-item coin-item" onClick={() => handleNavigation('/store')}>
                                <div className="menu-icon-wrapper coin-wrapper">
                                    <img src={coinImg} alt="Coins" className="menu-icon coin-icon" />
                                </div>
                                <div className="menu-text">
                                    <span className="menu-label">Coins</span>
                                    <span className="coin-value">{coins}</span>
                                </div>
                            </div>

                            <div className="menu-divider" />

                            <div className="menu-item" onClick={handleWatchAd}>
                                <div className="menu-icon-wrapper">
                                    <RiAdvertisementFill className="menu-icon" />
                                </div>
                                <span className="menu-label">Watch Ads</span>
                            </div>

                            <div className="menu-item" onClick={() => { setShowMusicPlayer(true); setIsOpen(false); }}>
                                <div className="menu-icon-wrapper">
                                    <RiMusicFill className="menu-icon" />
                                </div>
                                <span className="menu-label">Music</span>
                            </div>

                            <div className="menu-item" onClick={() => handleNavigation('/settings')}>
                                <div className="menu-icon-wrapper">
                                    <RiSettings4Fill className="menu-icon" />
                                </div>
                                <span className="menu-label">Settings</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Music Player Overlay */}
            <AnimatePresence>
                {showMusicPlayer && (
                    <MusicPlayer onClose={() => setShowMusicPlayer(false)} />
                )}
            </AnimatePresence>
        </>
    );
}
