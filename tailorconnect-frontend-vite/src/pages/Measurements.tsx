
import { useEffect, useState } from 'react';
import { measurementService } from '@/services/measurements';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MeasurementsPage() {
    const { t } = useLanguage();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        profile_name: '',
        chest: '',
        waist: '',
        hips: '',
        inseam: '',
        shoulder: '',
        sleeve_length: '',
        neck: ''
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            const data = await measurementService.getAll();
            setProfiles(data);
        } catch (error) {
            console.error('Failed to load measurements', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = { ...formData };
            Object.keys(payload).forEach(key => {
                if (payload[key] === '') {
                    payload[key] = null;
                }
            });

            if (editingId) {
                await measurementService.update(editingId, payload);
            } else {
                await measurementService.create(payload);
            }

            resetForm();
            loadProfiles();
        } catch (error: any) {
            console.error('Save failed:', error);
            alert('Failed to save measurement');
        }
    };

    const handleEdit = (profile: any) => {
        setFormData({
            profile_name: profile.profile_name,
            chest: profile.chest || '',
            waist: profile.waist || '',
            hips: profile.hips || '',
            inseam: profile.inseam || '',
            shoulder: profile.shoulder || '',
            sleeve_length: profile.sleeve_length || '',
            neck: profile.neck || ''
        });
        setEditingId(profile.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('measurements.deleteConfirm'))) return;
        try {
            await measurementService.delete(id);
            loadProfiles();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete measurement');
        }
    };

    const resetForm = () => {
        setFormData({
            profile_name: '', chest: '', waist: '', hips: '',
            inseam: '', shoulder: '', sleeve_length: '', neck: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('measurements.title')}</h1>
                    <p className="text-gray-500 mt-1">{t('measurements.subtitle')}</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        {t('measurements.addNew')}
                    </button>
                )}
            </div>

            {/* Form Section */}
            {showForm && (
                <div className="mb-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-slide-down">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">{editingId ? t('measurements.editProfile') : t('measurements.newProfile')}</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">{t('measurements.cancel')}</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('measurements.profileName')}</label>
                            <input
                                name="profile_name"
                                value={formData.profile_name}
                                onChange={handleChange}
                                required
                                placeholder={t('measurements.profileNamePlaceholder')}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {['chest', 'waist', 'hips', 'shoulder', 'inseam', 'sleeve_length', 'neck'].map((field) => (
                                <div key={field}>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{field.replace('_', ' ')} (in)</label>
                                    <input
                                        name={field}
                                        type="number"
                                        step="0.1"
                                        value={(formData as any)[field]}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                                {t('measurements.cancel')}
                            </button>
                            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md">
                                {editingId ? t('measurements.update') : t('measurements.save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((p) => (
                    <div key={p.id} className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-teal-500"></div>

                        <div className="flex justify-between items-start mb-4 pl-4">
                            <h3 className="font-bold text-xl text-gray-900">{p.profile_name}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold hover:bg-gray-200 transition-colors"
                                >
                                    âœï¸ Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full font-bold hover:bg-red-100 transition-colors"
                                >
                                    ðŸ—‘ï¸
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const text = `Measurements for ${p.profile_name}:\nChest: ${p.chest}" | Waist: ${p.waist}" | Hips: ${p.hips}"\nShoulder: ${p.shoulder}" | Sleeve: ${p.sleeve_length}" | Neck: ${p.neck}" | Inseam: ${p.inseam}"`;
                                navigator.clipboard.writeText(text);
                                alert('Copied to clipboard! ðŸ“‹');
                            }}
                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100 transition-colors mb-4 pl-4"
                        >
                            ðŸ“‹ Copy All
                        </button>

                        <div className="grid grid-cols-2 gap-y-3 pl-4 text-gray-600">
                            {[
                                { label: 'Chest', val: p.chest },
                                { label: 'Waist', val: p.waist },
                                { label: 'Hips', val: p.hips },
                                { label: 'Inseam', val: p.inseam },
                                { label: 'Shoulder', val: p.shoulder },
                                { label: 'Sleeve', val: p.sleeve_length },
                            ].map((item) => (
                                item.val && (
                                    <div key={item.label} className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase">{item.label}</span>
                                        <span className="font-medium text-gray-800">{item.val}"</span>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ))}

                {/* Empty State Help Card */}
                {profiles.length === 0 && !loading && !showForm && (
                    <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg mb-4">No measurement profiles found.</p>
                        <button onClick={() => setShowForm(true)} className="text-green-600 font-bold hover:underline">
                            Create your first profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

