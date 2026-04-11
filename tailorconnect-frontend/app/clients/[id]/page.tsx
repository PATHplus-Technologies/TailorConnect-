"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tailorService } from '@/services/tailors';
import { ordersService } from '@/services/orders';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import api from '@/lib/axios';

export default function ClientDetailPage() {
    const { t } = useLanguage();
    const { id } = useParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadData(Number(id));
        }
    }, [id]);

    const loadData = async (clientId: number) => {
        try {
            // Fetch Client Details (includes measurements)
            const clientRes = await api.get(`users/${clientId}/`);
            setClient(clientRes.data);

            // Fetch Orders for this client
            // We need to filter orders where client=clientId AND tailor=current_user
            // The ordersService.getAll() returns only orders relevant to the user (security fix).
            // So we can filter the result client-side or add a backend filter.
            // Since getAll returns *my* orders, filtering by client_id works.
            const allOrders = await ordersService.getAll();
            const clientOrders = allOrders.filter((o: any) => o.client === clientId || o.client_id === clientId); // check format
            setOrders(clientOrders);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div>
        </div>
    );

    if (!client) return <div className="p-8 text-center">{t('common.error')}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                        {client.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.username}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500">
                            <span className="flex items-center gap-1">📧 {client.email}</span>
                            <span className="flex items-center gap-1">📱 {client.phone || 'N/A'}</span>
                            <span className="flex items-center gap-1">📍 {client.address || 'N/A'}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push(`/chat?client=${client.id}`)}
                        className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
                    >
                        💬 {t('orders.message')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Measurements Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            📏 {t('dashboard.client.myMeasurements')}
                        </h2>
                        {client.measurements && client.measurements.length > 0 ? (
                            <div className="space-y-6">
                                {client.measurements.map((m: any) => (
                                    <div key={m.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                                            <span className="font-bold text-gray-900">{m.profile_name}</span>
                                            <span className="text-xs text-gray-400">{new Date(m.updated_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                                            {Object.entries(m).map(([key, val]) => {
                                                if (['id', 'profile_name', 'updated_at'].includes(key) || val === null) return null;
                                                return (
                                                    <div key={key} className="flex justify-between pr-4">
                                                        <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                                                        <span className="font-bold text-gray-900">{String(val)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-center py-8">{t('measurements.noProfiles')}</p>
                        )}
                    </div>

                    {/* Order History Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            📦 {t('nav.orders')}
                        </h2>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((o: any) => (
                                    <div key={o.order_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-900">{o.design_title || 'Custom Order'}</p>
                                            <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                            ${o.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'}`}>
                                            {o.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-center py-8">{t('orders.noOrders')}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
