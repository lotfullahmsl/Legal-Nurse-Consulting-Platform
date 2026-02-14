const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const auditValidator = require('../validators/audit.validator');

// All routes require authentication
router.use(protect);

// Get audit logs - Admin only
router.get(
    '/logs',
    authorize('admin'),
    validate(auditValidator.getAuditLogsValidation),
    auditController.getAuditLogs
);

// Get user audit logs - Admin only
router.get(
    '/user/:userId',
    authorize('admin'),
    validate(auditValidator.getUserAuditLogsValidation),
    auditController.getUserAuditLogs
);

// Get case audit logs - Admin, Attorney
router.get(
    '/case/:caseId',
    authorize('admin', 'attorney'),
    validate(auditValidator.getCaseAuditLogsValidation),
    auditController.getCaseAuditLogs
);

// Export audit logs - Admin only
router.get(
    '/export',
    authorize('admin'),
    validate(auditValidator.exportAuditLogsValidation),
    auditController.exportAuditLogs
);

// Generate compliance report - Admin only
router.post(
    '/report',
    authorize('admin'),
    validate(auditValidator.generateComplianceReportValidation),
    auditController.generateComplianceReport
);

// Get audit statistics - Admin only
router.get(
    '/statistics',
    authorize('admin'),
    validate(auditValidator.getAuditStatisticsValidation),
    auditController.getAuditStatistics
);

module.exports = router;
