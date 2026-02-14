const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const noteValidators = require('../validators/note.validator');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { validate } = require('../../../shared/middleware/validation.middleware');
const { auditLog } = require('../../../shared/middleware/audit.middleware');

router.use(protect);

// Search and stats
router.get('/search', validate(noteValidators.search), auditLog('search_notes'), noteController.searchNotes);
router.get('/case/:caseId', validate(noteValidators.getByCase), auditLog('view_case_notes'), noteController.getNotesByCase);

// CRUD operations
router.get('/', validate(noteValidators.getAll), auditLog('view_notes'), noteController.getAllNotes);
router.get('/:id', validate(noteValidators.getById), auditLog('view_note'), noteController.getNoteById);
router.post('/', authorize('admin', 'attorney', 'consultant'), validate(noteValidators.create), auditLog('create_note'), noteController.createNote);
router.put('/:id', authorize('admin', 'attorney', 'consultant'), validate(noteValidators.update), auditLog('update_note'), noteController.updateNote);
router.delete('/:id', authorize('admin', 'attorney'), validate(noteValidators.delete), auditLog('delete_note'), noteController.deleteNote);

// Attachments
router.post('/:id/attachments', authorize('admin', 'attorney', 'consultant'), validate(noteValidators.addAttachment), auditLog('add_note_attachment'), noteController.addAttachment);
router.delete('/:id/attachments/:attachmentId', authorize('admin', 'attorney', 'consultant'), auditLog('remove_note_attachment'), noteController.removeAttachment);

// History and versioning
router.get('/:id/history', validate(noteValidators.getById), auditLog('view_note_history'), noteController.getNoteHistory);

// Tags
router.post('/:id/tags', authorize('admin', 'attorney', 'consultant'), validate(noteValidators.manageTags), auditLog('add_note_tags'), noteController.addTags);
router.delete('/:id/tags', authorize('admin', 'attorney', 'consultant'), validate(noteValidators.manageTags), auditLog('remove_note_tags'), noteController.removeTags);

// Pin/Unpin
router.patch('/:id/pin', authorize('admin', 'attorney', 'consultant'), auditLog('pin_note'), noteController.pinNote);

module.exports = router;
