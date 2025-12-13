import { io } from 'socket.io-client';

class ChatSocket {
    constructor() {
        this.socket = null;
        this.serverUrl = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3001';
    }

    connect() {
        if (!this.socket) {
            this.socket = io(this.serverUrl);

            this.socket.on('connect', () => {
                console.log('✅ Connected to chat server');
            });

            this.socket.on('disconnect', () => {
                console.log('❌ Disconnected from chat server');
            });
        }
        return this.socket;
    }

    joinRoom(roomId, userId, userName) {
        if (!this.socket) this.connect();
        this.socket.emit('join-room', { roomId, userId, userName });
    }

    sendMessage(roomId, message, sender, senderName) {
        if (!this.socket) this.connect();
        this.socket.emit('send-message', { roomId, message, sender, senderName });
    }

    onReceiveMessage(callback) {
        if (!this.socket) this.connect();
        this.socket.on('receive-message', callback);
    }

    onMessageHistory(callback) {
        if (!this.socket) this.connect();
        this.socket.on('message-history', callback);
    }

    onUserJoined(callback) {
        if (!this.socket) this.connect();
        this.socket.on('user-joined', callback);
    }

    onUserLeft(callback) {
        if (!this.socket) this.connect();
        this.socket.on('user-left', callback);
    }

    typing(roomId, userName) {
        if (!this.socket) this.connect();
        this.socket.emit('typing', { roomId, userName });
    }

    onUserTyping(callback) {
        if (!this.socket) this.connect();
        this.socket.on('user-typing', callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const chatSocket = new ChatSocket();
