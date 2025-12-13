import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RiSettings4Line, RiEdit2Line, RiLogoutBoxRLine, RiShieldUserLine,
    RiNotification3Line, RiPaletteLine, RiQuestionLine, RiCloseLine,
    RiArrowRightSLine, RiCheckLine, RiSearchLine, RiEyeLine,
    RiUserAddLine, RiMessage3Line, RiImageAddLine, RiShareBoxLine,
    RiArrowLeftLine, RiArrowDownSLine
} from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import { useHUDStore } from '../store/useHUDStore';
import { useSubscriptionStore, TIERS } from '../store/useSubscriptionStore'; // Import Sub Bundle
import { useChatStore } from '../store/chatStore'; // Import Chat Store
import { formatRelativeTime } from '../utils/helpers';
import Header from '../components/Header'; // Keeping for other pages, but Profile has custom header
import BottomNav from '../components/BottomNav';
import ContextMenu from '../components/ContextMenu';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { user, setUser } = useUserStore();
    const { showChatbot, showMiniSlots, toggleChatbot, toggleMiniSlots } = useHUDStore();
    const { tier } = useSubscriptionStore(); // Get tier
    const { initializeConversation } = useChatStore(); // Get chat action

    // Theme Constants
    const isPlatinum = tier === TIERS.PLATINUM;
    const themeClass = isPlatinum ? 'platinum' : 'gold';

    if (!user) return null;

    console.log('DEBUG: Profile Render. User:', user, 'Params:', userId); // DEBUG

    const [showSettings, setShowSettings] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Edit Form State
    const [editForm, setEditForm] = useState({ ...user });
    const [idFile, setIdFile] = useState(null);
    const [verificationStep, setVerificationStep] = useState(0); // 0: Idle, 1: Scanning, 2: Success

    const [generalSearch, setGeneralSearch] = useState('');
    const [isOwnProfile, setIsOwnProfile] = useState(!userId || userId === String(user.id));
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        // If viewing someone else
        if (userId && userId !== String(user.id)) {
            setIsOwnProfile(false);

            // 1. Check if it's a known MOCK_STREAMER (from Home)
            // We need to import MOCK_STREAMERS or defined them here. 
            // For now, let's just generate consistent mock data based on ID.

            // Seeded random data for consistency
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
                isFollowing: false // Default
            });
        } else {
            setIsOwnProfile(true);
        }
    }, [userId, user.id]);

    const displayUser = isOwnProfile ? user : (otherUser || {});

    // Actions
    const handleMessageUser = () => {
        const targetId = displayUser.id || userId;
        // Initialize Conversation in Store
        initializeConversation(Number(targetId), {
            name: displayName,
            avatar: displayUser.photos?.[0] || user.photos?.[0], // Fallback
            isOnline: true // Mock
        });

        // Navigate
        navigate(`/chat/${targetId}`);
    };

    const handleFollowUser = () => {
        if (isOwnProfile) return;
        setOtherUser(prev => ({ ...prev, isFollowing: !prev.isFollowing }));
        // Also update MOCK stats if needed
    };

    // Display Logic
    const displayName = displayUser.displayName || displayUser.name || 'User';
    const username = displayUser.username || `user${displayUser.id}`;

    // Dynamic Age Calculation
    const calculateAge = (dob) => {
        if (!dob) return 25; // Default if no DOB
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

    // Mock Data for Lists with Real Names
    const MOCK_FRIENDS = [
        { id: 'f1', name: 'Jessica M.', username: 'jessicam', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 'f2', name: 'David K.', username: 'davidk', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 'f3', name: 'Sarah L.', username: 'sarahl', avatar: 'https://i.pravatar.cc/150?img=3' },
        { id: 'f4', name: 'Mike R.', username: 'miker', avatar: 'https://i.pravatar.cc/150?img=4' },
        { id: 'f5', name: 'Emily W.', username: 'emilyw', avatar: 'https://i.pravatar.cc/150?img=5' }
    ];

    const MOCK_FOLLOWERS = [
        { id: 'fl1', name: 'Tom H.', username: 'tomh', avatar: 'https://i.pravatar.cc/150?img=6' },
        { id: 'fl2', name: 'Lisa B.', username: 'lisab', avatar: 'https://i.pravatar.cc/150?img=7' },
        { id: 'fl3', name: 'Ryan G.', username: 'ryang', avatar: 'https://i.pravatar.cc/150?img=8' },
        { id: 'fl4', name: 'Anna P.', username: 'annap', avatar: 'https://i.pravatar.cc/150?img=9' },
        { id: 'fl5', name: 'Kevin J.', username: 'kevinj', avatar: 'https://i.pravatar.cc/150?img=10' }
    ];

    const MOCK_FOLLOWING = [
        { id: 'fg1', name: 'Coach Steve', username: 'coachsteve', avatar: 'https://i.pravatar.cc/150?img=11' },
        { id: 'fg2', name: 'Fitness Jen', username: 'fitnessjen', avatar: 'https://i.pravatar.cc/150?img=12' },
        { id: 'fg3', name: 'Chef Gordon', username: 'chefgordon', avatar: 'https://i.pravatar.cc/150?img=13' },
        { id: 'fg4', name: 'Travel Bug', username: 'travelbug', avatar: 'https://i.pravatar.cc/150?img=14' },
        { id: 'fg5', name: 'Tech Guy', username: 'techguy', avatar: 'https://i.pravatar.cc/150?img=15' }
    ];

    // Image Upload Logic
    const handleCameraUpload = async () => {
        try {
            const { CameraController } = await import('../utils/CameraController');
            const dataUrl = await CameraController.pickFromGallery(); // Default to gallery for simplicity
            if (dataUrl) {
                // Mock "Bot Check" for explicit content
                const isSafe = Math.random() > 0.1;
                if (!isSafe) {
                    alert("⚠️ Image rejected by AI Safety Filter (Explicit Content Detected).");
                    return;
                }
                const currentPhotos = user.photos || [];
                setUser({ ...user, photos: [dataUrl, ...currentPhotos.slice(1)] });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Verify Unique Username (Mock)
    const handleSaveProfile = () => {
        // 1. Unique Check
        const mockTakenUsernames = ['admin', 'support', 'staff', 'owner', 'mod'];
        if (editForm.username !== user.username) {
            if (mockTakenUsernames.includes(editForm.username.toLowerCase())) {
                alert("⚠️ Username is taken or reserved.");
                return;
            }

            // 2. Frequency Check
            const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            if (user.lastUsernameChange && (now - user.lastUsernameChange < ONE_WEEK)) {
                alert("⚠️ You can only change your username once a week.");
                return;
            }
            // Update timestamp
            setUser({ ...editForm, lastUsernameChange: now });
        } else {
            setUser(editForm);
        }
        setIsEditing(false);
    };


    const handleVerification = () => {
        if (!idFile) {
            alert("Please upload an ID photo first.");
            return;
        }
        setVerificationStep(1);
        // Simulate AI Scan
        setTimeout(() => {
            setVerificationStep(2);
            setUser({ ...user, isVerified: true });
            setEditForm({ ...editForm, isVerified: true });
            alert("✅ Identity Verified! Badge Awarded.");
        }, 3000);
    };

    // -- RENDERERS --

    const renderSettingsDrawer = () => (
        <AnimatePresence>
            {showSettings && (
                <div className="settings-drawer-overlay" onClick={() => setShowSettings(false)}>
                    <motion.div className="settings-drawer" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <span>Settings</span>
                            <button className="modal-close" onClick={() => setShowSettings(false)}><RiCloseLine /></button>
                        </div>
                        <div className="settings-list">
                            <div className="setting-row" onClick={() => setActiveModal('account')}><RiShieldUserLine /> Account</div>
                            <div className="setting-row" onClick={() => setActiveModal('notifications')}><RiNotification3Line /> Notifications</div>
                            <div className="setting-row" onClick={() => setActiveModal('display')}><RiEyeLine /> Display</div>
                            <div className="setting-row" onClick={() => setActiveModal('themes')}><RiPaletteLine /> Themes</div>
                            <div className="setting-row" onClick={() => setActiveModal('help')}><RiQuestionLine /> Help</div>
                            <div className="setting-group">
                                <label>EARN</label>
                                <div className="setting-row gold-text" onClick={() => navigate('/model-signup')}>
                                    <RiUserAddLine /> Become a Model
                                </div>
                            </div>
                            <div className="setting-row logout" onClick={() => navigate('/')}><RiLogoutBoxRLine /> Logout</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    const [contextMenu, setContextMenu] = useState(null);
    const [statsSearch, setStatsSearch] = useState(''); // New state for modal search



    const handleNavigateToUser = (targetId) => {
        setActiveModal(null); // Close the stats dropdown
        navigate(`/user/${targetId}`);
    };

    const handleContextMenu = (e, userId) => {
        e.preventDefault();
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        setContextMenu({
            x,
            y,
            userId,
            userName: userId // In real app, fetch actual name
        });
    };

    // Global click to close menu
    useEffect(() => {
        const closeMenu = () => setContextMenu(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const renderModalContent = () => {
        if (!activeModal) return null;

        // Gifts Modal
        if (activeModal === 'gifts-sent') {
            const giftEmojis = {
                'Rose': '🌹',
                'Supercar': '🏎️',
                'Diamond': '💎',
                'Heart': '❤️',
                'Crown': '👑',
                'Rocket': '🚀'
            };

            return (
                <div className="modal-content full-height">
                    <div className="modal-header-row">
                        <button className="back-btn" onClick={() => setActiveModal(null)}><RiArrowLeftLine /></button>
                        <h3>Sent Gifts History</h3>
                        <div style={{ width: 24 }}></div>
                    </div>
                    <div className="stats-list">
                        {user.giftsSent && user.giftsSent.length > 0 ? (
                            user.giftsSent.slice().reverse().map((gift, index) => (
                                <div key={index} className="profile-list-item">
                                    <div className="list-icon-circle">{giftEmojis[gift.giftType] || '🎁'}</div>
                                    <div className="list-content">
                                        <div className="list-title">{gift.giftType}</div>
                                        <div className="list-subtitle">
                                            Sent to @{gift.recipientName} • {formatRelativeTime(gift.timestamp)}
                                        </div>
                                    </div>
                                    <span className="gold-text">-{gift.coinCost} 💎</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎁</div>
                                <p>No gifts sent yet</p>
                                <p style={{ fontSize: '12px' }}>Send gifts to other users to see them here!</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (activeModal.startsWith('stats-')) {
            const title = activeModal.split('-')[1].charAt(0).toUpperCase() + activeModal.split('-')[1].slice(1);
            let dataList = [];
            if (activeModal === 'stats-friends') dataList = MOCK_FRIENDS;
            else if (activeModal === 'stats-followers') dataList = MOCK_FOLLOWERS;
            else if (activeModal === 'stats-following') dataList = MOCK_FOLLOWING;

            // Filter List
            const filteredList = dataList.filter(u => u.name.toLowerCase().includes(statsSearch.toLowerCase()));

            return (
                <div className="modal-content full-height">
                    <div className="modal-header-row">
                        <button className="back-btn" onClick={() => { setActiveModal(null); setStatsSearch(''); }}><RiArrowLeftLine /></button>
                        <h3>{title}</h3>
                        <div style={{ width: 24 }}></div>
                    </div>
                    <div className="search-input-wrapper">
                        <RiSearchLine />
                        <input
                            type="text"
                            placeholder={`Search ${title}...`}
                            value={statsSearch}
                            onChange={(e) => setStatsSearch(e.target.value)}
                        />
                    </div>
                    <div className="stats-list">
                        {filteredList.map((user, i) => (
                            <StatsDropdownItem
                                key={user.id}
                                name={user.name}
                                onNavigate={() => handleNavigateToUser(user.id)}
                                onContextMenu={(e) => handleContextMenu(e, user.name, user.id)}
                            />
                        ))}
                    </div>
                </div>
            );
        }
        // Settings Modals
        return (
            <div className="modal-content">
                <div className="modal-header-row">
                    <button className="back-btn" onClick={() => setActiveModal(null)}><RiArrowLeftLine /></button>
                    <h3>{activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}</h3>
                    <div style={{ width: 24 }}></div>
                </div>
                {/* Content based on type */}
                {activeModal === 'account' && (
                    <div className="setting-item"><span>Email</span> <span className="setting-value">user@example.com</span></div>
                )}
                {/* Add other settings here as needed */}
            </div>
        );
    };
    return (
        <div className={`profile-page-black-${themeClass}`}>
            <div className="custom-status-bar"></div>

            {/* Active Context Menu */}
            {
                contextMenu && (
                    <div
                        className="context-menu"
                        style={{ top: contextMenu.y, left: contextMenu.x, position: 'fixed', zIndex: 9999, background: '#222', border: '1px solid #444', borderRadius: '8px', padding: '5px' }}
                        onClick={() => setContextMenu(null)}
                    >
                        <div className="ctx-item" onClick={() => alert(`Friend Request sent to ${contextMenu.userId}`)}>Add Friend</div>
                        <div className="ctx-item" onClick={() => navigate(`/profile/${contextMenu.userId}`)}>Visit Profile</div>
                        <div className="ctx-item" onClick={() => alert(`3 Unsolicited Messages sent to ${contextMenu.userId}`)}>Send Messages (3/3)</div>
                    </div>
                )
            }

            {/* Custom Header: Share - Avatar - Settings */}
            {/* Custom Header: Share - Avatar - Settings */}
            <div className="profile-nav-header" style={{ zIndex: 9999 }}>
                <button className="icon-btn-gold back-btn" onClick={() => navigate(-1)}>
                    <RiArrowLeftLine size={28} />
                </button>
                <div className="nav-title">{displayName || `User ${userId || ''}`}</div>
                <button className="icon-btn-gold" onClick={() => isOwnProfile && setShowSettings(true)}>
                    {isOwnProfile ? <RiSettings4Line /> : <RiShareBoxLine />}
                </button>
            </div>

            <div className="profile-scroll-content">
                {/* Main Profile Card */}
                <div className="profile-card">
                    <div className="avatar-frame-gold">
                        <img src={photoUrl} className="avatar-img-large" />
                        {isOwnProfile && (
                            <button className="camera-fab" onClick={() => setIsEditing(true)}>
                                <RiEdit2Line />
                            </button>
                        )}
                    </div>

                    <h1 className="profile-display-name">
                        @{username}, {age} {/* SWAPPED: Username in Card */}
                        {user.isVerified && <RiCheckLine className="verified-badge-gold" />}
                    </h1>
                    <p className="profile-location-text">{locationString}</p>

                    <div className="diamond-pill">
                        <span>💎</span> <span>{isOwnProfile ? (user.coins || 0) : '0'}</span>
                    </div>

                    {/* Action Buttons (For Other Users) */}
                    {!isOwnProfile && (
                        <div className="profile-actions-row">
                            <button
                                className={`action-btn-gold ${otherUser?.isFollowing ? 'following' : ''}`}
                                onClick={handleFollowUser}
                            >
                                {otherUser?.isFollowing ? <RiCheckLine /> : <RiUserAddLine />}
                                {otherUser?.isFollowing ? 'Following' : 'Follow'}
                            </button>
                            <button className="action-btn-gold filled" onClick={handleMessageUser}>
                                <RiMessage3Line />
                                Message
                            </button>
                        </div>
                    )}
                </div>

                {/* Stats Bar - Reordered: Friends, Followers, Following */}
                <div className="stats-bar-gold">
                    <div className="stat-col" onClick={() => setActiveModal(activeModal === 'stats-friends' ? null : 'stats-friends')}>
                        <span className="stat-val">5</span>
                        <div className="stat-label-row">
                            <span className="stat-label">Friends</span>
                            <RiArrowDownSLine className="stat-arrow" />
                        </div>
                    </div>
                    <div className="stat-divider-v"></div>
                    <div className="stat-col" onClick={() => setActiveModal(activeModal === 'stats-followers' ? null : 'stats-followers')}>
                        <span className="stat-val">20</span>
                        <div className="stat-label-row">
                            <span className="stat-label">Followers</span>
                            <RiArrowDownSLine className="stat-arrow" />
                        </div>
                    </div>
                    <div className="stat-divider-v"></div>
                    <div className="stat-col" onClick={() => setActiveModal(activeModal === 'stats-following' ? null : 'stats-following')}>
                        <span className="stat-val">15</span>
                        <div className="stat-label-row">
                            <span className="stat-label">Following</span>
                            <RiArrowDownSLine className="stat-arrow" />
                        </div>
                    </div>
                </div>

                {/* Dropdown Lists for Stats */}
                {activeModal === 'stats-friends' && (
                    <div className="stats-dropdown">
                        <div className="stats-dropdown-list">
                            {MOCK_FRIENDS.map((friend, idx) => (
                                <StatsDropdownItem
                                    key={friend.id}
                                    name={friend.name}
                                    onNavigate={() => handleNavigateToUser(friend.id)}
                                    onContextMenu={(e) => handleContextMenu(e, friend.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeModal === 'stats-followers' && (
                    <div className="stats-dropdown">
                        <div className="stats-dropdown-list">
                            {MOCK_FOLLOWERS.map((follower, idx) => (
                                <StatsDropdownItem
                                    key={follower.id}
                                    name={follower.name}
                                    onNavigate={() => handleNavigateToUser(follower.id)}
                                    onContextMenu={(e) => handleContextMenu(e, follower.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeModal === 'stats-following' && (
                    <div className="stats-dropdown">
                        <div className="stats-dropdown-list">
                            {MOCK_FOLLOWING.map((following, idx) => (
                                <StatsDropdownItem
                                    key={following.id}
                                    name={following.name}
                                    onNavigate={() => handleNavigateToUser(following.id)}
                                    onContextMenu={(e) => handleContextMenu(e, following.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                {isOwnProfile && (
                    <div className="general-search-gold">
                        <RiSearchLine />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={generalSearch}
                            onChange={e => setGeneralSearch(e.target.value)}
                        />
                        {generalSearch.length > 0 && (
                            <div className="search-results-dropdown-profile">
                                {MOCK_FRIENDS.concat(MOCK_FOLLOWERS).concat(MOCK_FOLLOWING)
                                    .filter(u => u.name.toLowerCase().includes(generalSearch.toLowerCase()))
                                    .slice(0, 5) // Limit results
                                    .map(u => (
                                        <div key={u.id} className="search-result-item" onClick={() => {
                                            navigate(`/user/${u.id}`);
                                            setGeneralSearch(''); // Clear search on click
                                        }}>
                                            <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} alt="avatar" />
                                            <span>{u.name}</span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )} { /* Keeping this one between Stats and Menu */}

                {/* Menu List */}
                <div className="menu-list-gold">
                    {/* Premium Logic: Only show if totalSpent >= 100 */}
                    {user.totalSpent >= 100 && (
                        <div className="menu-item-gold">
                            <div className="item-icon-wrapper green-gradient"><RiShieldUserLine /></div>
                            <div className="item-text">
                                <div className="item-title green-text">Premium Member</div>
                                <div className="item-sub">10% EXTRA COINS</div>
                            </div>
                            <RiArrowRightSLine className="arrow-gold" />
                        </div>
                    )}

                    <div className="menu-item-gold" onClick={() => navigate('/store')}>
                        <div className="item-icon-wrapper gold-gradient"><RiShieldUserLine /></div>
                        <div className="item-text">
                            <div className="item-title">Coins</div>
                            <div className="item-sub">10% free coins in every purchase</div>
                        </div>
                        <div className="item-end-val">{user.coins || 0}</div>
                        <RiArrowRightSLine className="arrow-gold" />
                    </div>

                    <div className="menu-item-gold" onClick={() => setActiveModal('gifts-sent')}>
                        <div className="item-icon-wrapper pink-gradient"><RiMessage3Line /></div>
                        <div className="item-text">
                            <div className="item-title">Gifts</div>
                            <div className="item-sub">View Sent Gifts</div>
                        </div>
                        <RiArrowRightSLine className="arrow-gold" />
                    </div>
                </div>

                {/* My Stories / Photos Placeholder */}
                <div className="section-header-gold">MY STORIES</div>
                <div className="stories-row">
                    <div className="story-add-card">
                        <img src={photoUrl} />
                        <div className="add-plus">+</div>
                    </div>
                </div>

                <div className="section-header-gold">MY PHOTOS</div>
                <div className="photos-grid-preview">
                    <div className="photo-placeholder"></div>
                    <div className="photo-placeholder"></div>
                    <div className="photo-placeholder"></div>
                </div>
            </div>

            <BottomNav />
            {renderSettingsDrawer()}

            {/* EDIT PROFILE MODAL */}
            {
                isEditing && (
                    <div className="modal-overlay-black">
                        <div className="modal-container-gold">
                            <div className="modal-header-row">
                                <button className="back-btn" onClick={() => setIsEditing(false)}><RiArrowLeftLine /></button>
                                <h3>Edit Profile</h3>
                                <div style={{ width: 24 }}></div>
                            </div>

                            <div className="edit-form-scroll">
                                <div className="edit-avatar-section">
                                    <img src={user.photos?.[0]} />
                                    <button onClick={handleCameraUpload}><RiEdit2Line /> Edit Photo</button>
                                </div>

                                <label>Display Name (Max 64)</label>
                                <input
                                    type="text"
                                    maxLength={64}
                                    value={editForm.displayName}
                                    onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                                />

                                <label>Username (Max 64 - Changes 1x/Week)</label>
                                <input
                                    type="text"
                                    maxLength={64}
                                    value={editForm.username}
                                    onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                                />
                                <p className="input-hint">Username checks run on save.</p>

                                <label>Bio (Max 1000)</label>
                                <textarea
                                    maxLength={1000}
                                    value={editForm.bio}
                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                />

                                <div className="verification-section">
                                    <h4>Verify Profile</h4>
                                    {user.isVerified ? (
                                        <div className="verified-status">✅ Verified</div>
                                    ) : (
                                        <>
                                            <p>Upload ID for Bot Verification.</p>
                                            <input type="file" onChange={e => setIdFile(e.target.files[0])} />
                                            <button
                                                className="verify-btn-gold"
                                                onClick={handleVerification}
                                                disabled={verificationStep === 1}
                                            >
                                                {verificationStep === 1 ? "Scanning..." : "Request Verification"}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button className="save-btn-gold" onClick={handleSaveProfile}>SAVE CHANGES</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Generic Modals */}
            <AnimatePresence>
                {activeModal && !activeModal.startsWith('stats') && (
                    <div className="modal-overlay-black">
                        <div className="modal-container-gold">
                            {renderModalContent()}
                        </div>
                    </div>
                )}
                {/* Stats modal is full screen handled specially above if complex, or here if simple */}
                {activeModal && activeModal.startsWith('stats') && (
                    <div className="modal-overlay-black">
                        <div className="modal-container-gold full-screen">
                            {renderModalContent()}
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    userName={contextMenu.userName}
                    userId={contextMenu.userId}
                    onClose={() => setContextMenu(null)}
                />
            )}

        </div >
    );
}

const StatsDropdownItem = ({ name, onNavigate, onContextMenu }) => {
    const pressTimer = useRef(null);
    const isLongPress = useRef(false);

    const handleTouchStart = (e) => {
        isLongPress.current = false;
        pressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            onContextMenu(e.touches[0]);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
    };

    const handleClick = (e) => {
        if (isLongPress.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onNavigate();
    };

    return (
        <div
            className="stats-dropdown-item"
            onClick={handleClick}
            onContextMenu={onContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd}
        >
            {name}
        </div>
    );
};
