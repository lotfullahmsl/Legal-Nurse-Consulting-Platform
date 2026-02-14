import apiClient from './api.service';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        if (response.data.success) {
            const { token, refreshToken, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.success) {
            const { token, refreshToken, user } = response.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },

    // Logout user
    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get user from localStorage
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;
