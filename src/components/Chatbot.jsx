import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiSendPlaneFill, RiImageAddFill, RiGlobalLine, RiMicFill } from 'react-icons/ri';
import './Chatbot.css';

const LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Japanese', 'Korean', 'Chinese', 'Arabic'
];

const WELCOME_MESSAGES = {
    'English': "Hi! I'm Nova, your NoveltyCams assistant. Ask me anything about the app!",
    'Spanish': "¡Hola! Soy Nova, tu asistente de NoveltyCams. ¡Pregúntame lo que quieras!",
    'French': "Salut! Je suis Nova, votre assistant NoveltyCams. Posez-moi vos questions!",
    'German': "Hallo! Ich bin Nova, dein NoveltyCams-Assistent. Frag mich alles!",
    'Italian': "Ciao! Sono Nova, il tuo assistente NoveltyCams. Chiedimi qualsiasi cosa!",
    'Portuguese': "Olá! Sou Nova, seu assistente NoveltyCams. Pergunte-me qualquer coisa!",
    'Japanese': "こんにちは！Novaです。NoveltyCamsのアシスタントです。何でも聞いてください！",
    'Korean': "안녕하세요! 저는 Nova입니다. NoveltyCams 도우미입니다. 무엇이든 물어보세요!",
    'Chinese': "你好！我是Nova，你的NoveltyCams助手。有什么问题尽管问我！",
    'Arabic': "مرحبا! أنا نوفا، مساعدك في NoveltyCams. اسألني أي شيء!"
};

// Knowledge Base
const KNOWLEDGE_BASE = {
    streaming: {
        keywords: ['stream', 'live', 'broadcast', 'go live', 'streaming'],
        response: "To start streaming: Go to your profile → tap the camera icon → select 'Go Live'. You'll need to enable camera and microphone permissions. You can earn coins from viewers' gifts!"
    },
    coins: {
        keywords: ['coins', 'buy', 'purchase', 'payment', 'money', 'price'],
        response: "You can buy coins in the Store! We accept credit cards (Stripe) and cryptocurrency (Bitcoin, Ethereum). Premium members get 10% extra coins on every purchase!"
    },
    premium: {
        keywords: ['premium', 'vip', 'membership', 'subscribe'],
        response: "Premium membership gives you: 10% extra coins on all purchases, exclusive badges, priority support, and access to premium-only features. Upgrade in your Profile!"
    },
    chat: {
        keywords: ['chat', 'message', 'talk', 'dm', 'conversation'],
        response: "You can chat with anyone! Tap Messages → select a user or start a new chat. We support group chats, voice messages, and split-screen for multiple conversations!"
    },
    models: {
        keywords: ['model', 'creator', 'earn', 'become model', 'monetize'],
        response: "Want to become a model? Go to Profile → Settings → 'Become a Model'. You'll earn from: viewer gifts, private shows, subscriptions, and tips. Models get 70% revenue share!"
    },
    games: {
        keywords: ['game', 'play', 'mini', 'slots', 'rewards'],
        response: "Play mini-games to earn free coins! Access Game Center from the home screen. We have slots, poker, and daily challenges. Watch ads for bonus coins!"
    },
    gifts: {
        keywords: ['gift', 'send', 'present', 'tip'],
        response: "Send virtual gifts to your favorite streamers! Tap the gift icon during a stream. Gifts cost coins and help creators earn money. Check your pending gifts in Profile!"
    },
    profile: {
        keywords: ['profile', 'edit', 'photo', 'avatar', 'settings'],
        response: "Edit your profile: Go to Profile → tap the pencil icon. You can change your photo, bio, display name, and privacy settings. Upload photos from camera or gallery!"
    },
    help: {
        keywords: ['help', 'support', 'problem', 'issue', 'bug'],
        response: "Need help? Go to Profile → Settings → Help. You can also contact support at support@noveltycams.com. I'm here 24/7 to answer questions!"
    },
    default: "I can help you with: streaming, buying coins, premium membership, chatting, becoming a model, playing games, sending gifts, and profile settings. What would you like to know?"
};

function getResponse(message) {
    const lowerMsg = message.toLowerCase();

    // Check each category
    for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
        if (category === 'default') continue;
        if (data.keywords.some(keyword => lowerMsg.includes(keyword))) {
            return data.response;
        }
    }

    return KNOWLEDGE_BASE.default;
}

export default function Chatbot({ onClose }) {
    const [language, setLanguage] = useState('English');
    const [messages, setMessages] = useState([
        { id: 1, text: WELCOME_MESSAGES['English'], sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Update welcome message when language changes
        const newWelcome = {
            id: Date.now(),
            text: WELCOME_MESSAGES[language],
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages([newWelcome]);
    }, [language]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate thinking time
        setTimeout(() => {
            const response = getResponse(input);
            const botMsg = {
                id: Date.now() + 1,
                text: response,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 800);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const userMsg = {
                    id: Date.now(),
                    text: `📷 Sent an image`,
                    sender: 'user',
                    image: reader.result,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, userMsg]);

                // Context-aware response simulation
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: "I see your image! It looks interesting. Is there something specific you'd like me to analyze about it?",
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                }, 1000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Could map to selected language

        recognition.onstart = () => {
            setIsTyping(true);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "🎤 Listening...",
                sender: 'user',
                isSystem: true,
                timestamp: new Date()
            }]);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            // Remove "Listening..." placeholder if possible, or just append
            setMessages(prev => prev.filter(m => !m.isSystem)); // Remove system msg

            const userMsg = {
                id: Date.now(),
                text: `🎤 ${transcript}`,
                sender: 'user',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMsg]);

            // Process as text input
            setInput(transcript); // Optional: put in input

            setTimeout(() => {
                const response = getResponse(transcript);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: response,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
                setIsTyping(false);
            }, 800);
        };

        recognition.onerror = (event) => {
            setIsTyping(false);
            setMessages(prev => prev.filter(m => !m.isSystem));
            console.error(event.error);
        };

        recognition.start();
    };

    return (
        <motion.div
            className="chatbot-overlay"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
        >
            <div className="chatbot-container">
                <div className="chatbot-header">
                    <div className="bot-info">
                        <div className="bot-avatar">🤖</div>
                        <div>
                            <div className="bot-name">Nova AI</div>
                            <div className="bot-status">● Online</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            className="lang-btn"
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            title="Change Language"
                        >
                            <RiGlobalLine size={18} />
                        </button>
                        <button className="close-btn" onClick={onClose}>
                            <RiCloseLine size={16} />
                        </button>
                    </div>
                </div>

                {showLangMenu && (
                    <div className="lang-menu">
                        {LANGUAGES.map(lang => (
                            <div
                                key={lang}
                                className={`lang-option ${language === lang ? 'active' : ''}`}
                                onClick={() => {
                                    setLanguage(lang);
                                    setShowLangMenu(false);
                                }}
                            >
                                {lang}
                            </div>
                        ))}
                    </div>
                )}

                <div className="chatbot-messages">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            {msg.image && (
                                <img src={msg.image} alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '8px' }} />
                            )}
                            <div className="message-text">{msg.text}</div>
                            <div className="message-time">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message bot typing">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-input">
                    <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
                        <RiImageAddFill size={20} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                    <button className="icon-btn" onClick={handleVoiceInput}>
                        <RiMicFill size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={handleSend}>
                        <RiSendPlaneFill size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
