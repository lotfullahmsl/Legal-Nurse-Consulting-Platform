import api from './api.service';

const caseAnalysisService = {
    // Get case analysis
    getAnalysis: async (caseId) => {
        const response = await api.get(`/case-analysis/${caseId}`);
        return response.data;
    },

    // Create or update analysis
    upsertAnalysis: async (analysisData) => {
        const response = await api.post('/case-analysis', analysisData);
        return response.data;
    },

    // Get damages
    getDamages: async (caseId) => {
        const response = await api.get(`/case-analysis/damages/${caseId}`);
        return response.data;
    },

    // Add damage
    addDamage: async (damageData) => {
        const response = await api.post('/case-analysis/damages', damageData);
        return response.data;
    },

    // Update damage
    updateDamage: async (id, damageData) => {
        const response = await api.put(`/case-analysis/damages/${id}`, damageData);
        return response.data;
    },

    // Delete damage
    deleteDamage: async (id) => {
        const response = await api.delete(`/case-analysis/damages/${id}`);
        return response.data;
    }
};

export default caseAnalysisService;
