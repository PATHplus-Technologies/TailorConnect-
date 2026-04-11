"use client";

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-gray-50 border-t mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{t('footer.product')}</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="/designs" className="text-base text-gray-500 hover:text-gray-900 transition-colors">{t('nav.designs')}</a></li>
                            <li><a href="/tailors" className="text-base text-gray-500 hover:text-gray-900 transition-colors">{t('nav.tailors')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">{t('footer.support')}</h3>
                        <ul className="mt-4 space-y-4">
                            <li><a href="/contact" className="text-base text-gray-500 hover:text-gray-900 transition-colors">{t('footer.contact')}</a></li>
                            <li><a href="/about" className="text-base text-gray-500 hover:text-gray-900 transition-colors">{t('footer.about')}</a></li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">TailorConnect</h3>
                        <p className="mt-4 text-base text-gray-500 max-w-xs">
                            {t('footer.description')}
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 text-center">&copy; 2025 TailorConnect. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
}
