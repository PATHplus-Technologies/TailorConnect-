
import { useEffect, useState } from 'react';
import { paymentService } from '@/services/payments';

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const data = await paymentService.getTransactions();
            setTransactions(data);
        } catch (e) { } finally { setLoading(false); }
    };

    const handlePay = async () => {
        // Mock Payment Flow
        // In real app, this opens Paystack/Stripe modal.
        // Here we just create a transaction record.
        const amount = prompt("Enter amount to pay (GNF):", "500000");
        const orderId = prompt("Enter Order ID to pay for:", "1");

        if (amount && orderId) {
            try {
                await paymentService.createTransaction({
                    order: parseInt(orderId),
                    amount: parseFloat(amount),
                    currency: 'GNF',
                    status: 'successful', // Auto-success for demo
                    provider_ref: `DEMO-${Date.now()}`
                });
                loadTransactions();
                alert('Payment Successful!');
            } catch (e) {
                alert('Payment Failed (Check Order ID)');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <button onClick={handlePay} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                    + New Payment
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map((t) => (
                            <tr key={t.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{t.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(t.timestamp).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{t.amount} {t.currency}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.provider_ref || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${t.status === 'successful' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

