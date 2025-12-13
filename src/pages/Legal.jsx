import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Legal() {
    const { type } = useParams();
    const navigate = useNavigate();
    const title = type === 'terms' ? 'Terms of Service' : 'Privacy Policy';

    return (
        <div className="legal-page" style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'white' }}>
            <Header title={title} showBack onBack={() => navigate(-1)} />
            <div className="legal-content" style={{ padding: '80px 20px 20px' }}>
                <h1>{title}</h1>
                <p style={{ marginTop: '20px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    Last updated: November 2025
                </p>

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <section>
                        <h3 style={{ marginBottom: '10px' }}>1. Introduction</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Welcome to NoveltyCams. By using our service, you agree to these terms.
                            Please read them carefully.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ marginBottom: '10px' }}>2. User Conduct</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            You agree to use the service in a respectful manner. Harassment,
                            hate speech, and illegal content are strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ marginBottom: '10px' }}>3. Privacy</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            We take your privacy seriously. We collect minimal data necessary
                            to provide the service. See our Privacy Policy for details.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ marginBottom: '10px' }}>4. Virtual Currency</h3>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Coins and Diamonds have no real-world monetary value and cannot
                            be exchanged for cash.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
