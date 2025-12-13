import { useState } from 'react';
import { RiTimeLine, RiFileCopyLine, RiCheckLine, RiErrorWarningLine, RiCloseLine, RiBitCoinLine } from 'react-icons/ri';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { getApiUrl } from '../utils/config';
import './CryptoPayment.css';

export default function CryptoPayment({ amount, onSuccess, onClose }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCryptoPayment = async () => {
        setLoading(true);
        setError(null);

        try {
            const apiUrl = getApiUrl();

            const response = await fetch(`${apiUrl}/create-crypto-charge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'USD',
                    description: 'Coin Package Purchase',
                    metadata: {
                        source: 'NoveltyCams',
                        timestamp: new Date().toISOString()
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create crypto charge');
            }

            const { hosted_url } = await response.json();

            // Redirect to Coinbase Commerce checkout
            window.location.href = hosted_url;
        } catch (err) {
            console.error('Crypto payment error:', err);
            setError('Failed to initialize crypto payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="payment-overlay" onClick={onClose}>
            <div className="crypto-payment-modal" onClick={(e) => e.stopPropagation()}>
                <button className="payment-close" onClick={onClose}>
                    <RiCloseLine />
                </button>

                <div className="crypto-header">
                    <RiBitCoinLine size={48} className="crypto-icon" />
                    <h2>Pay with Cryptocurrency</h2>
                    <p className="crypto-amount">${amount.toFixed(2)} USD</p>
                </div>

                <div className="crypto-info">
                    <h3>Accepted Cryptocurrencies:</h3>
                    <div className="crypto-list">
                        <div className="crypto-item">
                            <FaBitcoin size={24} color="#F7931A" />
                            <span>Bitcoin (BTC)</span>
                        </div>
                        <div className="crypto-item">
                            <FaEthereum size={24} color="#627EEA" />
                            <span>Ethereum (ETH)</span>
                        </div>
                        <div className="crypto-item">
                            <SiTether size={24} color="#26A17B" />
                            <span>USDC</span>
                        </div>
                        <div className="crypto-item">
                            <SiTether size={24} color="#F3BA2F" />
                            <span>DAI</span>
                        </div>
                    </div>

                    <div className="crypto-benefits">
                        <p>✓ Secure blockchain payment</p>
                        <p>✓ No chargebacks</p>
                        <p>✓ Instant confirmation</p>
                    </div>
                </div>

                {error && (
                    <div className="crypto-error">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleCryptoPayment}
                    disabled={loading}
                    className="crypto-pay-btn"
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Redirecting to Coinbase...
                        </>
                    ) : (
                        <>
                            <RiBitCoinLine size={20} />
                            Continue to Crypto Checkout
                        </>
                    )}
                </button>

                <div className="crypto-footer">
                    <p>Powered by Coinbase Commerce</p>
                    <p className="crypto-note">You'll be redirected to complete payment</p>
                </div>
            </div>
        </div>
    );
}
