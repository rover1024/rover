import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    url?: string;
    image?: string;
    index: number;
}

export default function ProjectCard({ title, description, tags, url, image, index }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glareX, setGlareX] = useState(50);
    const [glareY, setGlareY] = useState(50);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setRotateX((y - 0.5) * -10);
        setRotateY((x - 0.5) * 10);
        setGlareX(x * 100);
        setGlareY(y * 100);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    const Wrapper = url ? 'a' : 'div';
    const wrapperProps = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
        <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Wrapper {...wrapperProps} className="block">
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative rounded-2xl overflow-hidden border border-[var(--color-border)]
                     bg-[var(--color-bg-card)] transition-shadow duration-500
                     hover:shadow-2xl hover:shadow-[var(--color-accent)]/10
                     group cursor-pointer"
                    style={{
                        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                        transition: 'transform 0.1s ease-out',
                    }}
                >
                    {/* Light tracking glare */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                        style={{
                            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(99,102,241,0.12) 0%, transparent 60%)`,
                        }}
                    />

                    {/* Card image */}
                    {image && (
                        <div className="h-48 overflow-hidden">
                            <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    )}

                    {/* Card content */}
                    <div className="p-6">
                        <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mb-2
                           group-hover:text-[var(--color-accent)] transition-colors duration-300">
                            {title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                            {description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 text-xs font-medium rounded-lg
                             bg-[var(--color-accent)]/10 text-[var(--color-accent)]
                             border border-[var(--color-accent)]/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Wrapper>
        </motion.div>
    );
}
