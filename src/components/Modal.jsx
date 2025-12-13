import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';
import { useEffect } from 'react';
import './Modal.css';

export default function Modal({
    isOpen,
    onClose,
    children,
    title,
    showCloseButton = true,
    size = 'medium',
    position = 'bottom'
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const modalVariants = {
        hidden: position === 'bottom'
            ? { y: '100%', opacity: 0 }
            : { scale: 0.9, opacity: 0 },
        visible: position === 'bottom'
            ? { y: 0, opacity: 1 }
            : { scale: 1, opacity: 1 },
        exit: position === 'bottom'
            ? { y: '100%', opacity: 0 }
            : { scale: 0.9, opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className={`modal modal-${size} modal-${position}`}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {title && (
                            <div className="modal-header">
                                <h2 className="modal-title">{title}</h2>
                                {showCloseButton && (
                                    <button className="modal-close" onClick={onClose}>
                                        <RiCloseLine size={24} />
                                    </button>
                                )}
                            </div>
                        )}
                        {!title && showCloseButton && (
                            <button className="modal-close modal-close-absolute" onClick={onClose}>
                                <RiCloseLine size={24} />
                            </button>
                        )}
                        <div className="modal-content">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
