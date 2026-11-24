
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SignupPage() {
    const { t } = useLanguage();
    const { register } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'client',
        phone: '',
        address: '',
        specialty: '',
        experience: 0,
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log('SignupPage: Form submitted');

        // Prepare payload with correct types
        const payload = {
            ...formData,
            experience: Number(formData.experience)
        };

        try {
            console.log('SignupPage: Calling register...');
            await register(payload);
            console.log('SignupPage: Registration successful');
            
            showToast(t('auth.signup.success') || 'Registration successful! Please login.', 'success');
            
            // Give the toast a moment to be seen before redirecting
            setTimeout(() => {
                navigate('/login?registered=true');
            }, 1000);
            
        } catch (err: any) {
            console.error('SignupPage: Error during signup', err);
            
            // Extract the most descriptive error message
            let errorMsg = 'Registration failed. Please check your inputs.';
            if (err.response?.data) {
                const data = err.response.data;
                if (data.username) errorMsg = `Username error: ${data.username}`;
                else if (data.email) errorMsg = `Email error: ${data.email}`;
                else if (typeof data === 'string') errorMsg = data;
                else if (data.detail) errorMsg = data.detail;
            }
            
            showToast(errorMsg, 'error');
            setLoading(false); // Only unset loading on error, success will redirect
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex w-1/2 bg-green-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="relative z-10 p-12 text-white max-w-2xl">
                    <h1 className="text-5xl font-bold mb-6">{t('auth.signup.hero.title')}</h1>
                    <p className="text-xl text-green-100 mb-8">
                        {formData.role === 'tailor'
                            ? t('auth.signup.hero.tailorSubtitle')
                            : t('auth.signup.hero.clientSubtitle')}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className={`backdrop-blur p-6 rounded-xl border transition-all ${formData.role === 'client' ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/10'}`}>
                            <h3 className="font-bold text-lg mb-2">{t('auth.signup.hero.forClients')}</h3>
                            <p className="text-sm text-green-100">{t('auth.signup.hero.clientFeature')}</p>
                        </div>
                        <div className={`backdrop-blur p-6 rounded-xl border transition-all ${formData.role === 'tailor' ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/10'}`}>
                            <h3 className="font-bold text-lg mb-2">{t('auth.signup.hero.forTailors')}</h3>
                            <p className="text-sm text-green-100">{t('auth.signup.hero.tailorFeature')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 h-screen overflow-y-auto bg-white p-8">
                <div className="max-w-md mx-auto py-12">
                    <div className="text-center mb-10">
                        <Link to="/" className="text-3xl font-bold text-gray-900 tracking-tighter">
                            Tailor<span className="text-green-600">Connect</span>
                        </Link>
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('auth.signup.title')}</h2>
                        <p className="mt-2 text-gray-600">
                            {t('auth.signup.subtitle')}{' '}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                {t('auth.signup.signinLink')}
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.signup.role')}</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['client', 'tailor'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r })}
                                            className={`py-2 px-4 rounded-lg font-medium text-sm border capitalize ${formData.role === r
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {t(`auth.signup.${r}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.signup.username')}</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.signup.email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.signup.password')}</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.signup.phone')}</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+224..."
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.signup.address')}</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Conakry, Guinea"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Tailor Specific Fields */}
                        {formData.role === 'tailor' && (
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-fade-in space-y-4">
                                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Tailor Profile</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: 'lepi', val: 'LÃ©pi Specialist' },
                                                { id: 'kindili', val: 'Kindili Specialist' },
                                                { id: 'foret', val: 'ForÃªt SacrÃ©e' },
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
                                                const currentSpecialties = formData.specialty.split(',').map((s: string) => s.trim()).filter(Boolean);
                                                const isSelected = currentSpecialties.includes(opt.val);

                                                return (
                                                    <label key={opt.val} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                                                        <input
                                                            type="checkbox"
                                                            value={opt.val}
                                                            checked={isSelected}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                let newSpecialties = [...currentSpecialties];

                                                                if (checked) {
                                                                    newSpecialties.push(opt.val);
                                                                } else {
                                                                    newSpecialties = newSpecialties.filter(s => s !== opt.val);
                                                                }
                                                                setFormData({ ...formData, specialty: newSpecialties.join(', ') });
                                                            }}
                                                            className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">{t(`profile.specialty_${opt.id}`) || opt.val}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            min="0"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            value={formData.experience}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About You</label>
                                    <textarea
                                        name="bio"
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Tell clients about your style and expertise..."
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? `${t('auth.signup.button')}...` : `${t('auth.signup.button')} ${t(`auth.signup.${formData.role}`)}`}
                        </button>

                        <p className="text-xs text-center text-gray-500">
                            {t('auth.signup.terms')}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

