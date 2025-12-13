import { RiHome5Fill, RiBroadcastFill, RiTrophyFill, RiUser3Fill, RiHistoryFill, RiChat3Fill, RiGamepadFill, RiShoppingBag3Fill, RiNotification3Fill } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSubscriptionStore, TIERS } from '../store/useSubscriptionStore';
import './BottomNav.css';

export default function BottomNav() {
    const { tier } = useSubscriptionStore();

    const navItems = [
        { path: '/home', icon: RiHome5Fill, label: 'Home' },
        { path: '/streams', icon: RiBroadcastFill, label: 'Streams' },
        { path: '/leaderboard', icon: RiTrophyFill, label: 'Leaderboard' },
        { path: '/chats', icon: RiChat3Fill, label: 'Messages' },
        { path: '/store', icon: RiShoppingBag3Fill, label: 'Store' },
        { path: '/history', icon: RiHistoryFill, label: 'History' }
    ];

    // Add Games tab for Platinum users
    if (tier === TIERS.PLATINUM) {
        navItems.splice(3, 0, { path: '/games', icon: RiGamepadFill, label: 'Games' });
    }

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    {({ isActive }) => (
                        <>
                            <motion.div
                                className="nav-icon"
                                whileTap={{ scale: 0.9 }}
                                animate={{ scale: isActive ? 1.1 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <item.icon size={24} />
                            </motion.div>
                            {isActive && (
                                <motion.div
                                    className="nav-indicator"
                                    layoutId="nav-indicator"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
