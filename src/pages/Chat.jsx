import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import Header from '../components/Header';
import ChatContent from '../components/ChatContent';
import { RiVideoAddFill, RiLayoutGridFill } from 'react-icons/ri';
import './Chat.css';

export default function Chat({ conversationId: propId, isSplitView = false }) {
    const { conversationId: paramId } = useParams();
    const conversationId = propId ? Number(propId) : Number(paramId);
    const navigate = useNavigate();
    const { conversations, openChatWindow } = useChatStore();

    const conversation = conversations.find(c => c.id === Number(conversationId));

    const handleVideoCall = () => {
        if (conversation) {
            navigate(`/call/${conversation.id}`);
        }
    };

    const handleOpenWindow = () => {
        openChatWindow(conversationId);
        navigate('/messages'); // Go back to list after opening window? Or stay? Let's go back so they see the window floating.
    };

    if (!conversation) {
        // Auto-redirect if not found (prevents dead screen)
        setTimeout(() => navigate('/chats'), 500);
        return <div className="chat-page error">Loading...</div>;
    }

    return (
        <div className="chat-page">
            {!isSplitView && (
                <Header
                    title={conversation.name}
                    showBack
                    rightAction={
                        <div className="chat-header-actions">
                            <button className="header-action-btn" onClick={handleOpenWindow} title="Open in Window" style={{ marginRight: '8px' }}>
                                <RiLayoutGridFill size={24} />
                            </button>
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
