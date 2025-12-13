import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiEyeFill, RiHeart3Fill, RiCoinFill, RiUser3Fill, RiAddCircleFill } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './Streams.css';

// Mock Data
const FEATURED_HOSTS = [
    { id: 1, name: 'Host', image: 'https://i.pravatar.cc/150?img=10', isHost: true },
    { id: 2, name: 'Guest 1', image: 'https://i.pravatar.cc/150?img=20', isHost: false },
    { id: 3, name: 'Guest 2', image: 'https://i.pravatar.cc/150?img=30', isHost: false },
    { id: 4, name: 'Guest 3', image: 'https://i.pravatar.cc/150?img=40', isHost: false },
    { id: 5, name: 'Guest 4', image: 'https://i.pravatar.cc/150?img=50', isHost: false },
];

const LIVE_STREAMS = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 10,
    name: `Streamer ${i + 1}`,
    image: `https://i.pravatar.cc/300?img=${i + 15}`,
    viewers: Math.floor(Math.random() * 5000) + 100,
    likes: Math.floor(Math.random() * 10000),
}));

export default function Streams() {
    const navigate = useNavigate();
    const { coins, spendDiamonds } = useUserStore();
    const [isJoined, setIsJoined] = useState(false);
    const [streams, setStreams] = useState(LIVE_STREAMS);
    const [lastTap, setLastTap] = useState(0);

    // Pay-to-join logic (Mock)
    useEffect(() => {
        let interval;
        if (isJoined) {
            interval = setInterval(() => {
                // In a real app, we'd deduct coins here. 
                // For now, we just simulate the cost.
                console.log('Deducting 20 coins for premium stream...');
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isJoined]);

    const handleJoin = () => {
        if (coins < 20) {
            alert("Not enough coins to join!");
            return;
        }
        navigate('/stream/multi');
    };

    const handleDoubleTap = (id) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            // Double tap detected
            setStreams(prev => prev.map(s =>
                s.id === id ? { ...s, likes: s.likes + 1 } : s
            ));
            // Show heart animation (simplified)
        }
        setLastTap(now);
    };

    return (
        <div className="streams-page">
            <Header title="Live Streams" showBalance />

            <div className="streams-content">
                {/* Featured Multi-Host Stream */}
                <div className="featured-stream-container">
                    <div className="featured-grid">
                        {FEATURED_HOSTS.map((host, index) => (
                            <div key={host.id} className={`featured-host ${host.isHost ? 'main-host' : ''}`}>
                                <img src={host.image} alt={host.name} />
                                {host.isHost && <div className="host-badge">HOST</div>}
                            </div>
                        ))}
                    </div>

                    {!isJoined && (
                        <div className="join-overlay">
                            <div className="join-content">
                                <h3>Premium Multi-Host Chat</h3>
                                <p>Join 5 top models live!</p>
                                <button className="join-btn" onClick={handleJoin}>
                                    <RiCoinFill /> Pay 20/sec to Join
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Stream Grid */}
                <h3 className="section-title">Trending Now</h3>
                <div className="streams-grid">
                    {streams.map(stream => (
                        <div
                            key={stream.id}
                            className="stream-card"
                            onClick={() => navigate(`/stream/${stream.id}`)}
                        >
                            <img src={stream.image} alt={stream.name} className="stream-img" />
                            <div className="stream-overlay" />

                            <div className="stream-viewers">
                                <RiEyeFill /> {stream.viewers}
                            </div>

                            <div className="stream-info">
                                <span className="stream-name">{stream.name}</span>
                                <div className="stream-likes">
                                    <RiHeart3Fill /> {stream.likes}
                                </div>
                            </div>

                            <div className="live-badge">LIVE</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="go-live-fab">
                <button
                    className="go-live-btn"
                    onClick={() => navigate('/broadcast')}
                >
                    <RiAddCircleFill size={24} />
                    <span>Go Live</span>
                </button>
            </div>

            <BottomNav />
        </div >
    );
}
