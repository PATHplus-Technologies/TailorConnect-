"use client";

import { useState } from 'react';
import { designsService } from '@/services/designs';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddDesignModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddDesignModal({ onClose, onSuccess }: AddDesignModalProps) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            if (image) {
                formData.append('image', image);
            }

            await designsService.create(formData);
            onSuccess();
        } catch (error: any) {
            console.error("Failed to create design", error);
            alert(`Failed to add design: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-green-600 p-6 text-white flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold">{t('modals.addDesign.title')}</h2>
                    <button onClick={onClose} className="text-white hover:bg-green-700 p-1 rounded-full">✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('modals.addDesign.image')} *</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview('');
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-6xl mb-4">📸</div>
                                        <label className="cursor-pointer">
                                            <span className="text-green-600 font-medium hover:text-green-700">{t('modals.addDesign.clickToUpload')}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                required
                                            />
                                        </label>
                                        <p className="text-sm text-gray-500 mt-2">{t('modals.addDesign.imageSpecs')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('modals.addDesign.name')} *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder={t('modals.addDesign.namePlaceholder')}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('modals.addDesign.description')} *</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]"
                                placeholder={t('modals.addDesign.descriptionPlaceholder')}
                                required
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('modals.addDesign.price')} *</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder={t('modals.addDesign.pricePlaceholder')}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Footer */}
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
                            {loading ? t('modals.addDesign.uploading') : t('modals.addDesign.submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
