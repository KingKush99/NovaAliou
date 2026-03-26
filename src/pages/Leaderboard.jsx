import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiVipCrownFill, RiFireFill, RiCoinFill } from 'react-icons/ri';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useUserStore } from '../store/userStore';
import { getApiUrl } from '../utils/config';
import './Leaderboard.css';

const TABS = [
    { id: 'model', label: 'Top Model' },
    { id: 'donator', label: 'Top Donator' },
    { id: 'matches', label: 'Longest Matches' }
];

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState('model');
    const [users, setUsers] = useState([]);
    const { user, coins } = useUserStore();
    const [myRank, setMyRank] = useState(125); // Fallback
    const [loadError, setLoadError] = useState(null);
    const isMatchesTab = activeTab === 'matches';

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoadError(null);
                const apiUrl = getApiUrl();
                const res = await fetch(`${apiUrl}/api/leaderboard?type=${encodeURIComponent(activeTab)}`);
                if (!res.ok) throw new Error(`Leaderboard request failed (${res.status})`);
                const data = await res.json();
                setUsers(data);

                // Find current user's rank
                const found = data.find(u => u.name === (user.displayName || user.username));
                if (found) setMyRank(found.rank);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                // Don't show mock data here; we want the leaderboard to reflect backend state.
                setUsers([]);
                setLoadError('Leaderboard unavailable. Start the API server on port 3003.');
            }
        };
        fetchLeaderboard();
    }, [activeTab]);

    return (
        <div className="leaderboard-page">
            <Header title="Leaderboard" showBalance />

            <div className="leaderboard-content">
                {/* Tabs */}
                <div className="leaderboard-tabs">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    className="tab-indicator"
                                    layoutId="lb-tab"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Top 3 Podium */}
                <div className="podium-container">
                    {users.slice(0, 3).map((user, index) => {
                        // Reorder for visual podium: 2nd, 1st, 3rd
                        let order = 0;
                        let scale = 1;
                        if (index === 0) { order = 2; scale = 1.2; } // 1st
                        if (index === 1) { order = 1; scale = 1; }   // 2nd
                        if (index === 2) { order = 3; scale = 0.9; } // 3rd

                        return (
                            <motion.div
                                key={user.id}
                                className={`podium-item rank-${index + 1}`}
                                style={{ order }}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="podium-avatar-container" style={{ transform: `scale(${scale})` }}>
                                    <img src={user.avatar} alt={user.name} className="podium-avatar" />
                                    <div className="podium-rank">{index + 1}</div>
                                    {index === 0 && <RiVipCrownFill className="crown-icon" />}
                                </div>
                                <div className="podium-info">
                                    <span className="podium-name">{user.name}</span>
                                    <span className="podium-score">
                                        {isMatchesTab ? (
                                            <>
                                                <RiFireFill className="coin-icon" />
                                                {(user.matches || 0).toLocaleString()}
                                            </>
                                        ) : (
                                            <>
                                                <RiCoinFill className="coin-icon" />
                                                {(user.coins || 0).toLocaleString()}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {loadError && (
                    <div style={{ padding: '12px 16px', color: '#ffb703' }}>
                        {loadError}
                    </div>
                )}

                {/* List */}
                <div className="leaderboard-list">
                    {users.slice(3).map((user, index) => (
                        <motion.div
                            key={user.id}
                            className="leaderboard-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index + 3) * 0.05 }}
                        >
                            <span className="rank-number">{user.rank}</span>
                            <img src={user.avatar} alt={user.name} className="list-avatar" />
                            <div className="list-info">
                                <span className="list-name">{user.name}</span>
                                <span className="list-matches">
                                    <RiFireFill size={12} /> {user.matches} matches
                                </span>
                            </div>
                            <div className="list-score">
                                {isMatchesTab ? (
                                    <>
                                        <RiFireFill className="coin-icon" />
                                        {(user.matches || 0).toLocaleString()}
                                    </>
                                ) : (
                                    <>
                                        <RiCoinFill className="coin-icon" />
                                        {(user.coins || 0).toLocaleString()}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Current User Fixed Bottom */}
                <div className="current-user-rank">
                    <span className="rank-number">{myRank}</span>
                    {user.photos?.[0] ? (
                        <img src={user.photos[0]} alt="You" className="list-avatar" />
                    ) : (
                        <div className="list-avatar placeholder-avatar" />
                    )}
                    <div className="list-info">
                        <span className="list-name">You ({user.displayName || user.username || 'User'})</span>
                    </div>
                    <div className="list-score">
                        {isMatchesTab ? (
                            <>
                                <RiFireFill className="coin-icon" />
                                0
                            </>
                        ) : (
                            <>
                                <RiCoinFill className="coin-icon" />
                                {coins.toLocaleString()}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
