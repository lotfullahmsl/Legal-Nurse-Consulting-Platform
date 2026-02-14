const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

router.use(protect);

router.get('/templates', auditLog('view_report_templates'), reportController.getTemplates);
router.get('/', auditLog('view_reports'), reportController.getAllReports);
router.get('/:id', auditLog('view_report'), reportController.getReportById);
router.get('/:id/download', auditLog('download_report'), reportController.downloadReport);
router.get('/case/:caseId', auditLog('view_case_reports'), reportController.getCaseReports);

router.post('/generate', authorize('admin', 'attorney', 'consultant'), auditLog('generate_report'), reportController.generateReport);
router.post('/custom', authorize('admin', 'attorney', 'consultant'), auditLog('generate_custom_report'), reportController.generateCustomReport);

router.delete('/:id', authorize('admin', 'attorney'), auditLog('delete_report'), reportController.deleteReport);

module.exports = router;
