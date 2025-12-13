import { io } from 'socket.io-client';

class StreamingController {
    constructor() {
        this.socket = null;
        this.peerConnection = null;
        this.localStream = null;
        this.serverUrl = import.meta.env.VITE_STREAM_SERVER_URL || 'http://localhost:3002';
        this.iceServers = [
            { urls: 'stun:stun.l.google.com:19302' },
            {
                urls: import.meta.env.VITE_TURN_SERVER_URL || 'turn:openrelay.metered.ca:80',
                username: import.meta.env.VITE_TURN_USERNAME || 'openrelayproject',
                credential: import.meta.env.VITE_TURN_CREDENTIAL || 'openrelayproject'
            }
        ];
    }

    connect() {
        if (!this.socket) {
            this.socket = io(this.serverUrl);
            console.log('✅ Connected to streaming server');
        }
        return this.socket;
    }

    async startStream(streamId, streamerName) {
        this.connect();

        try {
            // Get user media
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });

            this.socket.emit('start-stream', { streamId, streamerName });

            // Listen for viewers
            this.socket.on('viewer-joined', async ({ viewerId }) => {
                await this.createPeerConnection(viewerId, true);
            });

            return this.localStream;
        } catch (error) {
            console.error('Failed to start stream:', error);
            throw error;
        }
    }

    async joinStream(streamId, viewerId) {
        this.connect();
        this.socket.emit('join-stream', { streamId, viewerId });

        return new Promise((resolve, reject) => {
            this.socket.on('offer', async ({ from, offer }) => {
                const remoteStream = await this.createPeerConnection(from, false);

                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await this.peerConnection.createAnswer();
                await this.peerConnection.setLocalDescription(answer);

                this.socket.emit('answer', { to: from, answer });
                resolve(remoteStream);
            });

            this.socket.on('error', (error) => {
                reject(error);
            });
        });
    }

    async createPeerConnection(peerId, isOfferer) {
        this.peerConnection = new RTCPeerConnection({ iceServers: this.iceServers });

        if (isOfferer && this.localStream) {
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
        }

        const remoteStream = new MediaStream();

        this.peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            });
        };

        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit('ice-candidate', { to: peerId, candidate: event.candidate });
            }
        };

        this.socket.on('ice-candidate', async ({ from, candidate }) => {
            if (from === peerId) {
                await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        if (isOfferer) {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            this.socket.emit('offer', { to: peerId, offer });
        }

        return remoteStream;
    }

    sendMessage(streamId, message, sender) {
        if (this.socket) {
            this.socket.emit('stream-message', { streamId, message, sender });
        }
    }

    onMessage(callback) {
        if (this.socket) {
            this.socket.on('stream-message', callback);
        }
    }

    endStream(streamId) {
        if (this.socket) {
            this.socket.emit('end-stream', streamId);
        }
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const streamingController = new StreamingController();
