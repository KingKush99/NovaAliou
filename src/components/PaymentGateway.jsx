import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiSecurePaymentFill, RiCloseLine } from 'react-icons/ri';
import './PaymentGateway.css';

export default function PaymentGateway({ amount, onSuccess, onClose }) {
    const [processing, setProcessing] = useState(false);

    const handlePay = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="payment-overlay">
            <motion.div
                className="payment-modal"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="payment-header">
                    <h3><RiSecurePaymentFill /> Secure Checkout</h3>
                    <button onClick={onClose}><RiCloseLine /></button>
                </div>

                <div className="payment-amount">
                    Total: <span>${amount}</span>
                </div>

                <form onSubmit={handlePay} className="payment-form">
                    <div className="form-group">
                        <label>Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Expiry</label>
                            <input type="text" placeholder="MM/YY" maxLength="5" required />
                        </div>
                        <div className="form-group">
                            <label>CVC</label>
                            <input type="text" placeholder="123" maxLength="3" required />
                        </div>
                    </div>
                    <button type="submit" className="pay-btn" disabled={processing}>
                        {processing ? 'Processing...' : `Pay $${amount}`}
                    </button>
                </form>

                <div className="payment-footer">
                    Powered by Stripe (Mock)
                </div>
            </motion.div>
        </div>
    );
}
