import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import Header from '../components/Header';
import ChatContent from '../components/ChatContent';
import { RiVideoAddFill, RiLayoutGridFill } from 'react-icons/ri';
import './Chat.css';

export default function Chat({ conversationId: propId, isSplitView = false }) {
    const { conversationId: paramId } = useParams();
    const conversationId = String(propId || paramId || '');
    const navigate = useNavigate();
    const location = useLocation();
    const { conversations, initializeConversation, setActiveConversation } = useChatStore();

    const conversation = conversations.find(c => String(c.id) === String(conversationId));

    const handleVideoCall = () => {
        if (conversation) {
            navigate(`/call/${conversation.id}`);
        }
    };



    useEffect(() => {
        if (!conversationId) return;

        // Always keep store in sync with the URL.
        setActiveConversation(conversationId);

        // If user deep-linked or store was empty, initialize from navigation state.
        if (!conversation && location.state && typeof location.state === 'object') {
            const { name, avatar, isOnline } = location.state;
            initializeConversation(conversationId, { name, avatar, isOnline });
        }
    }, [conversationId, conversation, initializeConversation, location.state, setActiveConversation]);

    if (!conversation) {
        return <div className="chat-page error">Loading...</div>;
    }

    return (
        <div className="chat-page">
            {!isSplitView && (
                <Header
                    title={conversation.userName || conversation.name || `Chat with User ${conversation.id}`}
                    showBack
                    rightAction={
                        <div className="chat-header-actions">
                            <button className="header-action-btn" onClick={handleVideoCall}>
                                <RiVideoAddFill size={24} />
                            </button>
                        </div>
                    }
                />
            )}

            {/* Reusable Chat Content Component */}
            <div className="chat-page-content" style={{ flex: 1, overflow: 'hidden', height: isSplitView ? '100%' : 'calc(100vh - 60px)' }}>
                <ChatContent conversationId={conversationId} isWindowMode={false} />
            </div>
        </div>
    );
}
