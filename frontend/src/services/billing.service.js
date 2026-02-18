import apiClient from './api.service';

const billingService = {
    // Time Entries
    getAllTimeEntries: async (params = {}) => {
        const response = await apiClient.get('/time-entries', { params });
        return response.data;
    },

    getTimeEntryById: async (id) => {
        const response = await apiClient.get(`/time-entries/${id}`);
        return response.data;
    },

    getTimeEntriesByCase: async (caseId) => {
        const response = await apiClient.get(`/time-entries/case/${caseId}`);
        return response.data;
    },

    getTimeEntriesByUser: async (userId, params = {}) => {
        const response = await apiClient.get(`/time-entries/user/${userId}`, { params });
        return response.data;
    },

    createTimeEntry: async (data) => {
        const response = await apiClient.post('/time-entries', data);
        return response.data;
    },

    updateTimeEntry: async (id, data) => {
        const response = await apiClient.put(`/time-entries/${id}`, data);
        return response.data;
    },

    deleteTimeEntry: async (id) => {
        const response = await apiClient.delete(`/time-entries/${id}`);
        return response.data;
    },

    startTimer: async (data) => {
        const response = await apiClient.post('/time-entries/timer/start', data);
        return response.data;
    },

    stopTimer: async () => {
        const response = await apiClient.post('/time-entries/timer/stop');
        return response.data;
    },

    bulkCreateTimeEntries: async (entries) => {
        const response = await apiClient.post('/time-entries/bulk', { entries });
        return response.data;
    },

    // Invoices
    getAllInvoices: async (params = {}) => {
        const response = await apiClient.get('/invoices', { params });
        return response.data;
    },

    getInvoiceById: async (id) => {
        const response = await apiClient.get(`/invoices/${id}`);
        return response.data;
    },

    getInvoicesByCase: async (caseId) => {
        const response = await apiClient.get(`/invoices/case/${caseId}`);
        return response.data;
    },

    generateInvoice: async (data) => {
        const response = await apiClient.post('/invoices/generate', data);
        return response.data;
    },

    updateInvoice: async (id, data) => {
        const response = await apiClient.put(`/invoices/${id}`, data);
        return response.data;
    },

    sendInvoice: async (id) => {
        const response = await apiClient.post(`/invoices/${id}/send`);
        return response.data;
    },

    recordPayment: async (id, paymentData) => {
        const response = await apiClient.post(`/invoices/${id}/payment`, paymentData);
        return response.data;
    },

    voidInvoice: async (id) => {
        const response = await apiClient.post(`/invoices/${id}/void`);
        return response.data;
    },

    getBillingStats: async () => {
        const response = await apiClient.get('/invoices/stats');
        return response.data;
    },

    // Export
    exportTimeEntries: async (params = {}) => {
        const response = await apiClient.get('/time-entries/export', {
            params,
            responseType: 'blob'
        });
        return response.data;
    }
};

export default billingService;
