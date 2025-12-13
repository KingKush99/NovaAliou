import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Added
import { motion, AnimatePresence } from 'framer-motion';
import { RiVideoAddFill, RiImageAddFill, RiGiftFill, RiSendPlaneFill, RiMicFill, RiVideoFill, RiCloseLine, RiLayoutGridFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { useChatStore } from '../store/chatStore';
import { useStoreStore } from '../store/storeStore';
import { useUserStore } from '../store/userStore';
import { formatMessageTime } from '../utils/helpers';
import { generateMockMessages } from '../utils/mockData';
import GiftAnimation from './GiftAnimation';
import './ChatContent.css';

export default function ChatContent({ conversationId, isWindowMode = false, onClose, isGridMode = false }) {
    const navigate = useNavigate(); // Hook initialized
    const { messages, addMessage, loadMessages, setTyping } = useChatStore();
    const { gifts } = useStoreStore();
    const { diamonds, spendDiamonds } = useUserStore();

    const [messageText, setMessageText] = useState('');
    const [activeGift, setActiveGift] = useState(null);
    const [showGiftPicker, setShowGiftPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const conversationMessages = messages[conversationId] || [];

    // Load mock messages if none exist
    useEffect(() => {
        if (conversationMessages.length === 0) {
            loadMessages(conversationId, generateMockMessages(conversationId, 15));
        }
    }, [conversationId, conversationMessages.length, loadMessages]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages, activeGift]);

    const handleSend = (type = 'text', content = null) => {
        if (type === 'text' && !messageText.trim()) return;

        // Check consecutive messages limit
        const myConsecutiveMessages = conversationMessages.slice().reverse().findIndex(m => m.senderId !== 'me');
        const count = myConsecutiveMessages === -1 ? conversationMessages.length : myConsecutiveMessages;

        if (count >= 3 && type === 'text') {
            alert("You can only send 3 unsolicited messages. Wait for a reply!");
            return;
        }

        let msgContent = content || messageText;

        addMessage(conversationId, {
            text: msgContent,
            senderId: 'me',
            type: type
        });

        if (type === 'text') setMessageText('');

        // Simulate reply (delayed)
        setTimeout(() => {
            const replies = ["That's awesome! 😊", "I totally agree!", "Haha that's funny 😄", "Tell me more!", "Sounds great!"];
            addMessage(conversationId, {
                text: replies[Math.floor(Math.random() * replies.length)],
                senderId: 'other'
            });
        }, 5000);
    };

    const handleSendGift = (gift) => {
        if (diamonds < gift.price) {
            alert("Not enough diamonds!");
            return;
        }
        spendDiamonds(gift.price);
        setActiveGift(gift);
        handleSend('gift', `Sent a ${gift.name} ${gift.image}`);
        setShowGiftPicker(false);
    };

    const handleMedia = async (type) => {
        if (type === 'photo') {
            fileInputRef.current?.click();
        } else if (type === 'video') {
            // Basic simulation for desktop
            alert("Video upload would open native picker here.");
        } else if (type === 'voice') {
            alert("🎤 Voice Message recorded & sent! (Simulated)");
            handleSend('voice', "Voice Message (0:05)");
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                handleSend('image', ev.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    return (
        <div className={`chat-content ${isWindowMode ? 'window-mode' : ''}`}>
            {activeGift && (
                <GiftAnimation
                    gift={activeGift}
                    onComplete={() => setActiveGift(null)}
                />
            )}

            <div className="chat-messages-area">
                {conversationMessages.map((message, index) => (
                    <motion.div
                        key={message.id}
                        className={`message ${message.senderId === 'me' ? 'message-sent' : 'message-received'} ${message.type === 'gift' ? 'message-gift' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {message.type === 'image' && <img src={message.text} className="chat-media-img" />}
                        <div className="message-bubble">
                            <p className="message-text">{message.type === 'image' ? '📷 Photo' : message.text}</p>
                        </div>
                        <span className="message-time">
                            {formatMessageTime(message.timestamp)}
                        </span>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="chat-actions-left">
                    <button className="chat-action-icon" onClick={() => handleMedia('voice')}><RiMicFill /></button>
                    <button className="chat-action-icon" onClick={() => handleMedia('photo')}><RiImageAddFill /></button>
                    <button className="chat-action-icon" onClick={() => navigate('/chat-multi')} title="Multi-View"><RiLayoutGridFill /></button>
                    <button className="chat-action-icon" onClick={() => setShowGiftPicker(true)}><RiGiftFill /></button>
                </div>

                <input
                    type="text"
                    className="chat-text-input"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />

                <button
                    className="chat-send-fab"
                    onClick={() => handleSend()}
                    disabled={!messageText.trim()}
                >
                    <RiSendPlaneFill />
                </button>
            </div>

            {/* Gift Picker */}
            <AnimatePresence>
                {showGiftPicker && (
                    <div className="gift-picker-inline" onClick={() => setShowGiftPicker(false)}>
                        <motion.div
                            className="gift-picker-panel"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="gift-picker-header">
                                <span>Send Gift</span>
                                <button onClick={() => setShowGiftPicker(false)}><RiCloseLine /></button>
                            </div>
                            <div className="gift-grid-mini">
                                {gifts.map(gift => (
                                    <div key={gift.id} className="gift-item-mini" onClick={() => handleSendGift(gift)}>
                                        <div className="gift-img">{gift.image}</div>
                                        <div className="gift-price"><IoDiamond /> {gift.price}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
