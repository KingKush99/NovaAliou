import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiPhoneFill, RiCloseCircleFill } from 'react-icons/ri';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './History.css';

const MOCK_HISTORY = [
    { id: 1, name: 'Olivia', type: 'recent', time: '2 mins ago', duration: '5:23', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Sarah', type: 'missed', time: '1 hour ago', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Jessica', type: 'recent', time: 'Yesterday', duration: '12:45', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: 4, name: 'Emily', type: 'rejected', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?img=12' },
];

export default function History() {
    const [activeTab, setActiveTab] = useState('active');

    const filteredHistory = MOCK_HISTORY.filter(item => {
        if (activeTab === 'active') return item.type === 'recent';
        return item.type === 'missed' || item.type === 'rejected';
    });

    return (
        <div className="history-page">
            <Header title="History" showBalance />

            <div className="history-tabs">
                <button
                    className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active
                </button>
                <button
                    className={`tab-btn ${activeTab === 'missed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('missed')}
                >
                    Missed
                </button>
            </div>

            <div className="history-list">
                {filteredHistory.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className="history-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <img src={item.avatar} alt={item.name} className="history-avatar" />
                        <div className="history-info">
                            <span className="history-name">{item.name}</span>
                            <span className="history-time">{item.time}</span>
                        </div>
                        <div className="history-status">
                            {item.type === 'recent' ? (
                                <span className="status-duration"><RiPhoneFill /> {item.duration}</span>
                            ) : (
                                <span className="status-missed"><RiCloseCircleFill /> {item.type}</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}
