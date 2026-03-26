import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCameraSwitchLine, RiMicLine, RiMicOffLine, RiArrowLeftLine, RiBroadcastFill } from 'react-icons/ri';
import Header from '../components/Header';
import Button from '../components/Button';
import { useUserStore } from '../store/userStore';
import './GoLive.css';

export default function GoLive() {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const videoRef = useRef(null);
    const [title, setTitle] = useState('');
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [cameraError, setCameraError] = useState(null);

    useEffect(() => {
        // Start Camera
        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setCameraError(null);
                }
            } catch (err) {
                console.error("Camera Error:", err);
                setCameraError("Camera access denied. Please enable camera and microphone permissions to go live.");
            }
        };
        startCamera();
    }, []);

    const handleStartStream = () => {
        if (!title.trim()) {
            alert("Please enter a stream title!");
            return;
        }
        // Create a unique stream ID that includes the user's ID so StreamRoom can identify them as host
        const streamId = `${user.id}-${Date.now()}`;
        sessionStorage.setItem('isStreamer', streamId); // Use streamId as token
        navigate(`/stream/${streamId}?host=true`);
    };

    return (
        <div className="go-live-page">
            <Header
                title="Go Live"
                showBack
                onBack={() => navigate('/streams')}
            />

            <div className="camera-preview">
                {cameraError ? (
                    <div className="camera-error">
                        <RiCameraSwitchLine size={64} />
                        <p>{cameraError}</p>
                        <button onClick={() => window.location.reload()}>Retry</button>
                    </div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline muted className="preview-video" />
                )}
                <div className="preview-overlay">
                    <div className="title-input-card">
                        <label className="input-label">Stream Title</label>
                        <input
                            type="text"
                            placeholder="Type your stream title here..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="stream-title-input"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="camera-controls">
                    <button className="control-btn" onClick={() => setIsMicOn(!isMicOn)}>
                        {isMicOn ? <RiMicLine /> : <RiMicOffLine />}
                    </button>
                    <button className="control-btn" onClick={() => setIsCameraOn(!isCameraOn)}>
                        <RiCameraSwitchLine />
                    </button>
                </div>
            </div>

            <div className="go-live-footer">
                <Button variant="primary" size="large" fullWidth onClick={handleStartStream}>
                    <RiBroadcastFill style={{ marginRight: 8 }} />
                    Start Broadcast
                </Button>
            </div>
        </div>
    );
}
