import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import GlobalErrorBoundary from './components/GlobalErrorBoundary.jsx';
import './index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'mock-client-id';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalErrorBoundary>
            <GoogleOAuthProvider clientId={googleClientId}>
                <App />
            </GoogleOAuthProvider>
        </GlobalErrorBoundary>
    </React.StrictMode>,
)
