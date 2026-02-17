import api from './api.service';

const userService = {
    // Get all users
    getAllUsers: async (params = {}) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Get user by ID
    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Create user
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Update user
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    // Update user status
    updateUserStatus: async (id, status) => {
        const response = await api.patch(`/users/${id}/status`, { status });
        return response.data;
    }
};

export default userService;
