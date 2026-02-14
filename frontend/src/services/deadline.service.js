import apiClient from './api.service';

const deadlineService = {
    // Get all deadlines
    getAllDeadlines: async (params = {}) => {
        const response = await apiClient.get('/deadlines', { params });
        return response.data;
    },

    // Get upcoming deadlines
    getUpcomingDeadlines: async (days = 30) => {
        const response = await apiClient.get('/deadlines/upcoming', { params: { days } });
        return response.data;
    },

    // Get deadlines by case
    getDeadlinesByCase: async (caseId) => {
        const response = await apiClient.get(`/deadlines/case/${caseId}`);
        return response.data;
    },

    // Get deadline by ID
    getDeadlineById: async (id) => {
        const response = await apiClient.get(`/deadlines/${id}`);
        return response.data;
    },

    // Create deadline
    createDeadline: async (deadlineData) => {
        const response = await apiClient.post('/deadlines', deadlineData);
        return response.data;
    },

    // Update deadline
    updateDeadline: async (id, deadlineData) => {
        const response = await apiClient.put(`/deadlines/${id}`, deadlineData);
        return response.data;
    },

    // Delete deadline
    deleteDeadline: async (id) => {
        const response = await apiClient.delete(`/deadlines/${id}`);
        return response.data;
    },

    // Get deadline statistics
    getDeadlineStats: async () => {
        const response = await apiClient.get('/deadlines/stats');
        return response.data;
    }
};

export default deadlineService;
