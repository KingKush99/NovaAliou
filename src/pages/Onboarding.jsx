import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiFireFill, RiMessage3Fill, RiVideoFill, RiArrowRightLine, RiGoogleFill, RiCalendarLine } from 'react-icons/ri';
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
        desc: "Verify your age to continue.",
        icon: <RiCalendarLine size={64} />,
        color: "#FFF"
    }
];

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const { setUser } = useUserStore();
    const [birthDate, setBirthDate] = useState('');

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

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            // Final Step Validation
            if (!birthDate) {
                alert("Please enter your birth date.");
                return;
            }
            const age = calculateAge(birthDate);
            if (age < 18) {
                alert("You must be 18+ to use this app.");
                return;
            }

            // Save to Store
            setUser({ age: age, birthDate: birthDate });

            // Complete
            localStorage.setItem('hasOnboarded', 'true');
            navigate('/home');
        }
    };

    const handleGoogleLogin = () => {
        // Mock Login
        alert("Google Login Simulated");
        handleNext();
    };

    const renderStepContent = () => {
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

                <button className="next-btn" onClick={handleNext}>
                    {step === STEPS.length - 1 ? 'Finish' : 'Next'} <RiArrowRightLine />
                </button>
            </div>
        </div>
    );
}
