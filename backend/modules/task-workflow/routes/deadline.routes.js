const express = require('express');
const router = express.Router();
const deadlineController = require('../controllers/deadline.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const deadlineValidator = require('../validators/deadline.validator');

// All routes require authentication
router.use(protect);

// Deadline routes
router.get('/', auditLog('view_deadlines'), deadlineValidator.getDeadlinesValidator, validate, deadlineController.getAllDeadlines);
router.get('/upcoming', auditLog('view_upcoming_deadlines'), deadlineValidator.getUpcomingDeadlinesValidator, validate, deadlineController.getUpcomingDeadlines);
router.get('/stats', auditLog('view_deadline_stats'), deadlineController.getDeadlineStats);
router.get('/case/:caseId', auditLog('view_case_deadlines'), deadlineValidator.getDeadlinesByCaseValidator, validate, deadlineController.getDeadlinesByCase);
router.get('/:id', auditLog('view_deadline'), deadlineValidator.getDeadlineByIdValidator, validate, deadlineController.getDeadlineById);

router.post('/', authorize('admin', 'attorney', 'consultant'), auditLog('create_deadline'), deadlineValidator.createDeadlineValidator, validate, deadlineController.createDeadline);
router.put('/:id', authorize('admin', 'attorney', 'consultant'), auditLog('update_deadline'), deadlineValidator.updateDeadlineValidator, validate, deadlineController.updateDeadline);
router.delete('/:id', authorize('admin', 'attorney'), auditLog('delete_deadline'), deadlineValidator.getDeadlineByIdValidator, validate, deadlineController.deleteDeadline);

module.exports = router;
