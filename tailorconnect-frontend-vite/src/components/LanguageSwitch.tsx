"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitch() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
            title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
        >
            <span className="text-lg">{language === 'en' ? '🇬🇧' : '🇫🇷'}</span>
            <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'FR'}</span>
        </button>
    );
}
