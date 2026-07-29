"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tailorService } from '@/services/tailors';
import { designsService } from '@/services/designs';
import { reviewService } from '@/services/reviews';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import CreateOrderModal from '@/components/CreateOrderModal';
import UpdateProfileModal from '@/components/UpdateProfileModal';

export default function TailorProfilePage() {
    const { t } = useLanguage();
    const { id } = useParams();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [designs, setDesigns] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        const uid = localStorage.getItem('user_id');
        if (uid) setCurrentUserId(Number(uid));

        if (id) {
            loadData(Number(id));
        }
    }, [id]);

    const loadData = async (profileId: number) => {
        try {
            const p = await tailorService.getById(profileId);
            setProfile(p);
            if (p.user && p.user.id) {
                const [d, r] = await Promise.all([
                    designsService.getByTailor(p.user.id),
                    reviewService.getByTailor(p.id)
                ]);
                setDesigns(d);
                setReviews(r);
            }
        } catch (e: any) {
            console.error(e);
            if (e?.response?.status === 404) {
                setError('Tailor profile not found. It may have been deleted or the ID is incorrect.');
            } else {
                setError('Failed to load profile. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center p-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
                <p className="text-gray-500 mb-6 max-w-md">{error}</p>
                <button
                    onClick={() => router.push('/tailors')}
                    className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-all"
                >
                    ← Browse Tailors
                </button>
            </div>
        </div>
    );

    if (!profile) return <div className="text-center p-12 text-gray-500">{t('tailors.notFound')}</div>;

    const isOwner = currentUserId && profile.user && currentUserId === profile.user.id;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt={profile.user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center text-4xl md:text-5xl">
                                        👤
                                    </div>
                                )}
                            </div>
                            <span className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${profile.available ? 'bg-green-500' : 'bg-red-500'}`} title={profile.available ? t('tailors.available') : t('tailors.busy')}></span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {profile.user.username}
                                {isOwner && (
                                    <button
                                        onClick={() => setShowUpdateModal(true)}
                                        className="ml-4 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors align-middle border border-gray-200"
                                    >
                                        ✏️ {t('tailors.editProfile')}
                                    </button>
                                )}
                            </h1>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {profile.user.role === 'tailor' && profile.specialties && profile.specialties.map((spec: string, idx: number) => (
                                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        🪡 {spec}
                                    </span>
                                ))}
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    📍 {profile.location}
                                </span>
                                {profile.user.role === 'tailor' && (
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                        ⭐ {profile.experience} {t('tailors.yearsExp')}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 bg-gray-50 p-4 rounded-xl mb-4 text-sm">
                                <div>
                                    <span className="font-bold text-gray-900 block">{t('tailors.address')}:</span>
                                    {profile.address || t('tailors.notFound')}
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 block">{t('tailors.phone')}:</span>
                                    {profile.phone || t('tailors.phone')}
                                </div>
                            </div>

                            {profile.user.role === 'tailor' && profile.bio && (
                                <p className="text-gray-600 max-w-2xl leading-relaxed italic border-l-4 border-green-200 pl-4">
                                    "{profile.bio}"
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            {!isOwner && (
                                <>
                                    <button
                                        onClick={() => router.push(`/chat?tailor=${profile.user.id}`)}
                                        className="bg-white border text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        💬 {t('tailors.chatNow')}
                                    </button>
                                    {userRole !== 'tailor' && (
                                        <button
                                            onClick={() => setShowOrderModal(true)}
                                            className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                        >
                                            🧵 {t('tailors.hireTailor')}
                                        </button>
                                    )}
                                </>
                            )}
                            {isOwner && (
                                <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <p className="text-yellow-800 font-bold mb-1">{t('dashboard.welcome') || 'Your Profile View'}</p>
                                    <p className="text-xs text-yellow-600">{t('dashboard.client.profileViewNote')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {profile.user.role === 'tailor' && (
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">{t('tailors.portfolio')}</h2>
                        <span className="text-gray-500 text-sm">{designs.length} {t('nav.designs')}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {designs.map(d => (
                            <Link key={d.id} href={`/designs/${d.id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="h-64 bg-gray-100 relative overflow-hidden">
                                    {d.image ? (
                                        <img src={d.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <span className="text-3xl">👗</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 truncate">{d.title}</h3>
                                    <p className="text-green-600 text-sm font-medium mt-1">{d.price} GNF</p>
                                </div>
                            </Link>
                        ))}
                        {designs.length === 0 && (
                            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">{t('tailors.noDesigns')}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            {profile.user.role === 'tailor' && (
                <div className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">{t('reviews.title') || 'Reviews'}</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-xl font-bold">⭐ {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A'}</span>
                            <span className="text-gray-500 text-sm">({reviews.length} {t('reviews.count') || 'reviews'})</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-lg">
                                            👤
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{review.client_username}</p>
                                            <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                            </div>
                        ))}
                        {reviews.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500">{t('reviews.empty') || 'No reviews yet.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showOrderModal && (
                <CreateOrderModal
                    tailorId={profile.id} // Profile ID for order.tailor
                    tailorName={profile.user.username}
                    onClose={() => setShowOrderModal(false)}
                    onSuccess={() => {
                        setShowOrderModal(false);
                        router.push('/orders');
                    }}
                />
            )}

            {showUpdateModal && (
                <UpdateProfileModal
                    profile={profile}
                    onClose={() => setShowUpdateModal(false)}
                    onSuccess={() => {
                        setShowUpdateModal(false);
                        loadData(Number(id)); // Refresh data
                    }}
                />
            )}
        </div>
    );
}
