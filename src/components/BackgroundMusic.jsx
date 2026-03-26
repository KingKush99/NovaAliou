import { useState, useEffect, useRef } from 'react';
import { RiVolumeUpLine, RiVolumeMuteLine, RiPlayLine, RiPauseLine, RiSkipBackLine, RiSkipForwardLine, RiRepeatLine, RiShuffleLine } from 'react-icons/ri';
import './BackgroundMusic.css';

export default function BackgroundMusic() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [isMuted, setIsMuted] = useState(false);
    const [hasUserStartedMusic, setHasUserStartedMusic] = useState(false); // Only show bar if user clicked play
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    // Hide music player on onboarding and start screen
    const hiddenPaths = ['/', '/onboarding'];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Only show the bar if user has started music AND not on hidden paths
    if (hiddenPaths.includes(currentPath) || !hasUserStartedMusic) {
        return null;
    }

    // Remove auto-play - user must explicitly start music
    // (No auto-interaction listeners)

    // Update audio volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Update time
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
                setHasUserStartedMusic(true); // Show bar when user starts playing
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0) setIsMuted(false);
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="music-player-bar">
            <audio
                ref={audioRef}
                src="/audio/background.wav"
                loop={isRepeat}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Left: Playback Controls */}
            <div className="player-controls-left">
                <button
                    className={`control-btn ${isShuffle ? 'active' : ''}`}
                    onClick={() => setIsShuffle(!isShuffle)}
                    title="Shuffle"
                >
                    <RiShuffleLine size={18} />
                </button>
                <button className="control-btn" title="Previous">
                    <RiSkipBackLine size={20} />
                </button>
                <button className="control-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? <RiPauseLine size={24} /> : <RiPlayLine size={24} />}
                </button>
                <button className="control-btn" title="Next">
                    <RiSkipForwardLine size={20} />
                </button>
                <button
                    className={`control-btn ${isRepeat ? 'active' : ''}`}
                    onClick={() => setIsRepeat(!isRepeat)}
                    title="Repeat"
                >
                    <RiRepeatLine size={18} />
                </button>
            </div>

            {/* Center: Progress Bar */}
            <div className="player-progress-section">
                <div className="progress-container">
                    <span className="time-label">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="progress-bar"
                    />
                    <span className="time-label">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume & Extras */}
            <div className="player-controls-right">
                <button className="control-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted ? <RiVolumeMuteLine size={20} /> : <RiVolumeUpLine size={20} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                />
            </div>
        </div>
    );
}
