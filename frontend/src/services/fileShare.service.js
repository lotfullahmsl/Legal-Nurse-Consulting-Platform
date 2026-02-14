import api from './api.service';

const fileShareService = {
    // Get shared files by case
    getSharedFiles: async (caseId) => {
        const response = await api.get(`/files/shared${caseId ? `?case=${caseId}` : ''}`);
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
    downloadFile: async (id) => {
        const response = await api.post(`/files/${id}/download`, {}, { responseType: 'blob' });
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file');
        document.body.appendChild(link);
        link.click();
        link.remove();
        return response.data;
    },

    // Download shared file (alias)
    downloadSharedFile: async (id) => {
        return fileShareService.downloadFile(id);
    },

    // Revoke access
    revokeAccess: async (id) => {
        const response = await api.delete(`/files/shared/${id}`);
        return response.data;
    }
};

export default fileShareService;
