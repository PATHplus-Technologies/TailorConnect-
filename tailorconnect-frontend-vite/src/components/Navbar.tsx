import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitch from '@/components/LanguageSwitch';
import NotificationBell from '@/components/NotificationBell';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
    const location = useLocation();
    const pathname = location.pathname;
    const { t } = useLanguage();
    const { user, isAuthenticated, logout } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Tailor<span className="text-green-600">Connect</span></span>
                        </Link>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link to="/" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                {t('nav.home')}
                            </Link>
                            <Link to="/designs" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/designs' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                {t('nav.designs')}
                            </Link>
                            {user?.role === 'client' && (
                                <Link to="/tailors" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/tailors' ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                    {t('nav.tailors')}
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden xs:block">
                            <LanguageSwitch />
                        </div>
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <span className="text-sm text-gray-500 hidden lg:block">
                                    {t('dashboard.welcome')}, <span className="font-bold text-gray-900">{user?.username}</span> ({user?.role})
                                </span>
                                <NotificationBell />
                                <Link to="/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors">
                                    {t('nav.dashboard')}
                                </Link>
                                <button onClick={handleLogout} className="hidden sm:block text-sm text-red-600 hover:text-red-800 font-medium">
                                    {t('nav.logout')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <Link to="/login" className="text-gray-500 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium">
                                    {t('nav.login')}
                                </Link>
                                <Link to="/signup" className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-md transition-all hover:shadow-lg">
                                    {t('nav.signup')}
                                </Link>
                            </div>
                        )}
                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white border-b`}>
                <div className="pt-2 pb-3 space-y-1 px-4">
                    <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                        {t('nav.home')}
                    </Link>
                    <Link to="/designs" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/designs' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                        {t('nav.designs')}
                    </Link>
                    {user?.role === 'client' && (
                        <Link to="/tailors" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/tailors' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                            {t('nav.tailors')}
                        </Link>
                    )}
                    <div className="pt-4 pb-2 border-t border-gray-100 flex items-center justify-between">
                        <div className="xs:hidden">
                            <LanguageSwitch />
                        </div>
                        {isAuthenticated && (
                            <button onClick={handleLogout} className="text-sm font-medium text-red-600 px-3 py-2">
                                {t('nav.logout')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
