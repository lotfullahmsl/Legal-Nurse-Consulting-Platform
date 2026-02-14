import api from './api.service';

const fileShareService = {
    // Get shared files
    getSharedFiles: async () => {
        const response = await api.get('/files/shared');
        return response.data;
    },

    // Share file
    shareFile: async (shareData) => {
        const response = await api.post('/files/share', shareData);
        return response.data;
    },

    // Get access log
    getAccessLog: async (id) => {
        const response = await api.get(`/files/${id}/access-log`);
        return response.data;
    },

    // Download shared file
    downloadSharedFile: async (id) => {
        const response = await api.post(`/files/${id}/download`);
        return response.data;
    },

    // Revoke access
    revokeAccess: async (id) => {
        const response = await api.delete(`/files/shared/${id}`);
        return response.data;
    }
};

export default fileShareService;
