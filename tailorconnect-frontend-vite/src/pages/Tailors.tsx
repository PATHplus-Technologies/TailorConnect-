import { Link } from 'react-router-dom';
import { useEffect, useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tailorService } from '@/services/tailors';
import { useLanguage } from '@/contexts/LanguageContext';

function TailorsListContent() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const searchParams = useSearchParams();

    const [tailors, setTailors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const search = searchParams.get('q') || '';
    const specialty = searchParams.get('specialty') || '';

    useEffect(() => {
        fetchTailors();
    }, [search, specialty]);

    const fetchTailors = async () => {
        setLoading(true);
        try {
            // Backend expectation: 'search' and 'specialties__name__icontains'
            const data = await tailorService.getAll({
                search: search,
                specialties__name__icontains: specialty
            });
            setTailors(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateFilters = (newSearch: string, newSpecialty: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newSearch) params.set('q', newSearch);
        else params.delete('q');

        if (newSpecialty) params.set('specialty', newSpecialty);
        else params.delete('specialty');

        navigate(`/tailors?${params.toString()}`);
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                    {t('tailors.title')}
                </h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder={t('tailors.searchPlaceholder')}
                        className="border p-2 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-green-500 outline-none"
                        value={search}
                        onChange={(e) => updateFilters(e.target.value, specialty)}
                    />
                    <select
                        className="border p-2 rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none"
                        value={specialty}
                        onChange={(e) => updateFilters(search, e.target.value)}
                    >
                        <option value="">{t('tailors.allSpecialties')}</option>
                        <option value="Suits">{t('profile.specialty_suits') || 'Suits'}</option>
                        <option value="Dresses">{t('profile.specialty_dresses') || 'Dresses'}</option>
                        <option value="Traditional Wear">{t('profile.specialty_traditional') || 'Traditional'}</option>
                        <option value="Alterations">{t('profile.specialty_alterations') || 'Alterations'}</option>
                        <option value="Bazin Rich">{t('profile.specialty_bazin') || 'Bazin Rich'}</option>
                        <option value="LÃ©pi Specialist">{t('profile.specialty_lepi') || 'LÃ©pi'}</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {tailors.map((tailor: any) => (
                        <Link key={tailor.id} href={`/tailors/${tailor.id}`} className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-green-600 to-teal-600 opacity-90 group-hover:opacity-100 transition-opacity" />

                            <div className="px-6 pt-12 relative">
                                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg mx-auto flex items-center justify-center text-3xl overflow-hidden text-gray-400">
                                    {tailor.user.username.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{tailor.user.username}</h3>

                                <div className="flex justify-center space-x-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1">ðŸ“ {tailor.location}</span>
                                    <span className="flex items-center gap-1">âš¡ {tailor.experience} {t('tailors.yearsExp')}</span>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4 justify-center">
                                    {tailor.specialties && tailor.specialties.slice(0, 3).map((spec: string, idx: number) => (
                                        <span key={idx} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                                            {spec}
                                        </span>
                                    ))}
                                    {tailor.specialties && tailor.specialties.length > 3 && (
                                        <span className="text-gray-400 text-[10px] font-bold">+{tailor.specialties.length - 3}</span>
                                    )}
                                </div>

                                {tailor.bio && <p className="text-gray-600 text-sm line-clamp-2 mb-6 italic">"{tailor.bio}"</p>}

                                <div className="border-t pt-4">
                                    <span className="text-blue-600 font-semibold text-sm group-hover:underline">{t('common.viewMore') || 'View Profile'} â†’</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {tailors.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">{t('tailors.notFound')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function TailorsPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
            <TailorsListContent />
        </Suspense>
    );
}

