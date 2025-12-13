import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiGamepadFill, RiArrowLeftLine } from 'react-icons/ri';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useSubscriptionStore, TIERS } from '../store/useSubscriptionStore';
import './Games.css';

export default function Games() {
    const navigate = useNavigate();
    const { tier } = useSubscriptionStore();

    // Double check access (though route should be protected)
    if (tier !== TIERS.PLATINUM) {
        return (
            <div className="games-page">
                <Header title="Games Center" />
                <div className="games-locked">
                    <RiGamepadFill size={64} />
                    <h2>Platinum Exclusive</h2>
                    <p>Upgrade to Platinum to access exclusive games!</p>
                    <button onClick={() => navigate('/store')}>Upgrade Now</button>
                </div>
                <BottomNav />
            </div>
        );
    }

    const games = [
        {
            id: 'meme',
            title: 'Name That Meme',
            description: 'Test your internet culture knowledge!',
            icon: '🎭',
            color: '#FF6B6B',
            path: '/games/meme'
        },
        {
            id: 'star',
            title: 'Name The Pornstar',
            description: 'How well do you know the stars?',
            icon: '⭐',
            color: '#FFD700',
            path: '/games/star'
        }
    ];

    return (
        <div className="games-page">
            <Header title="Platinum Games" showBalance />

            <div className="games-grid">
                {games.map((game) => (
                    <motion.div
                        key={game.id}
                        className="game-card"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(game.path)}
                        style={{ borderColor: game.color }}
                    >
                        <div className="game-icon" style={{ background: game.color }}>
                            {game.icon}
                        </div>
                        <div className="game-info">
                            <h3>{game.title}</h3>
                            <p>{game.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
}
