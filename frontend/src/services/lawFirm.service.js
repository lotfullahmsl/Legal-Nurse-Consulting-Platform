import api from './api.service';

const lawFirmService = {
    // Get all law firms
    getAllLawFirms: async (params = {}) => {
        const response = await api.get('/law-firms', { params });
        return response.data;
    },

    // Get law firm by ID
    getLawFirmById: async (id) => {
        const response = await api.get(`/law-firms/${id}`);
        return response.data;
    },

    // Create new law firm
    createLawFirm: async (lawFirmData) => {
        const response = await api.post('/law-firms', lawFirmData);
        return response.data;
    },

    // Update law firm
    updateLawFirm: async (id, lawFirmData) => {
        const response = await api.put(`/law-firms/${id}`, lawFirmData);
        return response.data;
    },

    // Delete law firm
    deleteLawFirm: async (id) => {
        const response = await api.delete(`/law-firms/${id}`);
        return response.data;
    }
};

export default lawFirmService;
