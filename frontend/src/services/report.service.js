import apiClient from './api.service';

const reportService = {
    // Get all report templates
    getTemplates: () => apiClient.get('/reports/templates'),

    // Get all reports with filters
    getAll: (params) => apiClient.get('/reports', { params }),

    // Get single report by ID
    getById: (id) => apiClient.get(`/reports/${id}`),

    // Generate a new report
    generate: (data) => apiClient.post('/reports/generate', data),

    // Generate custom report
    generateCustom: (data) => apiClient.post('/reports/custom', data),

    // Download report
    download: (id) => apiClient.get(`/reports/${id}/download`),

    // Get reports for a specific case
    getCaseReports: (caseId) => apiClient.get(`/reports/case/${caseId}`),

    // Delete report
    delete: (id) => apiClient.delete(`/reports/${id}`)
};

export default reportService;
