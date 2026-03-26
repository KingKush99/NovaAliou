const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Stripe setup
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    try {
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        console.log('✅ Stripe initialized');
    } catch (error) {
        console.warn('⚠️  Stripe initialization failed:', error.message);
    }
} else {
    console.warn('⚠️  Stripe secret key not found in .env');
}

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

const path = require('path');
const fs = require('fs');

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Payment server running' });
});

// Real Leaderboard Data Persistence (Mental/File-based for now)
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard_data.json');

const getLeaderboard = () => {
    if (fs.existsSync(LEADERBOARD_FILE)) {
        return JSON.parse(fs.readFileSync(LEADERBOARD_FILE, 'utf8'));
    }
    // Initial Seed Data
    const seed = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        rank: i + 1,
        name: [`Star${i}`, `User${i}`, `Queen${i}`, `King${i}`][i % 4] + (i * 7),
        coins: Math.floor(Math.random() * 500000) + 10000,
        matches: Math.floor(Math.random() * 200) + 5,
        avatar: `https://i.pravatar.cc/150?u=${i}`
    })).sort((a, b) => b.coins - a.coins);

    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(seed));
    return seed;
};

app.get('/api/leaderboard', (req, res) => {
    const type = String(req.query.type || 'donator').toLowerCase();
    const data = getLeaderboard();

    const sorted = [...data].sort((a, b) => {
        if (type === 'matches') return (b.matches || 0) - (a.matches || 0);
        // "model" and "donator" both currently rank by coins until we have separate metrics.
        return (b.coins || 0) - (a.coins || 0);
    }).map((u, i) => ({ ...u, rank: i + 1 }));

    res.json(sorted);
});

app.post('/api/leaderboard/update', (req, res) => {
    const { name, coins, id, avatar } = req.body;
    let data = getLeaderboard();

    const userIndex = data.findIndex(u => u.name === name || u.id === id);
    if (userIndex !== -1) {
        data[userIndex].coins = coins;
        data[userIndex].avatar = avatar || data[userIndex].avatar;
    } else {
        data.push({
            id: id || Date.now(),
            name,
            coins,
            avatar: avatar || 'https://i.pravatar.cc/150',
            rank: data.length + 1,
            matches: 0
        });
    }

    // Resort
    data.sort((a, b) => b.coins - a.coins);
    // Update ranks
    data = data.map((u, i) => ({ ...u, rank: i + 1 }));

    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data));
    res.json({ success: true, data });
});

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, 'dist')));

// Stripe: Create payment intent
app.post('/create-payment-intent', async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: 'Stripe payments not configured' });
    }
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

// SPA fallback (Express 5 doesn't accept '*' as a route pattern)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`💰 Payment server running on port ${PORT}`);
    console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
});
