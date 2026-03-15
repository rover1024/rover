import { atom } from 'nanostores';

export type Theme = 'light' | 'dark' | 'system';

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) || 'system';
}

export const themeStore = atom<Theme>(getInitialTheme());

export function setTheme(theme: Theme) {
    themeStore.set(theme);
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    }
}

export function applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
        root.classList.toggle('light', !prefersDark);
    } else {
        root.classList.toggle('dark', theme === 'dark');
        root.classList.toggle('light', theme === 'light');
    }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themeStore.get() === 'system') {
            applyTheme('system');
        }
    });
}
