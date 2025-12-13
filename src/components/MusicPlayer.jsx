import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMusicFill, RiFolderMusicFill, RiCloseLine, RiPlayFill, RiPauseFill, RiSkipForwardFill, RiSkipBackFill } from 'react-icons/ri';
import './MusicPlayer.css';

export default function MusicPlayer({ onClose }) {
    const [title, setTitle] = useState('No Music Selected');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFolderSelect = (e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('audio/'));
        if (files.length > 0) {
            const newPlaylist = files.map(file => ({
                name: file.name.replace(/\.[^/.]+$/, ""),
                url: URL.createObjectURL(file), // Create blob URL for local playback
                file: file
            }));
            setPlaylist(newPlaylist);
            setCurrentIndex(0);
            playTrack(newPlaylist[0]);
        } else {
            alert('No audio files found in this folder!');
        }
    };

    const playTrack = (track) => {
        if (!track) return;
        setTitle(track.name);
        if (audioRef.current) {
            audioRef.current.src = track.url;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        if (playlist.length === 0) return;
        const next = (currentIndex + 1) % playlist.length;
        setCurrentIndex(next);
        playTrack(playlist[next]);
    };

    const prevTrack = () => {
        if (playlist.length === 0) return;
        const prev = (currentIndex - 1 + playlist.length) % playlist.length;
        setCurrentIndex(prev);
        playTrack(playlist[prev]);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    return (
        <div className="music-player-overlay">
            <motion.div
                className="music-player-card"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Allow dragging but snap back or limit? 
                // Actually users usually want to move it. Let's allow free drag.
                dragElastic={0.2}
            >
                <div className="player-header">
                    <RiMusicFill className="music-icon-header" />
                    <span>Music Player</span>
                    <button onClick={onClose} className="close-player-btn"><RiCloseLine /></button>
                </div>

                <div className="track-info">
                    <div className="track-art">🎵</div>
                    <div className="track-details">
                        <div className="track-title-scroll">
                            <span>{title}</span>
                        </div>
                        <div className="track-time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>
                </div>

                <div className="progress-bar-container" onClick={(e) => {
                    const width = e.target.clientWidth;
                    const clickX = e.nativeEvent.offsetX;
                    const time = (clickX / width) * duration;
                    audioRef.current.currentTime = time;
                }}>
                    <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                </div>

                <div className="player-controls">
                    <button onClick={() => fileInputRef.current?.click()} className="folder-btn">
                        <RiFolderMusicFill />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        webkitdirectory=""
                        directory=""
                        multiple
                        onChange={handleFolderSelect}
                    />

                    <button onClick={prevTrack}><RiSkipBackFill /></button>
                    <button onClick={togglePlay} className="play-btn-large">
                        {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                    </button>
                    <button onClick={nextTrack}><RiSkipForwardFill /></button>
                </div>

                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={nextTrack}
                    onError={(e) => console.log("Audio Error", e)}
                />
            </motion.div>
        </div>
    );
}
