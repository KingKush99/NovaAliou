
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiFilterLine, RiSortDesc, RiSortAsc, RiMore2Fill, RiAddLine, RiLayoutGridFill, RiCloseLine, RiCheckLine, RiUserLine, RiGroupLine } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import { useChatStore } from '../store/chatStore';
import { MOCK_STREAMERS, generateMockProfiles, generateMockConversations } from '../utils/mockData';
import { formatRelativeTime } from '../utils/helpers';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Chat from './Chat';
import './Messages.css';

export default function Messages() {
    const navigate = useNavigate();
    const { conversations, setConversations, setActiveConversation, activeConversationId } = useChatStore();
    const [activeFilter, setActiveFilter] = useState('All');
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'longest', 'shortest'
    const [advancedFilters, setAdvancedFilters] = useState({
        chatType: 'all', // 'all', 'individual', 'group'
        messageLength: 'all', // 'all', 'short', 'medium', 'long'
        chatAge: 'all' // 'all', 'recent', 'older'
    });

    const [isSplitView, setIsSplitView] = useState(window.innerWidth > 768);
    const [sidebarWidth, setSidebarWidth] = useState(350); // Default width

    useEffect(() => {
        const handleResize = () => setIsSplitView(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Width limits
    const MIN_WIDTH = 250;
    const MAX_WIDTH = 600;

    const startResizing = (mouseDownEvent) => {
        mouseDownEvent.preventDefault();

        const doDrag = (dragEvent) => {
            let newWidth = dragEvent.clientX;
            if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
            if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
            setSidebarWidth(newWidth);
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        document.body.style.cursor = 'col-resize';
    };

    useEffect(() => {
        if (conversations.length === 0) {
            const profiles = generateMockProfiles(15);
            const mockConversations = generateMockConversations(profiles);
            setConversations(mockConversations);
        }
    }, [conversations.length, setConversations]);

    const handleConversationClick = (conversation) => {
        setActiveConversation(conversation.id);
        if (!isSplitView) {
            navigate(`/chat/${conversation.id}`);
        }
    };

    // Unified Filter & Search Logic
    const filteredConversations = (() => {
        let results = conversations.filter(c => {
            // 1. Matches Search?
            const matchesSearch = !searchQuery || c.userName.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;

            // 2. Matches Tab Filter?
            if (activeFilter === 'Unread' && (c.unreadCount || 0) === 0) return false;
            if (activeFilter === 'Groups' && !c.isGroup) return false;

            return true;
        });

        // 3. Global Search (Append Mock Streamers if searching)
        if (searchQuery && searchQuery.length >= 2) {
            const mockStreamers = MOCK_STREAMERS || [];
            const foundStreamers = mockStreamers.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !results.some(r => r.userId === String(s.id)) // Avoid duplicates
            );

            const streamerConvos = foundStreamers.map(s => ({
                id: `new-${s.id}`,
                userId: String(s.id),
                userName: s.name,
                userPhoto: s.image,
                lastMessage: 'Tap to start chatting',
                lastMessageTime: Date.now(),
                unreadCount: 0,
                isOnline: true,
                isNewConnection: true
            }));

            results = [...results, ...streamerConvos];
        }

        return results;
    })();

    // Apply sorting (Restored)
    const sortedConversations = [...filteredConversations].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return b.lastMessageTime - a.lastMessageTime;
            case 'oldest':
                return a.lastMessageTime - b.lastMessageTime;
            case 'longest':
                return (b.messages?.length || 0) - (a.messages?.length || 0);
            case 'shortest':
                return (a.messages?.length || 0) - (b.messages?.length || 0);
            default:
                return 0;
        }
    });

    const handleCreateGroup = () => {
        setShowCreateGroup(false);
        setGroupName('');
        alert('Group created! (Simulated)');
    };

    return (
        <div className="messages-page">
            <Header
                title="Chats"
                showBalance
                rightAction={
                    <div className="header-actions">
                        {/* Actions moved to main view */}
                    </div>
                }
            />

            <div className="messages-content">
                {/* Search & Controls */}
                <div className="conversations-list" style={{ width: isSplitView ? sidebarWidth : '100%' }}>
                    <div className="chat-controls">
                        {/* Row 1: Search Bar (Full Width) */}
                        <div className="search-bar expanded">
                            <RiSearchLine className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Row 2: Action Buttons (Filter, Grid, Plus) */}
                        {/* Filter Tabs & Actions */}
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
                                {/* Grid Toggle Pill */}
                                <div className="vertical-divider" style={{ width: 1, background: '#444', margin: '0 8px' }}></div>
                                <button className="filter-pill" onClick={() => navigate('/chat-multi')}>
                                    <RiLayoutGridFill style={{ marginRight: 4 }} /> Grid
                                </button>
                            </div>
                            <div className="action-icons">
                                <button className="icon-action" onClick={() => setShowCreateGroup(true)}><RiAddLine /></button>
                            </div>
                        </div>
                    </div>

                    {/* Chat List Items */}
                    <div className="conversations-scroll-area" style={{ flex: 1, overflowY: 'auto' }}>
                        {sortedConversations.length === 0 ? (
                            <div className="messages-empty">
                                <div className="empty-icon">💬</div>
                                <h2>Start a new conversation!</h2>
                                <p>Search for a user or create a group to begin.</p>
                            </div>
                        ) : (
                            sortedConversations.map((conversation, index) => (
                                <motion.div
                                    key={conversation.id}
                                    className={`conversation-item ${activeConversationId === conversation.id && isSplitView ? 'active-chat' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleConversationClick(conversation)}
                                    style={{ background: (activeConversationId === conversation.id && isSplitView) ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                                >
                                    <div className="conversation-avatar">
                                        <img src={conversation.userPhoto} alt={conversation.userName} />
                                        {conversation.isOnline && <div className="online-dot" />}
                                    </div>

                                    <div className="conversation-info">
                                        <div className="conversation-header">
                                            <h3 className="conversation-name">{conversation.userName}</h3>
                                            <span className="conversation-time">
                                                {formatRelativeTime(conversation.lastMessageTime)}
                                            </span>
                                        </div>
                                        <p className="conversation-preview">
                                            {conversation.lastMessage}
                                        </p>
                                    </div>

                                    {conversation.unreadCount > 0 && (
                                        <div className="unread-badge">
                                            {conversation.unreadCount}
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {isSplitView && (
                    <div
                        className="resize-handle"
                        onMouseDown={startResizing}
                    />
                )}

                <div className="chat-pane">
                    {activeConversationId ? (
                        <Chat conversationId={activeConversationId} isSplitView={true} />
                    ) : (
                        <div className="empty-chat-placeholder">
                            <div style={{ fontSize: '64px', opacity: 0.3 }}>💬</div>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />

            {/* Create Group Modal */}
            <Modal
                isOpen={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
                title="Create Group"
            >
                <div className="create-group-modal">
                    <div className="input-group">
                        <label>Group Name</label>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <div className="members-select">
                        <label>Add Members</label>
                        <p className="hint">Select friends to add (Mock)</p>
                        <div className="friend-select-list">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="friend-select-item">
                                    <div className="friend-avatar" />
                                    <span>Friend {i}</span>
                                    <input type="checkbox" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleCreateGroup}
                        disabled={!groupName.trim()}
                    >
                        Create Group
                    </Button>
                </div>
            </Modal>

            {/* Filter Modal */}
            <Modal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                title="Filter Chats"
            >
                <div className="filter-modal">
                    <div className="filter-section">
                        <label>Chat Type</label>
                        <div className="filter-options">
                            <button className={`filter-option-btn ${advancedFilters.chatType === 'all' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, chatType: 'all' })}>All</button>
                            <button className={`filter-option-btn ${advancedFilters.chatType === 'individual' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, chatType: 'individual' })}><RiUserLine /> Individual</button>
                            <button className={`filter-option-btn ${advancedFilters.chatType === 'group' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, chatType: 'group' })}><RiGroupLine /> Group</button>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label>Message Length</label>
                        <div className="filter-options">
                            <button className={`filter-option-btn ${advancedFilters.messageLength === 'all' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, messageLength: 'all' })}>All</button>
                            <button className={`filter-option-btn ${advancedFilters.messageLength === 'short' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, messageLength: 'short' })}>Short (&lt;10)</button>
                            <button className={`filter-option-btn ${advancedFilters.messageLength === 'medium' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, messageLength: 'medium' })}>Medium (10-50)</button>
                            <button className={`filter-option-btn ${advancedFilters.messageLength === 'long' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, messageLength: 'long' })}>Long (&gt;50)</button>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label>Chat Age</label>
                        <div className="filter-options">
                            <button className={`filter-option-btn ${advancedFilters.chatAge === 'all' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, chatAge: 'all' })}>All</button>
                            <button className={`filter-option-btn ${advancedFilters.chatAge === 'recent' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, chatAge: 'recent' })}>Recent (&lt;24h)</button>
                            <button className={`filter-option-btn ${advancedFilters.chatAge === 'older' ? 'active' : ''}`} onClick={() => setAdvancedFilters({ ...advancedFilters, chatAge: 'older' })}>Older (&gt;24h)</button>
                        </div>
                    </div>

                    <Button variant="secondary" fullWidth onClick={() => { setAdvancedFilters({ chatType: 'all', messageLength: 'all', chatAge: 'all' }); setSearchQuery(''); setActiveFilter('All'); }}>
                        Clear All Filters
                    </Button>
                </div>
            </Modal>

            {/* Sort Modal */}
            <Modal
                isOpen={showSortModal}
                onClose={() => setShowSortModal(false)}
                title="Sort Chats"
            >
                <div className="filter-modal">
                    <div className="filter-section">
                        <label>Sort By Time</label>
                        <div className="filter-options">
                            <button className={`filter-option-btn ${sortBy === 'newest' ? 'active' : ''}`} onClick={() => { setSortBy('newest'); setShowSortModal(false); }}>
                                <RiSortDesc /> Newest First
                            </button>
                            <button className={`filter-option-btn ${sortBy === 'oldest' ? 'active' : ''}`} onClick={() => { setSortBy('oldest'); setShowSortModal(false); }}>
                                <RiSortAsc /> Oldest First
                            </button>
                        </div>
                    </div>

                    <div className="filter-section">
                        <label>Sort By Length</label>
                        <div className="filter-options">
                            <button className={`filter-option-btn ${sortBy === 'longest' ? 'active' : ''}`} onClick={() => { setSortBy('longest'); setShowSortModal(false); }}>
                                Longest Chats
                            </button>
                            <button className={`filter-option-btn ${sortBy === 'shortest' ? 'active' : ''}`} onClick={() => { setSortBy('shortest'); setShowSortModal(false); }}>
                                Shortest Chats
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
