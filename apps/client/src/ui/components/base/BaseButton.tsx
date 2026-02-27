import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface BaseButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const BaseButton: React.FC<BaseButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-brand-primary/20',
        secondary: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50',
        ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100',
        danger: 'bg-error text-white hover:bg-error/90 shadow-error/20',
        warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
        md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
        lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || (disabled as boolean)}
            className={`${baseClasses} ${variants[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </motion.button>
    );
};

export default BaseButton;
