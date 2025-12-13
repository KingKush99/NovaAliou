import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiArrowLeftLine, RiUser3Fill } from 'react-icons/ri';
import { useUserStore } from '../store/userStore';
import HamburgerMenu from './HamburgerMenu';
import './Header.css';
import logoBg from '../assets/logo_bg.jpg';
import coinImg from '../assets/NCoin.png';

export default function Header({ title, showBack, onBack, rightAction, showBalance }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, coins } = useUserStore();

    const [isKissing, setIsKissing] = useState(false);

    const handleLogoClick = () => {
        setIsKissing(true);
        navigate('/home');
        setTimeout(() => setIsKissing(false), 1000);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                {showBack ? (
                    <button className="header-back-btn" onClick={handleBack}>
                        <RiArrowLeftLine size={24} />
                    </button>
                ) : (
                    <button className="header-profile-btn" onClick={() => navigate('/profile')}>
                        <div className="header-avatar">
                            <img src={user.photos[0] || 'https://i.pravatar.cc/150?img=68'} alt="Profile" />
                        </div>
                    </button>
                )}
            </div>

            <div className="header-center">
                <div className={`header-logo-circle ${isKissing ? 'kissing' : ''}`} onClick={handleLogoClick}>
                    <img src={logoBg} alt="NoveltyCams" />
                </div>
            </div>

            <div className="header-right">
                {rightAction ? rightAction : <HamburgerMenu />}
            </div>
        </header>
    );
}
