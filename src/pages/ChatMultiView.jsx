import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiLayoutGridFill, RiCheckboxBlankCircleLine, RiCloseLine,
    RiAddLine, RiArrowLeftLine, RiLayoutRowLine, RiLayoutColumnLine
} from 'react-icons/ri';
import { useChatStore } from '../store/chatStore';
import ChatContent from '../components/ChatContent';
import Header from '../components/Header';
import './ChatMultiView.css';

export default function ChatMultiView() {
    const navigate = useNavigate();
    const { conversations, setConversations } = useChatStore();

    // Load Mock Data if Empty (Safety)
    if (conversations.length === 0) {
        import('../utils/mockData').then(({ generateMockProfiles, generateMockConversations }) => {
            const profiles = generateMockProfiles(15);
            setConversations(generateMockConversations(profiles));
        });
    }

    // Grid State: [top-left, top-right, bottom-left, bottom-right] (null = empty)
    const [gridSlots, setGridSlots] = useState([null, null, null, null]);
    const [activeLayout, setActiveLayout] = useState(2); // 1 = Single, 2 = Split V, 4 = Grid 2x2

    // Selector State
    const [isSelectingForSlot, setIsSelectingForSlot] = useState(null); // index of slot being filled

    const handleSelectChat = (chatId) => {
        if (isSelectingForSlot !== null) {
            const newSlots = [...gridSlots];
            newSlots[isSelectingForSlot] = chatId;
            setGridSlots(newSlots);
            setIsSelectingForSlot(null);
        }
    };

    const handleRemoveChat = (index) => {
        const newSlots = [...gridSlots];
        newSlots[index] = null;
        setGridSlots(newSlots);
    };

    // Layout Classes
    const getGridClass = () => {
        if (activeLayout === 1) return 'grid-layout-1';
        if (activeLayout === 2) return 'grid-layout-2';
        return 'grid-layout-4';
    };

    // Calculate which slots are visible based on layout
    const visibleSlots = activeLayout === 1 ? [0] : activeLayout === 2 ? [0, 1] : [0, 1, 2, 3];

    return (
        <div className="chat-multiview-page">
            <Header
                title="Multi-View Chat"
                showBack
                onBack={() => navigate('/messages')}
                rightAction={
                    <div className="layout-controls">
                        <button
                            className={`layout-btn ${activeLayout === 1 ? 'active' : ''}`}
                            onClick={() => setActiveLayout(1)}
                            title="Single View"
                        >
                            <span style={{ border: '1px solid currentColor', width: 14, height: 14, display: 'block' }}></span>
                        </button>
                        <button
                            className={`layout-btn ${activeLayout === 2 ? 'active' : ''}`}
                            onClick={() => setActiveLayout(2)}
                            title="Split View"
                        >
                            <RiLayoutColumnLine />
                        </button>
                        <button
                            className={`layout-btn ${activeLayout === 4 ? 'active' : ''}`}
                            onClick={() => setActiveLayout(4)}
                            title="Grid View"
                        >
                            <RiLayoutGridFill />
                        </button>
                    </div>
                }
            />

            <div className="multiview-content">
                {/* Chat Grid */}
                <div className={`active-grid ${getGridClass()}`}>
                    {visibleSlots.map((slotIndex) => {
                        const chatId = gridSlots[slotIndex];
                        const conversation = chatId ? conversations.find(c => c.id === chatId) : null;

                        return (
                            <div key={slotIndex} className="grid-cell">
                                {conversation ? (
                                    <div className="cell-content">
                                        <div className="cell-header">
                                            <span>{conversation.userName}</span>
                                            <button className="cell-close-btn" onClick={() => handleRemoveChat(slotIndex)}>
                                                <RiCloseLine />
                                            </button>
                                        </div>
                                        <div className="cell-chat-wrapper">
                                            {/* Pass key to force re-render if chat changes */}
                                            <ChatContent conversationId={conversation.id} key={conversation.id} isGridMode />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="add-chat-btn"
                                        onClick={() => setIsSelectingForSlot(slotIndex)}
                                    >
                                        <RiAddLine size={32} />
                                        <span>Add Chat</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar / Modal for Selection */}
                <AnimatePresence>
                    {isSelectingForSlot !== null && (
                        <motion.div
                            className="chat-selector-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSelectingForSlot(null)}
                        >
                            <motion.div
                                className="chat-selector-modal"
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <h3>Select Conversation</h3>
                                <div className="selector-list">
                                    {conversations.length > 0 ? conversations.map(conv => (
                                        <div key={conv.id} className="selector-item" onClick={() => handleSelectChat(conv.id)}>
                                            <img src={conv.userPhoto} alt="" />
                                            <div className="selector-info">
                                                <span className="name">{conv.userName}</span>
                                                <span className="preview">{conv.lastMessage}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="empty-state">No active conversations found. Start a chat first!</div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
