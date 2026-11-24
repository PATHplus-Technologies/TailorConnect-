import api from '@/lib/axios';

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('token/', credentials);
        console.log('Login Response:', response.data);
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            // Store user details
            localStorage.setItem('user_role', response.data.role);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('user_id', response.data.user_id);
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
    },
    register: async (userData: any) => {
        return await api.post('users/', userData);
    },
    requestPasswordReset: async (email: string) => {
        return await api.post('password_reset/', { email });
    },
    resetPassword: async (token: string, password: any) => {
        return await api.post('password_reset/confirm/', { token, password });
    }
};
