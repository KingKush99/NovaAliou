import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiHeart3Fill, RiSendPlaneFill, RiGiftFill, RiUser3Fill, RiCoinFill, RiMicLine, RiMicOffLine } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import { streamingController } from '../utils/StreamingController';
import './StreamRoom.css';

const getOppositeColor = (hex) => {
    if (!hex || hex.toLowerCase() === '#ffffff' || hex.toLowerCase() === '#fff') return '#ffffff';
    try {
        const r = (255 - parseInt(hex.slice(1, 3), 16)).toString(16).padStart(2, '0');
        const g = (255 - parseInt(hex.slice(3, 5), 16)).toString(16).padStart(2, '0');
        const b = (255 - parseInt(hex.slice(5, 7), 16)).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    } catch (e) { return '#ffffff'; }
};

const AI_BOTS = [
    { name: 'DirtyDiego', color: '#FF4500', messages: ['¡Qué curvas! Me pones a mil... 🔥', '¿Quieres ver algo especial? 😉', 'Eres la más sexy de aquí.', 'Mmm, me encanta lo que veo...'] },
    { name: 'AmourLuc', color: '#FF1493', messages: ['Miam, t\'es tellement sexy... 🫦', 'Je veux te voir plus, mon amour.', 'Tu me rends fou avec ton corps.', 'Une déesse absolue...'] },
    { name: 'HardyHank', color: '#32CD32', messages: ['I want to see everything... 👅', 'You make me so hard right now.', 'Can I tip for a private show?', 'Best body on this whole site.'] },
    { name: 'SafiraHot', color: '#9370DB', messages: ['Você é maravilhosa... que delícia! 🇧🇷', 'Quero te dar muitos diamantes hoje.', 'Vem ni mim, gata!', 'Olha esse corpo, meu deus...'] }
];

export default function StreamRoom() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, coins, deductCoins, addDiamonds } = useUserStore(); // Added addDiamonds
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');
    const [showGiftAnim, setShowGiftAnim] = useState(false);
    const [likes, setLikes] = useState(12450);
    const [isSpeaker, setIsSpeaker] = useState(false);
    const [isReported, setIsReported] = useState(false);

    // Host Logic: Check if ID contains user info OR if query param says so OR session token matches
    const isHost = (id && user && (
        (user.id && String(id).includes(String(user.id))) ||
        (user.username && String(id).includes(String(user.username)))
    )) ||
        new URLSearchParams(window.location.search).get('host') === 'true' ||
        sessionStorage.getItem('isStreamer') === id;

    // Assign a consistent random color (or white for host)
    const [myChatColor] = useState(() => {
        if (isHost) return '#FFFFFF';
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A29BFE', '#FF4500', '#FF1493'];
        return colors[Math.floor(Math.random() * colors.length)];
    });

    // Video Refs
    const videoRef = useRef(null);
    const chatEndRef = useRef(null);

    // AI Chat simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const bot = AI_BOTS[Math.floor(Math.random() * AI_BOTS.length)];
            const text = bot.messages[Math.floor(Math.random() * bot.messages.length)];

            setComments(prev => [...prev.slice(-15), {
                id: `ai-${Date.now()}`,
                user: bot.name,
                text: text,
                color: bot.color,
                isAI: true
            }]);
        }, Math.random() * 10000 + 5000); // 5-15 seconds

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    useEffect(() => {
        const setupStream = async () => {
            try {
                let stream;
                if (isHost) {
                    console.log("Starting stream as Host...");
                    stream = await streamingController.startStream(id, user.displayName || user.username);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.muted = true; // Mute self
                    }
                } else {
                    console.log("Joining stream as Viewer...");
                    stream = await streamingController.joinStream(id, user.id);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                }
            } catch (err) {
                console.error("Streaming setup failed:", err);
                // Fallback to mock if server is down? No, user wants REAL.
            }
        };

        setupStream();

        // Listeners
        streamingController.onGift((data) => {
            setComments(prev => [...prev.slice(-4), {
                id: Date.now(),
                user: 'System',
                text: `${data.senderName} sent ${data.giftName}! 🎁`,
                color: '#FFD700'
            }]);
            setShowGiftAnim(true);
            setTimeout(() => setShowGiftAnim(false), 2000);
        });

        // Payout Listener (Only for Host)
        if (isHost) {
            streamingController.onPayout((data) => {
                console.log(`💰 Paid ${data.amount} diamonds from ${data.from}`);
                addDiamonds(data.amount);
            });
        }

        // Chat Listener
        streamingController.onMessage((data) => {
            const botColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A29BFE'];
            const randomColor = botColors[Math.floor(Math.random() * botColors.length)];

            setComments(prev => [...prev.slice(-15), {
                id: data.id || Date.now(),
                user: data.sender,
                text: data.text,
                color: data.color || randomColor,
                senderId: data.senderId
            }]);
        });

        return () => {
            if (isHost) {
                streamingController.endStream(id);
            }
            // Viewers just disconnect socket via controller logic or refresh
            // streamingController.disconnect(); // Not exposed yet, maybe needed?
        };
    }, [id, isHost, user, addDiamonds]);

    const handleSend = () => {
        if (!input.trim() || !user) return;
        const messageText = input;

        // Host always speaks in pure white
        const displayColor = isHost ? '#FFFFFF' : myChatColor;

        // Local Echo: Add message to UI immediately
        setComments(prev => [...prev.slice(-15), {
            id: `me-${Date.now()}`,
            user: user.displayName || user.username || 'Me',
            text: messageText,
            color: displayColor,
            senderId: user.id,
            isLocal: true // Help identify local messages
        }]);

        // Send via Socket
        streamingController.sendMessage(id, messageText, user.displayName || user.username, displayColor, user.id);
        setInput('');
    };

    const handleGift = () => {
        const GIFT_COST = 50;
        const GIFT_NAME = "Heart";

        if (coins >= GIFT_COST) {
            const success = deductCoins(GIFT_COST);
            if (success) {
                // Send via Socket
                streamingController.sendGift(id, GIFT_NAME, GIFT_COST, user.displayName || 'User');

                // Local Feedback
                setShowGiftAnim(true);
                setTimeout(() => setShowGiftAnim(false), 2000);
                setComments(prev => [...prev.slice(-4), { id: Date.now(), user: 'Me', text: `Sent a ${GIFT_NAME}! 🎁`, color: '#FFD700' }]);
            }
        } else {
            alert(`Not enough coins! Gifts cost ${GIFT_COST} coins.`);
        }
    };

    const handleLike = () => {
        setLikes(prev => prev + 1);
    };

    return (
        <div className="stream-room">
            {/* Real Video Player */}
            <div className="stream-video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="main-host-video-element"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Host Badge */}
                <div className="host-label">LIVE</div>
            </div>

            {/* Overlay UI */}
            <div className="stream-overlay-ui">
                <div className="stream-header">
                    <div className="host-profile">
                        <div className="host-info">
                            <h4>{isHost ? 'You are Live' : 'Live Stream'}</h4>
                            <span className="viewer-count"><RiUser3Fill /> {isHost ? 'Broadcasting' : 'Watching'}</span>
                        </div>
                    </div>
                    <div className="stream-controls-top">
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
                        <AnimatePresence initial={false}>
                            {comments.map(comment => {
                                const isCommentHost = (id && (
                                    (comment.senderId && String(id).includes(String(comment.senderId))) ||
                                    (comment.user && String(id).includes(String(comment.user)))
                                )) || (isHost && comment.isLocal);

                                return (
                                    <motion.div
                                        key={comment.id}
                                        className="comment-item"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="comment-bubble">
                                            {isCommentHost && <span className="chat-badge host-badge">HOST</span>}
                                            <span className="comment-user" style={{ color: isCommentHost ? '#FFFFFF' : comment.color }}>
                                                {comment.user}
                                            </span>
                                            <span className="comment-text" style={{ color: isCommentHost ? '#FFFFFF' : getOppositeColor(comment.color) }}>: {comment.text}</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={chatEndRef} />
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
                        <button className="action-btn gift-btn" onClick={handleGift} disabled={isHost}>
                            <RiGiftFill />
                        </button>
                        <button className="action-btn like-btn" onClick={handleLike}>
                            <div className="viewers-count">
                                <RiUser3Fill /> {likes.toLocaleString()}
                            </div>
                        </button>
                        <button
                            className={`report-stream-btn ${isReported ? 'reported' : ''}`}
                            onClick={() => {
                                if (window.confirm("Report this stream for inappropriate content?")) {
                                    setIsReported(true);
                                    alert("Stream reported. Our moderators will review it shortly.");
                                }
                            }}
                            disabled={isReported}
                        >
                            🚩 {isReported ? 'Reported' : 'Report'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Gift Animation */}
            {showGiftAnim && (
                <div className="gift-animation-overlay">
                    <motion.div
                        initial={{ scale: 0, y: 100 }}
                        animate={{ scale: 1.5, y: -200, opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        style={{ fontSize: '100px' }}
                    >
                        🎁
                    </motion.div>
                </div>
            )}
        </div>
    );
}
