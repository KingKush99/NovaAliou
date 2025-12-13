import { useState } from 'react';
import { RiCloseLine, RiBankCardLine, RiBitCoinLine } from 'react-icons/ri';
import StripePayment from './StripePayment';
import CryptoPayment from './CryptoPayment';
import './UnifiedPayment.css';

export default function UnifiedPayment({ amount, onSuccess, onClose }) {
    const [paymentMethod, setPaymentMethod] = useState(null);

    if (paymentMethod === 'card') {
        return <StripePayment amount={amount} onSuccess={onSuccess} onClose={onClose} />;
    }

    if (paymentMethod === 'crypto') {
        return <CryptoPayment amount={amount} onSuccess={onSuccess} onClose={onClose} />;
    }

    // Payment method selector
    return (
        <div className="payment-overlay" onClick={onClose}>
            <div className="payment-selector-modal" onClick={(e) => e.stopPropagation()}>
                <button className="payment-close" onClick={onClose}>
                    <RiCloseLine />
                </button>

                <div className="selector-header">
                    <h2>Choose Payment Method</h2>
                    <p className="selector-amount">${amount.toFixed(2)}</p>
                </div>

                <div className="payment-methods">
                    <button
                        className="payment-method-btn card-btn"
                        onClick={() => setPaymentMethod('card')}
                    >
                        <div className="method-icon">
                            <RiBankCardLine size={32} />
                        </div>
                        <div className="method-info">
                            <h3>Credit/Debit Card</h3>
                            <p>Visa, Mastercard, Amex</p>
                            <span className="method-badge">Instant</span>
                        </div>
                        <div className="method-arrow">→</div>
                    </button>

                    <button
                        className="payment-method-btn crypto-btn"
                        onClick={() => setPaymentMethod('crypto')}
                    >
                        <div className="method-icon crypto">
                            <RiBitCoinLine size={32} />
                        </div>
                        <div className="method-info">
                            <h3>Cryptocurrency</h3>
                            <p>Bitcoin, Ethereum, USDC</p>
                            <span className="method-badge crypto">Secure</span>
                        </div>
                        <div className="method-arrow">→</div>
                    </button>
                </div>

                <div className="selector-footer">
                    <p>🔒 All payments are secure and encrypted</p>
                </div>
            </div>
        </div>
    );
}
