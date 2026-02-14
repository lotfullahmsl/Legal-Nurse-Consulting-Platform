const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

router.use(protect);
router.use(authorize('admin', 'attorney'));

router.get('/cases', auditLog('view_case_analytics'), analyticsController.getCaseAnalytics);
router.get('/revenue', auditLog('view_revenue_analytics'), analyticsController.getRevenueAnalytics);
router.get('/workload', auditLog('view_workload_analytics'), analyticsController.getWorkloadAnalytics);
router.get('/referrals', auditLog('view_referral_analytics'), analyticsController.getReferralAnalytics);
router.get('/performance', auditLog('view_performance_metrics'), analyticsController.getPerformanceMetrics);
router.get('/export', auditLog('export_analytics'), analyticsController.exportAnalytics);

module.exports = router;
