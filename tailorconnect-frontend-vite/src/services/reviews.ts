import api from '@/lib/axios';

export const reviewService = {
    getAll: async () => {
        const response = await api.get('reviews/');
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('reviews/', data);
        return response.data;
    },
    getByTailor: async (tailorId: number) => {
        const response = await api.get(`reviews/?tailor_id=${tailorId}`);
        return response.data;
    }
};
