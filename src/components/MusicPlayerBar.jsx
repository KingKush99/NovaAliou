import { useRef, useEffect } from 'react';
import { useMusicStore } from '../store/musicStore';
import { RiPlayFill, RiPauseFill, RiSkipBackFill, RiSkipForwardFill, RiHeartLine, RiRepeatLine, RiShuffleLine, RiVolumeUpLine } from 'react-icons/ri';
import './MusicPlayerBar.css';

export default function MusicPlayerBar() {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        nextTrack,
        prevTrack,
        currentTime,
        duration,
        updateTime,
        setIsPlaying
    } = useMusicStore();

    const audioRef = useRef(null);

    // Handle Metadata & Time Updates
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            updateTime(audioRef.current.currentTime, audioRef.current.duration || 0);
        }
    };

    // Handle Track Change
    useEffect(() => {
        if (currentTrack && audioRef.current) {
            // Only update src if it's different to prevent reloading
            const currentSrc = audioRef.current.getAttribute('src');
            if (currentSrc !== currentTrack.url) {
                audioRef.current.src = currentTrack.url;
                if (isPlaying) {
                    audioRef.current.play().catch(e => console.log("Play error:", e));
                }
            }
        }
    }, [currentTrack]);

    // Handle Play/Pause State
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        if (isPlaying && audioRef.current.paused) {
            audioRef.current.play().catch(e => console.log("Play error:", e));
        } else if (!isPlaying && !audioRef.current.paused) {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrack]);

    const handleProgressBarClick = (e) => {
        if (!audioRef.current) return;
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const time = (clickX / width) * duration;
        audioRef.current.currentTime = time;
        updateTime(time, duration);
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    if (!currentTrack) return null;

    return (
        <div className="music-player-bar">
            {/* Audio Element (Hidden) */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextTrack}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onError={(e) => console.log("Audio Error", e)}
            />

            <div className="bar-content">
                {/* Left: Info */}
                <div className="bar-info">
                    <div className="bar-art">
                        {currentTrack.cover ? <img src={currentTrack.cover} alt="Art" /> : '🎵'}
                    </div>
                    <div className="bar-text">
                        <div className="bar-title">{currentTrack.name}</div>
                        <div className="bar-artist">Unknown Artist</div>
                    </div>
                    <button className="bar-icon-btn"><RiHeartLine /></button>
                </div>

                {/* Center: Controls */}
                <div className="bar-center">
                    <div className="bar-controls">
                        <button className="bar-control-btn small"><RiShuffleLine /></button>
                        <button className="bar-control-btn" onClick={prevTrack}><RiSkipBackFill /></button>
                        <button className="bar-play-btn" onClick={togglePlay}>
                            {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                        </button>
                        <button className="bar-control-btn" onClick={nextTrack}><RiSkipForwardFill /></button>
                        <button className="bar-control-btn small"><RiRepeatLine /></button>
                    </div>
                    <div className="bar-progress-row">
                        <span className="time-text">{formatTime(currentTime)}</span>
                        <div className="bar-progress-container" onClick={handleProgressBarClick}>
                            <div className="bar-progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                        </div>
                        <span className="time-text">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Tools */}
                <div className="bar-tools">
                    <button className="bar-icon-btn"><RiVolumeUpLine /></button>
                    <div className="volume-slider"></div>
                </div>
            </div>
        </div>
    );
}
