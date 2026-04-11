"use client";

import { useEffect, useState } from 'react';
import { designsService } from '@/services/designs';
import Link from 'next/link';
import AddDesignModal from '@/components/AddDesignModal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DesignsPage() {
    const { t } = useLanguage();
    const [designs, setDesigns] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        const id = localStorage.getItem('user_id');
        setUserRole(role);
        setUserId(id);
        loadDesigns();
    }, []);

    const loadDesigns = async () => {
        try {
            const allDesigns = await designsService.getAll();
            const role = localStorage.getItem('user_role');
            const id = localStorage.getItem('user_id');

            // If user is a tailor, show only their designs
            if (role === 'tailor' && id) {
                const filtered = allDesigns.filter((d: any) => d.owner === parseInt(id));
                setDesigns(filtered);
            } else {
                setDesigns(allDesigns);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSuccess = () => {
        setShowAddModal(false);
        loadDesigns();
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        {userRole === 'tailor' ? t('tailors.portfolio') : t('designs.title')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {userRole === 'tailor' ? t('dashboard.tailor.viewOrders') : t('designs.subtitle')}
                    </p>
                </div>
                {userRole === 'tailor' && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
                    >
                        + {t('dashboard.tailor.addDesign')}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {designs.map(d => (
                    <Link key={d.id} href={`/designs/${d.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 block">
                        <div className="relative h-64 bg-gray-100 overflow-hidden">
                            {d.image ? (
                                <img src={d.image} alt={d.name} className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
                                    <span className="text-4xl">👗</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                {d.price} GNF
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-xl text-gray-900 mb-2">{d.name}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{d.description}</p>
                            <span className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium block text-center">
                                {t('common.viewMore')}
                            </span>
                        </div>
                    </Link>
                ))}
                {designs.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="text-6xl mb-4">👗</div>
                        <p className="text-gray-500 text-lg mb-4">
                            {userRole === 'tailor' ? t('designs.emptyPortfolio') : t('designs.emptyGallery')}
                        </p>
                        {userRole === 'tailor' && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
                            >
                                {t('dashboard.tailor.addDesign')}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddDesignModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAddSuccess}
                />
            )}
        </div>
    );
}
