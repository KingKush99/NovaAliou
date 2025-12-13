import { useState, useEffect } from 'react';
import { RiMessage3Line, RiUserAddLine, RiUserLine, RiCloseLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import './ContextMenu.css';

export default function ContextMenu({ x, y, userName, userId, onClose }) {
    const navigate = useNavigate();
    const [position, setPosition] = useState({ x, y });

    useEffect(() => {
        // Adjust position if menu would go off screen
        const menuWidth = 200;
        const menuHeight = 150;
        const adjustedX = x + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 10 : x;
        const adjustedY = y + menuHeight > window.innerHeight ? window.innerHeight - menuHeight - 10 : y;
        setPosition({ x: adjustedX, y: adjustedY });
    }, [x, y]);

    const handleSendMessage = () => {
        navigate(`/chat/${userId}`);
        onClose();
    };

    const handleAddFriend = () => {
        alert(`Friend request sent to ${userName}!`);
        onClose();
    };

    const handleVisitProfile = () => {
        navigate(`/user/${userId}`);
        onClose();
    };

    return (
        <>
            <div className="context-menu-overlay" onClick={onClose} />
            <div
                className="context-menu"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            >
                <div className="context-menu-header">
                    <span>{userName}</span>
                    <button className="context-menu-close" onClick={onClose}>
                        <RiCloseLine />
                    </button>
                </div>
                <div className="context-menu-items">
                    <button className="context-menu-item" onClick={handleSendMessage}>
                        <RiMessage3Line />
                        <span>Send Message</span>
                    </button>
                    <button className="context-menu-item" onClick={handleAddFriend}>
                        <RiUserAddLine />
                        <span>Add Friend</span>
                    </button>
                    <button className="context-menu-item" onClick={handleVisitProfile}>
                        <RiUserLine />
                        <span>Visit Profile</span>
                    </button>
                </div>
            </div>
        </>
    );
}
