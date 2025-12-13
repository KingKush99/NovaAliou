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

const rooms = new Map();
const messages = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ roomId, userId, userName }) => {
        socket.join(roomId);
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
            messages.set(roomId, []);
        }
        rooms.get(roomId).add({ socketId: socket.id, userId, userName });

        // Send message history
        socket.emit('message-history', messages.get(roomId) || []);

        // Notify others
        socket.to(roomId).emit('user-joined', { userId, userName });
        console.log(`${userName} joined room ${roomId}`);
    });

    socket.on('send-message', ({ roomId, message, sender, senderName }) => {
        const msg = {
            id: Date.now(),
            text: message,
            sender,
            senderName,
            timestamp: new Date().toISOString()
        };

        if (messages.has(roomId)) {
            messages.get(roomId).push(msg);
        }

        io.to(roomId).emit('receive-message', msg);
    });

    socket.on('typing', ({ roomId, userName }) => {
        socket.to(roomId).emit('user-typing', { userName });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        rooms.forEach((users, roomId) => {
            const user = Array.from(users).find(u => u.socketId === socket.id);
            if (user) {
                users.delete(user);
                socket.to(roomId).emit('user-left', { userId: user.userId, userName: user.userName });
            }
        });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`✅ Chat server running on port ${PORT}`);
});
