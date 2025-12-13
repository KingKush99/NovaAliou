import { useRef, useEffect, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { RiCloseLine, RiSubtractLine, RiVideoAddFill } from 'react-icons/ri';
import { useChatStore } from '../store/chatStore';
import ChatContent from './ChatContent';
import './ChatWindow.css';

export default function ChatWindow({ conversationId, initialPosition = { x: 50, y: 50 }, index }) {
    const { conversations, closeChatWindow, bringToFront } = useChatStore();
    const conversation = conversations.find(c => c.id === conversationId);

    // Random slight offset for stacked opening if multiple
    const [position, setPosition] = useState({
        x: initialPosition.x + (index * 20),
        y: initialPosition.y + (index * 20)
    });

    const windowRef = useRef(null);

    // If conversation not found (deleted?), close window
    if (!conversation) {
        closeChatWindow(conversationId);
        return null;
    }

    return (
        <motion.div
            className="chat-window-container"
            initial={{ opacity: 0, scale: 0.9, x: position.x, y: position.y }}
            animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
            exit={{ opacity: 0, scale: 0.9 }}
            drag
            dragMomentum={false}
            onDragEnd={(e, info) => {
                setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
            }}
            onMouseDown={() => bringToFront(conversationId)}
            style={{ zIndex: 1000 + index }} // Dynamic z-index based on order
        >
            <div className="chat-window-header">
                <div className="window-user-info">
                    <div className="window-avatar">
                        {conversation.avatar ? <img src={conversation.avatar} /> : <span>{conversation.name[0]}</span>}
                        {conversation.isOnline && <div className="online-dot"></div>}
                    </div>
                    <span className="window-username">{conversation.name}</span>
                </div>
                <div className="window-actions">
                    <button className="window-btn" title="Video Call"><RiVideoAddFill /></button>
                    <button className="window-btn" title="Close" onClick={() => closeChatWindow(conversationId)}><RiCloseLine /></button>
                </div>
            </div>

            <div className="window-content-area">
                <ChatContent conversationId={conversationId} isWindowMode={true} />
            </div>
        </motion.div>
    );
}
