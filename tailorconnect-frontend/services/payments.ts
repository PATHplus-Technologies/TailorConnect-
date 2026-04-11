import api from '@/lib/axios';

export const paymentService = {
    getTransactions: async () => {
        const response = await api.get('transactions/');
        return response.data;
    },
    createTransaction: async (data: any) => {
        const response = await api.post('transactions/', data);
        return response.data;
    }
};
