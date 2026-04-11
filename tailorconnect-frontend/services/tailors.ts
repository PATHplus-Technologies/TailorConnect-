import api from '@/lib/axios';

export const tailorService = {
    getAll: async (params?: any) => {
        // Fetch from the profiles endpoint which returns TailorProfile objects
        const response = await api.get('profiles/', { params });
        return response.data;
    },
    getSpecialties: async () => {
        const response = await api.get('profiles/specialties/');
        return response.data;
    },
    getById: async (id: number) => {
        const response = await api.get(`profiles/${id}/`);
        return response.data;
    },
    update: async (id: number, data: any) => {
        const isFormData = data instanceof FormData;
        const response = await api.patch(`profiles/${id}/`, data, {
            headers: {
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
            }
        });
        return response.data;
    },
    getClients: async () => {
        const response = await api.get('profiles/my_clients/');
        return response.data;
    }
};
