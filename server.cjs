const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Stripe setup
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Coinbase Commerce setup (only if API key is provided)
let Charge = null;
if (process.env.COINBASE_COMMERCE_API_KEY) {
    try {
        const coinbase = require('coinbase-commerce-node');
        const Client = coinbase.Client;
        Client.init(process.env.COINBASE_COMMERCE_API_KEY);
        Charge = coinbase.resources.Charge;
        console.log('✅ Coinbase Commerce initialized');
    } catch (error) {
        console.warn('⚠️  Coinbase Commerce not available:', error.message);
    }
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Payment server running' });
});

// Serve Static Frontend Files
const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));

// Stripe: Create payment intent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: metadata || {},
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Coinbase Commerce: Create crypto charge
app.post('/create-crypto-charge', async (req, res) => {
    if (!Charge) {
        return res.status(503).json({
            error: 'Crypto payments not configured. Add COINBASE_COMMERCE_API_KEY to .env'
        });
    }

    try {
        const { amount, currency = 'USD', description, metadata } = req.body;

        const chargeData = {
            name: description || 'Coin Package',
            description: 'NoveltyCams Purchase',
            local_price: {
                amount: amount.toString(),
                currency: currency
            },
            pricing_type: 'fixed_price',
            redirect_url: `${req.headers.origin}/payment-success`,
            cancel_url: `${req.headers.origin}/store`,
            metadata: metadata || {}
        };

        const charge = await Charge.create(chargeData);

        res.json({
            id: charge.id,
            hosted_url: charge.hosted_url,
            code: charge.code,
            addresses: charge.addresses
        });
    } catch (error) {
        console.error('Coinbase error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Handle SPA Routing (Index.html for all non-API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`💰 Payment server running on port ${PORT}`);
    console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
});
