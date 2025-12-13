
import { useEffect, useState } from 'react';
import { AdMobController } from '../utils/AdMobController';
import { RiCloseCircleFill } from 'react-icons/ri';

export default function AdBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [showCloseBtn, setShowCloseBtn] = useState(false);

  useEffect(() => {
    let timer;
    if (isVisible) {
      AdMobController.showBanner(60);
      // Delay close button to ensure it renders ON TOP of the native view
      setTimeout(() => setShowCloseBtn(true), 1500);
    } else {
      AdMobController.hideBanner();
      setShowCloseBtn(false);
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 90000);
    }

    return () => {
      clearTimeout(timer);
      AdMobController.hideBanner();
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    setShowCloseBtn(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Close Button: Rendered with delay and high Z-Index */}
      {showCloseBtn && (
        <div style={{
          position: 'fixed',
          top: '35px',
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

      {/* Web Mock - Debug Version 2.1 */}
      <div className="web-ad-mock" style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '100%',
        height: '50px',
        background: '#333',
        color: '#fff',
        display: 'none', // Hidden by default
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontSize: '12px',
        opacity: 0.8
      }}>
        📱 AdMob Banner (Real Ads in Native)
      </div>
    </>
  );
}
