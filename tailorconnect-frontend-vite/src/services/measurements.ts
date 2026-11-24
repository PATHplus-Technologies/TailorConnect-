import api from '@/lib/axios';

export const measurementService = {
    getAll: async () => {
        const response = await api.get('measurements/');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('measurements/', data);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const response = await api.put(`measurements/${id}/`, data);
        return response.data;
    },
    delete: async (id: number) => {
        await api.delete(`measurements/${id}/`);
    }
};
