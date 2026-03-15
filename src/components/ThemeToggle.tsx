import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { themeStore, setTheme, type Theme } from '../lib/theme';

const themes: { value: Theme; icon: JSX.Element; label: string }[] = [
    {
        value: 'light',
        label: 'Light',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
        ),
    },
    {
        value: 'dark',
        label: 'Dark',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        ),
    },
    {
        value: 'system',
        label: 'System',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
];

export default function ThemeToggle() {
    const currentTheme = useStore(themeStore);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />;
    }

    const currentIndex = themes.findIndex((t) => t.value === currentTheme);

    const cycleTheme = () => {
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].value);
    };

    return (
        <button
            onClick={cycleTheme}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl
                 transition-all duration-300 ease-out
                 hover:bg-[var(--color-accent)]/10 hover:scale-110
                 active:scale-95
                 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
            title={`Theme: ${themes[currentIndex].label}`}
            aria-label={`Switch theme, current: ${themes[currentIndex].label}`}
        >
            <span className="transition-transform duration-300 ease-out">
                {themes[currentIndex].icon}
            </span>
        </button>
    );
}
