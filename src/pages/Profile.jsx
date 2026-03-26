import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiSettings4Line, RiEdit2Line, RiLogoutBoxRLine, RiShieldUserLine,
    RiNotification3Line, RiPaletteLine, RiQuestionLine, RiCloseLine,
    RiArrowRightSLine, RiCheckLine, RiSearchLine, RiEyeLine,
    RiUserAddLine, RiMessage3Line, RiImageAddLine, RiShareBoxLine,
    RiArrowLeftLine, RiArrowDownSLine, RiMusicFill, RiUserSmileLine,
    RiShieldFlashLine, RiEditBoxLine, RiTimerLine, RiArrowUpSLine,
    RiUserFollowLine, RiUserUnfollowLine, RiUserHeartLine
} from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import { useHUDStore } from '../store/useHUDStore';
import { useSubscriptionStore, TIERS } from '../store/useSubscriptionStore';
import { useChatStore } from '../store/chatStore';
import { formatRelativeTime } from '../utils/helpers';
import { MOCK_STREAMERS } from '../utils/mockData';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import ContextMenu from '../components/ContextMenu';
import MusicPlayer from '../components/MusicPlayer';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { user, setUser, friendsList, followingList, followersList } = useUserStore();
    const { showChatbot, showMiniSlots, toggleChatbot, toggleMiniSlots } = useHUDStore();
    const { tier } = useSubscriptionStore();
    const { initializeConversation } = useChatStore();

    // Theme Constants
    const isPlatinum = tier === TIERS.PLATINUM;
    const themeClass = isPlatinum ? 'platinum' : 'gold';

    if (!user) return null;

    const [showSettings, setShowSettings] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ...user });
    const [idFile, setIdFile] = useState(null);
    const [verificationStep, setVerificationStep] = useState(0);
    const [generalSearch, setGeneralSearch] = useState('');
    const [statsSearch, setStatsSearch] = useState('');
    const [showToast, setShowToast] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(!userId || userId === String(user.id));
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        if (userId && userId !== String(user.id)) {
            setIsOwnProfile(false);
            const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const mockNames = ['Alice', 'Jessica', 'Raven', 'Luna', 'Sarah', 'Emma', 'Mia', 'Sophie'];
            const mockName = mockNames[seed % mockNames.length] + ((seed % 100).toString());

            setOtherUser({
                id: userId,
                name: mockName,
                username: mockName.toLowerCase().replace(/[^a-z0-9]/g, ''),
                age: 20 + (seed % 15),
                photos: [`https://i.pravatar.cc/300?img=${seed % 70}`],
                bio: 'Just here to have fun! 💖',
                location: { city: 'New York, USA' },
                isVerified: seed % 2 === 0,
                isFollowing: false
            });
        } else {
            setIsOwnProfile(true);
        }
    }, [userId, user.id]);

    const displayUser = isOwnProfile ? user : (otherUser || {});
    const displayName = displayUser.displayName || displayUser.name || 'User';
    const username = displayUser.username || `user${displayUser.id}`;
    
    const calculateAge = (dob) => {
        if (!dob) return 25;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    const age = displayUser.birthDate ? calculateAge(displayUser.birthDate) : (displayUser.age || 25);
    const locationString = displayUser.location?.city || 'Unknown';
    const photoUrl = displayUser.photos?.[0] || 'https://i.pravatar.cc/150?img=68';

    const handleBackNav = () => {
        const idx = window.history?.state?.idx ?? 0;
        if (idx > 0) navigate(-1);
        else navigate('/home');
    };

    const handleMessageUser = () => {
        let targetId = displayUser.id || userId;
        if (!targetId) return;
        const uName = displayUser.displayName || displayUser.name || 'User';
        const uPhoto = displayUser.photos?.[0] || user.photos?.[0];
        initializeConversation(targetId, { name: uName, avatar: uPhoto, isOnline: true });
        navigate(`/chat/${targetId}`);
    };

    const handleFollowUser = () => {
        if (isOwnProfile) return;
        const targetId = displayUser.id || userId;
        const { followUser, unfollowUser, followingList } = useUserStore.getState();
        const isCurrentlyFollowing = followingList.includes(targetId);
        if (isCurrentlyFollowing) unfollowUser(targetId);
        else followUser(targetId);
        setOtherUser(prev => ({ ...prev, isFollowing: !isCurrentlyFollowing }));
    };

    const getRealUsersFromIds = (idArray) => {
        return (idArray || []).map(id => {
            const streamer = MOCK_STREAMERS.find(s => String(s.id) === String(id));
            if (streamer) {
                return {
                    id: String(streamer.id),
                    name: streamer.name.replace('_', ' '),
                    username: streamer.name.toLowerCase().replace(/_/g, ''),
                    avatar: streamer.image
                };
            }
            return {
                id: String(id),
                name: `User ${id}`,
                username: `user${id}`,
                avatar: `https://i.pravatar.cc/150?u=${id}`
            };
        });
    };

    const MOCK_FRIENDS = isOwnProfile ? getRealUsersFromIds(friendsList) : [];
    const MOCK_FOLLOWERS = isOwnProfile ? getRealUsersFromIds(followersList) : [];
    const MOCK_FOLLOWING = isOwnProfile ? getRealUsersFromIds(followingList) : [];

    const handleCameraUpload = async () => {
        try {
            const { CameraController } = await import('../utils/CameraController');
            const dataUrl = await CameraController.pickFromGallery();
            if (dataUrl) {
                const isSafe = Math.random() > 0.1;
                if (!isSafe) { alert("⚠️ Image rejected by AI Safety Filter."); return; }
                const currentPhotos = user.photos || [];
                setUser({ ...user, photos: [dataUrl, ...currentPhotos.slice(1)] });
            }
        } catch (error) { console.error(error); }
    };

    const handleSaveProfile = () => {
        const mockTakenUsernames = ['admin', 'support', 'staff'];
        if (editForm.username !== user.username) {
            if (mockTakenUsernames.includes(editForm.username.toLowerCase())) { alert("⚠️ Username is taken."); return; }
            const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            if (user.lastUsernameChange && (now - user.lastUsernameChange < ONE_WEEK)) { alert("⚠️ Only one change per week."); return; }
            setUser({ ...editForm, lastUsernameChange: now });
        } else setUser(editForm);
        setIsEditing(false);
    };

    const handleVerification = () => {
        if (!idFile) { alert("Please upload an ID photo."); return; }
        setVerificationStep(1);
        setTimeout(() => {
            setVerificationStep(2);
            setUser({ ...user, isVerified: true });
            setEditForm({ ...editForm, isVerified: true });
            alert("✅ Identity Verified!");
        }, 3000);
    };

    const handleNavigateToUser = (targetId) => {
        setActiveModal(null);
        const allMocks = [...MOCK_FRIENDS, ...MOCK_FOLLOWERS, ...MOCK_FOLLOWING];
        const targetUser = allMocks.find(u => u.id === targetId) || MOCK_STREAMERS.find(s => String(s.id) === String(targetId));
        initializeConversation(targetId, {
            name: targetUser?.name || `User ${targetId}`,
            avatar: targetUser?.avatar || targetUser?.image || `https://i.pravatar.cc/150?u=${targetId}`,
            isOnline: true
        });
        navigate(`/chat/${targetId}`);
    };

    const handleContextMenu = (e, userId) => {
        e.preventDefault();
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        setContextMenu({ x, y, userId, userName: userId });
    };

    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const renderModalContent = () => {
        if (!activeModal) return null;
        if (activeModal === 'gifts-sent') {
            const giftEmojis = { 'Rose': '🌹', 'Supercar': '🏎️', 'Diamond': '💎', 'Heart': '❤️', 'Crown': '👑', 'Rocket': '🚀' };
            return (
                <div className="modal-content full-height">
                    <div className="modal-header-row">
                        <button className="back-btn" onClick={() => setActiveModal(null)}><RiArrowLeftLine /></button>
                        <h3>Sent Gifts</h3>
                        <div style={{ width: 24 }}></div>
                    </div>
                    <div className="stats-list">
                        {user.giftsSent?.length > 0 ? (
                            user.giftsSent.slice().reverse().map((gift, index) => (
                                <div key={index} className="profile-list-item">
                                    <div className="list-icon-circle">{giftEmojis[gift.giftType] || '🎁'}</div>
                                    <div className="list-content">
                                        <div className="list-title">{gift.giftType}</div>
                                        <div className="list-subtitle">Sent to @{gift.recipientName} • {formatRelativeTime(gift.timestamp)}</div>
                                    </div>
                                    <span className="gold-text">-{gift.coinCost} 💎</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No gifts sent yet</div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`profile-page-black-${themeClass}`}>
            <div className="custom-status-bar"></div>
            
            <div className="profile-nav-header">
                <button className="icon-btn-gold back-btn" onClick={handleBackNav}><RiArrowLeftLine size={28} /></button>
                <div className="nav-title">{displayName}</div>
                <button className="icon-btn-gold" onClick={() => isOwnProfile ? navigate('/settings') : null}>
                    {isOwnProfile ? <RiSettings4Line /> : <RiShareBoxLine />}
                </button>
            </div>

            <div className="profile-scroll-content">
                <div className="profile-card">
                    <div className="avatar-frame-gold">
                        <img src={photoUrl} className="avatar-img-large" />
                        {isOwnProfile && <button className="camera-fab" onClick={() => setIsEditing(true)}><RiEdit2Line /></button>}
                    </div>
                    <h1 className="profile-display-name">
                        {displayName}, {age}
                        {displayUser.isVerified && <RiCheckLine className="verified-badge-gold" />}
                    </h1>
                    <p className="profile-username-sub">@{username}</p>
                    <p className="profile-location-text">{locationString}</p>
                    <div className="diamond-pill"><span>💎</span> <span>{isOwnProfile ? (user.coins || 0) : '0'}</span></div>

                    {!isOwnProfile && (
                        <div className="profile-actions-row">
                            <button className={`action-btn-gold ${otherUser?.isFollowing ? 'following' : ''}`} onClick={handleFollowUser}>
                                {otherUser?.isFollowing ? <RiCheckLine /> : <RiUserAddLine />}
                                {otherUser?.isFollowing ? 'Following' : 'Follow'}
                            </button>
                            <button className="action-btn-gold" onClick={() => { setShowToast("Request Sent! 📨"); setTimeout(() => setShowToast(null), 3000); }}><RiUserSmileLine /> Add Friend</button>
                            <button className="action-btn-gold filled" onClick={handleMessageUser}><RiMessage3Line /> Message</button>
                        </div>
                    )}
                </div>

                <div className="stats-bar-gold">
                    <div className="stat-col" onClick={() => setActiveModal(activeModal === 'stats-friends' ? null : 'stats-friends')}>
                        <span className="stat-val">{isOwnProfile ? (friendsList.length) : (seed => seed % 50)(displayName.length)}</span>
                        <div className="stat-label-row"><span className="stat-label">Friends</span><RiArrowDownSLine className="stat-arrow" /></div>
                    </div>
                    <div className="stat-divider-v"></div>
                    <div className="stat-col" onClick={() => setActiveModal(activeModal === 'stats-followers' ? null : 'stats-followers')}>
                        <span className="stat-val">{isOwnProfile ? (user.followers) : (seed => seed % 1000)(displayName.length)}</span>
                        <div className="stat-label-row"><span className="stat-label">Followers</span><RiArrowDownSLine className="stat-arrow" /></div>
                    </div>
                    <div className="stat-divider-v"></div>
                    <div className="stat-col" onClick={() => setActiveModal(activeModal === 'stats-following' ? null : 'stats-following')}>
                        <span className="stat-val">{isOwnProfile ? (user.following) : (seed => seed % 200)(displayName.length)}</span>
                        <div className="stat-label-row"><span className="stat-label">Following</span><RiArrowDownSLine className="stat-arrow" /></div>
                    </div>
                </div>

                <AnimatePresence>
                    {activeModal?.startsWith('stats-') && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="stats-dropdown">
                            <div className="stats-dropdown-list">
                                {(activeModal === 'stats-friends' ? MOCK_FRIENDS : activeModal === 'stats-followers' ? MOCK_FOLLOWERS : MOCK_FOLLOWING).map(u => (
                                    <StatsDropdownItem key={u.id} name={u.name} onNavigate={() => handleNavigateToUser(u.id)} onContextMenu={(e) => handleContextMenu(e, u.id)} />
                                ))}
                                {(activeModal === 'stats-friends' ? MOCK_FRIENDS : activeModal === 'stats-followers' ? MOCK_FOLLOWERS : MOCK_FOLLOWING).length === 0 && (
                                    <div className="empty-stats">No results in this list.</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isOwnProfile && (
                    <div className="general-search-gold">
                        <RiSearchLine />
                        <input type="text" placeholder="Search users..." value={generalSearch} onChange={e => setGeneralSearch(e.target.value)} />
                        {generalSearch.length > 0 && (
                            <div className="search-results-dropdown-profile">
                                {MOCK_FRIENDS.concat(MOCK_FOLLOWERS).concat(MOCK_FOLLOWING)
                                    .filter(u => u.name.toLowerCase().includes(generalSearch.toLowerCase()))
                                    .slice(0, 3)
                                    .map(u => (
                                        <div key={u.id} className="search-result-item" onClick={() => handleNavigateToUser(u.id)}>
                                            <img src={u.avatar} alt="avatar" />
                                            <span>{u.name} (My List)</span>
                                        </div>
                                    ))}
                                {user.displayName?.toLowerCase().includes(generalSearch.toLowerCase()) && (
                                    <div className="search-result-item" onClick={() => { setGeneralSearch(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                        <img src={user.photos?.[0] || 'https://i.pravatar.cc/150?img=68'} alt="avatar" />
                                        <span>{user.displayName} (Me) ✨</span>
                                    </div>
                                )}
                                <div className="search-divider-gold" style={{ padding: '8px 12px', fontSize: '11px', color: '#FFD700', borderTop: '1px solid #333', background: 'rgba(0,0,0,0.5)' }}>Global Directory</div>
                                {MOCK_STREAMERS
                                    .filter(u => u.name.toLowerCase().includes(generalSearch.toLowerCase()) && String(u.id) !== String(user.id))
                                    .slice(0, 5)
                                    .map(u => (
                                        <div key={`global-${u.id}`} className="search-result-item" onClick={() => handleNavigateToUser(u.id)}>
                                            <img src={u.image} alt="avatar" />
                                            <span>{u.name.replace('_', ' ')}</span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="menu-list-gold">
                    {user.totalSpent >= 100 && (
                        <div className="menu-item-gold">
                            <div className="item-icon-wrapper green-gradient"><RiShieldUserLine /></div>
                            <div className="item-text"><div className="item-title green-text">Premium Member</div><div className="item-sub">10% EXTRA COINS</div></div>
                            <RiArrowRightSLine className="arrow-gold" />
                        </div>
                    )}
                    <div className="menu-item-gold" onClick={() => navigate('/store')}>
                        <div className="item-icon-wrapper gold-gradient"><RiShieldFlashLine /></div>
                        <div className="item-text"><div className="item-title">Coins</div><div className="item-sub">Manage Balance</div></div>
                        <div className="item-end-val">{user.coins || 0}</div>
                    </div>
                    <div className="menu-item-gold" onClick={() => setActiveModal('gifts-sent')}>
                        <div className="item-icon-wrapper pink-gradient"><RiUserHeartLine /></div>
                        <div className="item-text"><div className="item-title">Gifts</div><div className="item-sub">Sent History</div></div>
                        <RiArrowRightSLine className="arrow-gold" />
                    </div>
                </div>

                <div className="section-header-gold">MY STORIES</div>
                <div className="stories-row">
                    <div className="story-add-card">
                        <img src={user.photos?.[0] || 'https://i.pravatar.cc/150?img=68'} />
                        <div className="add-plus">+</div>
                    </div>
                </div>
                <div className="section-header-gold">MY PHOTOS</div>
                <div className="photos-grid-preview">
                    {[1, 2, 3].map(i => <div key={i} className="photo-placeholder"></div>)}
                </div>
            </div>

            <BottomNav />
            {/* Settings navigates to /settings page */}

            {isEditing && (
                <div className="modal-overlay-black">
                    <div className="modal-container-gold">
                        <div className="modal-header-row">
                            <button className="back-btn" onClick={() => setIsEditing(false)}><RiArrowLeftLine /></button>
                            <h3>Edit Profile</h3>
                        </div>
                        <div className="edit-form-scroll">
                            <div className="edit-avatar-section">
                                <img src={user.photos?.[0]} />
                                <button onClick={handleCameraUpload}><RiEdit2Line /> Edit Photo</button>
                            </div>
                            <label>Display Name</label>
                            <input type="text" value={editForm.displayName} onChange={e => setEditForm({...editForm, displayName: e.target.value})} />
                            <label>Username</label>
                            <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} />
                            <label>Bio</label>
                            <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})} />
                            <button className="save-btn-gold" onClick={handleSaveProfile}>SAVE CHANGES</button>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {activeModal && activeModal === 'gifts-sent' && (
                    <div className="modal-overlay-black">
                        <div className="modal-container-gold">
                            {renderModalContent()}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const StatsDropdownItem = ({ name, onNavigate, onContextMenu }) => {
    return (
        <div className="stats-dropdown-item" onClick={onNavigate} onContextMenu={onContextMenu} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #222' }}>
            <span>{name}</span>
            <RiMessage3Line size={14} color="#d4af37" />
        </div>
    );
};
