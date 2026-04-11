"use client";

import { useState } from 'react';
import { reviewService } from '@/services/reviews';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReviewModalProps {
    orderId: string;
    tailorId: number;
    tailorName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReviewModal({ orderId, tailorId, tailorName, onClose, onSuccess }: ReviewModalProps) {
    const { t } = useLanguage();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await reviewService.create({
                order: orderId,
                tailor: tailorId,
                rating,
                comment,
                client: Number(localStorage.getItem('user_id'))
            });
            onSuccess();
        } catch (error: any) {
            console.error(error);
            const errMsg = error.response?.data ? JSON.stringify(error.response.data) : t('common.error');
            alert(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('modals.review.title')}</h2>
                <p className="text-gray-500 mb-6">How was your order with <span className="font-bold text-gray-800">{tailorName}</span>?</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-4xl transition-all transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('modals.review.comment')}</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[100px]"
                            placeholder={t('modals.review.commentPlaceholder')}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? t('common.loading') : t('modals.review.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}
