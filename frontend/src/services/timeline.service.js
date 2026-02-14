import api from './api.service';

const timelineService = {
    // Get timelines by case
    getTimelinesByCase: async (caseId) => {
        const response = await api.get(`/timelines/case/${caseId}`);
        return response.data;
    },

    // Get timeline by ID
    getTimelineById: async (id) => {
        const response = await api.get(`/timelines/${id}`);
        return response.data;
    },

    // Create timeline
    createTimeline: async (timelineData) => {
        const response = await api.post('/timelines', timelineData);
        return response.data;
    },

    // Update timeline
    updateTimeline: async (id, timelineData) => {
        const response = await api.put(`/timelines/${id}`, timelineData);
        return response.data;
    },

    // Delete timeline
    deleteTimeline: async (id) => {
        const response = await api.delete(`/timelines/${id}`);
        return response.data;
    },

    // Update status
    updateStatus: async (id, status) => {
        const response = await api.patch(`/timelines/${id}/status`, { status });
        return response.data;
    },

    // Add event
    addEvent: async (timelineId, eventData) => {
        const response = await api.post(`/timelines/${timelineId}/events`, eventData);
        return response.data;
    },

    // Update event
    updateEvent: async (timelineId, eventId, eventData) => {
        const response = await api.put(`/timelines/${timelineId}/events/${eventId}`, eventData);
        return response.data;
    },

    // Delete event
    deleteEvent: async (timelineId, eventId) => {
        const response = await api.delete(`/timelines/${timelineId}/events/${eventId}`);
        return response.data;
    },

    // Get work queue
    getWorkQueue: async (params = {}) => {
        const response = await api.get('/timelines/work-queue', { params });
        return response.data;
    }
};

export default timelineService;
