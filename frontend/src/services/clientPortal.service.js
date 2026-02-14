import apiClient from './api.service';

/**
 * Client Portal Service
 * Handles all client-facing API calls
 */

/**
 * Get client dashboard data
 */
export const getClientDashboard = async () => {
    const response = await apiClient.get('/client/dashboard');
    return response.data.data;
};

/**
 * Get client's cases
 */
export const getClientCases = async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/client/cases', { params });
    return response.data.data;
};

/**
 * Get single case details
 */
export const getClientCaseById = async (caseId) => {
    const response = await apiClient.get(`/client/cases/${caseId}`);
    return response.data.data;
};

/**
 * Get client's documents
 */
export const getClientDocuments = async (filters = {}) => {
    const response = await apiClient.get('/client/documents', { params: filters });
    return response.data.data;
};

/**
 * Get client's messages
 */
export const getClientMessages = async (caseId = null) => {
    const params = caseId ? { caseId } : {};
    const response = await apiClient.get('/client/messages', { params });
    return response.data.data;
};

/**
 * Send message from client
 */
export const sendClientMessage = async (conversationId, content, attachments = []) => {
    const response = await apiClient.post('/client/messages', {
        conversationId,
        content,
        attachments
    });
    return response.data.data;
};

/**
 * Get client's activity updates
 */
export const getClientUpdates = async (limit = 20) => {
    const response = await apiClient.get('/client/updates', { params: { limit } });
    return response.data.data;
};

/**
 * Get client's invoices
 */
export const getClientInvoices = async () => {
    const response = await apiClient.get('/client/invoices');
    return response.data.data;
};

/**
 * Get client's reports
 */
export const getClientReports = async () => {
    const response = await apiClient.get('/client/reports');
    return response.data.data;
};

/**
 * Get client's timeline for a case
 */
export const getClientTimeline = async (caseId) => {
    const response = await apiClient.get(`/client/timeline/${caseId}`);
    return response.data.data;
};

const clientPortalService = {
    getClientDashboard,
    getClientCases,
    getClientCaseById,
    getClientDocuments,
    getClientMessages,
    sendClientMessage,
    getClientUpdates,
    getClientInvoices,
    getClientReports,
    getClientTimeline
};

export default clientPortalService;
