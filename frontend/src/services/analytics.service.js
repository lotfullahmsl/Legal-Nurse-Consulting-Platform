import apiClient from './api.service';

const analyticsService = {
    // Get case analytics
    getCaseAnalytics: (params) => apiClient.get('/analytics/cases', { params }),

    // Get revenue analytics
    getRevenueAnalytics: (params) => apiClient.get('/analytics/revenue', { params }),

    // Get workload analytics
    getWorkloadAnalytics: (params) => apiClient.get('/analytics/workload', { params }),

    // Get referral analytics
    getReferralAnalytics: (params) => apiClient.get('/analytics/referrals', { params }),

    // Get performance metrics
    getPerformanceMetrics: (params) => apiClient.get('/analytics/performance', { params }),

    // Export analytics data
    exportAnalytics: (params) => apiClient.get('/analytics/export', { params })
};

export default analyticsService;
