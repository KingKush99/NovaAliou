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
import DailyLoginModal from './components/DailyLoginModal';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Leaderboard from './pages/Leaderboard';
import Themes from './pages/Themes';
import Settings from './pages/Settings';
import Legal from './pages/Legal';
import GameCenter from './pages/GameCenter';
import GlobalHUD from './components/GlobalHUD';
import Streams from './pages/Streams';
import GoLive from './pages/GoLive';
import StreamRoom from './pages/StreamRoom';
import History from './pages/History';
import ModelSignup from './pages/ModelSignup';
import ModelDashboard from './pages/ModelDashboard';
import ChatSplitView from './pages/ChatSplitView';
import { useUserStore } from './store/userStore';
import BackgroundMusic from './components/BackgroundMusic';
import AdBanner from './components/AdBanner';
import MusicPlayerBar from './components/MusicPlayerBar';
import './App.css';
import { useTheme } from './hooks/useTheme';
import { getPurchasesController } from './utils/purchases';

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [dailyLoginData, setDailyLoginData] = useState(null); // { streak, coins, diamonds }
    const { hasCompletedOnboarding, user, setUser, coins, setCoins } = useUserStore(); // Get from store
    useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        // Initialize Push Notifications
        import('./utils/PushController').then(({ PushController }) => {
            PushController.requestPermissions();
            PushController.addListeners();
        });

        // Initialize AdMob
        import('./utils/AdMobController').then(({ AdMobController }) => {
            AdMobController.initialize();
        });

        return () => clearTimeout(timer);
    }, []);

    // Configure RevenueCat IAP (iOS/Android) and sync wallet if configured.
    useEffect(() => {
        (async () => {
            try {
                const purchases = await getPurchasesController();
                await purchases.configure?.({ appUserId: user?.id });
                const vc = await purchases.getVirtualCurrencies?.();
                const coinsBalance = vc?.virtualCurrencies?.coins?.balance;
                if (typeof coinsBalance === 'number' && Number.isFinite(coinsBalance)) {
                    setCoins(Math.max(0, Math.floor(coinsBalance)));
                }
            } catch (err) {
                // IAP is optional in dev; only log to console.
                console.warn('IAP init skipped:', err?.message || err);
            }
        })();
    }, [user?.id, setCoins]);

    // Daily Login Logic - Runs on mount AND when onboarding completes
    useEffect(() => {
        const checkDailyLogin = () => {
            const lastLogin = localStorage.getItem('lastLoginDate');
            const today = new Date().toDateString();
            const showAfterOnboarding = localStorage.getItem('showDailyLogin');

            // Force show after onboarding OR on new day
            if (showAfterOnboarding === 'true' || lastLogin !== today) {
                const currentStreak = parseInt(localStorage.getItem('loginStreak') || '0');
                const newStreak = currentStreak + 1;

                const coinReward = 100 + (newStreak * 10);
                const diamondReward = newStreak % 7 === 0 ? 5 : 0;

                useUserStore.getState().addCoins(coinReward);
                if (diamondReward > 0) useUserStore.getState().addDiamonds(diamondReward);

                localStorage.setItem('lastLoginDate', today);
                localStorage.setItem('loginStreak', newStreak.toString());
                localStorage.removeItem('showDailyLogin'); // Clear flag after showing

                // Show stylish modal
                setDailyLoginData({ streak: newStreak, coins: coinReward, diamonds: diamondReward });
            }
        };

        // Small delay to ensure smooth transition from onboarding
        const timeout = setTimeout(checkDailyLogin, 1000);
        return () => clearTimeout(timeout);
    }, [hasCompletedOnboarding]); // Trigger when onboarding finishes

    // Data Integrity Checks
    useEffect(() => {
        if (coins < 2500) setCoins(2500);
        if (user.displayName === 'Display Name undefined' || user.username === 'Display Name undefined') {
            setUser({ ...user, name: 'User', displayName: 'User', username: `user${user.id || '1'}` });
        }
    }, [user, coins, setCoins, setUser]);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <BrowserRouter>
            <GlobalHUD />
            <MusicPlayerBar />  {/* Persistent Music Bar */}
            <BackgroundMusic />
            <NotificationSimulator />
            <NotificationPopup />

            {/* Daily Login Modal */}
            <AnimatePresence>
                {dailyLoginData && (
                    <DailyLoginModal
                        streak={dailyLoginData.streak}
                        coins={dailyLoginData.coins}
                        diamonds={dailyLoginData.diamonds}
                        onClose={() => setDailyLoginData(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<StartScreen />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/call/:userId" element={<VideoCall />} />
                    <Route path="/messages" element={<Messages />} />
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
            {/* Global Ad Banner - Hide on Splash, Onboarding, and Start Screen */}
            {!showSplash && window.location.pathname !== '/onboarding' && window.location.pathname !== '/' && (
                <AdBanner position="bottom" style={{ position: 'fixed', bottom: '60px', left: 0, right: 0, zIndex: 90 }} />
            )}
        </BrowserRouter>
    );
}

export default App;

