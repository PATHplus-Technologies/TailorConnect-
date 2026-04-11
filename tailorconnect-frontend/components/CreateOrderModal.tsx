import { useState, useEffect } from 'react';
import { ordersService } from '@/services/orders';
import { measurementService } from '@/services/measurements';
import { designsService } from '@/services/designs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateOrderModalProps {
    tailorId: number;
    tailorName: string;
    preselectedDesignId?: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateOrderModal({ tailorId, tailorName, preselectedDesignId, onClose, onSuccess }: CreateOrderModalProps) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [measurements, setMeasurements] = useState<any[]>([]);
    const [designs, setDesigns] = useState<any[]>([]);

    const [selectedMeasurement, setSelectedMeasurement] = useState<string>('');
    const [selectedDesign, setSelectedDesign] = useState<string>(preselectedDesignId?.toString() || '');

    // Design Reference states
    const [designImage, setDesignImage] = useState<File | null>(null);
    const [designImagePreview, setDesignImagePreview] = useState<string>('');
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatingAI, setGeneratingAI] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [mData, dData] = await Promise.all([
                    measurementService.getAll(),
                    designsService.getByTailor(tailorId)
                ]);
                setMeasurements(mData);
                setDesigns(dData);
            } catch (e) {
                console.error("Failed to load data", e);
            }
        };
        loadData();
    }, [tailorId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDesignImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setDesignImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setGeneratingAI(true);
        try {
            const result = await designsService.generate(aiPrompt);
            const response = await fetch(result.image_url);
            const blob = await response.blob();
            const file = new File([blob], 'ai-generated.jpg', { type: 'image/jpeg' });
            setDesignImage(file);
            setDesignImagePreview(result.image_url);
            setShowAIPrompt(false);
            setAiPrompt('');
        } catch (error) {
            console.error(error);
            showToast(t('common.error') || 'Failed to generate design', 'error');
        } finally {
            setGeneratingAI(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('tailor', tailorId.toString());
            formData.append('client', user?.id || '');
            if (selectedDesign) formData.append('design', selectedDesign);
            if (selectedMeasurement) formData.append('measurements', selectedMeasurement);
            if (designImage) formData.append('image_reference', designImage);

            await ordersService.createWithImage(formData);
            showToast(t('orders.create.success') || 'Order created successfully!', 'success');
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            showToast(t('common.error') || 'Failed to create order', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
                {/* Header */}
                <div className="bg-green-600 p-6 text-white flex-shrink-0">
                    <h2 className="text-xl font-bold">{t('nav.tailors')} {tailorName}</h2>
                    <p className="text-green-100 text-sm">{t('modals.createOrder.title')}</p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Measurement Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('modals.createOrder.selectMeasurements')}</label>
                        <p className="text-xs text-gray-500 mb-2">{t('measurements.subtitle')}</p>

                        {measurements.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {measurements.map(m => (
                                    <label key={m.id} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${selectedMeasurement === m.id.toString() ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-200'}`}>
                                        <input
                                            type="radio"
                                            name="measurement"
                                            value={m.id}
                                            checked={selectedMeasurement === m.id.toString()}
                                            onChange={(e) => setSelectedMeasurement(e.target.value)}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                        />
                                        <div className="ml-3">
                                            <span className="block text-sm font-medium text-gray-900">{m.profile_name}</span>
                                            <span className="block text-xs text-gray-500">
                                                {t('measurements.chest')}: {m.chest}", {t('measurements.waist')}: {m.waist}"...
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-4 bg-yellow-50 rounded-xl text-yellow-700 text-sm">
                                {t('measurements.empty')}
                                <a href="/measurements" className="underline font-bold ml-1">{t('measurements.createFirst')}</a>
                            </div>
                        )}
                    </div>

                    {/* Design Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Choose from Tailor's Portfolio (Optional)</label>
                        <p className="text-xs text-gray-500 mb-2">Select a specific design from this tailor's work, or leave blank for a custom request.</p>
                        <select
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                            value={selectedDesign}
                            onChange={(e) => setSelectedDesign(e.target.value)}
                        >
                            <option value="">-- {t('modals.createOrder.requestDetails')} --</option>
                            {designs.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.price} GNF)</option>
                            ))}
                        </select>
                    </div>

                    {/* Design Reference */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('modals.createOrder.uploadReference')}</label>
                        <p className="text-xs text-gray-500 mb-3">{t('modals.createOrder.detailsPlaceholder')}</p>

                        {designImagePreview ? (
                            <div className="relative">
                                <img src={designImagePreview} alt="Design reference" className="w-full h-48 object-cover rounded-xl border-2 border-green-500" />
                                <button
                                    type="button"
                                    onClick={() => { setDesignImage(null); setDesignImagePreview(''); }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                                    <span className="text-3xl mb-2">📤</span>
                                    <span className="text-sm font-medium text-gray-700">{t('common.viewMore')}</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowAIPrompt(true)}
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-4 hover:border-purple-500 hover:bg-purple-50 transition-all"
                                >
                                    <span className="text-3xl mb-2">✨</span>
                                    <span className="text-sm font-medium text-purple-700">{t('nav.aiStudio')}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 border-t bg-gray-50 flex gap-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                        {t('measurements.cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || (measurements.length > 0 && !selectedMeasurement)}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('common.loading') : t('modals.createOrder.submit')}
                    </button>
                </div>

                {/* AI Prompt Modal */}
                {showAIPrompt && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h3 className="font-bold text-lg mb-3">Generate Design with AI</h3>
                            <textarea
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Describe your design idea..."
                                className="w-full border rounded-lg p-3 mb-4 h-24 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAIPrompt(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAIGenerate}
                                    disabled={generatingAI || !aiPrompt.trim()}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {generatingAI ? 'Generating...' : 'Generate'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
