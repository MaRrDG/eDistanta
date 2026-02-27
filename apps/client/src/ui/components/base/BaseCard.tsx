import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface BaseCardProps extends HTMLMotionProps<"div"> {
    variant?: 'flat' | 'elevated' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const BaseCard = ({
    children,
    className = '',
    variant = 'elevated',
    padding = 'md',
    ...props
}: BaseCardProps) => {
    const variants = {
        flat: 'bg-white border border-gray-100',
        elevated: 'bg-white shadow-sm border border-gray-50',
        glass: 'bg-white/70 backdrop-blur-md border border-white/20',
    };

    const paddings = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-7',
    };

    return (
        <motion.div
            className={`rounded-2xl transition-all duration-200 ${variants[variant]} ${paddings[padding]} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default BaseCard;
