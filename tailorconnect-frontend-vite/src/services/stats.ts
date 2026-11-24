import api from '@/lib/axios';

export const statsService = {
    getPlatformStats: async () => {
        const response = await api.get('stats/');
        return response.data;
    }
};
