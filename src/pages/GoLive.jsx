import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCameraSwitchLine, RiMicLine, RiMicOffLine, RiArrowLeftLine, RiBroadcastFill } from 'react-icons/ri';
import Header from '../components/Header';
import Button from '../components/Button';
import './GoLive.css';

export default function GoLive() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [title, setTitle] = useState('');
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    useEffect(() => {
        // Start Camera Mock
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error("Camera Error:", err));
        }
    }, []);

    const handleStartStream = () => {
        if (!title.trim()) {
            alert("Please enter a stream title!");
            return;
        }
        // Simulate starting stream and redirect to StreamRoom as Host
        // For now, we just go to a mock room
        navigate(`/stream/my-stream-${Date.now()}?host=true`);
    };

    return (
        <div className="go-live-page">
            <Header
                title="Go Live"
                showBack
                onBack={() => navigate('/streams')}
            />

            <div className="camera-preview">
                <video ref={videoRef} autoPlay playsInline muted className="preview-video" />
                <div className="preview-overlay">
                    <div className="input-group-transparent">
                        <input
                            type="text"
                            placeholder="Add a title to your stream..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="stream-title-input"
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
