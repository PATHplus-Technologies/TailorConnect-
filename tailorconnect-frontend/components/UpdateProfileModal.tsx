import { useState, useEffect } from 'react';
import { tailorService } from '@/services/tailors';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface UpdateProfileModalProps {
    profile: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UpdateProfileModal({ profile, onClose, onSuccess }: UpdateProfileModalProps) {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [bio, setBio] = useState(profile.bio || '');
    const [experience, setExperience] = useState(profile.experience || '');
    const [specialty, setSpecialty] = useState(
        Array.isArray(profile.specialties)
            ? profile.specialties.join(', ')
            : (profile.specialty || '')
    );
    const [location, setLocation] = useState(profile.location || '');
    const [latitude, setLatitude] = useState(profile.latitude || '');
    const [longitude, setLongitude] = useState(profile.longitude || '');
    const [address, setAddress] = useState(profile.address || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar || null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('bio', bio);
            formData.append('experience', String(experience));
            formData.append('location', location);
            if (latitude) formData.append('latitude', String(latitude));
            if (longitude) formData.append('longitude', String(longitude));
            formData.append('address', address);
            formData.append('phone', phone);

            const specialtyList = specialty.split(',').map((s: string) => s.trim()).filter(Boolean);
            specialtyList.forEach((s: string) => formData.append('specialty_list', s));

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            console.log('Updating profile ID:', profile.id);

            const result = await tailorService.update(profile.id, formData);
            showToast(t('profile.update.success') || 'Profile updated successfully!', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Update failed", error);
            showToast(t('common.error') || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Fixed Header */}
                <div className="bg-green-600 p-6 text-white flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold">{t('profile.updateTitle')}</h2>
                    <button onClick={onClose} className="text-white hover:bg-green-700 p-1 rounded-full">✕</button>
                </div>

                {/* Scrollable Form Content */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center gap-4 py-4 border-b border-gray-100 mb-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-teal-50 text-green-200">
                                            👤
                                        </div>
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-sm font-bold">
                                    {t('common.change') || 'Change'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setAvatarFile(file);
                                                setAvatarPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-400">JPG, PNG or GIF. Max 5MB.</p>
                        </div>

                        {/* Specialty, Experience, Bio - Only for Tailors */}
                        {profile.user.role === 'tailor' && (
                            <>
                                {/* Specialty */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('profile.specialty')}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'lepi', val: 'Lépi Specialist' },
                                            { id: 'kindili', val: 'Kindili Specialist' },
                                            { id: 'foret', val: 'Forêt Sacrée' },
                                            { id: 'bazin', val: 'Bazin Rich' },
                                            { id: 'embroidery', val: 'Hand Embroidery' },
                                            { id: 'wedding', val: 'Wedding & Bridal' },
                                            { id: 'traditional', val: 'Traditional Wear' },
                                            { id: 'fusion', val: 'Modern Fusion' },
                                            { id: 'suits', val: 'Suits' },
                                            { id: 'dresses', val: 'Dresses' },
                                            { id: 'shirts', val: 'Shirts' },
                                            { id: 'alterations', val: 'Alterations' }
                                        ].map((opt) => {
                                            const currentSpecialties = specialty.split(',').map((s: string) => s.trim());
                                            const isSelected = currentSpecialties.includes(opt.val);

                                            return (
                                                <label key={opt.val} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                                                    <input
                                                        type="checkbox"
                                                        value={opt.val}
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            let newSpecialties = [...currentSpecialties].filter(s => s !== '');

                                                            if (checked) {
                                                                newSpecialties.push(opt.val);
                                                            } else {
                                                                newSpecialties = newSpecialties.filter(s => s !== opt.val);
                                                            }
                                                            setSpecialty(newSpecialties.join(', '));
                                                        }}
                                                        className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{t(`profile.specialty_${opt.id}`) || opt.val}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('profile.experience')}</label>
                                    <input
                                        type="number"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('profile.bio')}</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]"
                                        placeholder="Tell clients about your style and expertise..."
                                    />
                                </div>
                            </>
                        )}

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('profile.location')}</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Dixinn, Conakry"
                                    required
                                />
                                <button
                                    type="button"
                                    disabled={locating}
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            setLocating(true);
                                            navigator.geolocation.getCurrentPosition(
                                                (position) => {
                                                    const lat = position.coords.latitude.toString();
                                                    const long = position.coords.longitude.toString();
                                                    setLatitude(lat);
                                                    setLongitude(long);
                                                    setLocating(false);

                                                    // UX Improvement: Auto-fill text if empty so form can submit
                                                    if (!location) {
                                                        setLocation(`${parseFloat(lat).toFixed(4)}, ${parseFloat(long).toFixed(4)}`);
                                                    }

                                                    alert("Coordinates detected!");
                                                },
                                                (error) => {
                                                    console.error(error);
                                                    setLocating(false);
                                                    let msg = "Could not get location.";
                                                    if (error.code === 1) msg = "Location permission denied.";
                                                    else if (error.code === 2) msg = "Position unavailable.";
                                                    else if (error.code === 3) msg = "Timeout.";
                                                    showToast(msg, 'error');
                                                }
                                            );
                                        } else {
                                            alert("Geolocation is not supported by this browser.");
                                        }
                                    }}
                                    className="bg-blue-100 text-blue-700 p-3 rounded-xl hover:bg-blue-200 transition-colors disabled:opacity-50"
                                    title="Get Current Location"
                                >
                                    {locating ? '⌛' : '📍'}
                                </button>
                            </div>
                            {(latitude || longitude) && (
                                <p className="text-xs text-green-600 mt-1">
                                    ✓ Coords: {parseFloat(latitude).toFixed(4)}, {parseFloat(longitude).toFixed(4)}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('tailors.address')}</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="e.g. Ratoma, Conakry"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('tailors.phone')}</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="e.g. +224 XXX XXX XXX"
                            />
                        </div>
                    </div>

                    {/* Fixed Footer with Buttons */}
                    <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            {t('measurements.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50"
                        >
                            {loading ? t('common.loading') : t('profile.saveChanges')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
