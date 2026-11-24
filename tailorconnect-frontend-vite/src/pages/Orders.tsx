
import { useEffect, useState } from 'react';
import { ordersService } from '@/services/orders';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReviewModal from '@/components/ReviewModal';
import PaymentModal from '@/components/PaymentModal';
import { useLanguage } from '@/contexts/LanguageContext';

const getSteps = (t: any) => [
    { id: 'pending', label: t('orders.status.pending'), icon: 'ðŸ“' },
    { id: 'accepted', label: t('orders.status.accepted'), icon: 'ðŸ¤' },
    { id: 'in_progress', label: t('orders.status.inProgress'), icon: 'ðŸ§µ' },
    { id: 'completed', label: t('orders.status.completed'), icon: 'âœ…' },
];

export default function OrdersPage() {
    const { t } = useLanguage();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<any>(null); // For payment
    const [reviewOrder, setReviewOrder] = useState<any>(null); // For review
    const [userRole, setUserRole] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUserRole(localStorage.getItem('user_role'));
        ordersService.getAll().then(setOrders).catch(console.error).finally(() => setLoading(false));
    }, [refresh]);

    const handlePaymentSuccess = async () => {
        if (selectedOrder) {
            setSelectedOrder(null);
            setRefresh(prev => prev + 1); // Reload orders
            alert(t('orders.paymentSuccessful'));
        }
    };

    const handleReviewSuccess = () => {
        setReviewOrder(null);
        alert(t('orders.reviewSubmitted'));
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await ordersService.updateStatus(orderId, newStatus);
            setRefresh(prev => prev + 1);
        } catch (e) {
            console.error(e);
            alert(t('orders.statusUpdateFailed'));
        }
    };

    const STEPS = getSteps(t);

    const getStepIndex = (status: string) => {
        return STEPS.findIndex(s => s.id === status);
    };

    if (loading) return (
        <div className="flex bg-gray-50 min-h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {userRole === 'tailor' ? t('orders.incomingOrders') : t('orders.myOrders')}
                        </h1>
                        <p className="text-gray-500 mt-1">{t('orders.subtitle')}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {orders.map(o => {
                        const stepIndex = getStepIndex(o.status);
                        const progress = (stepIndex / (STEPS.length - 1)) * 100;

                        return (
                            <div key={o.order_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all flex flex-col gap-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image Section */}
                                    <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                        {o.image_reference ? (
                                            <div className="relative w-full h-full">
                                                <img src={o.image_reference} alt="Client's design reference" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-xs py-1 px-2 text-center">
                                                    {t('orders.clientDesign')}
                                                </div>
                                            </div>
                                        ) : o.design_image ? (
                                            <img src={o.design_image} alt={o.design_title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                                                ðŸ“¦
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-xl text-gray-900">
                                                    {o.design_title || 'Custom Request'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Order #{o.order_id.substring(0, 8)}...
                                                </p>
                                            </div>
                                            {/* Tailor Controls */}
                                            {userRole === 'tailor' && (
                                                <select
                                                    value={o.status}
                                                    onChange={(e) => handleStatusUpdate(o.order_id, e.target.value)}
                                                    className="bg-gray-100 border-none rounded-lg text-sm font-bold text-gray-700 py-1 px-3 focus:ring-green-500"
                                                >
                                                    {STEPS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                                    <option value="cancelled">{t('orders.status.cancelled')}</option>
                                                </select>
                                            )}
                                            {userRole !== 'tailor' && (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wide">
                                                    {STEPS.find(s => s.id === o.status)?.label || o.status}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                            <div>
                                                <p className="text-gray-400 mb-1">Tailor</p>
                                                <Link to={`/tailors/${o.tailor}`} className="font-medium text-green-600 hover:underline">
                                                    {o.tailor_name || 'Unknown Tailor'}
                                                </Link>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 mb-1">Date</p>
                                                <p className="font-medium text-gray-900">{new Date(o.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="col-span-2 md:col-span-1">
                                                <p className="text-gray-400 mb-1">{t('orders.price')}</p>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {o.price ? parseFloat(o.price).toLocaleString() + ' GNF' : t('orders.pendingQuote')}
                                                </p>
                                            </div>

                                            {/* Measurement Snapshot (Visible to Tailor or Client) */}
                                            {o.measurement_snapshot && (
                                                <div className="col-span-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                    <p className="font-bold text-blue-900 text-xs uppercase mb-2">{t('orders.attachedMeasurements')}</p>
                                                    <div className="grid grid-cols-4 gap-2 text-xs text-blue-800">
                                                        {Object.entries(o.measurement_snapshot)
                                                            .filter(([key]) => !['id', 'user', 'profile_name', 'created_at', 'updated_at'].includes(key))
                                                            .map(([key, val]) => (
                                                                <div key={key}>
                                                                    <span className="capitalize text-blue-500 block">{key.replace('_', ' ')}</span>
                                                                    <span className="font-mono font-bold">{String(val)}</span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-32">
                                        <button
                                            onClick={() => navigate(userRole === 'tailor' ? `/chat?client=${o.client_id || o.client}` : `/chat?tailor=${o.tailor_user_id}`)}
                                            className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            {t('orders.message')}
                                        </button>

                                        {/* Pay Button - Now optional at all stages except pending and cancelled */}
                                        {userRole !== 'tailor' && ['accepted', 'in_progress', 'completed'].includes(o.status) && (
                                            <button
                                                onClick={() => setSelectedOrder(o)}
                                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm shadow-sm"
                                            >
                                                {t('orders.payNow')}
                                            </button>
                                        )}

                                        {/* Review Button */}
                                        {userRole !== 'tailor' && o.status === 'completed' && !o.is_reviewed && (
                                            <button
                                                onClick={() => setReviewOrder(o)}
                                                className="w-full bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors text-sm shadow-sm"
                                            >
                                                {t('orders.rateJob')}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Timeline Stepper */}
                                <div className="relative pt-6 border-t border-gray-50">
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                                        <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600">
                                        {STEPS.map((step, idx) => {
                                            const completed = getStepIndex(o.status) >= idx;
                                            return (
                                                <div key={step.id} className={`flex flex-col items-center gap-1 ${completed ? 'text-green-600' : 'text-gray-400 opacity-60'}`}>
                                                    <span className="text-lg">{step.icon}</span>
                                                    <span className="hidden sm:inline">{step.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {orders.length === 0 && !loading && (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-6">{t('orders.noOrders')}</p>
                            <Link to="/designs" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors">
                                {t('orders.browseDesigns')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {selectedOrder && (
                <PaymentModal
                    orderId={selectedOrder.order_id}
                    amount={Number(selectedOrder.price)}
                    onClose={() => setSelectedOrder(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}

            {reviewOrder && (
                <ReviewModal
                    orderId={reviewOrder.order_id}
                    tailorId={reviewOrder.tailor}
                    tailorName={reviewOrder.tailor_name || 'Tailor'}
                    onClose={() => setReviewOrder(null)}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
}

