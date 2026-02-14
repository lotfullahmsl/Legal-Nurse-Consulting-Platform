const express = require('express');
const router = express.Router();
const timeEntryController = require('../controllers/timeEntry.controller');
const timeEntryValidators = require('../validators/timeEntry.validator');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

router.use(protect);

router.get('/', validate(timeEntryValidators.getAll), auditLog('view_time_entries'), timeEntryController.getAllTimeEntries);
router.get('/case/:caseId', validate(timeEntryValidators.getByCase), auditLog('view_case_time_entries'), timeEntryController.getTimeEntriesByCase);
router.get('/user/:userId', validate(timeEntryValidators.getByUser), auditLog('view_user_time_entries'), timeEntryController.getTimeEntriesByUser);
router.get('/:id', validate(timeEntryValidators.getById), auditLog('view_time_entry'), timeEntryController.getTimeEntryById);

router.post('/', authorize('admin', 'attorney', 'consultant'), validate(timeEntryValidators.create), auditLog('create_time_entry'), timeEntryController.createTimeEntry);
router.post('/bulk', authorize('admin', 'attorney', 'consultant'), validate(timeEntryValidators.bulkCreate), auditLog('bulk_create_time_entries'), timeEntryController.bulkCreateTimeEntries);
router.post('/timer/start', authorize('admin', 'attorney', 'consultant'), validate(timeEntryValidators.startTimer), auditLog('start_timer'), timeEntryController.startTimer);
router.post('/timer/stop', authorize('admin', 'attorney', 'consultant'), auditLog('stop_timer'), timeEntryController.stopTimer);

router.put('/:id', authorize('admin', 'attorney', 'consultant'), validate(timeEntryValidators.update), auditLog('update_time_entry'), timeEntryController.updateTimeEntry);
router.delete('/:id', authorize('admin', 'attorney'), validate(timeEntryValidators.delete), auditLog('delete_time_entry'), timeEntryController.deleteTimeEntry);

module.exports = router;
