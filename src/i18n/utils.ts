import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import en from './locales/en.json';

export const languages = {
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'en': 'English',
};

export const defaultLang = 'zh-CN';

export type UiKey = keyof typeof zhCN;

export const ui: Record<string, Record<UiKey, string>> = {
    'zh-CN': zhCN as Record<UiKey, string>,
    'zh-TW': zhTW as Record<UiKey, string>,
    'en': en as Record<UiKey, string>,
};

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: string | keyof typeof ui) {
    const validLang = (lang in ui ? lang : defaultLang) as keyof typeof ui;
    return function t(key: UiKey) {
        return ui[validLang][key] || ui[defaultLang][key];
    };
}

// Generate the paths with current language
export function getRelativeLocaleUrl(lang: string, path: string) {
    const cleanPath = path.replace(/^\//, ''); // remove leading slash
    if (!cleanPath) return `/${lang}/`;
    return `/${lang}/${cleanPath}`;
}
