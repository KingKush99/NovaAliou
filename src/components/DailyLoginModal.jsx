import { motion } from 'framer-motion';
import { RiGiftFill, RiCloseLine, RiFireFill, RiCoinFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import './DailyLoginModal.css';

export default function DailyLoginModal({ streak, coins, diamonds, onClose }) {
    return (
        <motion.div
            className="daily-login-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="daily-login-modal"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
            >
                <button className="close-btn" onClick={onClose}>
                    <RiCloseLine />
                </button>

                <div className="modal-header">
                    <RiGiftFill className="gift-icon" />
                    <h2>Daily Login Reward!</h2>
                </div>

                <div className="streak-display">
                    <RiFireFill className="fire-icon" />
                    <span className="streak-number">{streak}</span>
                    <span className="streak-label">Day Streak</span>
                </div>

                <div className="rewards-section">
                    <div className="reward-item">
                        <RiCoinFill className="coin-icon" />
                        <span className="reward-amount">+{coins}</span>
                        <span className="reward-label">Coins</span>
                    </div>
                    {diamonds > 0 && (
                        <div className="reward-item diamond">
                            <IoDiamond className="diamond-icon" />
                            <span className="reward-amount">+{diamonds}</span>
                            <span className="reward-label">Diamonds</span>
                        </div>
                    )}
                </div>

                <p className="motivation-text">
                    {streak >= 7 ? "🔥 Amazing streak! Keep it up!" : "Come back tomorrow for more rewards!"}
                </p>

                <button className="claim-btn" onClick={onClose}>
                    Claim Reward
                </button>
            </motion.div>
        </motion.div>
    );
}
