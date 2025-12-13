import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiHeart3Fill, RiSendPlaneFill, RiGiftFill, RiUser3Fill, RiCoinFill, RiMicLine, RiMicOffLine } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import './StreamRoom.css';

const MOCK_COMMENTS = [
    { id: 1, user: 'User1', text: 'Wow amazing!', color: '#FF6B6B' },
    { id: 2, user: 'User2', text: 'Love this stream ❤️', color: '#4ECDC4' },
    { id: 3, user: 'User3', text: 'Hello from Brazil 🇧🇷', color: '#FFE66D' },
];

export default function StreamRoom() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { coins, deductCoins } = useUserStore();
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [input, setInput] = useState('');
    const [showGiftAnim, setShowGiftAnim] = useState(false);
    const [likes, setLikes] = useState(12450);
    const [isSpeaker, setIsSpeaker] = useState(false);
    const [showSpeakerModal, setShowSpeakerModal] = useState(false);

    // Determine if this is a multi-host stream (based on ID or stream data)
    const isMultiHostStream = id && id.includes('multi'); // Simple check, adjust as needed
    const SPEAKER_COST_PER_SECOND = 20; // Coins per second for speaker role

    // Speaker coin deduction (20 coins/second when speaker)
    useEffect(() => {
        if (isSpeaker) {
            const interval = setInterval(() => {
                const success = deductCoins(SPEAKER_COST_PER_SECOND);
                if (!success) {
                    alert("Out of coins! Speaker role ended.");
                    setIsSpeaker(false);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isSpeaker, deductCoins]);

    // NO automatic coin deduction - joining is FREE!

    // Mock incoming comments
    useEffect(() => {
        const interval = setInterval(() => {
            const newComment = {
                id: Date.now(),
                user: `User${Math.floor(Math.random() * 1000)}`,
                text: ['So cool!', 'Beautiful 😍', 'Hi!', 'Nice stream'][Math.floor(Math.random() * 4)],
                color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43'][Math.floor(Math.random() * 4)]
            };
            setComments(prev => [...prev.slice(-4), newComment]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSend = () => {
        if (!input.trim()) return;
        setComments(prev => [...prev.slice(-4), { id: Date.now(), user: 'Me', text: input, color: '#fff' }]);
        setInput('');
    };

    const handleGift = () => {
        const GIFT_COST = 50;
        if (coins >= GIFT_COST) {
            deductCoins(GIFT_COST);
            setShowGiftAnim(true);
            setTimeout(() => setShowGiftAnim(false), 2000);
            setComments(prev => [...prev.slice(-4), { id: Date.now(), user: 'System', text: 'Sent a Gift! 🎁', color: '#FFD700' }]);
        } else {
            alert(`Not enough coins! Gifts cost ${GIFT_COST} coins.`);
        }
    };

    const handleLike = () => {
        setLikes(prev => prev + 1);
        // Add visual heart animation logic here if desired
    };

    const handleBecomeSpeaker = () => {
        // Check if user has enough for at least a few seconds
        if (coins >= SPEAKER_COST_PER_SECOND * 5) {
            setIsSpeaker(true);
            setShowSpeakerModal(false);
            alert('You are now a speaker! 🎤 (20 coins/second)');
        } else {
            alert(`You need at least ${SPEAKER_COST_PER_SECOND * 5} coins to become a speaker. You have ${coins} coins.`);
        }
    };

    return (
        <div className="stream-room">
            {/* Video Background (Mock) */}
            <div className="stream-video-container">
                <div className="main-host-video">
                    <img src="https://i.pravatar.cc/400?img=10" alt="Main Host" />
                    <div className="host-label">HOST</div>
                </div>
                <div className="guest-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="guest-video">
                            <img src={`https://i.pravatar.cc/300?img=${20 + i}`} alt={`Guest ${i}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay UI */}
            <div className="stream-overlay-ui">
                <div className="stream-header">
                    <div className="host-profile">
                        <img src="https://i.pravatar.cc/150?img=10" alt="Host" />
                        <div className="host-info">
                            <h4>Host & Friends</h4>
                            <span className="viewer-count"><RiUser3Fill /> 5.2k</span>
                            {isMultiHostStream && (
                                <span className="stream-type-badge">Multi-Host</span>
                            )}
                        </div>
                    </div>
                    <div className="stream-controls-top">
                        {isMultiHostStream && !isSpeaker && (
                            <button
                                className="speaker-upgrade-btn"
                                onClick={() => setShowSpeakerModal(true)}
                                title={`Become a speaker for ${SPEAKER_COST_PER_SECOND} coins/second`}
                            >
                                <RiMicOffLine /> Become Speaker
                            </button>
                        )}
                        {isSpeaker && (
                            <div className="speaker-badge">
                                <RiMicLine /> Speaker
                            </div>
                        )}
                        <div className="coin-display">
                            <RiCoinFill className="coin-icon-spin" />
                            <span>{coins}</span>
                        </div>
                        <button className="close-btn" onClick={() => navigate('/streams')}>
                            <RiCloseLine />
                        </button>
                    </div>
                </div>

                <div className="stream-footer">
                    <div className="comments-area">
                        <AnimatePresence>
                            {comments.map(comment => (
                                <motion.div
                                    key={comment.id}
                                    className="comment-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <span style={{ color: comment.color }}>{comment.user}: </span>
                                    {comment.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="action-bar">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Say something..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                            />
                            <button className="send-btn" onClick={handleSend}>
                                <RiSendPlaneFill />
                            </button>
                        </div>
                        <button className="action-btn gift-btn" onClick={handleGift}>
                            <RiGiftFill />
                        </button>
                        <button className="action-btn like-btn" onClick={handleLike}>
                            <RiHeart3Fill />
                            <span className="like-count">{likes}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Speaker Upgrade Modal */}
            {showSpeakerModal && (
                <div className="speaker-modal-overlay" onClick={() => setShowSpeakerModal(false)}>
                    <div className="speaker-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Become a Speaker</h3>
                        <div className="speaker-modal-icon">🎤</div>
                        <p>Upgrade to speaker role to participate in the conversation!</p>
                        <div className="speaker-cost">
                            <RiCoinFill /> {SPEAKER_COST_PER_SECOND} Coins/Second
                        </div>
                        <p className="speaker-note">You have {coins} coins (need at least {SPEAKER_COST_PER_SECOND * 5} to start)</p>
                        <div className="speaker-modal-actions">
                            <button className="modal-btn cancel-btn" onClick={() => setShowSpeakerModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="modal-btn confirm-btn"
                                onClick={handleBecomeSpeaker}
                                disabled={coins < SPEAKER_COST_PER_SECOND * 5}
                            >
                                Upgrade
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
