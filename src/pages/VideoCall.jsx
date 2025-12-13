import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RiPhoneFill, RiMicOffLine, RiMicLine, RiCameraOffLine,
    RiCameraLine, RiCameraSwitchLine, RiGiftFill, RiFilterLine
} from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import './VideoCall.css';

export default function VideoCall() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { coins, spendCoins } = useUserStore();
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isMultiHost, setIsMultiHost] = useState(false); // For future multi-host feature

    // Coin charging: 
    // Single Model: 250 coins/min = ~4.16 coins/sec
    // Multi-Host: 500 coins/min = ~8.33 coins/sec
    const COST_PER_SECOND = isMultiHost ? (500 / 60) : (250 / 60);

    useEffect(() => {
        const timer = setInterval(() => {
            // Check if user has enough coins
            if (coins < COST_PER_SECOND) {
                alert('Not enough coins! Call ending...');
                navigate('/messages');
                return;
            }

            // Charge coins
            spendCoins(Math.ceil(COST_PER_SECOND)); // Charge whole integer coins
            setCallDuration(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [coins, COST_PER_SECOND, navigate, spendCoins]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        navigate(-1); // Go back to previous page instead of forcing /messages
    };

    return (
        <div className="video-call-page">
            {/* Remote Video (simulated) */}
            <div className="remote-video">
                <div className="video-placeholder">
                    <div className="placeholder-avatar">
                        <img src="https://i.pravatar.cc/400?img=5" alt="User" />
                    </div>
                    <div className="connection-quality">
                        <div className="quality-bar good" />
                        <div className="quality-bar good" />
                        <div className="quality-bar good" />
                        <div className="quality-bar" />
                    </div>
                </div>
            </div>

            {/* Local Video (Picture in Picture) */}
            <div className="local-video">
                <div className="video-placeholder small">
                    <div className="placeholder-avatar small">
                        <img src="https://i.pravatar.cc/400?img=1" alt="You" />
                    </div>
                </div>
            </div>

            {/* Call Info */}
            <div className="call-info">
                <h2 className="caller-name">Emma</h2>
                <p className="call-duration">{formatDuration(callDuration)}</p>
            </div>

            {/* Controls */}
            <div className="call-controls">
                <motion.button
                    className="control-btn"
                    onClick={() => setIsMuted(!isMuted)}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMuted ? <RiMicOffLine size={24} /> : <RiMicLine size={24} />}
                </motion.button>

                <motion.button
                    className="control-btn"
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    whileTap={{ scale: 0.9 }}
                >
                    {isCameraOff ? <RiCameraOffLine size={24} /> : <RiCameraLine size={24} />}
                </motion.button>

                <motion.button
                    className="control-btn"
                    onClick={() => { }}
                    whileTap={{ scale: 0.9 }}
                >
                    <RiCameraSwitchLine size={24} />
                </motion.button>

                <motion.button
                    className="control-btn"
                    onClick={() => setShowFilters(!showFilters)}
                    whileTap={{ scale: 0.9 }}
                >
                    <RiFilterLine size={24} />
                </motion.button>

                <motion.button
                    className="control-btn gift-btn"
                    onClick={() => { }}
                    whileTap={{ scale: 0.9 }}
                >
                    <RiGiftFill size={24} />
                </motion.button>

                <motion.button
                    className="control-btn end-call-btn"
                    onClick={handleEndCall}
                    whileTap={{ scale: 0.9 }}
                >
                    <RiPhoneFill size={24} />
                </motion.button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <motion.div
                    className="filters-panel"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <h3>Beauty Filters</h3>
                    <div className="filters-grid">
                        {['None', 'Natural', 'Smooth', 'Bright', 'Warm', 'Cool'].map((filter) => (
                            <button key={filter} className="filter-option">
                                {filter}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
