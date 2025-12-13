import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiVipCrownFill, RiCheckLine, RiShieldStarFill } from 'react-icons/ri';
import { IoDiamond } from 'react-icons/io5';
import { FaCoins } from 'react-icons/fa';
import { useStoreStore } from '../store/storeStore';
import { useUserStore } from '../store/userStore';
import { useSubscriptionStore, TIERS, TIER_BENEFITS } from '../store/useSubscriptionStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button';
import Modal from '../components/Modal';
import UnifiedPayment from '../components/UnifiedPayment';
import './Store.css';

export default function Store() {
    const [activeTab, setActiveTab] = useState('subs');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { vipPackages, diamondPackages, coinPackages, gifts } = useStoreStore();
    const { addDiamonds, addCoins, upgradeToVIP } = useUserStore();
    const { setTier } = useSubscriptionStore();

    const tabs = [
        { id: 'subs', label: 'Subscriptions', icon: <RiShieldStarFill /> },
        { id: 'diamonds', label: 'Diamonds', icon: <IoDiamond /> },
        { id: 'coins', label: 'Coins', icon: <FaCoins /> },
        { id: 'gifts', label: 'Gifts', icon: '🎁' }
    ];

    const handlePurchase = (item, type) => {
        setSelectedItem({ ...item, type });
        setShowPurchaseModal(true);
    };

    const confirmPurchase = () => {
        if (selectedItem.type === 'sub') {
            setTier(selectedItem.tier);
            // Add bonus coins if applicable
            if (selectedItem.tier === TIERS.GOLD) addCoins(10000);
            if (selectedItem.tier === TIERS.PLATINUM) addCoins(25000);
        } else if (selectedItem.type === 'diamonds') {
            addDiamonds(selectedItem.amount + (selectedItem.bonus || 0));
        } else if (selectedItem.type === 'coins') {
            addCoins(selectedItem.amount);
        }
        setShowPurchaseModal(false);
        setSelectedItem(null);
    };

    return (
        <div className="store-page">
            <Header title="Store" showBalance />

            <div className="store-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`store-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="store-content">
                {activeTab === 'subs' && (
                    <div className="store-grid">
                        {[TIERS.GOLD, TIERS.DIAMOND, TIERS.PLATINUM].map((tierKey) => {
                            const tier = TIER_BENEFITS[tierKey];
                            return (
                                <motion.div
                                    key={tierKey}
                                    className="store-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ borderColor: tier.color }}
                                >
                                    <div className="card-icon" style={{ color: tier.color }}>
                                        <RiShieldStarFill size={40} />
                                    </div>
                                    <h3 className="card-title" style={{ color: tier.color }}>{tier.name}</h3>
                                    <div className="card-price">
                                        ${tier.price}
                                        <span className="period">/month</span>
                                    </div>
                                    <ul className="card-features">
                                        {tier.features.map((feature, index) => (
                                            <li key={index}>
                                                <RiCheckLine style={{ color: tier.color }} /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => handlePurchase({ ...tier, tier: tierKey }, 'sub')}
                                        style={{ background: tier.color, color: '#000', marginBottom: '10px' }}
                                    >
                                        Subscribe
                                    </Button>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={() => {
                                            // Temporary preview
                                            document.documentElement.setAttribute('data-theme', tierKey.toLowerCase());
                                            setTimeout(() => {
                                                // Revert after 5 seconds if not subscribed
                                                const currentTier = useSubscriptionStore.getState().tier;
                                                const theme = currentTier === 'FREE' || currentTier === 'GOLD' ? 'default' : currentTier.toLowerCase();
                                                document.documentElement.setAttribute('data-theme', theme);
                                            }, 15000);
                                        }}
                                        style={{
                                            borderColor: tier.color,
                                            color: tier.color,
                                            background: tierKey === 'PLATINUM' ? 'linear-gradient(135deg, rgba(229, 228, 226, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)' : 'transparent',
                                            border: tierKey === 'PLATINUM' ? '1px solid #E5E4E2' : `1px solid ${tier.color}`
                                        }}
                                    >
                                        Preview Theme (15s)
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'diamonds' && (
                    <div className="store-grid">
                        {diamondPackages.map((pkg) => (
                            <motion.div
                                key={pkg.id}
                                className={`store-card compact ${pkg.popular ? 'popular' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {pkg.popular && <div className="popular-badge">Best Value</div>}
                                <div className="card-icon diamond-icon">
                                    <IoDiamond size={32} />
                                </div>
                                <h3 className="card-amount">{pkg.amount}</h3>
                                {pkg.bonus > 0 && (
                                    <div className="bonus-badge">+{pkg.bonus} Bonus</div>
                                )}
                                <div className="card-price">${pkg.price}</div>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => handlePurchase(pkg, 'diamonds')}
                                >
                                    Buy Now
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'coins' && (
                    <div className="store-grid">
                        {coinPackages.map((pkg) => (
                            <motion.div
                                key={pkg.id}
                                className={`store-card compact ${pkg.bonusPercent > 0 ? 'popular' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {pkg.bonusPercent > 0 && (
                                    <div className="popular-badge">{pkg.bonusPercent}% MORE DEAL</div>
                                )}
                                <div className="card-icon coin-icon">
                                    <FaCoins size={32} />
                                </div>
                                <h3 className="card-amount">{pkg.amount.toLocaleString()}</h3>
                                <div className="card-price">${pkg.price}</div>
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => handlePurchase(pkg, 'coins')}
                                >
                                    Buy Now
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'gifts' && (
                    <div className="gifts-grid">
                        {gifts.map((gift) => (
                            <motion.div
                                key={gift.id}
                                className="gift-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="gift-image">{gift.image}</div>
                                <h4 className="gift-name">{gift.name}</h4>
                                <div className="gift-price">
                                    <IoDiamond /> {gift.price}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />

            {/* Purchase Confirmation / Payment Gateway */}
            {showPurchaseModal && selectedItem && (
                <UnifiedPayment
                    amount={selectedItem.price}
                    onSuccess={confirmPurchase}
                    onClose={() => setShowPurchaseModal(false)}
                />
            )}
        </div>
    );
}
