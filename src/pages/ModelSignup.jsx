import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiUploadCloud2Line, RiBankCardLine, RiIdCardLine, RiKeyLine } from 'react-icons/ri';
import { validateReferralCode } from '../utils/referralCodes';
import Header from '../components/Header';
import './Profile.css';

export default function ModelSignup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        referralCode: '',
        legalName: '',
        dob: '',
        idFront: null,
        idBack: null,
        cardNumber: '',
        expiry: '',
        cvc: ''
    });
    const [codeError, setCodeError] = useState('');
    const [nameError, setNameError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationLog, setVerificationLog] = useState([]);


    const handleNext = () => {
        let hasError = false;

        if (step === 1) {
            // Referral Code Validation
            if (formData.referralCode !== 'NEWBIE20') {
                setCodeError('CRITICAL: Invalid referral code. Only pre-screened models may apply.');
                hasError = true;
            } else {
                setCodeError('');
            }

            // Legal Name Validation (Prestige Check)
            const nameParts = formData.legalName.trim().split(/\s+/);
            if (nameParts.length < 2) {
                setNameError('SECURITY ALERT: Full legal name (First & Last) required for payout verification.');
                hasError = true;
            } else {
                setNameError('');
            }

            // ID Upload Check
            if (!formData.idFront) {
                alert("ID front photo is required for AI identity verification.");
                hasError = true;
            }

            if (hasError) return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const handleFileChange = (e, field) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, [field]: e.target.files[0] });
        }
    };

    const handleSubmit = () => {
        setIsVerifying(true);
        setVerificationLog(['Initializing biometric scan...', 'Accessing global ID databases...']);

        // Step 1: Scan Front ID
        setTimeout(() => {
            setVerificationLog(prev => [...prev, 'OCR Analysis: Extracting name and DOB...', 'Front ID: AUTHENTIC']);

            // Step 2: Cross-reference
            setTimeout(() => {
                setVerificationLog(prev => [...prev, 'Cross-referencing legal name with banking records...', 'Database Match: POSITIVE']);

                // Step 3: Final Approval
                setTimeout(() => {
                    setVerificationLog(prev => [...prev, 'Security check passed.', 'Welcome to the platform!']);
                    alert("✅ AI IDENTITY VERIFIED\n\nYour model account has been successfully authorized for payouts.\n\nClick OK to visit your dashboard.");
                    setIsVerifying(false);
                    navigate('/profile');
                }, 2000);
            }, 2000);
        }, 2000);
    };

    return (
        <div className="profile-page" style={{ paddingTop: 60 }}>
            {/* Custom Header for Signup */}
            <div className="profile-top-bar" style={{ position: 'fixed', top: 0, width: '100%', background: 'black', zIndex: 10 }}>
                <button className="top-bar-btn" onClick={handleBack}><RiArrowLeftLine size={24} /></button>
                <span className="top-bar-title">Become a Model</span>
                <div style={{ width: 40 }}></div>
            </div>

            <div className="profile-content" style={{ padding: 20 }}>
                {step === 1 && (
                    <div className="signup-step">
                        <h2>Model Application</h2>
                        <p className="step-desc">Enter your referral code to begin.</p>

                        <label className="input-label">Referral Code (Required)</label>
                        <div className="input-with-icon">
                            <RiKeyLine className="input-icon" />
                            <input type="text" className="dark-input" placeholder="Enter code from model or admin"
                                value={formData.referralCode}
                                onChange={e => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                                style={{ borderColor: codeError ? '#ff4444' : '#333' }}
                            />
                        </div>
                        {codeError && <p style={{ color: '#ff4444', fontSize: 12, marginTop: -10 }}>{codeError}</p>}

                        <label className="input-label">Legal Name</label>
                        <input type="text" className="dark-input" placeholder="Enter full legal name (First Last)"
                            value={formData.legalName} onChange={e => setFormData({ ...formData, legalName: e.target.value })}
                            style={{ borderColor: nameError ? '#ff4444' : '#333' }}
                        />
                        {nameError && <p style={{ color: '#ff4444', fontSize: 11, marginTop: -10, marginBottom: 15 }}>{nameError}</p>}

                        <label className="input-label">Date of Birth</label>
                        <input type="date" className="dark-input"
                            value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />

                        <div className="id-upload-section">
                            <label>Government ID (Front)</label>
                            <p style={{ fontSize: 10, color: '#666', marginBottom: 5 }}>High-resolution photo required for AI biometric analysis.</p>
                            <div className="upload-box">
                                <input type="file" id="idFront" hidden onChange={e => handleFileChange(e, 'idFront')} />
                                <label htmlFor="idFront" className="upload-label">
                                    <RiIdCardLine size={30} style={{ color: formData.idFront ? '#ffd700' : '#444' }} />
                                    <span style={{ color: formData.idFront ? '#fff' : '#888' }}>
                                        {formData.idFront ? `File: ${formData.idFront.name}` : "Tap to Upload Front"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button className="gold-btn full-width" onClick={handleNext}>Next: Payout Info</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="signup-step">
                        <h2>Payout Information</h2>
                        <p className="step-desc">Banking and payout authorization.</p>

                        <label className="input-label">Debit/Credit Card Number</label>
                        <div className="input-with-icon">
                            <RiBankCardLine className="input-icon" />
                            <input type="text" className="dark-input pl-40" placeholder="0000 0000 0000 0000"
                                value={formData.cardNumber} onChange={e => setFormData({ ...formData, cardNumber: e.target.value })} />
                        </div>

                        <div className="form-row">
                            <div>
                                <label className="input-label">Expiry</label>
                                <input type="text" className="dark-input" placeholder="MM/YY"
                                    value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} />
                            </div>
                            <div>
                                <label className="input-label">CVC</label>
                                <input type="text" className="dark-input" placeholder="123"
                                    value={formData.cvc} onChange={e => setFormData({ ...formData, cvc: e.target.value })} />
                            </div>
                        </div>

                        {isVerifying ? (
                            <div className="verification-status-panel">
                                <div className="spinning-loader"></div>
                                <div className="log-container">
                                    {verificationLog.map((log, i) => (
                                        <div key={i} className="log-entry">&gt; {log}</div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <button className="gold-btn full-width" onClick={handleSubmit}>Authorize & Submit</button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .signup-step h2 { margin-bottom: 10px; color: #ffd700; }
                .step-desc { color: #888; margin-bottom: 20px; font-size: 14px; }
                .input-label { display: block; color: #ccc; margin-bottom: 5px; font-size: 13px; }
                .dark-input { width: 100%; background: #222; border: 1px solid #333; color: white; padding: 12px; border-radius: 8px; margin-bottom: 15px; }
                .gold-btn { background: #ffd700; color: black; border: none; padding: 14px; border-radius: 25px; font-weight: bold; cursor: pointer; margin-top: 20px; }
                .full-width { width: 100%; }
                .upload-box { background: #222; border: 2px dashed #444; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 20px; }
                .upload-label { display: flex; flex-direction: column; align-items: center; gap: 10px; color: #888; cursor: pointer; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

                .verification-status-panel {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 20px;
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                }
                .spinning-loader {
                    width: 30px;
                    height: 30px;
                    border: 3px solid rgba(212, 175, 55, 0.3);
                    border-top-color: #d4af37;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .log-container { width: 100%; font-family: monospace; font-size: 11px; color: #888; }
                .log-entry { margin-bottom: 4px; border-left: 2px solid #333; padding-left: 8px; }
            `}</style>
        </div>
    );
}
