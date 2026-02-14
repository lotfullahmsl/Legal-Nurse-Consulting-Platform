import apiClient from './api.service';

const workflowService = {
    // Get all workflows
    getAllWorkflows: async (params = {}) => {
        const response = await apiClient.get('/workflows', { params });
        return response.data;
    },

    // Get workflow templates
    getWorkflowTemplates: async () => {
        const response = await apiClient.get('/workflows/templates');
        return response.data;
    },

    // Get workflow by ID
    getWorkflowById: async (id) => {
        const response = await apiClient.get(`/workflows/${id}`);
        return response.data;
    },

    // Create workflow
    createWorkflow: async (workflowData) => {
        const response = await apiClient.post('/workflows', workflowData);
        return response.data;
    },

    // Update workflow
    updateWorkflow: async (id, workflowData) => {
        const response = await apiClient.put(`/workflows/${id}`, workflowData);
        return response.data;
    },

    // Delete workflow
    deleteWorkflow: async (id) => {
        const response = await apiClient.delete(`/workflows/${id}`);
        return response.data;
    },

    // Execute workflow
    executeWorkflow: async (id, caseId) => {
        const response = await apiClient.post(`/workflows/${id}/execute`, { caseId });
        return response.data;
    },

    // Clone workflow
    cloneWorkflow: async (id) => {
        const response = await apiClient.post(`/workflows/${id}/clone`);
        return response.data;
    }
};

export default workflowService;
