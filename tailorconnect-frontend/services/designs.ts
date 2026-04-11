import api from '@/lib/axios';

export const designsService = {
    getAll: async () => {
        const response = await api.get('designs/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`designs/${id}/`);
        return response.data;
    },
    getByTailor: async (tailorId: number) => {
        const response = await api.get(`designs/?tailor=${tailorId}`);
        return response.data;
    },
    create: async (formData: FormData) => {
        const response = await api.post('designs/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    generate: async (prompt: string) => {
        const response = await api.post('designs/generate/', { prompt });
        return response.data;
    }
};
