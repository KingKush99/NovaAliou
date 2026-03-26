import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiVipCrownFill, RiCheckboxCircleFill, RiTimerLine } from 'react-icons/ri';
import { useMatchStore } from '../store/matchStore';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { generateMockProfiles } from '../utils/mockData';
import { formatDistance } from '../utils/helpers';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import AdBanner from '../components/AdBanner';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const { profiles, currentProfileIndex, setProfiles, likeProfile, passProfile } = useMatchStore();
    const { addCoins } = useUserStore();
    const { initializeConversation } = useChatStore();
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        if (profiles.length === 0) {
            setProfiles(generateMockProfiles(30));
        }
    }, [profiles.length, setProfiles]);

    const currentProfile = profiles[currentProfileIndex];

    useEffect(() => {
        if (!currentProfile) return;
        setTimeLeft(10);
    }, [currentProfileIndex, currentProfile]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSkip();
        }
    }, [timeLeft]);

    useEffect(() => {
        if (!currentProfile) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentProfile]);

    const handleAccept = () => {
        if (!currentProfile) return;
        likeProfile(currentProfile.id);
        initializeConversation(currentProfile.id, currentProfile);
        navigate(`/call/${currentProfile.id}`);
    };

    const handleSkip = () => {
        if (!currentProfile) return;
        passProfile(currentProfile.id);
    };

    const handleWatchAd = async () => {
        try {
            const { AdMobController } = await import('../utils/AdMobController');
            const earned = await AdMobController.showRewardVideo();
            if (earned) {
                addCoins(15);
                alert("Thanks for watching! +15 Coins");
            }
        } catch (error) {
            console.error("Ad failed", error);
        }
    };

    if (!currentProfile) {
        return (
            <div className="home-page">
                <Header title="NoveltyCams" showBalance />
                <div className="home-empty">
                    <div className="empty-icon">💫</div>
                    <h2>No more profiles</h2>
                    <p>Check back later for new matches!</p>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="home-page">
            <Header title="NoveltyCams" showBalance />

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: 10 }}>
                <AdBanner position="top" />
                <button onClick={handleWatchAd} style={{ background: '#FFD700', border: 'none', borderRadius: 4, padding: '5px 10px', fontWeight: 'bold' }}>
                    🎬 +15 🪙
                </button>
            </div>

            <div className="home-content">
                <div className="match-container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentProfile.id}
                            className="profile-card-static"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-image-container">
                                <img src={currentProfile.photos[0]} alt={currentProfile.name} className="card-image" />
                                <div className="card-overlay" />
                                <div className="card-badges">
                                    {currentProfile.isPopular && (
                                        <div className="badge popular-badge">
                                            <RiVipCrownFill size={14} />
                                            <span>Popular</span>
                                        </div>
                                    )}
                                    {currentProfile.verified && (
                                        <div className="badge verified-badge">
                                            <RiCheckboxCircleFill size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <div className="card-header">
                                        <h2 className="card-name">{currentProfile.name}, {currentProfile.age}</h2>
                                        <p className="card-distance">{formatDistance(currentProfile.distance)}</p>
                                    </div>
                                    <p className="card-bio">{currentProfile.bio}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="match-prompt">
                        <h3>Do you want to match with this video?</h3>
                        <div className="timer-display">
                            <RiTimerLine />
                            <span>{timeLeft}s</span>
                        </div>
                    </div>

                    <div className="match-actions">
                        <Button variant="secondary" className="skip-btn" onClick={handleSkip}>SKIP</Button>
                        <Button variant="primary" className="accept-btn" onClick={handleAccept}>ACCEPT VIDEO</Button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}

