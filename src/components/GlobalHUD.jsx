import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUser3Fill, RiRobot2Fill, RiGamepadFill } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import { useHUDStore } from '../store/useHUDStore';
import { useChatStore } from '../store/chatStore'; // Import chat store
import MiniSlots from './MiniSlots';
import Chatbot from './Chatbot';
import ChatWindow from './ChatWindow'; // Import ChatWindow
import './GlobalHUD.css';

export default function GlobalHUD() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUserStore();
    const { showChatbot: chatbotEnabled, showMiniSlots: slotsEnabled } = useHUDStore();
    const { openWindows } = useChatStore(); // Get open windows from store

    const [showSlots, setShowSlots] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);

    // Hide HUD in stream rooms, video calls (BUT NOT PROFILE to allow chat on profile)
    // Removed isProfile from hiding logic as per user request for "multiple chats... same time" which implies multitasking
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

                {/* Floating Chat Windows - Disabled per user request */}
                {/* {openWindows.map((chatId, index) => (
                    <ChatWindow
                        key={chatId}
                        conversationId={chatId}
                        index={index}
                        initialPosition={{ x: 100 + (index * 40), y: 100 + (index * 40) }}
                    />
                ))} */}
            </AnimatePresence>
        </>
    );
}
