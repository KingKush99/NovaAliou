const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const streams = new Map(); // streamId -> streamerId
const viewers = new Map(); // streamId -> Set of viewerIds

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Broadcaster starts stream
    socket.on('start-stream', ({ streamId, streamerName }) => {
        streams.set(streamId, { socketId: socket.id, name: streamerName });
        viewers.set(streamId, new Set());
        socket.join(streamId);
        console.log(`🎥 Stream ${streamId} started by ${streamerName}`);
    });

    // Viewer joins stream
    socket.on('join-stream', ({ streamId, viewerId }) => {
        const stream = streams.get(streamId);
        if (!stream) {
            socket.emit('error', { message: 'Stream not found' });
            return;
        }

        socket.join(streamId);
        viewers.get(streamId).add(socket.id);

        // Notify broadcaster of new viewer
        socket.to(stream.socketId).emit('viewer-joined', { viewerId: socket.id });
        console.log(`👀 Viewer ${socket.id} joined stream ${streamId}`);
    });

    // WebRTC signaling
    socket.on('offer', ({ to, offer }) => {
        socket.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }) => {
        socket.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
        socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    // Stream chat
    socket.on('stream-message', ({ streamId, message, sender }) => {
        io.to(streamId).emit('stream-message', {
            id: Date.now(),
            text: message,
            sender,
            timestamp: new Date().toISOString()
        });
    });

    // Handle Gifts & Payouts (40% to Model, 30% to Platform, 30% to App Store)
    socket.on('send-gift', ({ streamId, senderName, giftName, coinCost }) => {
        const stream = streams.get(streamId);
        if (stream) {
            // Model gets 40% of the coin value as Diamonds
            const diamondValue = Math.floor(coinCost * 0.40);

            // Notify the room (Visuals)
            io.to(streamId).emit('gift-received', {
                senderName,
                giftName,
                coinCost,
                timestamp: new Date().toISOString()
            });

            // Notify the Streamer (Wallet Update) - Private Message
            io.to(stream.socketId).emit('payout-update', {
                amount: diamondValue,
                source: 'gift',
                from: senderName
            });

            console.log(`🎁 Gift: ${senderName} sent ${giftName} (${coinCost} coins) to ${stream.name}. Payout: ${diamondValue} diamonds (40%).`);
        }
    });

    // End stream
    socket.on('end-stream', (streamId) => {
        io.to(streamId).emit('stream-ended');
        streams.delete(streamId);
        viewers.delete(streamId);
        console.log(`Stream ${streamId} ended`);
    });

    socket.on('disconnect', () => {
        // Check if disconnected user was a broadcaster
        streams.forEach((stream, streamId) => {
            if (stream.socketId === socket.id) {
                io.to(streamId).emit('stream-ended');
                streams.delete(streamId);
                viewers.delete(streamId);
                console.log(`Stream ${streamId} ended (broadcaster disconnected)`);
            }
        });

        // Remove from viewers
        viewers.forEach((viewerSet, streamId) => {
            viewerSet.delete(socket.id);
        });

        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`✅ Streaming server running on port ${PORT}`);
});
