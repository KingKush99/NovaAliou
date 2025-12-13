import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught Error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: 20,
                    paddingTop: 100,
                    background: '#1a0000',
                    color: '#ff3333',
                    height: '100vh',
                    width: '100%',
                    overflow: 'auto',
                    fontFamily: 'monospace'
                }}>
                    <h1>⚠️ CRITICAL APP ERROR ⚠️</h1>
                    <h3>{this.state.error?.toString()}</h3>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: 10 }}>
                        {this.state.errorInfo?.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: 20,
                            padding: '15px 30px',
                            fontSize: 18,
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: 8
                        }}
                    >
                        RELOAD APP
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
