import api from './api.service';

const searchService = {
    // Search medical records
    searchRecords: async (searchData) => {
        const response = await api.post('/search/medical-records', searchData);
        return response.data;
    },

    // Get search suggestions
    getSuggestions: async (query) => {
        const response = await api.get('/search/suggestions', { params: { query } });
        return response.data;
    },

    // Get search history
    getSearchHistory: async () => {
        const response = await api.get('/search/history');
        return response.data;
    }
};

export default searchService;
