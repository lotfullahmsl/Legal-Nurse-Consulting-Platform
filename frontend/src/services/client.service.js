import api from './api.service';

const clientService = {
    // Get all clients
    getAllClients: async (params = {}) => {
        const response = await api.get('/clients', { params });
        return response.data;
    },

    // Get client by ID
    getClientById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    // Create new client
    createClient: async (clientData) => {
        const response = await api.post('/clients', clientData);
        return response.data;
    },

    // Update client
    updateClient: async (id, clientData) => {
        const response = await api.put(`/clients/${id}`, clientData);
        return response.data;
    },

    // Delete client
    deleteClient: async (id) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    },

    // Get client statistics
    getClientStats: async () => {
        const response = await api.get('/clients/stats');
        return response.data;
    }
};

export default clientService;
