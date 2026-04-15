import api from './api';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('user');
    },
};
