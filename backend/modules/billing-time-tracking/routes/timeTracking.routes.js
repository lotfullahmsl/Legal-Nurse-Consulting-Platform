const express = require('express');
const router = express.Router();
const timeTrackingController = require('../controllers/timeTracking.controller');
const { authenticate, authorize } = require('../../../shared/middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Timer operations
router.post('/timer/start', authorize(['admin', 'attorney', 'staff']), timeTrackingController.startTimer);
router.post('/timer/stop', authorize(['admin', 'attorney', 'staff']), timeTrackingController.stopTimer);
router.get('/timer/active', authorize(['admin', 'attorney', 'staff']), timeTrackingController.getActiveTimer);

// My time entries
router.get('/my-entries', authorize(['admin', 'attorney', 'staff']), timeTrackingController.getMyTimeEntries);
router.get('/my-productivity', authorize(['admin', 'attorney', 'staff']), timeTrackingController.getMyProductivity);

// Bulk operations
router.post('/bulk', authorize(['admin', 'attorney', 'staff']), timeTrackingController.bulkCreateEntries);

// Unbilled time
router.get('/cases/:caseId/unbilled', authorize(['admin', 'attorney', 'staff']), timeTrackingController.getUnbilledTime);

module.exports = router;
