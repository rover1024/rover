import { motion } from 'framer-motion';

import { useTranslations, getRelativeLocaleUrl } from '../i18n/utils';

interface HeroProps {
    avatarUrl: string;
    name: string;
    bio: string;
    githubUrl: string;
    lang: string;
}

export default function Hero({ avatarUrl, name, bio, githubUrl, lang }: HeroProps) {
    const t = useTranslations(lang);
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-grid animate-grid-fade opacity-30" />

            {/* Gradient orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--color-accent)]/20 rounded-full filter blur-[128px] animate-float" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--color-purple)]/20 rounded-full filter blur-[128px] animate-float" style={{ animationDelay: '1.5s' }} />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                {/* Avatar */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] rounded-full opacity-75 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-pulse-glow" />
                        <img
                            src={avatarUrl}
                            alt={name}
                            style={{ viewTransitionName: 'avatar' } as React.CSSProperties}
                            className="relative w-32 h-32 rounded-full border-2 border-[var(--color-bg-primary)] object-cover"
                        />
                    </div>
                </motion.div>

                {/* Name */}
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-display)] mb-4
                     bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-accent)] to-[var(--color-purple)] bg-clip-text text-transparent"
                >
                    {name}
                </motion.h1>

                {/* Bio */}
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed max-w-xl mx-auto"
                >
                    {bio}
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href={getRelativeLocaleUrl(lang, '/about')}
                        className="group relative px-8 py-3.5 rounded-2xl font-semibold text-sm
                       bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)]
                       text-white shadow-lg shadow-[var(--color-accent)]/25
                       hover:shadow-xl hover:shadow-[var(--color-accent)]/30
                       hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <span className="relative z-10">{t('hero.more')}</span>
                    </a>
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group px-8 py-3.5 rounded-2xl font-semibold text-sm
                       border border-[var(--color-border)] text-[var(--color-text-primary)]
                       hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
                       hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <span className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </span>
                    </a>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 rounded-full border-2 border-[var(--color-text-muted)] flex justify-center p-1.5">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
                    />
                </div>
            </motion.div>
        </section>
    );
}
