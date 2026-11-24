import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fr');
    const [translations, setTranslations] = useState<any>({});

    useEffect(() => {
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'en' || saved === 'fr')) {
            setLanguageState(saved);
        }
    }, []);

    useEffect(() => {
        import(`../translations/${language}.json`)
            .then((module) => setTranslations(module.default))
            .catch((err) => console.error('Failed to load translations:', err));
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) return key;
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        return {
            language: 'fr' as Language,
            setLanguage: () => { },
            t: (key: string) => key
        };
    }
    return context;
}
