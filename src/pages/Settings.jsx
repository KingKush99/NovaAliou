import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RiUser3Line, RiNotification3Line, RiLockLine, RiQuestionLine,
    RiCustomerService2Line, RiLogoutBoxLine, RiDeleteBinLine,
    RiArrowRightSLine, RiToggleLine, RiToggleFill
} from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import Button from '../components/Button';
import './Settings.css';

export default function Settings() {
    const navigate = useNavigate();
    const { settings, updateSettings } = useUserStore();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputModalType, setInputModalType] = useState(''); // 'email' or 'phone'
    const [inputValue, setInputValue] = useState('');
    const [deleteStep, setDeleteStep] = useState(1);

    const handleOpenInput = (type) => {
        setInputModalType(type);
        setInputValue('');
        setShowInputModal(true);
    };

    const handleSaveInput = () => {
        alert(`${inputModalType === 'email' ? 'Email' : 'Phone'} updated to: ${inputValue}`);
        setShowInputModal(false);
    };

    const settingsSections = [
        {
            title: 'Account',
            icon: <RiUser3Line />,
            items: [
                { label: 'Edit Profile', action: () => navigate('/profile') },
                { label: 'Email Verification', action: () => handleOpenInput('email') },
                { label: 'Phone Number', action: () => handleOpenInput('phone') }
            ]
        },
        {
            title: 'Notifications',
            icon: <RiNotification3Line />,
            // ... (omitted sections for brevity if possible, keeping context)
            // Actually I cannot omit sections in replace_file_content without context validity.
            // I will just replace the specific block if I can match it, or the larger block.
            // The tool supports StartLine/EndLine, so I'll target the Account and Help sections separately if I can, but I can't do multiple items in one call with replace.
            // Ah, multi_replace exists? No, I only have replace_file_content (single block) or multi_replace.
            // I'll use separate calls or replace the whole sections list. But list is long.
            // I'll use strict Targeting.
            items: [
                {
                    label: 'Matches',
                    toggle: true,
                    value: settings.notifications.matches,
                    onChange: (val) => updateSettings('notifications', { matches: val })
                },
                {
                    label: 'Messages',
                    toggle: true,
                    value: settings.notifications.messages,
                    onChange: (val) => updateSettings('notifications', { messages: val })
                },
                {
                    label: 'Likes',
                    toggle: true,
                    value: settings.notifications.likes,
                    onChange: (val) => updateSettings('notifications', { likes: val })
                },
                {
                    label: 'Promotions',
                    toggle: true,
                    value: settings.notifications.promotions,
                    onChange: (val) => updateSettings('notifications', { promotions: val })
                }
            ]
        },
        {
            title: 'Privacy',
            icon: <RiLockLine />,
            items: [
                {
                    label: 'Show Online Status',
                    toggle: true,
                    value: settings.privacy.showOnline,
                    onChange: (val) => updateSettings('privacy', { showOnline: val })
                },
                {
                    label: 'Incognito Mode',
                    toggle: true,
                    value: settings.privacy.incognito,
                    onChange: (val) => updateSettings('privacy', { incognito: val })
                },
                { label: 'Blocked Users', action: () => { } }
            ]
        },
        {
            title: 'Help & Support',
            icon: <RiCustomerService2Line />,
            items: [
                { label: 'FAQ', icon: <RiQuestionLine />, action: () => alert('FAQ: \n1. How to earn coins? Watch ads!\n2. How to stream? Go to Profile.') },
                { label: 'Contact Support', action: () => window.location.href = 'mailto:support@noveltycams.com' },
                { label: 'Report Issue', action: () => alert('Report submitted successfully.') }
            ]
        }
    ];

    const handleDeleteAccount = () => {
        if (deleteStep === 1) {
            setDeleteStep(2);
        } else if (deleteStep === 2) {
            setDeleteStep(3);
        } else {
            // Actually delete (in real app)
            alert('Account deleted (demo)');
            setShowDeleteModal(false);
            setDeleteStep(1);
        }
    };

    return (
        <div className="settings-page">
            <Header title="Settings" showBack onBack={() => navigate('/profile')} />

            <div className="settings-content">
                {settingsSections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        className="settings-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="section-header">
                            <span className="section-icon">{section.icon}</span>
                            <h3 className="section-title">{section.title}</h3>
                        </div>
                        <div className="section-items">
                            {section.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="settings-item"
                                    onClick={item.action}
                                >
                                    <span className="item-label">{item.label}</span>
                                    {item.toggle ? (
                                        <button
                                            className="toggle-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                item.onChange(!item.value);
                                            }}
                                        >
                                            {item.value ? (
                                                <RiToggleFill size={32} className="toggle-on" />
                                            ) : (
                                                <RiToggleLine size={32} className="toggle-off" />
                                            )}
                                        </button>
                                    ) : (
                                        <RiArrowRightSLine className="item-arrow" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* Danger Zone */}
                <div className="settings-section danger-zone">
                    <div className="section-header">
                        <h3 className="section-title">Danger Zone</h3>
                    </div>
                    <div className="section-items">
                        <div className="settings-item" onClick={() => { }}>
                            <span className="item-label">
                                <RiLogoutBoxLine /> Logout
                            </span>
                            <RiArrowRightSLine className="item-arrow" />
                        </div>
                        <div className="settings-item danger" onClick={() => setShowDeleteModal(true)}>
                            <span className="item-label">
                                <RiDeleteBinLine /> Delete Account
                            </span>
                            <RiArrowRightSLine className="item-arrow" />
                        </div>
                    </div>
                </div>

                <div className="settings-footer">
                    <p>Version 1.0.0</p>
                    <div className="footer-links">
                        <a href="#" onClick={() => navigate('/legal/terms')}>Terms of Service</a>
                        <span>•</span>
                        <a href="#" onClick={() => navigate('/legal/privacy')}>Privacy Policy</a>
                    </div>
                </div>
            </div>

            <BottomNav />

            {/* Delete Account Modal with Retention Strategy */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeleteStep(1);
                }}
                title={deleteStep === 1 ? "Delete Account?" : deleteStep === 2 ? "Are you sure?" : "Final Confirmation"}
            >
                <div className="delete-modal">
                    {deleteStep === 1 && (
                        <>
                            <div className="delete-icon">😢</div>
                            <h3>We'll miss you!</h3>
                            <p>Are you sure you want to delete your account? You'll lose:</p>
                            <ul className="delete-warnings">
                                <li>All your matches and conversations</li>
                                <li>Your VIP status and benefits</li>
                                <li>All diamonds and coins</li>
                                <li>Your profile and photos</li>
                            </ul>
                            <div className="delete-actions">
                                <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)}>
                                    Keep My Account
                                </Button>
                                <Button variant="danger" fullWidth onClick={handleDeleteAccount}>
                                    Continue Deletion
                                </Button>
                            </div>
                        </>
                    )}
                    {deleteStep === 2 && (
                        <>
                            <div className="delete-icon">💔</div>
                            <h3>Before you go...</h3>
                            <p>Instead of deleting, you could:</p>
                            <ul className="delete-alternatives">
                                <li>✨ Take a break with Incognito Mode</li>
                                <li>🔕 Disable notifications temporarily</li>
                                <li>🎁 Get 100 free diamonds to stay!</li>
                            </ul>
                            <div className="delete-actions">
                                <Button variant="primary" fullWidth onClick={() => setShowDeleteModal(false)}>
                                    Claim Free Diamonds
                                </Button>
                                <Button variant="ghost" fullWidth onClick={handleDeleteAccount}>
                                    Still Delete
                                </Button>
                            </div>
                        </>
                    )}
                    {deleteStep === 3 && (
                        <>
                            <div className="delete-icon">⚠️</div>
                            <h3>This is permanent!</h3>
                            <p>Your account will be deleted immediately and cannot be recovered.</p>
                            <div className="delete-actions">
                                <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" fullWidth onClick={handleDeleteAccount}>
                                    Delete Forever
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* General Input Modal */}
            <Modal
                isOpen={showInputModal}
                onClose={() => setShowInputModal(false)}
                title={`Update ${inputModalType === 'email' ? 'Email' : 'Phone Number'}`}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p>Enter your new {inputModalType === 'email' ? 'email address' : 'phone number'}:</p>
                    <input
                        type={inputModalType === 'email' ? 'email' : 'tel'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={inputModalType === 'email' ? 'user@example.com' : '+1 (555) 000-0000'}
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #333',
                            background: '#111',
                            color: 'white'
                        }}
                    />
                    <Button variant="primary" fullWidth onClick={handleSaveInput}>
                        Save Changes
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
