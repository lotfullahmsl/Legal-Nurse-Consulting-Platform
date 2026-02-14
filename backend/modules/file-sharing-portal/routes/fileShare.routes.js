const express = require('express');
const router = express.Router();
const fileShareController = require('../controllers/fileShare.controller');
const { protect, authorize } = require('../../../shared/middleware/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../../../shared/middleware/validation.middleware');

// Validation
const shareValidation = [
    body('fileId').notEmpty().withMessage('File ID is required'),
    body('sharedWithUserId').notEmpty().withMessage('User ID is required'),
    body('caseId').notEmpty().withMessage('Case ID is required')
];

// Get shared files
router.get('/shared', protect, fileShareController.getSharedFiles);

// Share file
router.post('/share',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    shareValidation,
    validate,
    fileShareController.shareFile
);

// Get access log
router.get('/:id/access-log', protect, fileShareController.getAccessLog);

// Download shared file
router.post('/:id/download', protect, fileShareController.downloadSharedFile);

// Revoke access
router.delete('/shared/:id',
    protect,
    authorize('admin', 'attorney', 'consultant'),
    fileShareController.revokeAccess
);

module.exports = router;
