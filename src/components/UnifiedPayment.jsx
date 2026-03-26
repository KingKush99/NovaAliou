import { useState } from 'react';
import { RiCloseLine, RiBankCardLine, RiBitCoinLine, RiAppleFill } from 'react-icons/ri';
import { Capacitor } from '@capacitor/core';
import { getPurchasesController } from '../utils/purchases';
import { getProductIdForStoreItem } from '../config/iapProducts';
import StripePayment from './StripePayment';
import CryptoPayment from './CryptoPayment';
import './UnifiedPayment.css';

export default function UnifiedPayment({ amount, onSuccess, onClose, productType = 'coins', productId = 'coins-1' }) {
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const isIOS = Capacitor.getPlatform() === 'ios';

    const handleApplePay = async () => {
        setIsPurchasing(true);
        try {
            const purchases = await getPurchasesController();
            const storeProductId = getProductIdForStoreItem(productType, productId);
            if (!storeProductId) throw new Error(`No App Store product ID found for ${productType}:${productId}`);

            await purchases.purchaseProductId(storeProductId);
            onSuccess();
        } catch (err) {
            // USER_CANCELLED is not an error — just close silently
            if (err?.code === 'USER_CANCELLED' || err?.message?.includes('USER_CANCELLED')) {
                return;
            }
            console.error('Apple IAP failed:', err);
            alert(`Purchase failed: ${err?.message || 'Please try again.'}`);
        } finally {
            setIsPurchasing(false);
        }
    };

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
                    {!isIOS ? (
                        <>
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
                        </>
                    ) : (
                        <button
                            className="payment-method-btn"
                            style={{ borderColor: '#000', background: 'rgba(255,255,255,0.1)', opacity: isPurchasing ? 0.6 : 1 }}
                            onClick={handleApplePay}
                            disabled={isPurchasing}
                        >
                            <div className="method-icon" style={{ background: '#000', color: '#fff' }}>
                                <RiAppleFill size={32} />
                            </div>
                            <div className="method-info">
                                <h3>{isPurchasing ? 'Processing…' : 'Apple Pay (In-App Purchase)'}</h3>
                                <p>App Store Secure Checkout</p>
                                <span className="method-badge" style={{ background: '#000', color: '#fff', borderColor: '#333' }}>Native</span>
                            </div>
                            <div className="method-arrow">→</div>
                        </button>
                    )}
                </div>

                <div className="selector-footer">
                    <p>🔒 All payments are secure and encrypted</p>
                </div>
            </div>
        </div>
    );
}
