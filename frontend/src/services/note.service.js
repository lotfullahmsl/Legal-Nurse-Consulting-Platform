import apiClient from './api.service';

export const noteService = {
    // Get all notes
    getAll: (params) => apiClient.get('/notes', { params }),

    // Get note by ID
    getById: (id) => apiClient.get(`/notes/${id}`),

    // Get notes by case
    getByCase: (caseId, params) => apiClient.get(`/notes/case/${caseId}`, { params }),

    // Create note
    create: (data) => apiClient.post('/notes', data),

    // Update note
    update: (id, data) => apiClient.put(`/notes/${id}`, data),

    // Delete note
    delete: (id) => apiClient.delete(`/notes/${id}`),

    // Add attachment
    addAttachment: (id, data) => apiClient.post(`/notes/${id}/attachments`, data),

    // Remove attachment
    removeAttachment: (id, attachmentId) => apiClient.delete(`/notes/${id}/attachments/${attachmentId}`),

    // Get note history
    getHistory: (id) => apiClient.get(`/notes/${id}/history`),

    // Add tags
    addTags: (id, tags) => apiClient.post(`/notes/${id}/tags`, { tags }),

    // Remove tags
    removeTags: (id, tags) => apiClient.delete(`/notes/${id}/tags`, { data: { tags } }),

    // Search notes
    search: (query, params) => apiClient.get('/notes/search', { params: { q: query, ...params } }),

    // Pin/unpin note
    togglePin: (id) => apiClient.patch(`/notes/${id}/pin`)
};

export default noteService;
