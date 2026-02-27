import type { Variants } from 'framer-motion';

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15, ease: [0.4, 0, 1, 1] }
    }
};

export const slideUp: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
    },
    exit: {
        y: 20,
        opacity: 0,
        transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
    }
};

export const slideInRight: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3, ease: [0, 0, 0.2, 1] }
    },
    exit: {
        x: 20,
        opacity: 0,
        transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
    }
};

export const scaleUp: Variants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.2, ease: [0, 0, 0.2, 1] }
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: { duration: 0.15, ease: [0.4, 0, 1, 1] }
    }
};

export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};
