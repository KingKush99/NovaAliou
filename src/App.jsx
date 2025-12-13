import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import StartScreen from './pages/StartScreen';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Matches from './pages/Matches';
import VideoCall from './pages/VideoCall';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Chats from './pages/Chats';
import ChatMultiView from './pages/ChatMultiView';
import NotificationSimulator from './components/NotificationSimulator';
import NotificationPopup from './components/NotificationPopup';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Leaderboard from './pages/Leaderboard';
import Themes from './pages/Themes';
import Settings from './pages/Settings';
import Legal from './pages/Legal';
import GameCenter from './pages/GameCenter';
import GlobalHUD from './components/GlobalHUD';
import Streams from './pages/Streams';
import GoLive from './pages/GoLive'; // Import GoLive
import StreamRoom from './pages/StreamRoom';
import History from './pages/History';
import ModelSignup from './pages/ModelSignup';
import ModelDashboard from './pages/ModelDashboard';
import ChatSplitView from './pages/ChatSplitView';

import { useUserStore } from './store/userStore';
import BackgroundMusic from './components/BackgroundMusic';
import './App.css';

import { useTheme } from './hooks/useTheme';

function App() {
    const [showSplash, setShowSplash] = useState(true);
    useTheme(); // Applies theme based on subscription tier

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        // Initialize Push Notifications
        import('./utils/PushController').then(({ PushController }) => {
            PushController.requestPermissions();
            PushController.addListeners();
        });

        // Initialize AdMob (Real Ads)
        import('./utils/AdMobController').then(({ AdMobController }) => {
            AdMobController.initialize();
        });

        // Daily Login Logic (Re-applying)
        const checkDailyLogin = () => {
            const lastLogin = localStorage.getItem('lastLoginDate');
            const today = new Date().toDateString();

            if (lastLogin !== today) {
                const currentStreak = parseInt(localStorage.getItem('loginStreak') || '0');
                const newStreak = currentStreak + 1;

                const coinReward = 100 + (newStreak * 10);
                const diamondReward = newStreak % 7 === 0 ? 5 : 0;

                useUserStore.getState().addCoins(coinReward);
                if (diamondReward > 0) useUserStore.getState().addDiamonds(diamondReward);

                localStorage.setItem('lastLoginDate', today);
                localStorage.setItem('loginStreak', newStreak.toString());

                setTimeout(() => {
                    // Simple alert for user feedback
                    alert(`Daily Login! Streak: ${newStreak} Days\nReceived: ${coinReward} Coins${diamondReward > 0 ? ` & ${diamondReward} Diamonds!` : ''}`);
                }, 3000);
            }
        };
        checkDailyLogin();

        // Force Sync Coins for new limit
        const { coins, setCoins, user, setUser } = useUserStore.getState();
        if (coins < 2500) {
            console.log("Forcing coin update to 2500");
            setCoins(2500);
        }

        // Fix Corrupted Data (The "Display Name undefined" bug)
        if (user.displayName === 'Display Name undefined' || user.username === 'Display Name undefined' || user.name === 'Display Name undefined') {
            console.log("Found corrupted user data. Resetting...");
            setUser({
                ...user,
                name: 'User',
                displayName: 'User',
                username: `user${user.id || '1'}`
            });
        }

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <BrowserRouter>
            <GlobalHUD />
            <BackgroundMusic />
            <NotificationSimulator />
            <NotificationPopup />

            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<StartScreen />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/call/:userId" element={<VideoCall />} />
                    <Route path="/messages" element={<Messages />} />
                    {/* Fixed Route: Uses Profile instead of UserProfile */}
                    <Route path="/user/:userId" element={<Profile />} />
                    <Route path="/chats" element={<Chats />} />
                    <Route path="/chat/:conversationId" element={<Chat />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/themes" element={<Themes />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/games" element={<GameCenter />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/streams" element={<Streams />} />
                    <Route path="/go-live" element={<GoLive />} />
                    <Route path="/stream/:streamId" element={<StreamRoom />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/model-signup" element={<ModelSignup />} />
                    <Route path="/model-dashboard" element={<ModelDashboard />} />
                    <Route path="/chat-split" element={<ChatSplitView />} />
                    <Route path="/chat-multi" element={<ChatMultiView />} />
                    <Route path="/legal/:type" element={<Legal />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
        </BrowserRouter>
    );
}

export default App;
