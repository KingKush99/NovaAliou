import { motion } from 'framer-motion';
import clsx from 'clsx';
import './Button.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className,
    ...props
}) {
    const buttonClass = clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        {
            'btn-loading': loading,
            'btn-disabled': disabled,
            'btn-full-width': fullWidth,
            'btn-icon-only': icon && !children
        },
        className
    );

    return (
        <motion.button
            className={buttonClass}
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
            whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
            transition={{ duration: 0.1 }}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
                    {children && <span className="btn-text">{children}</span>}
                    {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
                </>
            )}
        </motion.button>
    );
}
