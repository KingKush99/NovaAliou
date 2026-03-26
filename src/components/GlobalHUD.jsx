import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUser3Fill, RiRobot2Fill, RiGamepadFill, RiMusicFill } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import { useHUDStore } from '../store/useHUDStore';
import { useChatStore } from '../store/chatStore';
import MiniSlots from './MiniSlots';
import Chatbot from './Chatbot';
import MusicPlayer from './MusicPlayer';
import './GlobalHUD.css';

export default function GlobalHUD() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUserStore();
    const { showChatbot: chatbotEnabled, showMiniSlots: slotsEnabled } = useHUDStore();
    const { openWindows } = useChatStore();

    const [showSlots, setShowSlots] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);

    // Hide HUD in stream rooms, video calls
    const isInStream = location.pathname.startsWith('/stream/');
    const isInCall = location.pathname.startsWith('/call/');
    const isInChat = location.pathname.startsWith('/chat/') || location.pathname === '/messages';
    const isOnboarding = location.pathname === '/onboarding' || location.pathname === '/' || location.pathname === '';

    if (isInStream || isInCall || isInChat || isOnboarding) return null;

    return (
        <>
            <div className="global-hud">
                {/* Bottom Left: Chatbot */}
                {chatbotEnabled && (
                    <motion.button
                        className="hud-btn bottom-left"
                        onClick={() => setShowChatbot(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <RiRobot2Fill size={24} />
                    </motion.button>
                )}

                {/* Music button removed per user request - access through Settings */}

                {/* Bottom Right: Mini Slots */}
                {slotsEnabled && (
                    <motion.button
                        className="hud-btn bottom-right"
                        onClick={() => setShowSlots(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <span className="slots-icon">🎰</span>
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {showSlots && <MiniSlots key="slots" onClose={() => setShowSlots(false)} />}
                {showChatbot && <Chatbot key="chatbot" onClose={() => setShowChatbot(false)} />}
                {showMusicPlayer && <MusicPlayer key="music" onClose={() => setShowMusicPlayer(false)} />}
            </AnimatePresence>
        </>
    );
}

