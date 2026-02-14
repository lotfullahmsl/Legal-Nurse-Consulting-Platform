const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authenticate, authorize } = require('../../../shared/middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Billing statistics and reports
router.get('/stats', authorize(['admin', 'attorney']), billingController.getBillingStats);
router.get('/cases/:caseId/summary', authorize(['admin', 'attorney', 'staff']), billingController.getCaseBillingSummary);
router.get('/cases/:caseId/unbilled', authorize(['admin', 'attorney', 'staff']), billingController.getUnbilledWork);
router.get('/revenue', authorize(['admin', 'attorney']), billingController.getRevenueReport);
router.get('/aging', authorize(['admin', 'attorney']), billingController.getAgingReport);
router.get('/top-cases', authorize(['admin', 'attorney']), billingController.getTopBillingCases);
router.get('/users/:userId/stats', authorize(['admin', 'attorney']), billingController.getUserBillingStats);
router.get('/rates', authorize(['admin', 'attorney']), billingController.getBillableRates);
router.get('/report', authorize(['admin', 'attorney', 'staff']), billingController.generateBillingReport);

// Administrative actions
router.post('/mark-overdue', authorize(['admin', 'attorney']), billingController.markOverdueInvoices);

module.exports = router;
