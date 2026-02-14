import apiClient from './api.service';

export const conversationService = {
    // Get all conversations
    getAll: (params) => apiClient.get('/conversations', { params }),

    // Get conversation by ID
    getById: (id) => apiClient.get(`/conversations/${id}`),

    // Create conversation
    create: (data) => apiClient.post('/conversations', data),

    // Update conversation
    update: (id, data) => apiClient.put(`/conversations/${id}`, data),

    // Add participants
    addParticipants: (id, participants) =>
        apiClient.post(`/conversations/${id}/participants`, { participants }),

    // Remove participant
    removeParticipant: (id, participantId) =>
        apiClient.delete(`/conversations/${id}/participants/${participantId}`),

    // Leave conversation
    leave: (id) => apiClient.post(`/conversations/${id}/leave`),

    // Archive/unarchive conversation
    toggleArchive: (id) => apiClient.patch(`/conversations/${id}/archive`)
};

export default conversationService;
