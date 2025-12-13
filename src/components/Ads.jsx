import { useState, useEffect } from 'react';
import { RiCloseLine, RiAdvertisementFill } from 'react-icons/ri';
import './Ads.css';

export const VideoAd = ({ onClose }) => {
    const [timeLeft, setTimeLeft] = useState(15);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="ad-overlay">
            <div className="ad-video-container">
                <div className="ad-header">
                    <span className="ad-badge">Ad</span>
                    {timeLeft > 0 ? (
                        <span className="ad-timer">Reward in {timeLeft}s</span>
                    ) : (
                        <button className="ad-close-btn" onClick={onClose}>
                            <RiCloseLine />
                        </button>
                    )}
                </div>
                <div className="ad-content">
                    {/* Mock Video Content */}
                    <div className="mock-video">
                        <h3>Amazing Product!</h3>
                        <p>Buy now and save 50%</p>
                        <button className="cta-btn">Shop Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BannerAd = ({ position = 'bottom' }) => {
    return (
        <div className={`banner-ad ${position}`}>
            <div className="banner-content">
                <RiAdvertisementFill />
                <span>Sponsored Content</span>
            </div>
        </div>
    );
};
