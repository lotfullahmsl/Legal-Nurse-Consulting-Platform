import api from './api.service';

const medicalRecordService = {
    // Get all medical records
    getAllRecords: async (params = {}) => {
        const response = await api.get('/medical-records', { params });
        return response.data;
    },

    // Get record by ID
    getRecordById: async (id) => {
        const response = await api.get(`/medical-records/${id}`);
        return response.data;
    },

    // Get records by case
    getRecordsByCase: async (caseId) => {
        const response = await api.get(`/medical-records/case/${caseId}`);
        return response.data;
    },

    // Upload medical record
    uploadRecord: async (recordData) => {
        const response = await api.post('/medical-records/upload', recordData);
        return response.data;
    },

    // Update record
    updateRecord: async (id, recordData) => {
        const response = await api.put(`/medical-records/${id}`, recordData);
        return response.data;
    },

    // Delete record
    deleteRecord: async (id) => {
        const response = await api.delete(`/medical-records/${id}`);
        return response.data;
    },

    // Trigger OCR
    triggerOCR: async (id) => {
        const response = await api.post(`/medical-records/${id}/ocr`);
        return response.data;
    },

    // Get statistics
    getStats: async () => {
        const response = await api.get('/medical-records/stats');
        return response.data;
    },

    // Download record file
    downloadRecord: async (id) => {
        const response = await api.get(`/medical-records/${id}/download`);
        return response.data;
    }
};

export default medicalRecordService;
