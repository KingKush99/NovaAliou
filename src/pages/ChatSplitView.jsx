import { useState } from 'react';
import { RiAddLine, RiCloseLine } from 'react-icons/ri';
import Chats from './Chats';
import Chat from './Chat';
import './ChatSplitView.css';

export default function ChatSplitView() {
    // Stores array of active conversation IDs (Max 4)
    const [activeChats, setActiveChats] = useState([]);
    const [showSelector, setShowSelector] = useState(true);

    const handleSelectChat = (id) => {
        if (activeChats.includes(id)) return;

        if (activeChats.length >= 4) {
            alert("Max 4 chats allowed in split view!");
            return;
        }

        setActiveChats([...activeChats, id]);
        if (window.innerWidth < 768) setShowSelector(false); // Hide selector on mobile automaticall
    };

    const removeChat = (idToRem) => {
        setActiveChats(activeChats.filter(id => id !== idToRem));
    };

    // Grid classes based on count
    const getGridClass = () => {
        switch (activeChats.length) {
            case 1: return 'grid-1';
            case 2: return 'grid-2';
            case 3: return 'grid-3';
            case 4: return 'grid-4';
            default: return 'grid-empty';
        }
    };

    return (
        <div className="chat-split-view">
            {/* Sidebar List (Collapsible) */}
            <div className={`split-list-panel ${!showSelector ? 'collapsed' : ''}`}>
                <div className="split-header">
                    <h3>Chats ({activeChats.length}/4)</h3>
                    <button onClick={() => setShowSelector(!showSelector)} className="toggle-list-btn">
                        {showSelector ? 'Hide' : 'Add Chat'}
                    </button>
                </div>
                {showSelector && (
                    <Chats
                        onSelectConversation={(id) => handleSelectChat(id)}
                        isSplitView={true}
                    />
                )}
            </div>

            {/* Grid Area */}
            <div className={`split-chat-grid ${getGridClass()}`}>
                {activeChats.length === 0 ? (
                    <div className="empty-split-state">
                        <h2>Multi-View Chat</h2>
                        <p>Select up to 4 conversations from the list to view them simultaneously.</p>
                        <button onClick={() => setShowSelector(true)} className="start-split-btn">
                            <RiAddLine /> Open Chat List
                        </button>
                    </div>
                ) : (
                    activeChats.map(id => (
                        <div key={id} className="split-chat-item">
                            <button className="close-split-item" onClick={() => removeChat(id)}>
                                <RiCloseLine />
                            </button>
                            <Chat conversationId={id} isSplitView={true} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
