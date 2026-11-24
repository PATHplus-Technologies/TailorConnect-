import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';

interface User {
    id: string;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: any) => Promise<any>;
    logout: () => void;
    register: (userData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem('access_token');
        const id = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('user_role');

        if (access && id && username && role) {
            setUser({ id, username, role });
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        const data = await authService.login(credentials);
        if (data.access) {
            const newUser = {
                id: data.user_id,
                username: data.username,
                role: data.role
            };
            setUser(newUser);
            return data;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        navigate('/login');
    };

    const register = async (userData: any) => {
        console.log('AuthContext: Initiating registration for', userData.username);
        try {
            const response = await authService.register(userData);
            console.log('AuthContext: Registration response received', response.status);
            return response.data;
        } catch (error: any) {
            console.error('AuthContext: Registration error', error.response?.data || error.message);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
