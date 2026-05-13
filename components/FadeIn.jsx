'use client';
import { motion } from 'framer-motion';

const FadeIn = ({ 
    children, 
    delay = 0, 
    direction = 'up', 
    className = '', 
    fullWidth = false,
    duration = 0.8,
    scale = 1,
    blur = false
}) => {
    const directions = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 },
        none: { y: 0, x: 0 },
    };

    return (
        <motion.div
            initial={{ 
                opacity: 0, 
                ...directions[direction],
                scale: scale !== 1 ? scale : 1,
                filter: blur ? 'blur(10px)' : 'none'
            }}
            whileInView={{ 
                opacity: 1, 
                y: 0, 
                x: 0,
                scale: 1,
                filter: 'blur(0px)'
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
                duration: duration, 
                delay: delay, 
                ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier for boutique feel
            }}
            className={className}
            style={{ width: fullWidth ? '100%' : 'auto' }}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
