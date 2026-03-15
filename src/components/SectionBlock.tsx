import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionBlockProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function SectionBlock({ children, className = '', delay = 0 }: SectionBlockProps) {
    return (
        <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
