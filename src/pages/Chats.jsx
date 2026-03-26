import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiSearchLine, RiAddCircleLine, RiGroupLine, RiUser3Line, RiMoreFill, RiLayoutGridFill, RiAddLine } from 'react-icons/ri';
import { useChatStore } from '../store/chatStore';
import { useSubscriptionStore, TIERS } from '../store/useSubscriptionStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import AdBanner from '../components/AdBanner';
import './Chats.css';

const MOCK_CHATS = []; // Cleared for production: User must start conversations manually


const MOCK_GLOBAL_USERS = [
    { id: 101, name: 'Alice Springer', avatar: 'https://i.pravatar.cc/150?img=20' },
    { id: 102, name: 'Bob Miller', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 103, name: 'Charlie Day', avatar: 'https://i.pravatar.cc/150?img=33' },
    { id: 104, name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?img=25' },
    { id: 105, name: 'Evan Peters', avatar: 'https://i.pravatar.cc/150?img=60' }
];

export default function Chats() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    const { conversations, initializeConversation } = useChatStore();
    const { tier } = useSubscriptionStore();

    // Filter Logic - Use Real Conversations from Store
    const filteredChats = conversations.filter(chat => {
        const matchesSearch = !searchQuery ||
            chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'Unread' && chat.unread === 0) return false;
        if (activeFilter === 'Groups' && !chat.isGroup) return false;

        return true;
    });

    const handleChatClick = (chatId) => {
        const chat = MOCK_CHATS.find(c => c.id === chatId);
        if (chat) {
            initializeConversation(chatId, {
                id: chatId,
                name: chat.name,
                avatar: chat.avatar,
                isOnline: chat.online
            });
        }
        navigate(`/chat/${chatId}`, {
            state: chat
                ? { name: chat.name, avatar: chat.avatar, isOnline: chat.online }
                : undefined
        });
    };
    const handleCreateGroup = () => {
        if (tier === TIERS.FREE) {
            alert('Group chat creation is a Diamond benefit! Upgrade in the Store to unlock.');
            return;
        }
        alert('Group chat creation is coming soon for Diamond and Platinum members!');
    };

    return (
        <div className="chats-page">
            <Header title="Chats" showBalance />

            <div className="chats-content">
                {/* Search Bar */}
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
                </div>

                {/* Filter Tabs Row */}
                <div className="filter-tabs-row">
                    <div className="filter-pills">
                        {['All', 'Unread', 'Groups'].map(f => (
                            <button
                                key={f}
                                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                                onClick={() => setActiveFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                        <div className="vertical-divider"></div>
                        <button className="filter-pill" onClick={() => navigate('/chat-multi')}>
                            <RiLayoutGridFill style={{ marginRight: 4 }} /> Grid
                        </button>
                    </div>
                    <div className="action-icons">
                        <button className="icon-action" onClick={handleCreateGroup}>
                            <RiAddLine />
                        </button>
                    </div>
                </div>

                {/* Chat List */}
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

            {/* Global & Self Search Results */}
            {searchQuery && (
                <div className="global-search-section">
                    <h4 className="section-title">Search Results</h4>
                    
                    {/* Self Search */}
                    {useUserStore.getState().user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) && (
                        <motion.div
                            className="chat-item"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => navigate('/profile')}
                        >
                            <div className="chat-avatar-container">
                                <img 
                                    src={useUserStore.getState().user.photos?.[0] || 'https://i.pravatar.cc/150?img=68'} 
                                    className="chat-avatar" 
                                    alt="me" 
                                />
                                <div className="online-indicator" />
                            </div>
                            <div className="chat-info">
                                <div className="chat-header-row">
                                    <h4 className="chat-name">{useUserStore.getState().user.displayName} (Me) ✨</h4>
                                </div>
                                <div className="chat-message-row">
                                    <p className="chat-last-message">Your Profile</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Global Directory - Search from MOCK_GLOBAL_USERS but check chatStore for active ones */}
                    {MOCK_GLOBAL_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !useChatStore.getState().conversations.find(c => c.name === u.name))
                        .map(user => (
                            <motion.div
                                key={user.id}
                                className="chat-item"
                                onClick={() => handleChatClick(user.id)}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="chat-avatar-container">
                                    <img src={user.avatar} alt={user.name} className="chat-avatar" />
                                </div>
                                <div className="chat-info">
                                    <div className="chat-header-row">
                                        <h4 className="chat-name">{user.name}</h4>
                                    </div>
                                    <div className="chat-message-row">
                                        <p className="chat-last-message">Tap to message</p>
                                    </div>
                                </div>
                                <div className="add-icon">
                                    <RiAddCircleLine size={24} color="#FFD700" />
                                </div>
                            </motion.div>
                        ))}
                </div>
            )}

            <BottomNav />
            <AdBanner position="bottom" />
        </div >
    );
}
