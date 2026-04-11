"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { tailorService } from '@/services/tailors';

export default function Dashboard() {
    const router = useRouter();
    const { t } = useLanguage();
    const [role, setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
            return;
        }
        setRole(localStorage.getItem('user_role'));
        setUsername(localStorage.getItem('username'));
    }, [router]);

    const [clients, setClients] = useState<any[]>([]);

    useEffect(() => {
        if (role === 'tailor') {
            tailorService.getClients().then(setClients).catch(console.error);
        }
    }, [role]);

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    if (!role) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div></div>;

    const ClientDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/tailors" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    🧵
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.client.findTailor')}</h2>
                <p className="text-gray-500">{t('home.hero.subtitle')}</p>
                <div className="mt-4 text-green-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('common.viewMore')} →
                </div>
            </Link>

            <Link href="/measurements" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    📏
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.client.myMeasurements')}</h2>
                <p className="text-gray-500">{t('measurements.subtitle')}</p>
                <div className="mt-4 text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('common.edit')} →
                </div>
            </Link>

            <Link href="/orders" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    📦
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('nav.orders')}</h2>
                <p className="text-gray-500">{t('orders.subtitle')}</p>
                <div className="mt-4 text-purple-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('dashboard.client.viewAll')} →
                </div>
            </Link>

            <Link href="/designs" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    👗
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('nav.designs')}</h2>
                <p className="text-gray-500">{t('home.features.designs.description')}</p>
                <div className="mt-4 text-orange-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('home.designs.viewAll')}
                </div>
            </Link>

            <Link href="/designs/generate" className="group bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 text-white">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
                    ✨
                </div>
                <h2 className="text-xl font-bold mb-2">{t('nav.aiStudio')}</h2>
                <p className="text-purple-100">{t('dashboard.client.aiStudio')}</p>
                <div className="mt-4 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('common.viewMore')} →
                </div>
            </Link>
        </div>
    );

    const TailorDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/orders" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    📋
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.tailor.pendingOrders')}</h2>
                <p className="text-gray-500">{t('orders.subtitle')}</p>
                <div className="mt-4 text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('dashboard.tailor.viewOrders')} →
                </div>
            </Link>

            <Link href="/designs" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    🖼️
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('nav.designs')}</h2>
                <p className="text-gray-500">{t('dashboard.tailor.addDesign')}</p>
                <div className="mt-4 text-purple-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('nav.designs')} →
                </div>
            </Link>

            <Link href={`/tailors/${localStorage.getItem('user_id')}`} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    👤
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.tailor.editProfile')}</h2>
                <p className="text-gray-500">{t('dashboard.tailor.editProfile')}</p>
                <div className="mt-4 text-green-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('common.edit')} →
                </div>
            </Link>

            <Link href="/designs/generate" className="group bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 text-white">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform backdrop-blur-sm">
                    ✨
                </div>
                <h2 className="text-xl font-bold mb-2">{t('nav.aiStudio')}</h2>
                <p className="text-purple-100">{t('dashboard.client.aiStudio')}</p>
                <div className="mt-4 font-bold text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                    {t('common.viewMore')} →
                </div>
            </Link>

            {/* My Clients Section */}
            <div className="md:col-span-2 lg:col-span-3 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    👥 {t('dashboard.tailor.myClients')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {clients.map(client => (
                        <div key={client.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <Link href={`/clients/${client.id}`} className="flex-1 min-w-0 flex items-center gap-4 hover:opacity-80 transition-opacity">
                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-xl">
                                    {client.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{client.username}</p>
                                    <p className="text-xs text-gray-500 truncate">{client.phone || client.email}</p>
                                </div>
                            </Link>
                            <Link href={`/chat?client=${client.id}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Message">
                                💬
                            </Link>
                        </div>
                    ))}
                    {clients.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">{t('dashboard.tailor.noClients')}</p>
                            <p className="text-sm text-gray-400 mt-1">Clients appear here when they order or message you.</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            {t('dashboard.welcome')}, <span className="text-green-600">{username}</span>!
                        </h1>
                        <p className="text-xl text-gray-500 mt-2">
                            {role === 'tailor' ? t('dashboard.tailor.title') : t('dashboard.client.title')}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/chat" className="bg-white text-gray-700 px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow transition-shadow border border-gray-200 flex items-center gap-2">
                            💬 {t('nav.chat')}
                        </Link>
                        <button onClick={handleLogout} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors">
                            {t('nav.logout')}
                        </button>
                    </div>
                </div>

                {role === 'tailor' ? <TailorDashboard /> : <ClientDashboard />}
            </div>
        </div>
    );
}
