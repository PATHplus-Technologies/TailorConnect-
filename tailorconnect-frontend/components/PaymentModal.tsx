"use client";

import { useState } from 'react';
import { paymentService } from '@/services/payments';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentModalProps {
    orderId: string;
    amount: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PaymentModal({ orderId, amount, onClose, onSuccess }: PaymentModalProps) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Actual backend call (Mock payment)
            await paymentService.createTransaction({
                order: orderId,
                amount: amount,
                payment_method: 'card',
                status: 'completed'
            });
            onSuccess();
        } catch (error) {
            console.error('Payment failed', error);
            alert(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{t('modals.payment.title')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center">
                    <span className="text-gray-600">{t('modals.payment.amountToPay')}</span>
                    <span className="text-2xl font-bold text-gray-900">{amount.toLocaleString()} GNF</span>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('modals.payment.cardNumber')}</label>
                        <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('modals.payment.expiry')}</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('modals.payment.cvv')}</label>
                            <input
                                type="text"
                                placeholder="123"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg flex justify-center items-center gap-2 mt-4"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                {t('modals.payment.processing')}
                            </>
                        ) : `${t('modals.payment.pay')} 🔒`}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex justify-center items-center gap-1">
                        🔒 Secured by Stripe (Mock)
                    </p>
                </form>
            </div>
        </div>
    );
}
