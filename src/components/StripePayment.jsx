import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { RiCloseLine, RiSecurePaymentFill } from 'react-icons/ri';
import Button from './Button';
import { getApiUrl } from '../utils/config';
import './StripePayment.css';

// Use environment variable or mock key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

const CheckoutForm = ({ onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            // 1. Create Payment Intent
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 1250, currency: 'usd' }) // Example amount, should be prop
            });

            if (!response.ok) throw new Error('Failed to start payment');

            const { clientSecret } = await response.json();

            // 2. Confirm Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: 'NoveltyCams User', // Ideally prompt for this
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    onSuccess();
                }
            }
        } catch (err) {
            console.error('Payment failed', err);
            setError('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="checkout-form-container">
            <div className="payment-methods">
                <button className="mobile-pay-btn apple-pay" type="button" onClick={() => alert("Apple Pay Mock")}>
                    <span> Pay</span>
                </button>
                <button className="mobile-pay-btn google-pay" type="button" onClick={() => alert("Google Pay Mock")}>
                    <span>G Pay</span>
                </button>
            </div>

            <div className="divider">
                <span>Or pay with card</span>
            </div>

            <form onSubmit={handleSubmit} className="stripe-form">
                <div className="card-element-container">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#ffffff',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }} />
                </div>
                {error && <div className="stripe-error">{error}</div>}
                <Button type="submit" disabled={!stripe || processing} className="pay-btn">
                    {processing ? 'Processing...' : 'Pay Now'}
                </Button>
            </form>
        </div>
    );
};

export default function StripePayment({ onClose, onSuccess }) {
    return (
        <div className="stripe-modal-overlay">
            <motion.div
                className="stripe-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="stripe-header">
                    <h3><RiSecurePaymentFill /> Secure Payment</h3>
                    <button onClick={onClose}><RiCloseLine /></button>
                </div>
                <div className="stripe-body">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm onSuccess={onSuccess} onClose={onClose} />
                    </Elements>
                </div>
            </motion.div>
        </div>
    );
}
