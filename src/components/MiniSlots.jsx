import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiCloseLine, RiArrowUpSLine, RiRefreshLine } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import './MiniSlots.css';

const SYMBOLS = ['🍒', '🍋', '🍇', '💎', '7️⃣', '🔔'];
// Reversed for DropUp Visuals (High on Top)
const BET_OPTIONS = [500, 100, 50, 25, 10];
const REEL_OPTIONS = [6, 5, 4, 3];

export default function MiniSlots({ onClose }) {
    const { coins, addCoins, spendCoins } = useUserStore();
    const [bet, setBet] = useState(10);
    const [reelCount, setReelCount] = useState(3);
    const [reels, setReels] = useState(Array(3).fill('7️⃣'));
    const [isSpinning, setIsSpinning] = useState(false);
    const [winAmount, setWinAmount] = useState(0);
    const [leverPulled, setLeverPulled] = useState(false);
    const [showBetMenu, setShowBetMenu] = useState(false);
    const [showReelMenu, setShowReelMenu] = useState(false);
    const [autoSpin, setAutoSpin] = useState(false);

    // Auto-spin logic using recursive timeout to avoid dependency loops
    useEffect(() => {
        let timeoutId;

        const runAutoSpin = () => {
            if (autoSpin && !isSpinning && coins >= bet) {
                handleSpin();
            } else if (coins < bet) {
                setAutoSpin(false);
            }
        };

        if (autoSpin && !isSpinning) {
            // Add a small delay to prevent immediate state update loops
            timeoutId = setTimeout(runAutoSpin, 100);
        }

        return () => clearTimeout(timeoutId);
    }, [autoSpin, isSpinning, coins, bet]);

    // Ensure reels array matches count
    useEffect(() => {
        setReels(prev => {
            if (prev.length !== reelCount) {
                return Array(reelCount).fill('❓');
            }
            return prev;
        });
    }, [reelCount]);

    const handleSpin = () => {
        if (coins < bet) {
            setAutoSpin(false);
            return;
        }

        spendCoins(bet);
        setIsSpinning(true);
        setWinAmount(0);
        setLeverPulled(true); // Animation trigger

        setTimeout(() => setLeverPulled(false), 500);

        setTimeout(() => {
            const newReels = Array.from({ length: reelCount }, () =>
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
            );
            setReels(newReels);
            setIsSpinning(false);
            checkWin(newReels);
        }, 2000); // 2 second spin duration
    };

    const checkWin = (currentReels) => {
        const first = currentReels[0];
        const allMatch = currentReels.every(s => s === first);

        if (allMatch) {
            const multiplier = reelCount * 5;
            const win = bet * multiplier;
            setWinAmount(win);
            addCoins(win);
        }
    };

    return (
        <div className="mini-slots-overlay">
            <motion.div
                className="mini-slots-container"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
            >
                <button className="slots-close-btn" onClick={onClose}>
                    <RiCloseLine />
                </button>

                <h3 className="slots-title">Mini Slots</h3>

                <div className="slots-machine">
                    <div className="reels-window">
                        {reels.map((symbol, i) => (
                            <div key={i} className="reel">
                                <motion.div
                                    className="reel-strip"
                                    animate={isSpinning ? { y: [0, -1000, 0] } : { y: 0 }}
                                    transition={{ duration: 0.8, ease: "linear", repeat: isSpinning ? Infinity : 0 }}
                                >
                                    {isSpinning ? '🎰' : symbol}
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    {/* Lever */}
                    <div className="lever-container"
                        onClick={handleSpin}
                        style={{ cursor: isSpinning ? 'not-allowed' : 'pointer' }}>
                        <div className="lever-base"></div>
                        <motion.div
                            className="lever-stick"
                            animate={leverPulled ? { rotateX: 60 } : { rotateX: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            <div className="lever-knob"></div>
                        </motion.div>
                    </div>
                </div>

                {winAmount > 0 && (
                    <motion.div className="win-display" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        WIN! +{winAmount}
                    </motion.div>
                )}

                <div className="slots-controls">
                    {/* Bets */}
                    <div className="control-group">
                        <label>Bets:</label>
                        <div className="dropup-container">
                            <button className="control-btn" onClick={() => setShowBetMenu(!showBetMenu)}>
                                {bet} <RiArrowUpSLine />
                            </button>
                            {showBetMenu && (
                                <div className="dropup-menu">
                                    {BET_OPTIONS.map((opt) => (
                                        <div key={opt} className="dropup-item" onClick={() => { setBet(opt); setShowBetMenu(false); }}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Push / Auto */}
                    <div className="action-group">
                        <button
                            className={`push-btn ${isSpinning ? 'disabled' : ''}`}
                            onClick={() => !isSpinning && !autoSpin && handleSpin()}
                            disabled={isSpinning || autoSpin || coins < bet}
                        >
                            PUSH
                        </button>
                        <button
                            className={`auto-btn ${autoSpin ? 'active' : ''}`}
                            onClick={() => setAutoSpin(!autoSpin)}
                        >
                            <RiRefreshLine className={autoSpin ? 'spin-icon' : ''} />
                            AUTO
                        </button>
                    </div>

                    {/* Reels */}
                    <div className="control-group">
                        <label>Reels:</label>
                        <div className="dropup-container">
                            <button className="control-btn" onClick={() => setShowReelMenu(!showReelMenu)}>
                                {reelCount} <RiArrowUpSLine />
                            </button>
                            {showReelMenu && (
                                <div className="dropup-menu">
                                    {REEL_OPTIONS.map((opt) => (
                                        <div key={opt} className="dropup-item" onClick={() => { setReelCount(opt); setShowReelMenu(false); }}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
