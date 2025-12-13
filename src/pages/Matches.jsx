import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMatchStore } from '../store/matchStore';
import { useChatStore } from '../store/chatStore';
import { formatRelativeTime } from '../utils/helpers';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Matches.css';

export default function Matches() {
    const navigate = useNavigate();
    const { matches } = useMatchStore();
    const { setActiveConversation } = useChatStore();

    const handleMatchClick = (match) => {
        setActiveConversation(match.id);
        navigate(`/chat/${match.id}`);
    };

    return (
        <div className="matches-page">
            <Header title="Matches" showBalance />

            <div className="matches-content">
                {matches.length === 0 ? (
                    <div className="matches-empty">
                        <div className="empty-icon">💕</div>
                        <h2>No matches yet</h2>
                        <p>Start swiping to find your perfect match!</p>
                    </div>
                ) : (
                    <div className="matches-grid">
                        {matches.map((match, index) => (
                            <motion.div
                                key={match.id}
                                className="match-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleMatchClick(match)}
                            >
                                <div className="match-image-container">
                                    <img src={match.photos[0]} alt={match.name} />
                                    {match.isOnline && <div className="online-indicator" />}
                                </div>
                                <div className="match-info">
                                    <h3 className="match-name">{match.name}</h3>
                                    <p className="match-age">{match.age}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
