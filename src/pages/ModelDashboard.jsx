import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCoinFill, RiBankCardFill, RiBitCoinFill, RiTimeFill, RiCheckboxCircleFill } from 'react-icons/ri';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ModelDashboard.css';

export default function ModelDashboard() {
    const navigate = useNavigate();
    const [earnings, setEarnings] = useState(1240);
    const [payoutMethod, setPayoutMethod] = useState('crypto'); // 'crypto' or 'fiat'
    const [address, setAddress] = useState('');
    const [autoPayout, setAutoPayout] = useState(false);

    // Simulate earnings (2 coins per second)
    useEffect(() => {
        const interval = setInterval(() => {
            setEarnings(prev => prev + 2);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSave = () => {
        if (!address) {
            alert("Please enter a valid payout address.");
            return;
        }
        alert("Payout settings saved!");
    };

    return (
        <div className="model-dashboard-page">
            <Header title="Model Dashboard" showBack />

            <div className="dashboard-content">
                {/* Earnings Card */}
                <div className="earnings-card">
                    <h2>Current Earnings</h2>
                    <div className="earnings-display">
                        <RiCoinFill className="coin-icon-lg" />
                        <span className="earnings-amount">{earnings}</span>
                    </div>
                    <div className="earnings-rate">
                        <RiTimeFill />
                        <span>You earn 2 coins per second (120 coins/min)</span>
                    </div>
                    <div className="earnings-usd">
                        ≈ ${(earnings * 0.01).toFixed(2)} USD
                    </div>
                </div>

                {/* Go Live Button */}
                <button
                    className="go-live-btn"
                    onClick={() => navigate('/streams/create')}
                >
                    <span className="live-pulse"></span>
                    <span className="btn-text">🔴 GO LIVE</span>
                </button>

                {/* Payout Settings */}
                <div className="payout-section">
                    <h3>Payout Settings</h3>

                    <div className="method-toggle">
                        <button
                            className={`method-btn ${payoutMethod === 'crypto' ? 'active' : ''}`}
                            onClick={() => setPayoutMethod('crypto')}
                        >
                            <RiBitCoinFill /> Crypto
                        </button>
                        <button
                            className={`method-btn ${payoutMethod === 'fiat' ? 'active' : ''}`}
                            onClick={() => setPayoutMethod('fiat')}
                        >
                            <RiBankCardFill /> Fiat
                        </button>
                    </div>

                    <div className="input-group">
                        <label>{payoutMethod === 'crypto' ? 'Wallet Address (USDT/BTC)' : 'Bank Account / IBAN'}</label>
                        <input
                            type="text"
                            placeholder={payoutMethod === 'crypto' ? '0x...' : 'US123456789...'}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="info-box">
                        <p>Minimum payout: <strong>$50.00 USD</strong></p>
                        <p>Payout Schedule: <strong>Every 2nd Monday</strong></p>
                    </div>

                    <div className="auto-payout-toggle" onClick={() => setAutoPayout(!autoPayout)}>
                        <div className={`checkbox ${autoPayout ? 'checked' : ''}`}>
                            {autoPayout && <RiCheckboxCircleFill />}
                        </div>
                        <span>Enable Automatic Payouts (min $50)</span>
                    </div>

                    <button className="save-settings-btn" onClick={handleSave}>
                        Save Payout Settings
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
