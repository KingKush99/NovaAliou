
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMobController } from '../utils/AdMobController';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useSubscriptionStore, TIERS } from '../store/useSubscriptionStore';

export default function AdBanner({ style, className }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const isNative = Capacitor.isNativePlatform();
  const { tier } = useSubscriptionStore();

  useEffect(() => {
    let timer;
    if (isVisible) {
      if (isNative) {
        AdMobController.showBanner(60);
        // Delay close button to ensure it renders ON TOP of the native view
        setTimeout(() => setShowCloseBtn(true), 1500);
      }
    } else {
      if (isNative) {
        AdMobController.hideBanner();
      }
      setShowCloseBtn(false);
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 90000);
    }

    return () => {
      clearTimeout(timer);
      if (isNative) AdMobController.hideBanner();
    };
  }, [isVisible, isNative]);

  const handleClose = () => {
    setIsVisible(false);
    setShowCloseBtn(false);
  };

  if (!isVisible || tier !== TIERS.FREE) return null;

  // On Native: Render transparent placeholder + Close Button
  // On Web: Render Mock Banner
  return (
    <>
      {/* Close Button: Rendered with delay and high Z-Index */}
      {showCloseBtn && (
        <div style={{
          position: 'fixed',
          top: '35px', // Adjust based on banner position? Native banner is usually bottom or top.
          right: '10px',
          zIndex: 2147483647,
          cursor: 'pointer',
          background: 'rgba(255, 0, 0, 0.9)',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }} onClick={handleClose}>
          <RiCloseCircleFill size={20} color="#fff" />
        </div>
      )}

      {/* Web Mock */}
      {!isNative && (
        <div className={`web-ad-mock ${className || ''}`} style={{
          background: '#222',
          color: '#aaa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          borderTop: '1px solid #333',
          ...style
        }}>
          <span>📱 [AdBanner Mock] AdMob Banner Space</span>
          <button onClick={handleClose} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <RiCloseCircleFill />
          </button>
        </div>
      )}
    </>
  );
}
