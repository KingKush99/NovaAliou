import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiMusicFill, RiFolderMusicFill, RiCloseLine, RiPlayFill, RiPauseFill, RiSkipForwardFill, RiSkipBackFill } from 'react-icons/ri';
import { useMusicStore, PLAYLIST_TABS } from '../store/musicStore';
import './MusicPlayer.css';

export default function MusicPlayer({ onClose }) {
    const {
        currentTrack,
        isPlaying,
        playlist,
        activeTab,
        currentTime,
        duration,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        setPlaylist,
        setTab,
        updateTime
    } = useMusicStore();

    const fileInputRef = useRef(null);

    // Load manually selected files
    const handleFolderSelect = (e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('audio/'));
        if (files.length > 0) {
            const newPlaylist = files.map(file => ({
                name: file.name.replace(/\.[^/.]+$/, ""),
                url: URL.createObjectURL(file),
                file: file
            }));
            setPlaylist(newPlaylist);
            playTrack(newPlaylist[0], 0);
        } else {
            alert('No audio files found in this folder!');
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
                dragElastic={0.2}
            >
                <div className="player-header">
                    <RiMusicFill className="music-icon-header" />
                    <span>Music Player</span>
                    <button onClick={onClose} className="close-player-btn"><RiCloseLine /></button>
                </div>

                {/* Playlist Tabs */}
                <div className="playlist-tabs">
                    {PLAYLIST_TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`playlist-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Song List */}
                <div className="song-list-scroll">
                    {playlist.map((track, i) => (
                        <div
                            key={i}
                            className={`song-item ${currentTrack?.name === track.name ? 'playing' : ''}`}
                            onClick={() => playTrack(track, i)}
                        >
                            <span className="song-idx">{i + 1}</span>
                            <span className="song-name">{track.name}</span>
                            {currentTrack?.name === track.name && isPlaying && <span className="playing-indicator">Last Playing 🎵</span>}
                        </div>
                    ))}
                </div>

                <div className="track-info">
                    <div className="track-art">🎵</div>
                    <div className="track-details">
                        <div className="track-title-scroll">
                            <span>{currentTrack?.name || 'Select a track'}</span>
                        </div>
                        <div className="track-time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>
                </div>

                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                </div>

                <div className="player-controls">
                    <button onClick={() => fileInputRef.current?.click()} className="folder-btn" title="Load music from folder">
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

                <p className="music-hint">
                    Upload your music to: <code>public/music/{activeTab}</code>
                </p>
            </motion.div>
        </div>
    );
}
