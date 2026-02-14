import apiClient from './api.service';

export const messageService = {
    // Get all messages
    getAll: (params) => apiClient.get('/messages', { params }),

    // Get message by ID
    getById: (id) => apiClient.get(`/messages/${id}`),

    // Get conversation messages
    getConversationMessages: (conversationId, params) =>
        apiClient.get(`/messages/conversation/${conversationId}`, { params }),

    // Send message
    send: (data) => apiClient.post('/messages', data),

    // Edit message
    edit: (id, content) => apiClient.put(`/messages/${id}`, { content }),

    // Delete message
    delete: (id) => apiClient.delete(`/messages/${id}`),

    // Mark as read
    markAsRead: (id) => apiClient.put(`/messages/${id}/read`),

    // Mark conversation as read
    markConversationAsRead: (conversationId) =>
        apiClient.post(`/messages/conversation/${conversationId}/read`),

    // Add attachment
    addAttachment: (id, data) => apiClient.post(`/messages/${id}/attachments`, data),

    // Get unread count
    getUnreadCount: () => apiClient.get('/messages/unread-count'),

    // Get unread by conversation
    getUnreadByConversation: () => apiClient.get('/messages/unread-by-conversation')
};

export default messageService;
