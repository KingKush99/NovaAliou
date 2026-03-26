import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiFireFill, RiMessage3Fill, RiVideoFill, RiArrowRightLine, RiArrowLeftLine, RiGoogleFill, RiCalendarLine, RiCameraLine, RiMicLine, RiSkipForwardLine } from 'react-icons/ri';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';
import { useUserStore } from '../store/userStore';
import './Onboarding.css';

const STEPS = [
    {
        id: 1,
        title: "Welcome to NoveltyCams",
        desc: "The ultimate platform for live streaming and connection.",
        icon: <RiVideoFill size={64} />,
        color: "#FFD700"
    },
    {
        id: 2,
        title: "Discover Hot Content",
        desc: "Explore thousands of live broadcasters from around the world.",
        icon: <RiFireFill size={64} />,
        color: "#FF6B6B"
    },
    {
        id: 3,
        title: "Chat & Connect",
        desc: "Interact in real-time and make new friends instantly.",
        icon: <RiMessage3Fill size={64} />,
        color: "#4ECDC4"
    },
    {
        id: 4,
        title: "Setup Your Profile",
        desc: "Enter your birthday to verify your age.",
        icon: <RiCalendarLine size={64} />,
        color: "#FFF"
    },
    {
        id: 5,
        title: "Enable Permissions",
        desc: "Allow camera and microphone access for streaming and video calls.",
        icon: <RiCameraLine size={64} />,
        color: "#00E5FF",
        isPermissionStep: true
    }
];

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const { setUser } = useUserStore();
    const [birthDate, setBirthDate] = useState('');
    const [permissionGranted, setPermissionGranted] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const requestPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setPermissionGranted(true);
            return true;
        } catch (err) {
            console.error("Permission error:", err);
            alert("Camera/Microphone access is required for streaming features. Please enable permissions in your browser settings.");
            return false;
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleNext = async () => {
        // Step 3 (Birthday) validation
        if (step === 3) {
            if (!birthDate) {
                alert("Please enter your birth date.");
                return;
            }
            const age = calculateAge(birthDate);
            if (age < 18) {
                alert("You must be 18+ to use this app.");
                return;
            }
            setUser({ age: age, birthDate: birthDate });
            setStep(step + 1);
            return;
        }

        // Step 4 (Permissions)
        if (step === 4) {
            // Check if already granted (stream active)
            if (!permissionGranted) {
                const granted = await requestPermissions();
                if (!granted) return;
                // Don't advance yet? Or advance?
                // User said "make them work". Showing the preview confirms it works.
                // We should probably show a "Continue" button once preview is live.
                // If this function is called by "Next/Enable", we should prob allow proceeding if already enabled.
                return;
            }

            // If granted, then finish
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            localStorage.setItem('hasOnboarded', 'true');
            localStorage.setItem('showDailyLogin', 'true'); // Trigger daily login after onboarding
            navigate('/home');
            return;
        }

        // Other steps
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // Initialize GoogleAuth (Required on Web, safe on Native)
            await GoogleAuth.initialize({
                clientId: '211356037468-t37lqacjk52oi62rbdpretftpo0srstr.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
                grantOfflineAccess: true
            });

            const user = await GoogleAuth.signIn();
            console.log('Google User:', user);

            // Set user data from Google response
            setUser({
                displayName: user.name || user.givenName,
                email: user.email,
                photos: user.imageUrl ? [user.imageUrl] : [],
                googleId: user.id
            });

            // Set a mock birthdate (Google doesn't provide this) and proceed
            setBirthDate('2000-01-01');
            setStep(step + 1);
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            alert('Google Sign-In failed. Please try again or enter your birthday manually.');
        }
    };

    const handleSkipPermissions = () => {
        // Allow user to skip permissions - they can enable later in Settings or when going Live
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        localStorage.setItem('hasOnboarded', 'true');
        localStorage.setItem('permissionsSkipped', 'true'); // Flag for later prompting
        localStorage.setItem('showDailyLogin', 'true'); // Trigger daily login after onboarding
        navigate('/home');
    };

    const renderStepContent = () => {
        // Birthday Step
        if (step === 3) {
            return (
                <div className="onboarding-form">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="onboarding-input"
                    />
                    <div className="divider">OR</div>
                    <button className="google-btn" onClick={handleGoogleLogin}>
                        <RiGoogleFill /> Continue with Google
                    </button>
                    <p className="hint">We use this to verify your age.</p>
                </div>
            );
        }

        // Permissions Step
        if (step === 4) {
            return (
                <div className="onboarding-form permissions-step">
                    {!permissionGranted ? (
                        <>
                            <div className="permission-icons">
                                <div className="permission-icon"><RiCameraLine size={48} /></div>
                                <div className="permission-icon"><RiMicLine size={48} /></div>
                            </div>
                            <p className="hint">Tap "Enable Access" to verify camera and microphone.</p>
                        </>
                    ) : (
                        <div className="camera-preview-container">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="onboarding-camera-preview"
                            />
                            <p className="hint success">Camera & Mic Connected! Tap Finish to start.</p>
                        </div>
                    )}
                </div>
            );
        }

        return <p>{STEPS[step].desc}</p>;
    };

    return (
        <div className="onboarding-container">
            <div className="onboarding-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    className="onboarding-content"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="icon-wrapper" style={{ color: STEPS[step].color }}>
                        {STEPS[step].icon}
                    </div>
                    <h1>{STEPS[step].title}</h1>
                    {renderStepContent()}
                </motion.div>
            </AnimatePresence>

            <div className="onboarding-footer">
                <div className="dots-indicator">
                    {STEPS.map((_, idx) => (
                        <div key={idx} className={`dot ${idx === step ? 'active' : ''}`} />
                    ))}
                </div>

                <div className="footer-buttons">
                    {step > 0 && (
                        <button className="back-btn" onClick={handleBack}>
                            <RiArrowLeftLine /> Back
                        </button>
                    )}

                    {/* Skip button for permissions step */}
                    {step === 4 && !permissionGranted && (
                        <button className="skip-btn" onClick={handleSkipPermissions}>
                            Skip for now
                        </button>
                    )}

                    <button className="next-btn" onClick={handleNext}>
                        {step === 4 ? (permissionGranted ? "Finish" : "Enable Access") : (step === STEPS.length - 1 ? 'Finish' : 'Next')}
                        {step !== 4 && <RiArrowRightLine />}
                    </button>
                </div>
            </div>
        </div>
    );
}
