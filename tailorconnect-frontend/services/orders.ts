import api from '@/lib/axios';

export const ordersService = {
    getAll: async () => {
        const response = await api.get('orders/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`orders/${id}/`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('orders/', data);
        return response.data;
    },
    createWithImage: async (formData: FormData) => {
        const response = await api.post('orders/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.patch(`orders/${id}/`, { status });
        return response.data;
    }
};
