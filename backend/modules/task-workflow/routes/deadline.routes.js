const express = require('express');
const router = express.Router();
const deadlineController = require('../controllers/deadline.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

// All routes require authentication
router.use(protect);

// Deadline routes
router.get('/', auditLog('view_deadlines'), deadlineController.getAllDeadlines);
router.get('/upcoming', auditLog('view_upcoming_deadlines'), deadlineController.getUpcomingDeadlines);
router.get('/stats', auditLog('view_deadline_stats'), deadlineController.getDeadlineStats);
router.get('/case/:caseId', auditLog('view_case_deadlines'), deadlineController.getDeadlinesByCase);
router.get('/:id', auditLog('view_deadline'), deadlineController.getDeadlineById);

router.post('/', authorize('admin', 'attorney', 'consultant'), auditLog('create_deadline'), deadlineController.createDeadline);
router.put('/:id', authorize('admin', 'attorney', 'consultant'), auditLog('update_deadline'), deadlineController.updateDeadline);
router.delete('/:id', authorize('admin', 'attorney'), auditLog('delete_deadline'), deadlineController.deleteDeadline);

module.exports = router;
