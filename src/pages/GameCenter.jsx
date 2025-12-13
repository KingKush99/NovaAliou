import { motion } from 'framer-motion';
import { generateMockGames } from '../utils/mockData';
import { useUserStore } from '../store/userStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import './GameCenter.css';

export default function GameCenter() {
    const games = generateMockGames();
    const { addDiamonds } = useUserStore();

    const handlePlayGame = (game) => {
        // Simulate playing game and earning diamonds
        const earned = Math.floor(Math.random() * game.reward) + 10;
        addDiamonds(earned);
        alert(`You earned ${earned} diamonds! 💎`);
    };

    return (
        <div className="game-center-page">
            <Header title="Game Center" showBalance />

            <div className="game-center-content">
                <div className="game-center-header">
                    <h2>Play & Earn Diamonds</h2>
                    <p>Complete games to earn rewards!</p>
                </div>

                <div className="games-grid">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            className="game-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="game-thumbnail">{game.thumbnail}</div>
                            <div className="game-info">
                                <h3 className="game-name">{game.name}</h3>
                                <p className="game-description">{game.description}</p>
                                <div className="game-stats">
                                    <span className="game-reward">
                                        💎 Up to {game.reward}
                                    </span>
                                    <span className="game-plays">
                                        {game.plays} plays
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => handlePlayGame(game)}
                            >
                                Play Now
                            </Button>
                        </motion.div>
                    ))}
                </div>

                <div className="daily-challenge">
                    <h3>Daily Challenge</h3>
                    <p>Complete 3 games today to earn a bonus 100 diamonds!</p>
                    <div className="challenge-progress">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '33%' }} />
                        </div>
                        <span className="progress-text">1/3 completed</span>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
