import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { Capacitor } from '@capacitor/core';
import { NativeAuthController } from '../utils/NativeAuthController';
import './GoogleLoginButton.css';

export default function GoogleLoginButton({ onSuccess }) {
    const { setUser } = useUserStore();
    const navigate = useNavigate();

    const handleNativeLogin = async () => {
        try {
            await NativeAuthController.initialize();
            const user = await NativeAuthController.signIn();

            if (user) {
                // Determine photo URL (Capacitor plugin returns imageUrl or imageUrl)
                const photoUrl = user.imageUrl || (user.authentication?.idToken && jwtDecode(user.authentication.idToken).picture);

                const userData = {
                    id: user.id || user.authentication?.sub,
                    name: user.displayName || user.name || user.givenName,
                    email: user.email,
                    photos: [photoUrl],
                    displayName: user.displayName || user.name,
                    age: 25,
                    bio: 'Mobile user',
                    location: 'Unknown',
                    isGoogleUser: true,
                    googleId: user.id
                };

                if (onSuccess) {
                    // Pass to onboarding to continue with permissions
                    onSuccess(userData);
                } else {
                    // Fallback: set user and navigate directly
                    setUser(userData);
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error('Native login failed', error);
            if (error) {
                alert('DEBUG ERROR CODE:\n' + JSON.stringify(error, null, 2) + '\n\nMessage: ' + error.message);
            } else {
                alert('Unknown Error Occurred');
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log('Google user info:', decoded);

            const userData = {
                id: decoded.sub,
                name: decoded.name,
                email: decoded.email,
                photos: [decoded.picture],
                displayName: decoded.name,
                age: 25,
                bio: 'New user',
                location: 'Unknown',
                isGoogleUser: true,
                googleId: decoded.sub
            };

            if (onSuccess) {
                // Pass to onboarding to continue with permissions
                onSuccess(userData);
            } else {
                // Fallback: set user and navigate directly
                setUser(userData);
                navigate('/home');
            }
        } catch (error) {
            console.error('Google login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    const handleError = () => {
        console.error('Google Login Failed');
        alert('Google login failed. Please try again.');
    };

    // If on native platform (Android/iOS), use the native button
    if (Capacitor.isNativePlatform()) {
        return (
            <div className="google-login-container">
                <button className="google-login-btn" onClick={handleNativeLogin}>
                    <FcGoogle size={20} />
                    <span>Continue with Google</span>
                </button>
            </div>
        );
    }

    // Check if Google Client ID is configured for Web
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId.includes('your_google_client_id')) {
        return (
            <button className="google-login-btn mock" onClick={() => {
                const userData = {
                    id: 'mock-google-user',
                    name: 'Google User',
                    email: 'user@gmail.com',
                    photos: ['https://i.pravatar.cc/150?img=12'],
                    displayName: 'Google User',
                    age: 25,
                    bio: 'Mock Google user',
                    location: 'USA'
                };

                if (onSuccess) {
                    // Pass to onboarding to continue with permissions
                    onSuccess(userData);
                } else {
                    // Fallback: set user and navigate directly
                    setUser(userData);
                    navigate('/home');
                }
            }}>
                <FcGoogle size={20} />
                <span>Continue with Google (Mock)</span>
            </button>
        );
    }

    return (
        <div className="google-login-container">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleError}
                useOneTap={false}
                theme="filled_black"
                size="large"
                text="continue_with"
                shape="rectangular"
                width="280"
            />
        </div>
    );
}
