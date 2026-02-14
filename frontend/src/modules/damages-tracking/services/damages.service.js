import apiClient from '../../../services/api.service';

const damagesService = {
    // Get all damages for a case
    getDamagesByCase: async (caseId) => {
        const response = await apiClient.get(`/damages/case/${caseId}`);
        return response.data;
    },

    // Get damage by ID
    getDamageById: async (id) => {
        const response = await apiClient.get(`/damages/${id}`);
        return response.data;
    },

    // Create new damage
    createDamage: async (damageData) => {
        const response = await apiClient.post('/damages', damageData);
        return response.data;
    },

    // Update damage
    updateDamage: async (id, damageData) => {
        const response = await apiClient.put(`/damages/${id}`, damageData);
        return response.data;
    },

    // Delete damage
    deleteDamage: async (id) => {
        const response = await apiClient.delete(`/damages/${id}`);
        return response.data;
    },

    // Get damages statistics
    getDamagesStats: async (caseId) => {
        const response = await apiClient.get(`/damages/case/${caseId}/stats`);
        return response.data;
    }
};

export default damagesService;
