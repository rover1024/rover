import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTranslations, languages, getRelativeLocaleUrl } from '../i18n/utils';

interface NavbarProps {
    currentPath: string;
    lang: string;
}

export default function Navbar({ currentPath, lang }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const t = useTranslations(lang);

    const navItems = [
        { label: t('nav.home'), href: getRelativeLocaleUrl(lang, '/') },
        { label: t('nav.about'), href: getRelativeLocaleUrl(lang, '/about') },
        { label: t('nav.projects'), href: getRelativeLocaleUrl(lang, '/projects') },
        { label: t('nav.friends'), href: getRelativeLocaleUrl(lang, '/friends') },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isActive = (href: string) => {
        // Exact match for root page of the language or root path itself
        if (href === `/${lang}/` || href === `/${lang}`) {
            return currentPath === `/${lang}/` || currentPath === `/${lang}` || currentPath === '/';
        }
        return currentPath.startsWith(href);
    };

    const currentPathWithoutLang = currentPath.replace(new RegExp(`^/${lang}`), '') || '/';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? 'py-3 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl navbar-scrolled'
                    : 'py-5 bg-transparent'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a
                    href={getRelativeLocaleUrl(lang, '/')}
                    className="text-xl font-bold font-[family-name:var(--font-display)] 
                     bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-purple)] bg-clip-text text-transparent
                     hover:opacity-80 transition-opacity"
                >
                    Rover.
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 
                ${isActive(item.href)
                                    ? 'text-[var(--color-accent)]'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                }`}
                        >
                            {isActive(item.href) && (
                                <span className="absolute inset-0 bg-[var(--color-accent)]/10 rounded-xl" />
                            )}
                            <span className="relative">{item.label}</span>
                        </a>
                    ))}

                    <div className="ml-3 pl-3 flex items-center gap-2 border-l border-[var(--color-border)]">
                        {/* Language Switcher */}
                        <div className="relative" ref={langMenuRef}>
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
                           text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                           hover:bg-[var(--color-accent)]/10 transition-colors"
                                aria-label="Switch language"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                                <span className="uppercase text-xs">{lang.split('-')[0]}</span>
                            </button>

                            {/* Dropdown */}
                            <div className={`absolute top-full right-0 mt-2 w-32 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-lg shadow-[var(--color-bg-primary)]/50 transition-all duration-200 origin-top-right overflow-hidden ${langMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                                }`}>
                                {Object.entries(languages).map(([key, label]) => (
                                    <a
                                        key={key}
                                        href={getRelativeLocaleUrl(key, currentPathWithoutLang)}
                                        className={`block px-4 py-2.5 text-sm transition-colors ${lang === key
                                                ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
                                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
                                            }`}
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Nav Toggle */}
                <div className="flex md:hidden items-center gap-2">
                    {/* Mobile Language Dropdown (simplified) */}
                    <div className="relative">
                        <button
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl
                           text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                           hover:bg-[var(--color-accent)]/10 transition-colors"
                        >
                            <span className="uppercase text-xs font-semibold">{lang.split('-')[0]}</span>
                        </button>
                        {langMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-lg z-50 overflow-hidden">
                                {Object.entries(languages).map(([key, label]) => (
                                    <a
                                        key={key}
                                        href={getRelativeLocaleUrl(key, currentPathWithoutLang)}
                                        className={`block px-4 py-2.5 text-sm ${lang === key ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'text-[var(--color-text-primary)]'
                                            }`}
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <ThemeToggle />

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl
                       hover:bg-[var(--color-accent)]/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`w-5 h-0.5 bg-[var(--color-text-primary)] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1' : ''
                                }`}
                        />
                        <span
                            className={`w-5 h-0.5 bg-[var(--color-text-primary)] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-4 space-y-1 bg-[var(--color-bg-primary)]/95 backdrop-blur-xl border-b border-[var(--color-border)]">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(item.href)
                                    ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]'
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}
