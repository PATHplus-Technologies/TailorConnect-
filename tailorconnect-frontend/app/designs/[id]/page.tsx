"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { designsService } from '@/services/designs';
import { useLanguage } from '@/contexts/LanguageContext';
import CreateOrderModal from '@/components/CreateOrderModal';

export default function DesignDetailsPage() {
    const { t } = useLanguage();
    const { id } = useParams();
    const router = useRouter();
    const [design, setDesign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);

    // Gallery states
    const [activeThumbIdx, setActiveThumbIdx] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const [userRole, setUserRole] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    // Simulating multiple images since model only has one
    const images = design ? [design.image, design.image, design.image] : [];
    const activeImage = images[activeThumbIdx] || null;

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        const uid = localStorage.getItem('user_id');
        if (uid) setCurrentUserId(Number(uid));

        if (id) {
            loadDesign(Number(id));
        }
    }, [id]);

    const loadDesign = async (designId: number) => {
        try {
            const data = await designsService.getById(designId);
            setDesign(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    if (!design) return <div className="text-center p-8 text-xl text-gray-600">{t('designs.detail.notFound')}</div>;

    const isOwner = currentUserId && design.owner === currentUserId;


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb / Back */}
            <nav className="flex mb-8 text-sm font-medium text-gray-500">
                <button onClick={() => router.push('/')} className="hover:text-green-600 transition-colors">Home</button>
                <span className="mx-2">/</span>
                <button onClick={() => router.push('/designs')} className="hover:text-green-600 transition-colors">Designs</button>
                <span className="mx-2">/</span>
                <span className="text-gray-900 truncate max-w-[200px]">{design.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Image Gallery Column (Left - 7 cols on lg) */}
                <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
                    {/* Thumbnails */}
                    <div className="order-2 md:order-1 flex md:flex-col gap-3 min-w-[80px]">
                        {[design.image, design.image, design.image].map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveThumbIdx(idx)}
                                className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeThumbIdx === idx ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100 hover:border-gray-300'}`}
                            >
                                <img src={img || '/placeholder.png'} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div
                        className="order-1 md:order-2 flex-grow bg-gray-50 rounded-2xl overflow-hidden aspect-[3/4] max-h-[700px] shadow-sm relative group cursor-zoom-in"
                        onClick={() => setIsZoomed(true)}
                    >
                        {design.image ? (
                            <>
                                <img
                                    src={design.image}
                                    alt={design.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        Click to Zoom
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                {t('designs.detail.noImage')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Column (Right - 5 cols on lg) */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="sticky top-24">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                                Premium Design
                            </span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                                {design.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-green-600">{parseFloat(design.price).toLocaleString()} <small className="text-sm font-normal text-gray-500">GNF</small></span>
                                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Tax included</span>
                            </div>
                        </div>

                        <div className="prose prose-sm text-gray-600 mb-8 border-t border-gray-100 pt-6">
                            <p className="leading-relaxed">
                                {design.description || "Indulge in the luxury of bespoke tailoring. This exclusive design is meticulously crafted to ensure the perfect fit and exceptional style, making it a standout addition to your wardrobe."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 mb-10 border-t border-gray-100 pt-8">
                            {userRole !== 'tailor' && (
                                <button
                                    onClick={() => setShowOrderModal(true)}
                                    className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 transform hover:-translate-y-1 active:scale-95"
                                >
                                    {t('designs.detail.orderNow')}
                                </button>
                            )}

                            {!isOwner && (
                                <button
                                    onClick={() => router.push(`/chat?tailor=${design.owner}`)}
                                    className="w-full bg-white text-gray-800 border-2 border-gray-200 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                >
                                    💬 {t('designs.detail.askQuestion')}
                                </button>
                            )}
                        </div>

                        {/* Tailor Info Card */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Crafted By</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 font-black text-xl border border-gray-100">
                                        {design.tailor_name ? design.tailor_name[0].toUpperCase() : 'T'}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 leading-none mb-1">{design.tailor_name || "Master Tailor"}</h4>
                                        <button
                                            onClick={() => router.push(`/tailors/${design.tailor_profile_id}`)}
                                            className="text-xs text-green-600 font-bold hover:underline"
                                        >
                                            View Professional Profile
                                        </button>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">Pro</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showOrderModal && (
                <CreateOrderModal
                    tailorId={design.tailor_profile_id}
                    tailorName={design.tailor_name}
                    preselectedDesignId={design.id}
                    onClose={() => setShowOrderModal(false)}
                    onSuccess={() => {
                        setShowOrderModal(false);
                        router.push('/orders');
                    }}
                />
            )}

            {/* Zoom Modal */}
            {isZoomed && design.image && (
                <div
                    className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
                    onClick={() => setIsZoomed(false)}
                >
                    <button className="absolute top-6 right-6 text-white text-3xl font-light hover:scale-110 transition-transform">✕</button>
                    <img
                        src={design.image}
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                        alt="Zoomed Design"
                    />
                </div>
            )}
        </div>
    );
}
