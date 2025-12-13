import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiSearchLine, RiAddCircleLine, RiGroupLine, RiUser3Line, RiMoreFill } from 'react-icons/ri';
import { useChatStore } from '../store/chatStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import AdBanner from '../components/AdBanner';
import './Chats.css';

const MOCK_CHATS = [
    { id: 1, name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'Hey! How are you?', time: '2m ago', unread: 2, online: true },
    { id: 2, name: 'Sophia Martinez', avatar: 'https://i.pravatar.cc/150?img=5', lastMessage: 'Thanks for the gift! 💝', time: '15m ago', unread: 0, online: true },
    { id: 3, name: 'Olivia Brown', avatar: 'https://i.pravatar.cc/150?img=9', lastMessage: 'See you tonight!', time: '1h ago', unread: 1, online: false },
    { id: 4, name: 'Models Group', avatar: null, lastMessage: 'Sarah: Welcome everyone!', time: '2h ago', unread: 5, isGroup: true },
    { id: 5, name: 'Ava Johnson', avatar: 'https://i.pravatar.cc/150?img=16', lastMessage: 'Love the stream today!', time: '3h ago', unread: 0, online: false },
];

export default function Chats() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChats, setSelectedChats] = useState([]);

    const filteredChats = MOCK_CHATS.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ... inside component ...
    const { initializeConversation } = useChatStore();

    const handleChatClick = (chatId) => {
        // Ensure conversation exists in store before navigating
        const chat = MOCK_CHATS.find(c => c.id === chatId);
        if (chat) {
            initializeConversation(chatId, {
                id: chatId,
                name: chat.name,
                avatar: chat.avatar,
                isOnline: chat.online
            });
        }
        navigate(`/chat/${chatId}`);
    };

    const handleCreateGroup = () => {
        const { user, isVIP, diamonds } = useUserStore.getState(); // direct access
        // Check requirement: Diamond Tier or above (mocked as VIP or > 5000 diamonds)
        if (!user.isVIP && diamonds < 5000) {
            alert("⚠️ Group Chats are reserved for Diamond Tier members (VIP or 5000+ Diamonds).");
            return;
        }
        alert('Group chat creation coming soon! (You meet the requirements)');
    };

    return (
        <div className="chats-page">
            <Header title="Chats" showBalance />

            <div className="chats-content">
                <div className="chats-header">
                    <div className="search-bar">
                        <RiSearchLine />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="create-group-btn" onClick={handleCreateGroup}>
                        <RiAddCircleLine size={24} />
                    </button>
                </div>

                <div className="chats-list">
                    {filteredChats.map((chat) => (
                        <motion.div
                            key={chat.id}
                            className="chat-item"
                            onClick={() => handleChatClick(chat.id)}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="chat-avatar-container">
                                {chat.isGroup ? (
                                    <div className="group-avatar">
                                        <RiGroupLine size={24} />
                                    </div>
                                ) : (
                                    <>
                                        <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                                        {chat.online && <div className="online-indicator" />}
                                    </>
                                )}
                            </div>

                            <div className="chat-info">
                                <div className="chat-header-row">
                                    <h4 className="chat-name">{chat.name}</h4>
                                    <span className="chat-time">{chat.time}</span>
                                </div>
                                <div className="chat-message-row">
                                    <p className="chat-last-message">{chat.lastMessage}</p>
                                    {chat.unread > 0 && (
                                        <div className="unread-badge">{chat.unread}</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <BottomNav />
            <AdBanner position="bottom" />
        </div>
    );
}
