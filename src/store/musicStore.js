import { create } from 'zustand';

// Hardcoded playlists from user's music folders
export const INSTRUMENTALS = [
    { name: "Lover's Quarrel", url: '/audio/music/instrumental/Lover\'s Quarrel.wav', cover: '/images/covers/lovers_quarrel.png' },
    { name: 'Ruby Haze', url: '/audio/music/instrumental/Ruby Haze.wav', cover: '/images/covers/ruby_haze.png' },
    { name: 'Sunshine Kisses', url: '/audio/music/instrumental/Sunshine Kisses.wav', cover: '/images/covers/sunshine_kisses.png' },
    { name: 'Velvet Pulse', url: '/audio/music/instrumental/Velvet Pulse.wav', cover: '/images/covers/velvet_pulse.png' }
];

export const VOCALS = [
    { name: 'After Midnight', url: '/audio/music/lyrics/After Midnight.wav', cover: '/images/covers/after_midnight.png' },
    { name: 'Backseat', url: '/audio/music/lyrics/Backseat.wav', cover: '/images/covers/backseat.png' },
    { name: 'Crave You', url: '/audio/music/lyrics/Crave You.wav', cover: '/images/covers/crave_you.png' },
    { name: 'Crimson Room', url: '/audio/music/lyrics/Crimson Room.wav', cover: '/images/covers/crimson_room.png' },
    { name: 'Feverline', url: '/audio/music/lyrics/Feverline.wav', cover: '/images/covers/feverline.png' },
    { name: 'Hands On', url: '/audio/music/lyrics/Hands On.wav', cover: '/images/covers/hands_on.png' },
    { name: 'Heat Check', url: '/audio/music/lyrics/Heat Check.wav', cover: '/images/covers/heat_check.png' },
    { name: 'Lights Low', url: '/audio/music/lyrics/Lights Low.wav', cover: '/images/covers/lights_low.png' },
    { name: 'Night Silk', url: '/audio/music/lyrics/Night Silk.wav', cover: '/images/covers/night_silk.png' },
    { name: 'Pine', url: '/audio/music/lyrics/Pine.wav', cover: '/images/covers/pine.png' },
    { name: 'Pressure', url: '/audio/music/lyrics/Pressure.wav', cover: '/images/covers/pressure.png' },
    { name: 'Private Room', url: '/audio/music/lyrics/Private Room.wav', cover: '/images/covers/private_room.png' },
    { name: 'Pull Me In', url: '/audio/music/lyrics/Pull Me In.wav', cover: '/images/covers/pull_me_in.png' },
    { name: 'Rush', url: '/audio/music/lyrics/Rush.wav', cover: '/images/covers/rush.png' },
    { name: 'Sweet Like Mine', url: '/audio/music/lyrics/Sweet Like Mine.wav', cover: '/images/covers/sweet_like_mine.png' },
    { name: 'Tokens', url: '/audio/music/lyrics/Tokens.wav', cover: '/images/covers/tokens.png' },
    { name: 'VIP', url: '/audio/music/lyrics/VIP.wav', cover: '/images/covers/vip.png' }
];

export const PLAYLIST_TABS = [
    { id: 'instrumentals', label: 'Instrumentals', tracks: INSTRUMENTALS },
    { id: 'vocals', label: 'Vocals', tracks: VOCALS }
];

export const useMusicStore = create((set, get) => ({
    isPlaying: false,
    currentTrack: null,
    playlist: INSTRUMENTALS, // Default
    currentIndex: 0,
    activeTab: 'instrumentals',
    currentTime: 0,
    duration: 0,
    volume: 1.0,

    // Actions
    setPlaylist: (list) => set({ playlist: list }),

    setTab: (tabId) => {
        const tab = PLAYLIST_TABS.find(t => t.id === tabId);
        if (tab) {
            set({
                activeTab: tabId,
                playlist: tab.tracks,
                // Optional: Don't stop playing immediately if switching tabs, only if selecting song?
                // But user expects list to change. 
                // We'll keep current track playing even if list changes, until they pick a new one.
            });
        }
    },

    playTrack: (track, index) => set({
        currentTrack: track,
        currentIndex: index,
        isPlaying: true
    }),

    togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),

    setIsPlaying: (status) => set({ isPlaying: status }),

    nextTrack: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length === 0) return;
        const next = (currentIndex + 1) % playlist.length;
        set({
            currentIndex: next,
            currentTrack: playlist[next],
            isPlaying: true
        });
    },

    prevTrack: () => {
        const { playlist, currentIndex } = get();
        if (playlist.length === 0) return;
        const prev = (currentIndex - 1 + playlist.length) % playlist.length;
        set({
            currentIndex: prev,
            currentTrack: playlist[prev],
            isPlaying: true
        });
    },

    updateTime: (time, duration) => set({ currentTime: time, duration: duration }),

    setVolume: (vol) => set({ volume: vol })
}));
