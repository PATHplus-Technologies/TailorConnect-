"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LoginPage() {
    const { t } = useLanguage();
    const { login } = useAuth();
    const { showToast } = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ username, password });
            showToast(t('auth.login.success') || 'Login successful!', 'success');
            router.push('/dashboard');
        } catch (err) {
            showToast(t('auth.login.error'), 'error');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Image Side */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-gray-900/90 mix-blend-multiply"></div>
                <div className="relative z-10 text-white max-w-lg p-12">
                    <h1 className="text-5xl font-bold mb-6">{t('auth.login.title')}</h1>
                    <p className="text-xl text-green-100 leading-relaxed">
                        {t('home.hero.subtitle')}
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-10">
                        <Link href="/" className="text-3xl font-bold text-gray-900 tracking-tighter">
                            Tailor<span className="text-green-600">Connect</span>
                        </Link>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('auth.login.subtitle')}</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {t('auth.login.noAccount')}{' '}
                            <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
                                {t('auth.login.signupLink')}
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.login.username')}</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder={t('auth.login.username')}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">{t('auth.login.password')}</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-green-600 hover:text-green-500"
                                >
                                    {t('auth.login.forgotPassword') || 'Forgot password?'}
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? `${t('auth.login.button')}...` : t('auth.login.button')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
