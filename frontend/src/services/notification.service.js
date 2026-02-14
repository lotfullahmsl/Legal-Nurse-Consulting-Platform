import apiClient from './api.service';

const notificationService = {
    // Get all notifications for current user
    getNotifications: async (params = {}) => {
        const response = await apiClient.get('/notifications', { params });
        return response.data;
    },

    // Get unread notification count
    getUnreadCount: async () => {
        const response = await apiClient.get('/notifications/unread/count');
        return response.data;
    },

    // Mark notification as read
    markAsRead: async (id) => {
        const response = await apiClient.patch(`/notifications/${id}/read`);
        return response.data;
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await apiClient.patch('/notifications/read-all');
        return response.data;
    },

    // Delete notification
    deleteNotification: async (id) => {
        const response = await apiClient.delete(`/notifications/${id}`);
        return response.data;
    }
};

export default notificationService;
