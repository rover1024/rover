import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Friend } from '../data/friends';

import { useTranslations } from '../i18n/utils';

interface FriendCardProps {
    friend: Friend;
    index: number;
    lang: string;
}

export default function FriendCard({ friend, index, lang }: FriendCardProps) {
    const t = useTranslations(lang);
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [mouseX, setMouseX] = useState(50);
    const [mouseY, setMouseY] = useState(50);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setRotateX((y - 0.5) * -15);
        setRotateY((x - 0.5) * 15);
        setMouseX(x * 100);
        setMouseY(y * 100);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="group"
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="relative rounded-2xl cursor-pointer"
                style={{
                    transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transition: 'transform 0.15s ease-out',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Animated border glow */}
                <div
                    className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #f59e0b, #6366f1)`,
                        backgroundSize: '300% 300%',
                        animation: isHovered ? 'border-flow 4s linear infinite' : 'none',
                    }}
                />

                {/* Card body */}
                <div className="relative rounded-2xl bg-[var(--color-bg-card)] p-6 overflow-hidden">
                    {/* Holographic shimmer overlay */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, 
                rgba(99,102,241,0.15) 0%, 
                rgba(139,92,246,0.08) 25%,
                rgba(236,72,153,0.05) 50%, 
                transparent 70%)`,
                        }}
                    />

                    {/* Prismatic light effect */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none mix-blend-overlay"
                        style={{
                            background: `linear-gradient(${mouseX * 3.6}deg, 
                transparent 20%, 
                rgba(99,102,241,0.3) 35%, 
                rgba(139,92,246,0.3) 45%, 
                rgba(236,72,153,0.3) 55%, 
                rgba(245,158,11,0.3) 65%, 
                transparent 80%)`,
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Avatar + Name row */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] rounded-full opacity-0 group-hover:opacity-80 blur-sm transition-all duration-500" />
                                <img
                                    src={friend.avatar}
                                    alt={friend.name}
                                    className="relative w-14 h-14 rounded-full border-2 border-[var(--color-border)] group-hover:border-transparent
                             object-cover transition-all duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold font-[family-name:var(--font-display)] text-[var(--color-text-primary)]
                               group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[var(--color-accent)] group-hover:to-[var(--color-purple)] group-hover:bg-clip-text
                               transition-all duration-300 truncate">
                                    {friend.name}
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] truncate">{t(`friend.${friend.id}.title` as any)}</p>
                            </div>
                        </div>

                        {/* Bio — revealed on hover */}
                        <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100">
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 mb-3">
                                {t(`friend.${friend.id}.bio` as any)}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {friend.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 text-[10px] font-medium rounded-md
                             bg-[var(--color-accent)]/8 text-[var(--color-accent)]
                             border border-[var(--color-accent)]/15
                             group-hover:bg-[var(--color-accent)]/15 group-hover:border-[var(--color-accent)]/30
                             transition-all duration-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)] group-hover:border-[var(--color-accent)]/20 transition-colors duration-300">
                            <a
                                href={friend.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]
                           hover:text-[var(--color-accent)] transition-colors duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                                {t('friend.blog')}
                            </a>
                            <a
                                href={friend.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]
                           hover:text-[var(--color-accent)] transition-colors duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
