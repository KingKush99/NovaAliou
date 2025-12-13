import { motion } from 'framer-motion';
import './SplashScreen.css';

export default function SplashScreen() {
    return (
        <div className="splash-screen">
            <motion.div
                className="splash-content"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="splash-logo">
                    <h1>NoveltyCams</h1>
                </div>
                <div className="splash-spinner">
                    <div className="spinner-ring"></div>
                </div>
            </motion.div>
        </div>
    );
}
